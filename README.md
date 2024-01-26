## Real Estate Management Application

# Getting Started

# Prerequisites

Python 3
pip (Python package manager)
Virtual Environment (recommended: virtualenv)
PostgreSQL
Node.js and npm
Git (for version control)

# Backend Setup
- Clone the Repository

git clone [repository-url]

# Set Up a Python Virtual Environment

-Navigate to the \backend directory

python -m venv venv
.\venv\Scripts\activate  # Windows

# Install Dependencies

pip install -r requirements.txt

# Set Up the Database

- Install PostgreSQL and create a database.
- Update SQLALCHEMY_DATABASE_URI in app.py.

# Run Migrations

flask db upgrade

# Start the Flask Server

flask run

# Frontend Setup

- Navigate to the \frontend Directory

- Install Node Modules

npm install

- Start the React Development Server

npm start

## Running the Application

Flask backend: http://127.0.0.1:5000
React frontend: http://localhost:3000

## Features

Backend API for real estate data management.
Frontend interface for data interaction.
CRUD operations for properties, units, tenants, leases, payments, and expenses.

- Testing

Use Postman for Flask API endpoints.
Test React components and backend integration.