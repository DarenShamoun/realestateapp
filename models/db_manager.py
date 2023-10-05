import sqlite3

class DatabaseManager:
    def __init__(self, db_name='real_estate.db'):
        self.conn = sqlite3.connect('real_estate.db')

    def get_properties(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM properties")  # Adjust query to match your actual table and column names
        properties = cursor.fetchall()
        return properties
    
    def insert_property(self, property_name):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO Properties (PropertyName) VALUES (?)", (property_name,))
        self.conn.commit()

