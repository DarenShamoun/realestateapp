from PyQt5.QtWidgets import QWidget, QVBoxLayout, QListWidget, QPushButton, QDialog
from models.db_manager import DatabaseManager
from dialogs.property_dialog import PropertyDialog
from dialogs.edit_property_dialog import EditPropertyDialog

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

        self.refresh_properties()  # Load and display properties on startup

    def add_property(self):
        dialog = PropertyDialog(self)
        result = dialog.exec_()

        if result == QDialog.Accepted:
            self.refresh_properties()  # Refresh property list after adding new property

    def edit_property(self):
        selected_property_name = self.get_selected_property()
        # Retrieve the full property details using selected_property_name
        # Open the edit dialog with the retrieved details
        dialog = EditPropertyDialog(selected_property_name, self)
        result = dialog.exec_()
        if result == QDialog.Accepted:
            # Assumes dialog returns edited details
            new_property_name = dialog.get_new_property_name()  
            # Update the database and refresh the properties list
            db_manager = DatabaseManager()
            db_manager.update_property(selected_property_name, new_property_name)
            self.refresh_properties()

    def get_selected_property(self):
        selected_item = self.property_list.currentItem()  # Assumes you're using a QListWidget for property_list
        selected_property_name = selected_item.text()
        # Retrieve additional details from database if necessary
        return selected_property_name

    def populate_properties(self, properties):
        # TODO: Query the database to get the list of properties and add them to the property_list
        for property in properties:
            self.property_list.addItem(property['property_name'])

    def refresh_properties(self):
        self.property_list.clear()
        db_manager = DatabaseManager()
        properties = db_manager.get_properties()
        for property in properties:
            self.property_list.addItem(property['PropertyName'])
