import tkinter as tk
import sqlite3

# Database connection
conn = sqlite3.connect('real_estate.db')

def init_db():
    """Initialize the SQLite database with units and tenant table."""
    global conn
    conn = sqlite3.connect('real_estate.db')

    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY,
            property_name TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY,
            property_id INTEGER,
            unit_number TEXT NOT NULL,
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tenants (
            id INTEGER PRIMARY KEY,
            unit_id INTEGER,
            primary_tenant TEXT NOT NULL,
            primary_phone TEXT,
            secondary_tenant TEXT,
            secondary_phone TEXT,
            contact_notes TEXT,
            FOREIGN KEY (unit_id) REFERENCES units (id)
        )
    ''')

    conn.commit()

init_db()  # Initialize the database

# UI Functions
def on_exit():
    """Handle the event when the user chooses the Exit menu item."""
    root.destroy()

def get_properties():
    """Retrieve all properties from the database."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    properties = cursor.fetchall()
    return properties

def show_units_for_property(property_id):
    """Display all units associated with a given property."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM units WHERE property_id = ?", (property_id,))
    units = cursor.fetchall()
    
    # Clear the dashboard frame
    for widget in dashboard_frame.winfo_children():
        widget.destroy()
    
    # Display each unit
    tk.Label(dashboard_frame, text="Units", font=("Arial", 18)).pack(pady=10)
    for unit in units:
        unit_button = tk.Button(dashboard_frame, text=unit[2], command=lambda u=unit[0]: show_tenants_for_unit(u))
        unit_button.pack()

def show_properties():
    """Display all properties on the dashboard."""
    properties = get_properties()
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    tk.Label(dashboard_frame, text="Properties", font=("Arial", 18)).pack(pady=10)
    
    for property in properties:
        property_button = tk.Button(dashboard_frame, text=property[1], command=lambda p=property[0]: show_property_details(p))
        property_button.pack()

def show_property_details(property_id):
    """Display details for selected property."""
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    # Retrieve the details of the selected property from the database
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()

    # Display property name and other details
    property_name_label = tk.Label(dashboard_frame, text=f"Property: {property[1]}", font=("Arial", 18))
    property_name_label.pack(pady=10)

    # Retrieve and display units related to the selected property
    cursor.execute("SELECT * FROM units WHERE property_id = ?", (property_id,))
    units = cursor.fetchall()
    units_label = tk.Label(dashboard_frame, text="Units", font=("Arial", 18))
    units_label.pack(pady=10)
    for unit in units:
        unit_label = tk.Label(dashboard_frame, text=f"Unit {unit[2]}")
        unit_label.pack()

    # Add button to add new unit
    add_unit_button = tk.Button(dashboard_frame, text="Add New Unit", command=lambda: on_add_unit(property_id))
    add_unit_button.pack(pady=10)

    # Retrieve and display tenants related to the selected property
    cursor.execute("SELECT * FROM tenants WHERE unit_id IN (SELECT id FROM units WHERE property_id = ?)", (property_id,))
    tenants = cursor.fetchall()
    tenants_label = tk.Label(dashboard_frame, text="Tenants", font=("Arial", 18))
    tenants_label.pack(pady=10)
    for tenant in tenants:
        tenant_label = tk.Label(dashboard_frame, text=f"Tenant: {tenant[2]}")
        tenant_label.pack()

    # Add button to add new tenant
    add_tenant_button = tk.Button(dashboard_frame, text="Add New Tenant", command=show_add_tenant_form)
    add_tenant_button.pack(pady=10)

    # Back Button to go back to the list of properties
    back_button = tk.Button(dashboard_frame, text="Back to Properties", command=show_properties)
    back_button.pack(pady=10)

def show_tenants_for_unit(unit_id):
    """Display all tenants associated with a given unit."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenants WHERE unit_id = ?", (unit_id,))
    tenants = cursor.fetchall()
    
    # Clear the dashboard frame
    for widget in dashboard_frame.winfo_children():
        widget.destroy()
    
    # Display each tenant
    tk.Label(dashboard_frame, text="Tenants", font=("Arial", 18)).pack(pady=10)
    for tenant in tenants:
        tenant_info = f"{tenant[2]} - {tenant[3]}"  # Adjust this based on your tenant data structure
        tenant_label = tk.Label(dashboard_frame, text=tenant_info)
        tenant_label.pack()

def submit_property():
    """Submit the property form and insert property into database."""
    global property_name_entry
    
    # Retrieve data from form fields
    property_name = property_name_entry.get()
    
    # Insert data into SQLite database
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO properties (property_name)
        VALUES (?)
    ''', (property_name,))
    conn.commit()

    # Clear the form fields or navigate to another frame
    show_dashboard()

def on_add_property():
    """Display the form to add a new property."""
    global property_name_entry
    
    # Clear the dashboard frame
    for widget in dashboard_frame.winfo_children():
        widget.destroy()
    
    # Create and pack the property form elements
    tk.Label(dashboard_frame, text="Add Property Form", font=("Arial", 18)).pack(pady=10)
    tk.Label(dashboard_frame, text="Property Name:").pack()
    property_name_entry = tk.Entry(dashboard_frame)
    property_name_entry.pack()

    tk.Button(dashboard_frame, text="Submit", command=submit_property).pack()
    tk.Button(dashboard_frame, text="Back", command=show_dashboard).pack()

def submit_edit_property():
    """Submit the edit property form and update property in the database."""
    global selected_property_var, edit_property_name_entry
    
    # Retrieve data from form fields
    selected_property_id = selected_property_var.get()
    new_property_name = edit_property_name_entry.get()
    
    # Update data in SQLite database
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE properties SET property_name = ? WHERE id = ?
    ''', (new_property_name, selected_property_id))
    conn.commit()

    # Clear the form fields or navigate to another frame
    show_dashboard()

def on_edit_property():
    """Display the form to edit an existing property."""
    global selected_property_var, edit_property_name_entry
    
    # Clear the dashboard frame
    for widget in dashboard_frame.winfo_children():
        widget.destroy()
    
    # Retrieve and display a list of properties for selection
    properties = get_properties()
    tk.Label(dashboard_frame, text="Edit Property Form", font=("Arial", 18)).pack(pady=10)
    tk.Label(dashboard_frame, text="Select Property:").pack()
    property_menu = tk.OptionMenu(dashboard_frame, selected_property_var, *properties)
    property_menu.pack()
    
    # Create and pack the edit property form elements
    tk.Label(dashboard_frame, text="New Property Name:").pack()
    edit_property_name_entry = tk.Entry(dashboard_frame)
    edit_property_name_entry.pack()

    tk.Button(dashboard_frame, text="Submit", command=submit_edit_property).pack()
    tk.Button(dashboard_frame, text="Back", command=show_dashboard).pack()

def on_add_unit(property_id):
    """Display the form to add a new unit to a selected property."""
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    # Create and pack the unit form elements
    tk.Label(dashboard_frame, text="Add Unit Form", font=("Arial", 18)).pack(pady=10)
    
    tk.Label(dashboard_frame, text="Unit Number:").pack()
    unit_number_entry = tk.Entry(dashboard_frame)
    unit_number_entry.pack()

    def submit_unit():
        """Submit the unit form and insert unit into database."""
        # Retrieve data from form fields
        unit_number = unit_number_entry.get()
        
        # Insert data into SQLite database
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO units (property_id, unit_number)
            VALUES (?, ?)
        ''', (property_id, unit_number))
        conn.commit()

        # Clear the form fields or navigate to another frame
        show_property_details(property_id)
    
    tk.Button(dashboard_frame, text="Submit", command=submit_unit).pack()
    tk.Button(dashboard_frame, text="Back", command=lambda: show_property_details(property_id)).pack()


def show_dashboard():
    """Display the dashboard."""
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    tk.Label(dashboard_frame, text="Properties", font=("Arial", 18)).pack(pady=10)
    tk.Button(dashboard_frame, text="Add New Property", command=on_add_property).pack()


# Global variables for entry widgets
primary_tenant_entry = None
primary_phone_entry = None
secondary_tenant_entry = None
secondary_phone_entry = None
contact_notes_entry = None

def submit_tenant():
    """Submit the tenant form and insert tenant into database."""
    global primary_tenant_entry, primary_phone_entry, secondary_tenant_entry, secondary_phone_entry, contact_notes_entry
    
    # Retrieve data from form fields
    primary_tenant = primary_tenant_entry.get()
    primary_phone = primary_phone_entry.get()
    secondary_tenant = secondary_tenant_entry.get()
    secondary_phone = secondary_phone_entry.get()
    contact_notes = contact_notes_entry.get()
    
    # Insert data into SQLite database
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tenants (primary_tenant, primary_phone, secondary_tenant, secondary_phone, contact_notes)
        VALUES (?, ?, ?, ?, ?)
    ''', (primary_tenant, primary_phone, secondary_tenant, secondary_phone, contact_notes))
    conn.commit()

    # Clear the form fields or navigate to another frame
    show_dashboard()

def show_add_tenant_form():
    """Display the form to add a new tenant."""
    global primary_tenant_entry, primary_phone_entry, secondary_tenant_entry, secondary_phone_entry, contact_notes_entry
    
    # Clear the dashboard frame
    for widget in dashboard_frame.winfo_children():
        widget.destroy()
    
    # Create and pack the tenant form elements
    tk.Label(dashboard_frame, text="Add Tenant Form", font=("Arial", 18)).pack(pady=10)
    tk.Label(dashboard_frame, text="Primary Tenant:").pack()
    primary_tenant_entry = tk.Entry(dashboard_frame)
    primary_tenant_entry.pack()
    tk.Label(dashboard_frame, text="Primary Phone:").pack()
    primary_phone_entry = tk.Entry(dashboard_frame)
    primary_phone_entry.pack()
    tk.Label(dashboard_frame, text="Secondary Tenant:").pack()
    secondary_tenant_entry = tk.Entry(dashboard_frame)
    secondary_tenant_entry.pack()
    tk.Label(dashboard_frame, text="Secondary Phone:").pack()
    secondary_phone_entry = tk.Entry(dashboard_frame)
    secondary_phone_entry.pack()
    tk.Label(dashboard_frame, text="Contact Notes:").pack()
    contact_notes_entry = tk.Entry(dashboard_frame)
    contact_notes_entry.pack()

    tk.Button(dashboard_frame, text="Submit", command=submit_tenant).pack()
    tk.Button(dashboard_frame, text="Back", command=show_dashboard).pack()

def get_tenants():
    """Retrieve all tenants from the database."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenants")
    tenants = cursor.fetchall()
    return tenants

def show_tenants():
    """Display all tenants on the dashboard."""
    tenants = get_tenants()
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    tk.Label(dashboard_frame, text="Tenants", font=("Arial", 18)).pack(pady=10)
    
    for tenant in tenants:
        tenant_info = f"{tenant[1]} ({tenant[2]})"
        if tenant[3]:  # if there is a secondary tenant
            tenant_info += f", {tenant[3]} ({tenant[4]})"
        tk.Label(dashboard_frame, text=tenant_info).pack()
        
    # Back Button
    back_button = tk.Button(dashboard_frame, text="Back", command=show_dashboard)
    back_button.pack()

def show_dashboard():
    """Display the dashboard."""
    for widget in dashboard_frame.winfo_children():
        widget.destroy()

    tk.Label(dashboard_frame, text="Properties", font=("Arial", 18)).pack(pady=10)
    tk.Button(dashboard_frame, text="Add New Property", command=on_add_property).pack()

    tk.Label(dashboard_frame, text="Units", font=("Arial", 18)).pack(pady=10)
    # Add more buttons and labels as needed for Units

    tk.Label(dashboard_frame, text="Tenants", font=("Arial", 18)).pack(pady=10)
    view_tenants_button = tk.Button(dashboard_frame, text="View Tenants", command=show_tenants)
    view_tenants_button.pack(pady=10)
    tk.Button(dashboard_frame, text="Add New Tenant", command=show_add_tenant_form).pack(pady=10)

    tk.Label(dashboard_frame, text="Recent Transactions", font=("Arial", 18)).pack(pady=10)
    # Add more buttons and labels as needed for Transactions

# Main Application Window
root = tk.Tk()
root.title("Real Estate Management")
root.geometry("800x600")

selected_property_var = tk.StringVar()
edit_property_name_entry = None

# Menu Bar
menu_bar = tk.Menu(root)
file_menu = tk.Menu(menu_bar, tearoff=0)
file_menu.add_command(label="Import Data", command=None)
file_menu.add_command(label="Export Data", command=None)
file_menu.add_separator()
file_menu.add_command(label="Exit", command=on_exit)

property_menu = tk.Menu(menu_bar, tearoff=0)
property_menu.add_command(label="Add New Property", command=on_add_property)
property_menu.add_command(label="Edit Property", command=on_edit_property)
property_menu.add_command(label="Delete Property", command=None)

menu_bar.add_cascade(label="File", menu=file_menu)
menu_bar.add_cascade(label="Properties", menu=property_menu)

root.config(menu=menu_bar)

# Dashboard Frame
dashboard_frame = tk.Frame(root)
dashboard_frame.pack(fill=tk.BOTH, expand=True)

# Labels & Buttons on Dashboard
properties_label = tk.Label(dashboard_frame, text="Properties", font=("Arial", 18))
properties_label.pack(pady=10)
add_property_button = tk.Button(dashboard_frame, text="Add New Property", command=on_add_property)
add_property_button.pack()

units_label = tk.Label(dashboard_frame, text="Units", font=("Arial", 18))
units_label.pack(pady=10)
# Add more buttons and labels as needed for Units

tenants_label = tk.Label(dashboard_frame, text="Tenants", font=("Arial", 18))
tenants_label.pack(pady=10)
add_tenant_button = tk.Button(dashboard_frame, text="Add New Tenant", command=show_add_tenant_form)
add_tenant_button.pack(pady=10)

transactions_label = tk.Label(dashboard_frame, text="Recent Transactions", font=("Arial", 18))
transactions_label.pack(pady=10)
# Add more buttons and labels as needed for Transactions

# Call the show_dashboard function to initially load the dashboard view
show_dashboard()

root.mainloop()
