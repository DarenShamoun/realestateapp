"""edited some relationships

Revision ID: e19fc2674826
Revises: 3370c113c254
Create Date: 2023-12-27 16:19:53.798772

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e19fc2674826'
down_revision = '3370c113c254'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.drop_index('ix_payment_tenant_id')
        batch_op.drop_index('ix_payment_unit_id')
        batch_op.drop_constraint('payment_unit_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('payment_tenant_id_fkey', type_='foreignkey')
        batch_op.drop_column('tenant_id')
        batch_op.drop_column('unit_id')

    with op.batch_alter_table('unit', schema=None) as batch_op:
        batch_op.drop_index('ix_unit_tenant_id')
        batch_op.drop_constraint('unit_tenant_id_fkey', type_='foreignkey')
        batch_op.drop_column('tenant_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('unit', schema=None) as batch_op:
        batch_op.add_column(sa.Column('tenant_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('unit_tenant_id_fkey', 'tenant', ['tenant_id'], ['id'])
        batch_op.create_index('ix_unit_tenant_id', ['tenant_id'], unique=False)

    with op.batch_alter_table('payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('unit_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('tenant_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('payment_tenant_id_fkey', 'tenant', ['tenant_id'], ['id'])
        batch_op.create_foreign_key('payment_unit_id_fkey', 'unit', ['unit_id'], ['id'])
        batch_op.create_index('ix_payment_unit_id', ['unit_id'], unique=False)
        batch_op.create_index('ix_payment_tenant_id', ['tenant_id'], unique=False)

    # ### end Alembic commands ###
