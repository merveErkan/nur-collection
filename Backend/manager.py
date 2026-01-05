from flask import Blueprint, request, jsonify
from db_config import get_connection

# 🔹 Blueprint'i en üstte tanımla
manager_bp = Blueprint("manager", __name__, url_prefix="/manager")

# =====================
#   MANAGER LOGIN
# =====================
@manager_bp.route("/login", methods=["POST"])
def manager_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT person_id, first_name, last_name, role
            FROM person
            WHERE username = %s AND password = %s AND role = 'manager'
        """, (username, password))

        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return jsonify({
                "success": True,
                "person_id": user[0],   # 🔥 EN ÖNEMLİSİ
                "role": user[3]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Hatalı kullanıcı adı veya şifre"
            })

    except Exception as e:
        print("🔥 Login error:", e)
        return jsonify({"success": False, "message": "Sunucu hatası"}), 500

# =====================
#   EMPLOYEE LIST
# =====================
@manager_bp.route("/employeeList", methods=["GET"])
def get_employee_list():
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
        SELECT 
            p.person_id,
            p.first_name,
            p.last_name,
            p.gender,
            p.email,
            p.address,
            p.city,
            p.postal_code,
            p.phone_number,
            p.age,
            p.username,
            e.hire_date,
            e.salary,
            e.service_duration
        FROM person p
        JOIN employee e ON p.person_id = e.person_id;
        """

        cur.execute(query)
        rows = cur.fetchall()

        employees = []
        for row in rows:
            employees.append({
                "person_id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "gender": row[3],
                "email": row[4],
                "address": row[5],
                "city": row[6],
                "postal_code": row[7],
                "phone_number": row[8],
                "age": row[9],
                "username": row[10],
                "hire_date": row[11].isoformat() if row[11] else None,
                "salary": float(row[12]) if row[12] else None,
                "service_duration": str(row[13]) if row[13] else None
        })


        cur.close()
        conn.close()

        return jsonify({"success": True, "employees": employees})

    except Exception as e:
        print("🔥 Hata:", e)
        return jsonify({"success": False, "message": "Veritabanı hatası"}), 500


@manager_bp.route("/employeeDelete/<int:person_id>", methods=["DELETE"])
def delete_employee(person_id):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Önce employee tablosundan sil
        cur.execute("DELETE FROM Employee WHERE person_id = %s", (person_id,))

        # Sonra person tablosundan sil
        cur.execute("DELETE FROM Person WHERE person_id = %s", (person_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Employee deleted successfully!"})

    except Exception as e:
        print("🔥 Delete Error:", e)
        return jsonify({"success": False, "message": "Database delete error"}), 500

@manager_bp.route("/generalReport", methods=["GET"])
def get_general_report():
    try:
        conn = get_connection()
        cur = conn.cursor()
   
        query = """
        SELECT 
            person_id, first_name, last_name, gender, 
            email, address, city, postal_code, 
            phone_number, age, username, role
        FROM person
        ORDER BY person_id ASC;
        """

        cur.execute(query)
        rows = cur.fetchall()

        report = []
        for row in rows:
            report.append({
                "person_id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "gender": row[3],
                "email": row[4],
                "address": row[5],
                "city": row[6],
                "postal_code": row[7],
                "phone_number": row[8],
                "age": row[9],
                "username": row[10],
                "role": row[11]
            })

        cur.close()
        conn.close()
        
      
        return jsonify({"success": True, "report": report})

    except Exception as e:
        print("🔥 Report Error:", e)
        return jsonify({"success": False, "message": str(e)}), 500



@manager_bp.route("/productList", methods=["GET"])
def get_product_list():
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        
        query = """
        SELECT product_id, category_id, price, material,color,image_url, quantity 
        FROM product 
        ORDER BY product_id ASC;
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        products = []
        for r in rows:
            products.append({
                "product_id": r[0],
                "category_id": r[1],
                "price": float(r[2]),
                "material": r[3],
                "color": r[4],
                "image_url": r[5],
                "quantity": r[6]
            })
            
        cur.close()
        conn.close()
        return jsonify({"success": True, "products": products})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500