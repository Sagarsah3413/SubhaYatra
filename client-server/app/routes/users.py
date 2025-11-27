# app/routes/users.py
from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import crud

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route("/", methods=["POST"])
def create_user_route():
    db = SessionLocal()
    data = request.json
    existing = crud.get_user_by_email(db, data['email'])
    if existing:
        db.close()
        return jsonify({"error": "Email already registered"}), 400
    user = crud.create_user(db, data)
    db.close()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "mobile": user.mobile
    })

@users_blueprint.route("/", methods=["GET"])
def get_users_route():
    db = SessionLocal()
    users = crud.get_users(db)
    db.close()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "mobile": u.mobile}
        for u in users
    ])
