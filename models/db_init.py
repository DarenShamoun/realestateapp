import sqlite3

def init_db(db_path):
    conn = sqlite3.connect('real_estate.db')
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Properties (
        PropertyID INTEGER PRIMARY KEY,
        PropertyName TEXT NOT NULL
        -- Add other relevant property details here
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Units (
        UnitID INTEGER PRIMARY KEY,
        PropertyID INTEGER,
        UnitName TEXT NOT NULL,
        FOREIGN KEY (PropertyID) REFERENCES Properties (PropertyID)
        -- Add other relevant unit details here
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Tenants (
        TenantID INTEGER PRIMARY KEY,
        PropertyID INTEGER,
        UnitID INTEGER,
        TenantName TEXT NOT NULL,
        FOREIGN KEY (PropertyID) REFERENCES Properties (PropertyID),
        FOREIGN KEY (UnitID) REFERENCES Units (UnitID)
        -- Add other relevant tenant details here
    );
    """)

    conn.commit()
    conn.close()

# Call this function at the start of your application to ensure the database is initialized
init_db('your_database_name.db')
