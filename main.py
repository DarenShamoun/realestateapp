# main.py

from PyQt5.QtWidgets import QApplication, QMainWindow
from views.property_view import PropertyView
from models.db_init import init_db  # Import the initialization function

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set window properties
        self.setWindowTitle('Real Estate Management')
        self.setGeometry(100, 100, 800, 600)  # Set window size and position

        # Initialize the property view and set it as the central widget
        self.property_view = PropertyView(self)
        self.setCentralWidget(self.property_view)

if __name__ == "__main__":
    import sys
    
    # Initialize the database. Ensure you use the correct path to your SQLite database
    # For this example, the database is named "real_estate_db.db" and is located in the current working directory.
    # Adjust the path as needed based on your actual file structure.
    init_db('real_estate_db.db')

    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec_())
