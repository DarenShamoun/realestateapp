from PyQt5.QtWidgets import QDialog, QVBoxLayout, QLabel, QLineEdit, QPushButton
from models.db_manager import DatabaseManager

class EditPropertyDialog(QDialog):
    def __init__(self, original_property_name, parent=None):
        super().__init__(parent)

        # Set up layout
        layout = QVBoxLayout()

        # Create and add widgets
        self.name_label = QLabel('Property Name:')
        self.name_edit = QLineEdit()
        layout.addWidget(self.name_label)
        layout.addWidget(self.name_edit)

        # Add Save button
        self.save_button = QPushButton('Save')
        self.save_button.clicked.connect(self.save_property)
        layout.addWidget(self.save_button)

        # Set dialog layout
        self.setLayout(layout)
        self.db_manager = DatabaseManager()

        # Load original property details
        self.original_property_name = original_property_name
        self.load_property_details(original_property_name)

    def load_property_details(self, property_name):
        property_details = self.db_manager.get_property_details(property_name)
        self.name_edit.setText(property_details['PropertyName'])

    def save_property(self):
        new_property_name = self.name_edit.text()
        original_property_id = self.db_manager.get_property_id(self.original_property_name)
        self.db_manager.update_property(original_property_id, new_property_name)
        self.accept()  # Close the dialog after updating
