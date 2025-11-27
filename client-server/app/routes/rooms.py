# app/routes/rooms.py
from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import crud

rooms_blueprint = Blueprint('rooms', __name__)

@rooms_blueprint.route("/", methods=["POST"])
def create_room_route():
    db = SessionLocal()
    data = request.json
    room = crud.create_room(db, data)
    db.close()
    return jsonify({
        "id": room.id,
        "name": room.name,
        "description": room.description,
        "price": room.price,
        "image": room.image
    })

@rooms_blueprint.route("/", methods=["GET"])
def get_rooms_route():
    db = SessionLocal()
    rooms = crud.get_rooms(db)
    db.close()
    return jsonify([
        {"id": r.id, "name": r.name, "description": r.description, "price": r.price, "image": r.image}
        for r in rooms
    ])
