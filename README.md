## Real Estate Management Application
This application is a Flask-based backend for managing real estate properties. It includes a PostgreSQL database for storing property data and Flask-Migrate for database migrations.

## Getting Started

# Prerequisites
Python 3
pip
Virtual Environment (venv)
PostgreSQL

# Installation
Clone the repository:
bash
Copy code
git clone [https://github.com/DarenShamoun/realestateapp]
Navigate to the project directory:
bash
Copy code
cd realestateapp
Create a virtual environment and activate it:
bash
Copy code
python -m venv venv
.\venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Unix or MacOS
Install required packages:
bash
Copy code
pip install Flask Flask-SQLAlchemy Flask-Migrate psycopg2
Set up PostgreSQL database and update SQLALCHEMY_DATABASE_URI in app.py with your database credentials.

# Running the Application
To run the Flask application:
bash
Copy code
flask run
Access the application at http://127.0.0.1:5000/.

# Project Structure
app.py: Main Flask application file.
models.py: Contains SQLAlchemy models for the database.
/venv: Virtual environment for the project.