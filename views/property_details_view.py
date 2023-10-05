from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel

class PropertyDetailsView(QWidget):
    def __init__(self, property_name, parent=None):
        super().__init__(parent)

        # Create layout
        layout = QVBoxLayout()

        # Create widgets
        self.label = QLabel(f"Details for {property_name}")
        self.image_placeholder = QLabel("Image will go here")
        self.financial_overview = QLabel("Financial Overview will go here")

        # Add widgets to layout
        layout.addWidget(self.label)
        layout.addWidget(self.image_placeholder)
        layout.addWidget(self.financial_overview)

        # Set the layout for this widget
        self.setLayout(layout)
