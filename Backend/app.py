from flask import Flask
from flask_cors import CORS
from manager import manager_bp
from employee import employee_bp
from customer import customer_bp
from product import product_bp
from order import order_bp

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(product_bp)
app.register_blueprint(manager_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(order_bp)


@app.route('/')
def home():
    return "Backend çalışıyor!"

if __name__ == '__main__':
    app.run(debug=True, port=5003)
