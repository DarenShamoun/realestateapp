from flask import Flask
from flask_cors import CORS
from extensions import db, migrate
from routes.property_routes import property_bp
from routes.unit_routes import unit_bp
from routes.tenant_routes import tenant_bp
from routes.lease_routes import lease_bp
from routes.payment_routes import payment_bp
from routes.expense_routes import expense_bp
from routes.rent_routes import rent_bp
from routes.rent_history_routes import rent_history_bp
from routes.document_routes import document_bp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')

# Set the absolute path for DOCUMENTS_FOLDER
# This sets the path relative to the location of app.py
base_dir = os.path.abspath(os.path.dirname(__file__))
documents_folder = os.getenv('DOCUMENTS_FOLDER', 'documents')
app.config['DOCUMENTS_FOLDER'] = os.path.join(base_dir, documents_folder)

# Initialize Database and Migrate
db.init_app(app)
migrate.init_app(app, db)

# Register Blueprints
app.register_blueprint(property_bp)
app.register_blueprint(unit_bp)
app.register_blueprint(tenant_bp)
app.register_blueprint(lease_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(rent_bp)
app.register_blueprint(rent_history_bp)
app.register_blueprint(document_bp)

@app.route('/')
def welcome():
    return 'Welcome to the Real Estate Management API!'

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
