"""
Script to create an admin user in the database
Run this script to create/update admin credentials
"""

import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Admin
from app.auth import hash_password

def create_admin(username="admin", password="admin123"):
    """Create or update admin user with hashed password"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.username == username).first()
        
        if existing_admin:
            print(f"⚠️  Admin user '{username}' already exists!")
            update = input("Do you want to update the password? (yes/no): ").lower()
            if update == 'yes':
                existing_admin.password = hash_password(password)
                db.commit()
                print(f"✅ Admin password updated successfully!")
                print(f"   Username: {username}")
                print(f"   Password: {password}")
            else:
                print("❌ No changes made.")
        else:
            # Create new admin with hashed password
            new_admin = Admin(
                username=username,
                password=hash_password(password)
            )
            db.add(new_admin)
            db.commit()
            print(f"✅ Admin user created successfully!")
            print(f"   Username: {username}")
            print(f"   Password: {password}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Admin User Creation Script")
    print("=" * 50)
    
    # Get custom credentials or use defaults
    use_custom = input("\nUse custom credentials? (yes/no, default: no): ").lower()
    
    if use_custom == 'yes':
        username = input("Enter username (default: admin): ").strip() or "admin"
        password = input("Enter password (default: admin123): ").strip() or "admin123"
    else:
        username = "admin"
        password = "admin123"
    
    print(f"\nCreating admin user with:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
    print()
    
    create_admin(username, password)
    
    print("\n" + "=" * 50)
    print("You can now login to the admin panel at:")
    print("http://localhost:5173/admin/login")
    print("=" * 50)
