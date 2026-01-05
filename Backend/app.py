from flask import Flask
from flask_cors import CORS
from manager import manager_bp
from employee import employee_bp
from customer import customer_bp
from product import product_bp
from order import order_bp
import os

app = Flask(__name__)
CORS(app)

app.register_blueprint(product_bp)
app.register_blueprint(manager_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(order_bp)

@app.route('/')
def home():
    return "Backend çalışıyor!"

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)

