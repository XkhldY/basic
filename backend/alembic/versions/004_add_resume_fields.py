"""Add resume fields to users table

Revision ID: 004_add_resume_fields
Revises: 003_add_missing_location
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '004_add_resume_fields'
down_revision = '003_add_missing_location'
branch_labels = None
depends_on = None

def upgrade():
    # Add resume fields to users table
    op.add_column('users', sa.Column('resume_url', sa.String(length=500), nullable=True))
    op.add_column('users', sa.Column('resume_file_name', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('resume_uploaded_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('resume_file_size', sa.Integer(), nullable=True))

def downgrade():
    # Remove resume fields from users table
    op.drop_column('users', 'resume_file_size')
    op.drop_column('users', 'resume_uploaded_at')
    op.drop_column('users', 'resume_file_name')
    op.drop_column('users', 'resume_url')

