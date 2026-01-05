from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db_config import get_connection

order_bp = Blueprint("order", __name__, url_prefix="/order")

# ======================================================
# 🔹 SİPARİŞ OLUŞTUR (Customer Panel - Sepet Onayı)
# ======================================================
@order_bp.route("/create", methods=["POST", "OPTIONS"])
@cross_origin()
def create_pending_order():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200
    
    conn = None
    try:
        data = request.get_json() or {}
        sent_id = data.get("customer_id")
        total_amount = data.get("total_amount")
        items = data.get("items") # [{product_id, quantity, price}, ...]

        conn = get_connection()
        cur = conn.cursor()

        # 1. Müşteri kontrolü
        cur.execute('SELECT customer_id FROM customer WHERE person_id = %s OR customer_id = %s', (sent_id, sent_id))
        cust_res = cur.fetchone()
        if not cust_res:
            return jsonify({"success": False, "message": "Müşteri kaydı bulunamadı"}), 404
        actual_customer_id = cust_res[0]

        # 🔥 2. KRİTİK: Stok Kontrolü (Döngü içinde kontrol)
        for item in items:
            cur.execute("SELECT quantity, material, color FROM product WHERE product_id = %s", (item["product_id"],))
            prod = cur.fetchone()
            if not prod:
                return jsonify({"success": False, "message": f"Ürün ID {item['product_id']} bulunamadı"}), 404
            
            stock_available = prod[0]
            if item["quantity"] > stock_available:
                return jsonify({
                    "success": False, 
                    "message": f"Yetersiz stok! {prod[1]} {prod[2]} için mevcut stok: {stock_available}"
                }), 400

        # 3. pending_orders tablosuna ana kaydı ekle
        cur.execute("""
            INSERT INTO pending_orders (customer_id, total_amount, status, order_date)
            VALUES (%s, %s, 'PENDING', NOW())
            RETURNING pending_order_id
        """, (actual_customer_id, total_amount))
        pending_order_id = cur.fetchone()[0]

        # 4. pending_order_items tablosuna ürünleri ekle
        for item in items:
            cur.execute("""
                INSERT INTO pending_order_items (pending_order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (pending_order_id, item["product_id"], item["quantity"], item["price"]))

        conn.commit()
        return jsonify({"success": True, "pending_order_id": pending_order_id})
    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn: conn.close()

# ======================================================
# 🔹 SİPARİŞİ ONAYLA (Manager Panel)
# ======================================================
@order_bp.route("/approve/<int:pending_order_id>", methods=["POST"])
@cross_origin()
def approve_pending_order(pending_order_id):
    conn = None
    try:
        data = request.get_json() or {}
        admin_id = data.get("approved_by_id")
        role = data.get("approved_by_role")

        conn = get_connection()
        cur = conn.cursor()

        # 🔥 KRİTİK: Onay anında son stok kontrolü (Başka biri almış olabilir)
        cur.execute("""
            SELECT poi.product_id, poi.quantity, p.quantity as current_stock
            FROM pending_order_items poi
            JOIN product p ON poi.product_id = p.product_id
            WHERE poi.pending_order_id = %s
        """, (pending_order_id,))
        
        items_to_check = cur.fetchall()
        for pid, req_qty, cur_stock in items_to_check:
            if req_qty > cur_stock:
                return jsonify({"success": False, "message": f"Sipariş onaylanamadı. Ürün (ID:{pid}) stoğu yetersiz!"}), 400

        # 1. 'orders' tablosuna taşı
        cur.execute("""
            INSERT INTO orders (customer_id, approved_by_person_id, approved_by_role, total_amount, order_date)
            SELECT customer_id, %s, %s, total_amount, NOW()
            FROM pending_orders WHERE pending_order_id = %s
            RETURNING order_id
        """, (admin_id, role, pending_order_id))
        
        row = cur.fetchone()
        if not row:
            return jsonify({"success": False, "message": "Sipariş bulunamadı"}), 404
        order_id = row[0]

        # 2. 'order_items' tablosuna ürünleri taşı (TRIGGER BURADA ÇALIŞIR)
        cur.execute("""
            INSERT INTO order_items (order_id, product_id, quantity, price)
            SELECT %s, product_id, quantity, price
            FROM pending_order_items WHERE pending_order_id = %s
        """, (order_id, pending_order_id))

        # 3. Temizlik
        cur.execute('DELETE FROM pending_order_items WHERE pending_order_id = %s', (pending_order_id,))
        cur.execute('DELETE FROM pending_orders WHERE pending_order_id = %s', (pending_order_id,))

        conn.commit()
        return jsonify({"success": True, "message": "Sipariş onaylandı ve stoklar güncellendi"})
    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"success": False, "message": f"Onay hatası: {str(e)}"}), 500
    finally:
        if conn: conn.close()

# ======================================================
# 🔹 LİSTELEME FONKSİYONLARI (Pending & My Orders)
# ======================================================
@order_bp.route("/pending", methods=["GET"])
@cross_origin()
def get_pending_orders():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT po.pending_order_id, p.first_name || ' ' || p.last_name, po.total_amount, po.order_date
            FROM pending_orders po
            JOIN customer c ON po.customer_id = c.customer_id
            JOIN person p ON c.person_id = p.person_id
            WHERE po.status = 'PENDING'
            ORDER BY po.order_date DESC
        """)
        rows = cur.fetchall()
        orders = [{
            "pending_order_id": r[0],
            "customer_name": r[1],
            "total_amount": float(r[2]),
            "order_date": r[3].strftime('%d.%m.%Y %H:%M') if r[3] else "-"
        } for r in rows]
        return jsonify({"success": True, "orders": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn: conn.close()

@order_bp.route("/my-orders/<int:p_id>", methods=["GET"])
@cross_origin()
def get_my_orders(p_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT o.order_id, o.order_date, o.total_amount, o.approved_by_role
            FROM orders o
            JOIN customer c ON o.customer_id = c.customer_id
            WHERE c.person_id = %s
            ORDER BY o.order_date DESC
        """, (p_id,))
        rows = cur.fetchall()
        orders = [{
            "order_id": r[0],
            "order_date": r[1].strftime('%d.%m.%Y %H:%M') if r[1] else "-",
            "total_amount": float(r[2]),
            "status": "Approved" if r[3] else "Processing"
        } for r in rows]
        return jsonify({"success": True, "orders": orders})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn: conn.close()



@order_bp.route("/approved-list", methods=["GET"])
@cross_origin()
def get_approved_orders():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # 'orders' tablosundan onaylanmış siparişleri detaylarıyla çekiyoruz
        # customer ve person tabloları ile JOIN yaparak müşteri ismini alıyoruz
        cur.execute("""
            SELECT 
                o.order_id, 
                p.first_name || ' ' || p.last_name AS customer_name, 
                o.total_amount, 
                o.order_date,
                o.approved_by_role,
                ap.first_name || ' ' || ap.last_name AS approved_by_name
            FROM orders o
            JOIN customer c ON o.customer_id = c.customer_id
            JOIN person p ON c.person_id = p.person_id
            LEFT JOIN person ap ON o.approved_by_person_id = ap.person_id
            ORDER BY o.order_date DESC
        """)
        
        rows = cur.fetchall()
        approved_orders = [{
            "order_id": r[0],
            "customer_name": r[1],
            "total_amount": float(r[2]),
            "order_date": r[3].strftime('%d.%m.%Y %H:%M') if r[3] else "-",
            "approved_by_role": r[4],
            "approved_by_name": r[5] if r[5] else "System"
        } for r in rows]
        
        return jsonify({"success": True, "orders": approved_orders})
    except Exception as e:
        return jsonify({"success": False, "message": f"Liste çekme hatası: {str(e)}"}), 500
    finally:
        if conn: conn.close()

@order_bp.route("/reject/<int:pending_order_id>", methods=["DELETE"])
@cross_origin()
def reject_pending_order(pending_order_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Önce kalemleri sonra ana kaydı siliyoruz (Foreign Key kısıtlaması için)
        cur.execute('DELETE FROM pending_order_items WHERE pending_order_id = %s', (pending_order_id,))
        cur.execute('DELETE FROM pending_orders WHERE pending_order_id = %s', (pending_order_id,))
        
        conn.commit()
        return jsonify({"success": True, "message": "Sipariş reddedildi ve silindi."})
    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn: conn.close()