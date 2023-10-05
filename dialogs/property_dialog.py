from PyQt5.QtWidgets import QDialog, QVBoxLayout, QLabel, QLineEdit, QPushButton
from models.db_manager import DatabaseManager

class PropertyDialog(QDialog):
    def __init__(self, parent=None):
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

    def save_property(self):
        property_name = self.name_edit.text()  # Get the text entered by the user
        self.db_manager.insert_property(property_name)  # Insert the new property into the database
        self.accept()  # Close the dialog after insertion
