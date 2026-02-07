"""
COMPLETE FIX for Admin Login Issues
This script will:
1. Check database
2. Show existing admins
3. Delete all admins
4. Create fresh admin user
5. Verify it works
"""

from app.database import SessionLocal, engine
from app.models import Admin, Base

def fix_admin_login():
    """Complete fix for admin login"""
    
    print("="*70)
    print("ADMIN LOGIN FIX SCRIPT")
    print("="*70)
    
    # Step 1: Ensure tables exist
    print("\n[1/5] Ensuring database tables exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables ready")
    except Exception as e:
        print(f"⚠️  Warning: {e}")
    
    db = SessionLocal()
    
    try:
        # Step 2: Show existing admins
        print("\n[2/5] Checking existing admin users...")
        existing_admins = db.query(Admin).all()
        
        if existing_admins:
            print(f"✅ Found {len(existing_admins)} existing admin(s):")
            for admin in existing_admins:
                print(f"   - ID: {admin.id}, Username: '{admin.username}', Password: '{admin.password}'")
        else:
            print("ℹ️  No existing admin users found")
        
        # Step 3: Delete all existing admins
        print("\n[3/5] Cleaning up old admin users...")
        deleted_count = db.query(Admin).delete()
        db.commit()
        print(f"✅ Deleted {deleted_count} old admin user(s)")
        
        # Step 4: Create fresh admin
        print("\n[4/5] Creating fresh admin user...")
        new_admin = Admin(
            username="admin",
            password="admin123"
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print("✅ Fresh admin user created!")
        
        # Step 5: Verify
        print("\n[5/5] Verifying new admin user...")
        verify_admin = db.query(Admin).filter(Admin.username == "admin").first()
        
        if verify_admin:
            print("✅ Verification successful!")
            print("\n" + "="*70)
            print("🎉 ADMIN LOGIN IS NOW FIXED!")
            print("="*70)
            print("\n📋 USE THESE EXACT CREDENTIALS:")
            print("-"*70)
            print(f"Username: {verify_admin.username}")
            print(f"Password: {verify_admin.password}")
            print("-"*70)
            print("\n📍 Login URL: http://localhost:5173/admin/login")
            print("\n⚠️  IMPORTANT: Type the credentials EXACTLY as shown above")
            print("   - Username: admin (lowercase, no spaces)")
            print("   - Password: admin123 (lowercase, no spaces)")
            print("\n" + "="*70)
        else:
            print("❌ Verification failed!")
            
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n")
    fix_admin_login()
    print("\n")
