"""Update Property model

Revision ID: 2d5093cc380a
Revises: 756390be9d46
Create Date: 2023-11-09 18:42:03.069773

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2d5093cc380a'
down_revision = '756390be9d46'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tenant',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('primary_phone', sa.String(length=20), nullable=False),
    sa.Column('secondary_phone', sa.String(length=20), nullable=True),
    sa.Column('contact_notes', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('expense',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('property_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('category', sa.String(length=50), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['property_id'], ['property.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('unit',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('property_id', sa.Integer(), nullable=False),
    sa.Column('unit_number', sa.String(length=20), nullable=False),
    sa.Column('rent', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['property_id'], ['property.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lease',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('unit_id', sa.Integer(), nullable=False),
    sa.Column('tenant_id', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('monthly_rent', sa.Float(), nullable=False),
    sa.Column('deposit', sa.Float(), nullable=True),
    sa.Column('terms', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ),
    sa.ForeignKeyConstraint(['unit_id'], ['unit.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('lease_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('payment_type', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['lease_id'], ['lease.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=False))
        batch_op.add_column(sa.Column('property_type', sa.String(length=50), nullable=False))
        batch_op.drop_column('price')
        batch_op.drop_column('location')
        batch_op.drop_column('title')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('location', sa.VARCHAR(length=200), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
        batch_op.drop_column('property_type')
        batch_op.drop_column('name')

    op.drop_table('payment')
    op.drop_table('lease')
    op.drop_table('unit')
    op.drop_table('expense')
    op.drop_table('tenant')
    # ### end Alembic commands ###