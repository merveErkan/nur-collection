from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db_config import get_connection

product_bp = Blueprint("product", __name__, url_prefix="/product")

# ============================
# ✅ PRODUCT INSERT (Ekleme)
# ============================
@product_bp.route("/insert", methods=["POST"])
@cross_origin()
def insert_product():
    conn = None
    try:
        data = request.get_json()

        category_id = int(data.get("category_id"))
        price = data.get("price")
        material = data.get("material")
        color = data.get("color")
        quantity = data.get("quantity", 0) 
        image_url = data.get("image_url", "/images/default.png")

        size = data.get("size")
        lengt = data.get("lengt")
        body = data.get("body")

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO Product (category_id, price, material, color, image_url, quantity)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING product_id;
        """, (category_id, price, material, color, image_url, quantity))

        product_id = cur.fetchone()[0]

        if category_id == 2:  # Scarf
            cur.execute("INSERT INTO Scarf (product_id, size) VALUES (%s, %s)", (product_id, size))
        elif category_id == 1:  # Swal
            cur.execute("INSERT INTO Swal (product_id, lengt) VALUES (%s, %s)", (product_id, lengt))
        elif category_id == 3:  # Bonnet
            cur.execute("INSERT INTO Bonnet (product_id, body) VALUES (%s, %s)", (product_id, body))

        conn.commit()
        return jsonify({"success": True, "message": "Product successfully added!", "product_id": product_id})

    except Exception as e:
        if conn: conn.rollback()
        print("🔥 Insert error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

# ============================
# ✅ PRODUCT LIST (Listeleme)
# ============================
@product_bp.route("/list", methods=["GET"])
@cross_origin()
def list_products():
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

       
        cur.execute("""
            SELECT 
                p.product_id, 
                p.category_id, 
                p.price, 
                p.material, 
                p.color, 
                p.image_url, 
                p.quantity,
                c.category_name  
            FROM Product p
            LEFT JOIN Category c ON p.category_id = c.category_id
            ORDER BY p.product_id;
        """)

        rows = cur.fetchall()
        products = []
        for row in rows:
            products.append({
                "product_id": row[0],
                "category_id": row[1],
                "price": float(row[2]),
                "material": row[3],
                "color": row[4],
                "image_url": row[5],
                "quantity": row[6],
                "category_name": row[7]  
            })

        return jsonify({"success": True, "products": products})

    except Exception as e:
        print("🔥 Product list error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

# ============================
# ✅ PRODUCT DELETE (Silme)
# ============================
@product_bp.route("/delete/<int:product_id>", methods=["DELETE"])
@cross_origin()
def delete_product(product_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT category_id FROM product WHERE product_id = %s", (product_id,))
        result = cur.fetchone()

        if not result:
            return jsonify({"success": False, "message": "Product not found"}), 404

        category_id = result[0]

        if category_id == 2:
            cur.execute("DELETE FROM Scarf WHERE product_id = %s", (product_id,))
        elif category_id == 1:
            cur.execute("DELETE FROM Swal WHERE product_id = %s", (product_id,))
        elif category_id == 3:
            cur.execute("DELETE FROM Bonnet WHERE product_id = %s", (product_id,))

        cur.execute("DELETE FROM product WHERE product_id = %s", (product_id,))

        conn.commit()
        return jsonify({"success": True, "message": "Product deleted successfully!"})

    except Exception as e:
        if conn: conn.rollback()
        print("🔥 Delete Error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

# ======================================================
# 🔹 TOPLU FİYAT GÜNCELLEME (Saklı Prosedür Çağrısı)
# ======================================================
@product_bp.route("/bulk-price-update", methods=["POST"])
@cross_origin()
def bulk_price_update():
    conn = None
    try:
        data = request.get_json()
        percent_val = data.get("percentage")

        if percent_val is None:
            return jsonify({"success": False, "message": "Yüzde miktarı girilmedi"}), 400

        conn = get_connection()
        cur = conn.cursor()

        # 🔥 Veritabanında oluşturduğun Saklı Prosedürü 'CALL' ile tetikliyoruz
        cur.execute("CALL update_prices_by_percentage(%s)", (percent_val,))
        
        conn.commit()
        return jsonify({"success": True, "message": f"Tüm fiyatlar %{percent_val} oranında başarıyla güncellendi!"})

    except Exception as e:
        if conn: conn.rollback()
        print("🔥 Procedure Call Error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

@product_bp.route("/<int:p_id>", methods=["GET", "OPTIONS"])
@cross_origin()
def get_product_detail(p_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # 1. ADIM: Ürün detaylarını View'dan çekiyoruz.
        # Sütunları tek tek yazıyoruz ki indisler (row[0], row[1]...) asla şaşmasın.
        query = """
            SELECT 
                product_id,     -- row[0]
                category_name,  -- row[1]
                product_type,   -- row[2]
                price,          -- row[3]
                material,       -- row[4]
                color,          -- row[5]
                quantity,       -- row[6]
                image_url,      -- row[7]
                category_id     -- row[8]
            FROM view_product_details 
            WHERE product_id = %s
        """
        cur.execute(query, (p_id,))
        row = cur.fetchone()

        # Terminalde kontrol et: Eğer burada None yazıyorsa View'da LEFT JOIN eksiktir!
        print(f"--- DEBUG: Database Result(ID {p_id}): {row}")

        if row:
            # 2. ADIM: Bu ürüne ait Trigger Loglarını (stock_log) çekiyoruz.
            # Eğer tablo boşsa veya hata verirse programın çökmemesi için try-except içine aldık.
            logs = []
            try:
                log_query = """
                    SELECT operation_type, old_quantity, new_quantity, change_date 
                    FROM stock_log 
                    WHERE product_id = %s 
                    ORDER BY change_date DESC
                """
                cur.execute(log_query, (p_id,))
                log_rows = cur.fetchall()
                
                for l in log_rows:
                    logs.append({
                        "operation_type": l[0],
                        "old_quantity": l[1],
                        "new_quantity": l[2],
                        "change_date": l[3].isoformat() if l[3] else None
                    })
            except Exception as log_error:
                print(f"Logs could not be retrieved (Table missing or empty): {log_error}")
                logs = []

            # 3. ADIM: React'in beklediği formatta JSON döndürüyoruz.
            return jsonify({
                "product_id": row[0],
        "category_name": row[1],
        "product_type": row[2],
        "price": float(row[3]) if row[3] else 0,
        "material": row[4],
        "color": row[5],
        "quantity": row[6],
        "image_url": row[7],
        "category_id": row[8],
        # Alt tablolardan gelen özel sütunlar (View sorguna bunları da ekle!)
        "size": row[9] if len(row) > 9 else None,
        "lengt": row[10] if len(row) > 10 else None,
        "body": row[11] if len(row) > 11 else None,
        "logs": logs
            }), 200
        else:
            # Eğer row None dönerse burası çalışır (404 Hatası buradandır)
            return jsonify({"success": False, "message": "Product not found."}), 404

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()
            