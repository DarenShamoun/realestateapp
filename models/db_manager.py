import sqlite3

class DatabaseManager:
    def __init__(self, db_name='real_estate.db'):
        self.conn = sqlite3.connect('real_estate.db')
        self.conn.row_factory = sqlite3.Row  # Set row factory

    def get_properties(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM properties")  # Adjust query to match your actual table and column names
        properties = cursor.fetchall()
        return properties
    
    def insert_property(self, property_name):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO Properties (PropertyName) VALUES (?)", (property_name,))
        self.conn.commit()

    def update_property(self, property_id, new_property_name):
        cursor = self.conn.cursor()
        cursor.execute("UPDATE Properties SET PropertyName = ? WHERE PropertyID = ?", (new_property_name, property_id))
        self.conn.commit()

    def get_property_details(self, property_name):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM Properties WHERE PropertyName = ?", (property_name,))
        property_details = cursor.fetchone()
        return property_details  # Consider returning a dictionary with column names as keys

