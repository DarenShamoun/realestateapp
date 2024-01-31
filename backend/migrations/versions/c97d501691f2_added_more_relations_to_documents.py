"""Added more relations to documents

Revision ID: c97d501691f2
Revises: 6eea9684d72e
Create Date: 2024-01-31 13:24:44.589502

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c97d501691f2'
down_revision = '6eea9684d72e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.add_column(sa.Column('unit_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('payment_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'unit', ['unit_id'], ['id'])
        batch_op.create_foreign_key(None, 'payment', ['payment_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('payment_id')
        batch_op.drop_column('unit_id')

    # ### end Alembic commands ###
