
import sys
import os

# Add client-server directory to Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from app.app import create_app
from app.database import db
from app.models import User

app = create_app()

with app.app_context():
    user = User.query.filter_by(
        email="talktodoc3@gmail.com"
    ).first()

    if user:
        user.role = "superadmin"
        db.session.commit()
        print("Superadmin role assigned successfully!")
    else:
        print("User not found. First log in through Google.")
