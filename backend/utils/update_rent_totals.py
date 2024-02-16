from models import db, Rent
from services.rent_service import calculate_total_rent
from app import app

# This function updates the total_rent field for all rents in the database
def update_rent_totals():
    with app.app_context():
        rents = Rent.query.all()
        for rent in rents:
            rent.total_rent = calculate_total_rent(rent)
            db.session.add(rent)
        db.session.commit()

if __name__ == "__main__":
    update_rent_totals()
