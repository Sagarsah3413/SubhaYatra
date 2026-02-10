"""
Script to create the first admin user
Run this once to set up your admin account
"""
from app.database import SessionLocal
from app.models import Admin
from app.auth import hash_password
import getpass

def create_admin():
    print("=" * 60)
    print("CREATE ADMIN USER")
    print("=" * 60)
    print()
    
    username = input("Enter admin username: ").strip()
    if not username:
        print("❌ Username cannot be empty")
        return
    
    password = getpass.getpass("Enter admin password (min 8 characters): ")
    if len(password) < 8:
        print("❌ Password must be at least 8 characters")
        return
    
    password_confirm = getpass.getpass("Confirm password: ")
    if password != password_confirm:
        print("❌ Passwords do not match")
        return
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing = db.query(Admin).filter(Admin.username == username).first()
        if existing:
            print(f"❌ Admin '{username}' already exists")
            return
        
        # Create new admin
        admin = Admin(
            username=username,
            password=hash_password(password)
        )
        db.add(admin)
        db.commit()
        
        print()
        print("=" * 60)
        print("✅ ADMIN CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Username: {username}")
        print(f"Admin ID: {admin.id}")
        print()
        print("You can now login at: POST /api/admin/login")
        print()
        print("Example request:")
        print(f'''
curl -X POST http://localhost:8000/api/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{{"username":"{username}","password":"YOUR_PASSWORD"}}'
        ''')
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
