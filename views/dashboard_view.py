from PyQt5.QtWidgets import QWidget, QVBoxLayout, QListWidget, QPushButton, QDialog
from models.db_manager import DatabaseManager
from dialogs.property_dialog import PropertyDialog

class DashboardView(QWidget):
    def __init__(self):
        super().__init__()

        # Set up the layout
        layout = QVBoxLayout()

        # Set up and add the QListWidget for properties
        self.property_list = QListWidget()
        layout.addWidget(self.property_list)

        # Set up and add the 'Add Property' button
        self.add_property_button = QPushButton('Add Property')
        self.add_property_button.clicked.connect(self.add_property)
        layout.addWidget(self.add_property_button)

        # Set up and add the 'Edit Property' button
        self.edit_property_button = QPushButton('Edit Property')
        self.edit_property_button.clicked.connect(self.edit_property)
        layout.addWidget(self.edit_property_button)

        # Apply the layout
        self.setLayout(layout)

    def add_property(self):
        dialog = PropertyDialog(self)
        result = dialog.exec_()

        if result == QDialog.Accepted:
            self.refresh_properties()  # Refresh property list after adding new property


    def edit_property(self):
        # TODO: Implement the functionality for editing a property
        print("Edit Property Button Clicked")

    def populate_properties(self, properties):
        # TODO: Query the database to get the list of properties and add them to the property_list
        for property in properties:
            self.property_list.addItem(property['property_name'])

    def refresh_properties(self):
        self.property_list.clear()
        
        db_manager = DatabaseManager()  # Initialize your database manager
        properties = db_manager.get_properties()  # Get properties from the database
        
        for property in properties:
            self.property_list.addItem(property['property_name'])




