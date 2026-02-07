from flask import Blueprint, jsonify, request
import json
from ..database import SessionLocal
from ..models import Hotel, Place

hotels_bp = Blueprint('hotels', __name__)

def serialize_hotel(hotel):
    """Serialize a hotel object with all fields"""
    # Parse all_images and normalize paths
    all_images = []
    if hotel.all_images:
        try:
            images = json.loads(hotel.all_images)
            # Normalize each image path
            for img in images:
                if img:
                    # Convert backslashes to forward slashes
                    img = img.replace('\\', '/')
                    # Add folder prefix if missing
                    if not img.startswith('hotel_images/'):
                        img = f"hotel_images/{img}"
                    all_images.append(img)
        except:
            all_images = []
    
    return {
        'id': hotel.id,
        'name': hotel.name,
        'type': 'Hotel',  # Add type field for frontend
        'location': hotel.location,
        'description': hotel.description,
        'tags': hotel.tags,
        'image_url': hotel.image_url,
        'rating': hotel.rating,
        'price_range': hotel.price_range,
        'place_id': hotel.place_id,
        'all_images': all_images
    }

@hotels_bp.route('/hotels', methods=['GET'])
def list_hotels():
    """Get all hotels from the database with filtering options"""
    session = SessionLocal()
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        price_range = request.args.get('price_range')
        min_rating = request.args.get('min_rating')
        place_id = request.args.get('place_id')
        search = request.args.get('search')
        
        # Build query
        query = session.query(Hotel)
        
        # Apply filters
        if price_range:
            query = query.filter(Hotel.price_range == price_range)
        if min_rating:
            query = query.filter(Hotel.rating >= float(min_rating))
        if place_id:
            query = query.filter(Hotel.place_id == int(place_id))
        if search:
            query = query.filter(
                Hotel.name.ilike(f'%{search}%') |
                Hotel.description.ilike(f'%{search}%') |
                Hotel.location.ilike(f'%{search}%')
            )
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        hotels = query.order_by(Hotel.rating.desc().nullslast()).offset(offset).limit(limit).all()
        
        # Serialize results
        results = [serialize_hotel(hotel) for hotel in hotels]
        
        return jsonify({
            'hotels': results,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@hotels_bp.route('/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel_details(hotel_id):
    """Get detailed information about a specific hotel"""
    session = SessionLocal()
    try:
        hotel = session.query(Hotel).filter(Hotel.id == hotel_id).first()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        # Get associated place information
        place = None
        if hotel.place_id:
            place = session.query(Place).filter(Place.id == hotel.place_id).first()
        
        result = serialize_hotel(hotel)
        if place:
            result['place'] = {
                'id': place.id,
                'name': place.name,
                'location': place.location,
                'type': place.type
            }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@hotels_bp.route('/hotels/count', methods=['GET'])
def get_hotel_count():
    """Get total count of hotels"""
    session = SessionLocal()
    try:
        count = session.query(Hotel).count()
        return jsonify({'count': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@hotels_bp.route('/hotels/price-ranges', methods=['GET'])
def get_price_ranges():
    """Get all available price ranges"""
    session = SessionLocal()
    try:
        ranges = session.query(Hotel.price_range).distinct().all()
        range_list = [r[0] for r in ranges if r[0]]
        return jsonify(range_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@hotels_bp.route('/hotels/featured', methods=['GET'])
def get_featured_hotels():
    """Get featured hotels (highest rated)"""
    session = SessionLocal()
    try:
        limit = int(request.args.get('limit', 6))
        
        hotels = session.query(Hotel).filter(
            Hotel.rating.isnot(None)
        ).order_by(Hotel.rating.desc()).limit(limit).all()
        
        results = [serialize_hotel(hotel) for hotel in hotels]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()