"""
Update existing users with hashed passwords
"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def update_user_passwords():
    """Add hashed passwords to existing users"""
    db: Session = SessionLocal()
    
    try:
        print("Updating user passwords...")
        
        # Get all users without passwords
        users = db.query(User).filter(
            (User.hashed_password == None) | (User.hashed_password == '')
        ).all()
        
        if not users:
            print("✅ All users already have passwords!")
            return
        
        # Hash password
        test_password_hash = get_password_hash("test123")
        
        # Update each user
        for user in users:
            user.hashed_password = test_password_hash
            print(f"   Updated: {user.email}")
        
        db.commit()
        print(f"\n✅ Updated {len(users)} users with password: test123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    update_user_passwords()
