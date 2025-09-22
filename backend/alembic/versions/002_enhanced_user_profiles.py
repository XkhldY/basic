"""Enhanced user profiles

Revision ID: 002_enhanced_user_profiles
Revises: 001_initial_migration
Create Date: 2025-08-22 15:38:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_enhanced_user_profiles'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade():
    # Add new employer fields
    op.add_column('users', sa.Column('company_website', sa.String(500), nullable=True))
    op.add_column('users', sa.Column('company_logo_url', sa.String(500), nullable=True))
    op.add_column('users', sa.Column('founded_year', sa.String(4), nullable=True))
    op.add_column('users', sa.Column('company_type', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('revenue_range', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('employee_count', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('contact_person', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('contact_phone', sa.String(20), nullable=True))
    op.add_column('users', sa.Column('company_address', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('company_city', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('company_state', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('company_country', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('company_postal_code', sa.String(20), nullable=True))
    op.add_column('users', sa.Column('tax_id', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('registration_number', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('business_license', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('hiring_frequency', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('typical_contract_length', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('remote_policy', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('benefits_offered', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('company_verified', sa.Boolean(), default=False))
    op.add_column('users', sa.Column('verification_documents', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('trust_score', sa.Integer(), default=0))
    
    # Add new candidate fields
    op.add_column('users', sa.Column('phone_number', sa.String(20), nullable=True))
    op.add_column('users', sa.Column('date_of_birth', sa.Date(), nullable=True))
    op.add_column('users', sa.Column('linkedin_url', sa.String(500), nullable=True))
    op.add_column('users', sa.Column('github_url', sa.String(500), nullable=True))
    op.add_column('users', sa.Column('education_level', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('years_of_experience', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('current_salary', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('expected_salary', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('preferred_work_type', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('willing_to_relocate', sa.Boolean(), default=False))
    op.add_column('users', sa.Column('notice_period', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('technical_skills', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('soft_skills', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('certifications', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('languages', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('desired_industries', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('work_schedule_preference', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('remote_work_preference', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('travel_willingness', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('profile_completion_percentage', sa.Integer(), default=0))
    op.add_column('users', sa.Column('last_profile_update', sa.DateTime(timezone=True), nullable=True))


def downgrade():
    # Remove candidate fields
    op.drop_column('users', 'travel_willingness')
    op.drop_column('users', 'remote_work_preference')
    op.drop_column('users', 'work_schedule_preference')
    op.drop_column('users', 'desired_industries')
    op.drop_column('users', 'languages')
    op.drop_column('users', 'certifications')
    op.drop_column('users', 'soft_skills')
    op.drop_column('users', 'technical_skills')
    op.drop_column('users', 'notice_period')
    op.drop_column('users', 'willing_to_relocate')
    op.drop_column('users', 'preferred_work_type')
    op.drop_column('users', 'expected_salary')
    op.drop_column('users', 'current_salary')
    op.drop_column('users', 'years_of_experience')
    op.drop_column('users', 'education_level')
    op.drop_column('users', 'date_of_birth')
    op.drop_column('users', 'phone_number')
    op.drop_column('users', 'github_url')
    op.drop_column('users', 'linkedin_url')
    op.drop_column('users', 'profile_completion_percentage')
    op.drop_column('users', 'last_profile_update')
    
    # Remove employer fields
    op.drop_column('users', 'trust_score')
    op.drop_column('users', 'verification_documents')
    op.drop_column('users', 'company_verified')
    op.drop_column('users', 'benefits_offered')
    op.drop_column('users', 'remote_policy')
    op.drop_column('users', 'typical_contract_length')
    op.drop_column('users', 'hiring_frequency')
    op.drop_column('users', 'business_license')
    op.drop_column('users', 'registration_number')
    op.drop_column('users', 'tax_id')
    op.drop_column('users', 'company_postal_code')
    op.drop_column('users', 'company_country')
    op.drop_column('users', 'company_state')
    op.drop_column('users', 'company_city')
    op.drop_column('users', 'company_address')
    op.drop_column('users', 'contact_phone')
    op.drop_column('users', 'contact_person')
    op.drop_column('users', 'employee_count')
    op.drop_column('users', 'revenue_range')
    op.drop_column('users', 'company_type')
    op.drop_column('users', 'founded_year')
    op.drop_column('users', 'company_logo_url')
    op.drop_column('users', 'company_website')


