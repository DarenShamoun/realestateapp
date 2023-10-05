# import_view.py

from PyQt5.QtWidgets import QWidget, QComboBox, QPushButton, QVBoxLayout, QFileDialog
from models.import_model import ImportModel
from models.property_model import PropertyModel

class ImportView(QWidget):
    def __init__(self, db_path):
        super().__init__()
        self.import_model = ImportModel(db_path)
        self.property_model = PropertyModel(db_path)
        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()

        # Property Dropdown
        self.property_dropdown = QComboBox()
        properties = self.property_model.get_all_properties()
        for property in properties:
            self.property_dropdown.addItem(property['PropertyName'], property['PropertyID'])
        layout.addWidget(self.property_dropdown)

        # Import Button
        self.import_button = QPushButton('Import Data')
        self.import_button.clicked.connect(self.import_data)
        layout.addWidget(self.import_button)

        self.setLayout(layout)

    def import_data(self):
        # Get selected property ID
        property_id = self.property_dropdown.currentData()

        # Open File Dialog to select Excel file
        options = QFileDialog.Options()
        file_name, _ = QFileDialog.getOpenFileName(self, "QFileDialog.getOpenFileName()", "", "Excel Files (*.xlsx);;All Files (*)", options=options)
        if file_name:
            # Define your mappings here
            mappings = {
                # 'ExcelColumnName': 'ExpectedColumnName',
                # ... add your mappings ...
            }
            success, message = self.import_model.import_data(file_name, mappings, property_id)
            # Handle success or failure, maybe show a message to the user
