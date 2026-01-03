from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from ..database import SessionLocal
from ..models import Place

places_bp = Blueprint('places', __name__)

UPLOAD_DIR = os.path.join(os.getcwd(), 'datasets', 'uploads')
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

@places_bp.route('/places', methods=['POST'])
def create_place():
    # Accept multipart/form-data
    name = request.form.get('name')
    location = request.form.get('location')
    ptype = request.form.get('type')
    description = request.form.get('description')
    tags = request.form.get('tags')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    # handle file uploads (image_1, image_2 etc.) - take first if present
    image_url = None
    for key in request.files:
        f = request.files[key]
        if f and f.filename:
            filename = secure_filename(f.filename)
            save_path = os.path.join(UPLOAD_DIR, filename)
            f.save(save_path)
            # store path relative to /datasets for serving
            image_url = f"/datasets/uploads/{filename}"
            break

    # Save to DB
    session = SessionLocal()
    try:
        place = Place(
            name=name,
            location=location,
            type=ptype,
            description=description,
            tags=tags,
            image_url=image_url
        )
        session.add(place)
        session.commit()
        session.refresh(place)
        return jsonify({'success': True, 'place_id': place.id}), 201
    except Exception as e:
        session.rollback()
        current_app.logger.error('Failed to create place: %s', e)
        return jsonify({'error': 'internal server error'}), 500
    finally:
        session.close()

@places_bp.route('/places', methods=['GET'])
def list_places():
    session = SessionLocal()
    try:
        places = session.query(Place).order_by(Place.id.desc()).all()
        out = []
        for p in places:
            out.append({
                'id': p.id,
                'name': p.name,
                'location': p.location,
                'type': p.type,
                'description': p.description,
                'tags': p.tags,
                'image_url': p.image_url
            })
        return jsonify(out)
    finally:
        session.close()
