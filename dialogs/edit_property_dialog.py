from PyQt5.QtWidgets import QDialog, QVBoxLayout, QLabel, QLineEdit, QPushButton
from models.db_manager import DatabaseManager

class EditPropertyDialog(QDialog):
    def __init__(self, property_name, parent=None):
        super().__init__(parent)
        
        # Set up layout
        layout = QVBoxLayout()
        
        # Create and add widgets
        self.name_label = QLabel('Property Name:')
        self.name_edit = QLineEdit()
        layout.addWidget(self.name_label)
        layout.addWidget(self.name_edit)
        
        # Add more widgets for other property details as needed
        
        # Add Save button
        self.save_button = QPushButton('Save')
        self.save_button.clicked.connect(self.save_property)
        layout.addWidget(self.save_button)
        
        # Set dialog layout
        self.setLayout(layout)
        
        # Load property details
        self.load_property_details(property_name)
    
    def load_property_details(self, property_name):
        db_manager = DatabaseManager()
        property_details = db_manager.get_property_details(property_name)
        self.name_edit.setText(property_details['PropertyName'])
        # ... (set other fields as necessary)
    
    def save_property(self):
        property_name = self.name_edit.text()  # Get the text entered by the user
        # ... (get other details from widgets)
        
        # Instantiate your DatabaseManager or equivalent class
        db_manager = DatabaseManager() 
        
        # Update the property details in the database
        db_manager.update_property(property_name)  # You need to implement update_property in DatabaseManager
        
        # Close the dialog after updating
        self.accept()
