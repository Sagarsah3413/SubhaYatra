from flask import Blueprint, jsonify, request
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import SessionLocal
from ..models import Admin, Booking
import requests
import os
from datetime import datetime

# -----------------------------
# Blueprint
# -----------------------------
admin_bp = Blueprint("admin", __name__)

# -----------------------------
# Admin Login
# -----------------------------
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

# -----------------------------
# Clerk Helper
# -----------------------------
CLERK_API_KEY = os.environ.get("CLERK_API_KEY")
CLERK_API_URL = "https://api.clerk.dev/v1/users"

def get_users_from_clerk():
    if not CLERK_API_KEY:
        print("⚠️ CLERK_API_KEY is missing!")
        return []

    headers = {"Authorization": f"Bearer {CLERK_API_KEY}"}
    try:
        response = requests.get(CLERK_API_URL, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print("⚠️ Clerk API error:", response.status_code, response.text)
            return []
    except Exception as e:
        print("⚠️ Clerk API request failed:", str(e))
        return []

# -----------------------------
# Dashboard Endpoints
# -----------------------------

# Total registered users
@admin_bp.route("/admin/dashboard/user-count", methods=["GET"])
def total_users():
    users = get_users_from_clerk()
    valid_users = [u for u in users if u.get("id")]
    return jsonify({"totalUsers": len(valid_users)})

# New users this month
@admin_bp.route("/admin/dashboard/new-users", methods=["GET"])
def new_users():
    users = get_users_from_clerk()
    this_month = datetime.utcnow().month
    count = 0

    for u in users:
        created_at = u.get("created_at")
        if not created_at:
            continue
        try:
            if isinstance(created_at, int):
                if created_at > 1e12:  # milliseconds
                    created_at /= 1000
                dt = datetime.utcfromtimestamp(created_at)
            else:
                dt = datetime.fromisoformat(str(created_at).replace("Z", "+00:00"))

            if dt.month == this_month:
                count += 1
        except Exception:
            continue

    return jsonify({"newUsersThisMonth": count})

# Total bookings from SQLite
@admin_bp.route("/admin/dashboard/total-bookings", methods=["GET"])
def total_bookings():
    session = SessionLocal()
    count = session.query(Booking).count()
    session.close()
    return jsonify({"totalBookings": count})

# Bookings per city
@admin_bp.route("/admin/dashboard/bookings-per-city", methods=["GET"])
def bookings_per_city():
    session = SessionLocal()
    results = session.query(Booking.city, func.count(Booking.id)).group_by(Booking.city).all()
    session.close()
    data = [{"city": row[0], "count": row[1]} for row in results]
    return jsonify(data)
