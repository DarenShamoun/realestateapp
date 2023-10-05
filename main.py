from PyQt5.QtWidgets import QApplication, QMainWindow
from views.property_view import PropertyView

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
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec_())
