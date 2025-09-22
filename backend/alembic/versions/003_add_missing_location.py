"""Add missing location column

Revision ID: 003_add_missing_location
Revises: 002_enhanced_user_profiles
Create Date: 2025-08-22 15:47:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_add_missing_location'
down_revision = '002_enhanced_user_profiles'
branch_labels = None
depends_on = None


def upgrade():
    # Add missing location column
    op.add_column('users', sa.Column('location', sa.String(200), nullable=True))


def downgrade():
    # Remove location column
    op.drop_column('users', 'location')


