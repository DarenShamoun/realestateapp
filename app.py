from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from routes.property_routes import property_bp

app = Flask(__name__)

app.register_blueprint(property_bp)

# Replace the below line with your actual database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:shamoun111@localhost/realestateapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
 