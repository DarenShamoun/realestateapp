import sqlite3

class PropertyModel:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)

    def insert(self, property_name, other_details):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO Properties (PropertyName, OtherDetails) VALUES (?, ?)", (property_name, other_details))
        self.conn.commit()
        return cursor.lastrowid

    def get_all_properties(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM Properties")
        return cursor.fetchall()

    # Implement other methods for update, delete as needed
