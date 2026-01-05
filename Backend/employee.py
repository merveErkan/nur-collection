from flask import Blueprint, request, jsonify
from db_config import get_connection

employee_bp = Blueprint("employee", __name__, url_prefix="/employee")

# ============================
#  EMPLOYEE LOGIN
# ============================
@employee_bp.route("/login", methods=["POST"])
def employee_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT person_id, role
            FROM person
            WHERE username = %s AND password = %s AND role = 'employee'
        """, (username, password))

        user = cur.fetchone()

        cur.close()
        conn.close()

        if user:
            return jsonify({
                "success": True,
                "person_id": user[0],
                "role": user[1]
            })
        else:
            return jsonify({
                "success": False,
                "message": "Incorrect username or password"
            })

    except Exception as e:
        print("🔥 Employee login error:", e)
        return jsonify({"success": False, "message": "Server error"}), 500

# ============================
#  EMPLOYEE INSERT (YENİ EKLENDİ)
# ============================
@employee_bp.route("/insert", methods=["POST"])
def insert_employee():
    data = request.get_json()

    try:
        conn = get_connection()
        cur = conn.cursor()

        # 1) PERSON tablosuna ekleme
        person_sql = """
        INSERT INTO person (
            first_name, last_name, gender, email, address, city, postal_code,
            phone_number, age, username, password, role
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'employee')
        RETURNING person_id;
        """

        cur.execute(person_sql, (
            data["first_name"],
            data["last_name"],
            data["gender"],
            data["email"],
            data["address"],
            data["city"],
            data["postal_code"],
            data["phone_number"],
            data["age"],
            data["username"],
            data["password"]
        ))

        person_id = cur.fetchone()[0]

     
        employee_sql = """
        INSERT INTO employee (person_id, hire_date, salary, service_duration)
        VALUES (%s, %s, %s, %s);
        """

        cur.execute(employee_sql, (
            person_id,
            data["hire_date"],
            data["salary"],
            data["service_duration"]
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Employee successfully added.!"})

    except Exception as e:
        print("🔥 Insert errror:", e)
        return jsonify({"success": False, "message": "Employee could not be added.."}), 500
