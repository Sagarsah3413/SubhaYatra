from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import json
from ..database import SessionLocal
from ..models import Place, Hotel, Restaurant, Attraction

places_bp = Blueprint('places', __name__)

UPLOAD_DIR = os.path.join(os.getcwd(), 'datasets', 'uploads')
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def serialize_place(place):
    """Serialize a place object with all fields"""
    return {
        'id': place.id,
        'name': place.name,
        'location': place.location,
        'type': place.type,
        'description': place.description,
        'tags': place.tags,
        'image_url': place.image_url,
        'latitude': place.latitude,
        'longitude': place.longitude,
        'best_season': place.best_season,
        'activities': place.activities,
        'difficulty_level': place.difficulty_level,
        'accessibility': place.accessibility,
        'transportation': place.transportation,
        'province': place.province,
        'all_images': json.loads(place.all_images) if place.all_images else [],
        'created_at': place.created_at
    }

def serialize_hotel(hotel):
    """Serialize a hotel object with all fields"""
    return {
        'id': hotel.id,
        'name': hotel.name,
        'location': hotel.location,
        'description': hotel.description,
        'tags': hotel.tags,
        'image_url': hotel.image_url,
        'rating': hotel.rating,
        'price_range': hotel.price_range,
        'place_id': hotel.place_id,
        'all_images': json.loads(hotel.all_images) if hotel.all_images else []
    }

def serialize_restaurant(restaurant):
    """Serialize a restaurant object with all fields"""
    return {
        'id': restaurant.id,
        'name': restaurant.name,
        'location': restaurant.location,
        'description': restaurant.description,
        'tags': restaurant.tags,
        'image_url': restaurant.image_url,
        'rating': restaurant.rating,
        'price_range': restaurant.price_range,
        'place_id': restaurant.place_id,
        'all_images': json.loads(restaurant.all_images) if restaurant.all_images else []
    }

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
    """Get all places with optional filtering"""
    session = SessionLocal()
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        place_type = request.args.get('type')
        province = request.args.get('province')
        difficulty = request.args.get('difficulty')
        search = request.args.get('search')
        
        # Build query
        query = session.query(Place)
        
        # Apply filters
        if place_type:
            query = query.filter(Place.type.ilike(f'%{place_type}%'))
        if province:
            query = query.filter(Place.province == province)
        if difficulty:
            query = query.filter(Place.difficulty_level.ilike(f'%{difficulty}%'))
        if search:
            query = query.filter(
                Place.name.ilike(f'%{search}%') |
                Place.description.ilike(f'%{search}%') |
                Place.tags.ilike(f'%{search}%')
            )
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        places = query.order_by(Place.id.desc()).offset(offset).limit(limit).all()
        
        # Serialize results
        results = [serialize_place(place) for place in places]
        
        return jsonify({
            'places': results,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        })
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>', methods=['GET'])
def get_place_details():
    """Get detailed information about a specific place including hotels and restaurants"""
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        # Get associated hotels and restaurants
        hotels = session.query(Hotel).filter(Hotel.place_id == place_id).all()
        restaurants = session.query(Restaurant).filter(Restaurant.place_id == place_id).all()
        
        result = serialize_place(place)
        result['hotels'] = [serialize_hotel(hotel) for hotel in hotels]
        result['restaurants'] = [serialize_restaurant(restaurant) for restaurant in restaurants]
        
        return jsonify(result)
    finally:
        session.close()

@places_bp.route('/places/featured', methods=['GET'])
def get_featured_places():
    """Get featured places (top-rated or popular destinations)"""
    session = SessionLocal()
    try:
        limit = int(request.args.get('limit', 6))
        
        # Get places with high ratings or specific types
        places = session.query(Place).filter(
            Place.type.in_(['trekking_&_adventure', 'cultural_&_religious_sites', 'natural_attractions'])
        ).order_by(Place.id.desc()).limit(limit).all()
        
        results = [serialize_place(place) for place in places]
        return jsonify(results)
    finally:
        session.close()

@places_bp.route('/places/categories', methods=['GET'])
def get_place_categories():
    """Get all available place categories"""
    session = SessionLocal()
    try:
        categories = session.query(Place.type).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        return jsonify(category_list)
    finally:
        session.close()

@places_bp.route('/places/provinces', methods=['GET'])
def get_provinces():
    """Get all available provinces"""
    session = SessionLocal()
    try:
        provinces = session.query(Place.province).distinct().all()
        province_list = [prov[0] for prov in provinces if prov[0]]
        return jsonify(province_list)
    finally:
        session.close()

@places_bp.route('/places/search', methods=['GET'])
def search_places():
    """Advanced search for places"""
    session = SessionLocal()
    try:
        query_text = request.args.get('q', '')
        category = request.args.get('category')
        min_rating = request.args.get('min_rating')
        max_difficulty = request.args.get('max_difficulty')
        
        if not query_text:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Build search query
        query = session.query(Place).filter(
            Place.name.ilike(f'%{query_text}%') |
            Place.description.ilike(f'%{query_text}%') |
            Place.tags.ilike(f'%{query_text}%') |
            Place.activities.ilike(f'%{query_text}%')
        )
        
        if category:
            query = query.filter(Place.type.ilike(f'%{category}%'))
        
        places = query.order_by(Place.id.desc()).limit(20).all()
        results = [serialize_place(place) for place in places]
        
        return jsonify({
            'query': query_text,
            'results': results,
            'count': len(results)
        })
    finally:
        session.close()
