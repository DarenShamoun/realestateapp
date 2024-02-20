import os
import re
import tempfile
from flask import current_app
from reportlab.lib.pagesizes import letter, inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet

# Import the backend services
from services.property_service import get_properties
from services.unit_service import get_units
from services.lease_service import get_leases
from services.tenant_service import get_tenants
from services.rent_service import get_rents
from services.document_service import add_document

def generate_rent_stubs_pdf(property_id, month, year):
    # Fetch data
    property_data = get_properties({'property_id': property_id})
    units = get_units({'property_id': property_id})
    leases = get_leases({'property_id': property_id})
    tenants = get_tenants({'property_id': property_id})
    rents = get_rents({'property_id': property_id, 'month': month, 'year': year})

    # Function to split the unit number into parts of digits and non-digits
    def natural_keys(text):
        return [int(c) if c.isdigit() else c.lower() for c in re.split(r'(\d+)', text)]

    # Sorting the units list using the natural_keys function
    units.sort(key=lambda x: natural_keys(x.unit_number))

    # Initialize styles
    styles = getSampleStyleSheet()
    elements = []

    # Month number to name mapping
    month_names = {
        1: "January", 2: "February", 3: "March",
        4: "April", 5: "May", 6: "June",
        7: "July", 8: "August", 9: "September",
        10: "October", 11: "November", 12: "December"
    }

    # Fetch property name and replace spaces with underscores
    property_name = property_data[0].name.replace(" ", "_")

    # Ensure the month is an integer
    month_int = int(month)

    # Get the full month name from the month number
    full_month_name = month_names.get(month_int, "Invalid_Month")

    # Construct the desired filename using the full month name
    desired_filename = f"RentStubs_{property_name}_{full_month_name}_{year}.pdf"

    # Process data and create PDF content
    for unit in units:
        tenant = next((t for t in tenants for lease in t.leases if lease.unit_id == unit.id), None)
        rent_detail = next((r for r in rents if r.lease.unit_id == unit.id), None)

        if not tenant or not rent_detail:
            continue

        data = [
            [Paragraph(f"<b>Unit Number:</b> {unit.unit_number}, <b>Tenant:</b> {tenant.full_name}", styles['BodyText'])],
            [Paragraph(f"<b>Rent Payment Breakdown for {full_month_name} {year}</b>", styles['BodyText'])],
            [f"Rent: ${rent_detail.rent}", f"Breaks/Discounts: ${rent_detail.breaks}"],
            [f"Water/Sewer: ${rent_detail.water_sewer}", f"Previous Debts: ${rent_detail.debt}"],
            [f"Trash: ${rent_detail.trash}"],
            [f"Parking: ${rent_detail.parking}"],
            [f"Total for the Month: ${(rent_detail.total_rent - rent_detail.debt)}", f"Total Balance Due: ${rent_detail.total_rent}"]
        ]

        table = Table(data, colWidths=[3.0 * inch] * 2)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('SPAN', (0, 0), (1, 0)),
            ('SPAN', (0, 1), (1, 1)),
            ('ALIGN', (0, 1), (-1, 1), 'CENTER'),  # Center align the header
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        # Wrap the table in a KeepTogether to avoid splitting across pages
        keep_table_together = KeepTogether([table, Spacer(1, 0.4 * inch)])

        # Add KeepTogether (table and spacer) to elements list for PDF document
        elements.append(keep_table_together)

    # Create a temporary file for the PDF
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', prefix=desired_filename, dir=current_app.config['DOCUMENTS_FOLDER']) as temp:
        pdf = SimpleDocTemplate(temp.name, pagesize=letter)
        pdf.build(elements)
        temp_filename = temp.name  # Preserve the temp file name

    # Now call add_document with both data and the file
    with open(temp_filename, 'rb') as file:
        data = {
            'document_type': 'rent_stub',
            'property_id': property_id,
            'filename': desired_filename
        }
        document = add_document(data, file)

    # Optionally delete the temp file after adding to the database
    os.remove(temp_filename)

    # Return the path of the new file
    return document.file_path
