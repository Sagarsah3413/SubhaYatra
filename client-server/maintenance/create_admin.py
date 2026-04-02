"""
Create or reset the default admin user.
Run from client-server/: python maintenance/create_admin.py
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.app import create_app
from app.database import db
from app.models import Admin
from app.auth import hash_password

USERNAME = "admin"
PASSWORD = "admin123"
EMAIL    = "admin@roamiowanderly.com"
ROLE     = "superadmin"

app = create_app()
with app.app_context():
    existing = Admin.query.filter_by(username=USERNAME).first()
    if existing:
        existing.password = hash_password(PASSWORD)
        existing.role     = ROLE
        existing.is_active= True
        db.session.commit()
        print(f"✅ Admin '{USERNAME}' password reset.")
    else:
        admin = Admin(username=USERNAME, password=hash_password(PASSWORD),
                      email=EMAIL, role=ROLE)
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin '{USERNAME}' created.")

    print(f"   Username : {USERNAME}")
    print(f"   Password : {PASSWORD}")
    print(f"   Role     : {ROLE}")
