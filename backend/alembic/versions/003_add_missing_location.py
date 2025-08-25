"""Add missing location column

Revision ID: 003
Revises: 002
Create Date: 2025-08-22 15:47:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Add missing location column
    op.add_column('users', sa.Column('location', sa.String(200), nullable=True))


def downgrade():
    # Remove location column
    op.drop_column('users', 'location')


