from waitress import serve
from dotenv import load_dotenv

print("Loading environment variables...")
load_dotenv()

print("Importing Flask app...")
from app import app

print("Starting Waitress server...")
serve(app, host='localhost', port=3000, url_scheme='http', threads=6)
