from PyQt5.QtWidgets import QApplication, QMainWindow
from models.db_init import init_db  
from views.dashboard_view import DashboardView  # Import the DashboardView class

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set window properties
        self.setWindowTitle('Real Estate Management')
        self.setGeometry(100, 100, 800, 600)  # Set window size and position

        # Initialize the dashboard view and set it as the central widget
        self.dashboard_view = DashboardView()
        self.setCentralWidget(self.dashboard_view)

        # TODO: Query the database to get properties and populate the dashboard
        properties = []  # Replace this with actual query result
        self.dashboard_view.populate_properties(properties)

if __name__ == "__main__":
    import sys
    
    # Initialize the database. Ensure you use the correct path to your SQLite database
    init_db('real_estate.db')

    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec_())
