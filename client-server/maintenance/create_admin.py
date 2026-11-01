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

# USERNAME = "admin"
# PASSWORD = "Admin@123$%"
# EMAIL    = "admin@subhayatra.com"
# ROLE     = "superadmin"
ADMINS = [
    {
        "username": "admin",
        "email": "admin@subhayatra.com",
        "password": "Admin@123$%"
    },
    {
        "username": "sagar",
        "email": "sahs82341@gmail.com",
        "password": "Admin@123$%"
    }
]
app = create_app()

with app.app_context():

    for admin_data in ADMINS:

        username = admin_data["username"]
        email = admin_data["email"]
        password = admin_data["password"]

        existing = Admin.query.filter_by(username=username).first()

        if existing:
            existing.password = hash_password(password)
            existing.email = email
            existing.role = ROLE
            existing.is_active = True

            print(f"Admin '{username}' updated.")

        else:
            admin = Admin(
                username=username,
                email=email,
                password=hash_password(password),
                role=ROLE
            )

            db.session.add(admin)
            print(f"Admin '{username}' created.")

    db.session.commit()

    print("\nSuper Admin setup completed successfully.")
    print(f"Total accounts configured: {len(ADMINS)}")


# app = create_app()
# with app.app_context():
#     existing = Admin.query.filter_by(username=USERNAME).first()
#     if existing:
#         existing.password = hash_password(PASSWORD)
#         existing.role     = ROLE
#         existing.is_active= True
#         db.session.commit()
#         print(f"✅ Admin '{USERNAME}' password reset.")
#     else:
#         admin = Admin(username=USERNAME, password=hash_password(PASSWORD),
#                       email=EMAIL, role=ROLE)
#         db.session.add(admin)
#         db.session.commit()
#         print(f"✅ Admin '{USERNAME}' created.")

    print(f"   Username : {USERNAME}")
    # print(f"   Password : {PASSWORD}")
    print(f"   Role     : {ROLE}")
