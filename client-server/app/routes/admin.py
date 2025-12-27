from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Admin

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing data"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    db: Session = SessionLocal()

    try:
        admin = db.query(Admin).filter(Admin.username == username).first()

        if not admin or admin.password != password:
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({
            "message": "Admin login successful",
            "admin_id": admin.id,
            "username": admin.username
        }), 200

    finally:
        db.close()
