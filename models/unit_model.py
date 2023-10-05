import sqlite3

class UnitModel:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)

    def insert(self, property_id, unit_name, other_details):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO Units (PropertyID, UnitName, OtherDetails) VALUES (?, ?, ?)", (property_id, unit_name, other_details))
        self.conn.commit()
        return cursor.lastrowid

    # Implement other methods for update, delete, and retrieval as needed
