import os
import tempfile
from flask import current_app
from reportlab.lib.pagesizes import letter, inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
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

    # Initialize PDF
    custom_filename = f"RentStubs_{property_id}_{month}_{year}.pdf"
    pdf_path = os.path.join(current_app.config['DOCUMENTS_FOLDER'], custom_filename)
    pdf = SimpleDocTemplate(pdf_path, pagesize=letter)

    # Initialize styles
    styles = getSampleStyleSheet()
    elements = []

    # Process data and create PDF content
    for unit in units:
        tenant = next((t for t in tenants for lease in t.leases if lease.unit_id == unit.id), None)
        rent_detail = next((r for r in rents if r.lease.unit_id == unit.id), None)

        if not tenant or not rent_detail:
            continue

        data = [
            [Paragraph(f"<b>Unit Number:</b> {unit.unit_number}, <b>Tenant:</b> {tenant.full_name}", styles['BodyText'])],
            [Paragraph(f"<b>Rent Payment Breakdown for {month}/{year}</b>", styles['BodyText'])],
            [f"Rent: ${rent_detail.rent}", f"Trash: ${rent_detail.trash}"],
            [f"Water/Sewer: ${rent_detail.water_sewer}", f"Parking: ${rent_detail.parking}"],
            [f"Debt: ${rent_detail.debt}", f"Breaks/Discounts: ${rent_detail.breaks}"],
            [f"Total Rent: ${rent_detail.total_rent}", '']
        ]

        table = Table(data, colWidths=[3.0 * inch] * 2)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('SPAN', (0, 0), (1, 0)),  # Span for the header
            ('ALIGN', (0, 1), (-1, 1), 'CENTER'),  # Center align the header
        ]))

        elements.append(table)
        elements.append(Spacer(1, 12))

    # Initialize PDF with a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
        pdf = SimpleDocTemplate(temp.name, pagesize=letter)
        pdf.build(elements)

        # Set the filename for the temporary file
        temp_filename = temp.name

    # Reopen the temporary file to read its content and set the filename attribute
    with open(temp_filename, 'rb') as file:
        # Manually set the filename attribute
        file.filename = os.path.basename(temp_filename)

        # Now call add_document with both data and the file
        data = {
            'document_type': 'rent_stub',
            'property_id': property_id,
            # other fields as necessary
        }
        add_document(data, file)

    # Return the path of the temporary file
    return temp_filename
