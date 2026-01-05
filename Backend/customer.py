from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db_config import get_connection

customer_bp = Blueprint("customer", __name__, url_prefix="/customer")

# ======================================================
# LOGIN
# ======================s================================
@customer_bp.route("/login", methods=["POST", "OPTIONS"])
@cross_origin()
def customer_login():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200
        
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Role kontrolü person tablosunda yapılıyor
        cur.execute("""
            SELECT person_id, first_name, last_name, email, username
            FROM person
            WHERE username = %s AND password = %s AND role = 'customer'
        """, (username, password))

        person = cur.fetchone()
        
        if person:
            p_id = person[0]
            # Customer tablosundan customer_id bilgisini çekiyoruz (İlişki: person_id)
            cur.execute("SELECT customer_id FROM customer WHERE person_id = %s", (p_id,))
            cust_row = cur.fetchone()
            c_id = cust_row[0] if cust_row else None

            return jsonify({
                "success": True,
                "user": {
                    "person_id": p_id,
                    "customer_id": c_id, 
                    "first_name": person[1],
                    "last_name": person[2],
                    "email": person[3],
                    "username": person[4]
                }
            })
        else:
            return jsonify({"success": False, "message": "Kullanıcı adı veya şifre hatalı."}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ======================================================
# SIGNUP
# ======================================================
@customer_bp.route("/signup", methods=["POST", "OPTIONS"])
@cross_origin()
def customer_signup():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    data = request.get_json() or {}
    
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    gender = data.get("gender", "Other")
    email = data.get("email")
    address = data.get("address") 
    city = data.get("city")
    postal_code = data.get("postal_code")
    phone_number = data.get("phone_number")
    age = data.get("age", 0)
    username = data.get("username")
    password = data.get("password")

    if not all([first_name, last_name, email, username, password]):
        return jsonify({"success": False, "message": "Zorunlu alanları doldurun."}), 400

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 1. ADIM: person tablosuna kayıt
        cur.execute("""
            INSERT INTO person (first_name, last_name, gender, email, address, city, postal_code, phone_number, age, username, password, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'customer')
            RETURNING person_id;
        """, (first_name, last_name, gender, email, address, city, postal_code, phone_number, age, username, password))
        person_id = cur.fetchone()[0]

        # 2. ADIM: customer (Ana Tablo) tablosuna kayıt
        # Siteden kayıt olduğu için tipi 'Online' olarak işaretliyoruz
        cur.execute("""
            INSERT INTO customer (person_id, customer_type)
            VALUES (%s, 'Online')
            RETURNING customer_id;
        """, (person_id,))
        customer_id = cur.fetchone()[0]

        # 3. ADIM: online_customer (Alt Tablo) tablosuna kayıt
        # ER diyagramındaki Overlap mantığı: customer_id'yi buraya anahtar olarak ekliyoruz
        cur.execute("""
            INSERT INTO online_customer (online_customer_id, username, password)
            VALUES (%s, %s, %s);
        """, (customer_id, username, password))

        conn.commit()
        return jsonify({"success": True, "message": "Kayıt başarılı."}), 201
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Signup Hatası: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            conn.close()

# ======================================================
# CUSTOMER INFO (MY ACCOUNT)
# ======================================================

@customer_bp.route("/info/<int:person_id>", methods=["GET"])
@cross_origin()
def get_customer_info(person_id):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 🔥 purchased_quantity ve credit_amount sorgudan çıkarıldı
        cur.execute("""
            SELECT 
                p.first_name, p.last_name, p.gender, p.email, 
                p.address, p.city, p.postal_code, p.phone_number, 
                p.age, p.username,
                c.customer_type,
                c.customer_id
            FROM person p
            JOIN customer c ON p.person_id = c.person_id
            WHERE p.person_id = %s
        """, (person_id,))

        row = cur.fetchone()

        if row:
            return jsonify({
                "success": True,
                "info": {
                    "first_name": row[0],
                    "last_name": row[1],
                    "gender": row[2],
                    "email": row[3],
                    "address": row[4],
                    "city": row[5],
                    "postal_code": row[6],
                    "phone_number": row[7],
                    "age": row[8],
                    "username": row[9],
                    "customer_type": row[10],
                    "customer_id": row[11]
                }
            })
        else:
            return jsonify({"success": False, "message": "Kullanıcı bulunamadı"}), 404

    except Exception as e:
        print(f"🔥 Backend Hatası: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()