# import_model.py

import pandas as pd
from models.property_model import PropertyModel
from models.unit_model import UnitModel
from models.tenant_model import TenantModel

class ImportModel:
    def __init__(self, db_path):
        self.property_model = PropertyModel(db_path)
        self.unit_model = UnitModel(db_path)
        self.tenant_model = TenantModel(db_path)

    def import_data(self, file_path, mappings, property_id):
        try:
            # Read Excel data
            data = self.read_excel(file_path)
            
            # Apply user-defined mappings
            mapped_data = self.apply_mappings(data, mappings)
            
            # Validate and clean data
            valid_data = self.validate_and_clean(mapped_data)
            
            # Insert data into database
            self.insert_data(property_id, valid_data)
            
            return True, "Data import successful!"
        except Exception as e:
            return False, str(e)

    def read_excel(self, file_path):
        xl = pd.ExcelFile(file_path)
        data = xl.parse(xl.sheet_names[0])
        return data

    def apply_mappings(self, data, mappings):
        return data.rename(columns=mappings)

    def validate_and_clean(self, data):
        # Implement your data validation and cleaning logic here
        return data

    def insert_data(self, property_id, data):
        for index, row in data.iterrows():
            unit_id = self.unit_model.insert(property_id, row['UnitName'], row['OtherUnitDetails'])
            self.tenant_model.insert(property_id, unit_id, row['TenantName'], row['OtherTenantDetails'])
