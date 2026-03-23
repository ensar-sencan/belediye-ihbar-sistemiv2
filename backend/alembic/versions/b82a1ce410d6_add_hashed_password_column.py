"""add_hashed_password_column"""

revision = 'b82a1ce410d6'
down_revision = 'c2a23a67d06a'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa

def upgrade():
    # Buraya migration ekle: Mesela
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'hashed_password')