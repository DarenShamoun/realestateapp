import sqlite3

class TenantModel:
    def __init__(self, db_path):
        self.conn = sqlite3.connect(db_path)

    def insert(self, property_id, unit_id, tenant_name, other_details):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO Tenants (PropertyID, UnitID, TenantName, OtherDetails) VALUES (?, ?, ?, ?)", (property_id, unit_id, tenant_name, other_details))
        self.conn.commit()
        return cursor.lastrowid

    # Implement other methods for update, delete, and retrieval as needed
