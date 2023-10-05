from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel, QComboBox
from models.db_manager import DatabaseManager
from views.property_details_view import PropertyDetailsView

class PropertyView(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)

        # Create layout
        layout = QVBoxLayout()

        # Create and configure widgets
        self.label = QLabel("Select Property:")
        self.property_selector = QComboBox()
        self.populate_properties()

        # Connect property_selector's signal to a slot function
        self.property_selector.currentIndexChanged.connect(self.on_property_selected)

        # Add widgets to layout
        layout.addWidget(self.label)
        layout.addWidget(self.property_selector)

        # Set the layout for this widget
        self.setLayout(layout)

    def populate_properties(self):
        db_manager = DatabaseManager()
        properties = db_manager.get_properties()
        property_names = [property[1] for property in properties]  # assuming the name is in the second column
        self.property_selector.addItems(property_names)

    def on_property_selected(self):
        selected_property = self.property_selector.currentText()
        property_details_view = PropertyDetailsView(selected_property)
        
        # You'd then load property_details_view where appropriate, e.g., in a QStackedWidget
        # For now, this is a placeholder and you might need to adjust it based on your app structure.
