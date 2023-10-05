import sqlite3

class DatabaseManager:
    def __init__(self, db_name='real_estate.db'):
        self.connection = sqlite3.connect(db_name)

    def get_properties(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM Properties")  # Adjust the table name to match the actual name in the database
        properties = cursor.fetchall()
        return properties
