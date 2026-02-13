from flask import Blueprint, jsonify, request
import json
from ..database import SessionLocal
from ..models import Restaurant, Place

restaurants_bp = Blueprint('restaurants', __name__)

def serialize_restaurant(restaurant):
    """Serialize a restaurant object with all fields"""
    # Parse all_images and normalize paths
    all_images = []
    if restaurant.all_images:
        try:
            images = json.loads(restaurant.all_images)
            # Normalize each image path
            for img in images:
                if img:
                    # Convert backslashes to forward slashes
                    img = img.replace('\\', '/')
                    # Add folder prefix if missing
                    if not img.startswith('restaurant_images/'):
                        img = f"restaurant_images/{img}"
                    all_images.append(img)
        except:
            all_images = []
    
    return {
        'id': restaurant.id,
        'name': restaurant.name,
        'type': 'Restaurant',  # Add type field for frontend
        'location': restaurant.location,
        'description': restaurant.description,
        'tags': restaurant.tags,
        'image_url': restaurant.image_url,
        'rating': restaurant.rating,
        'price_range': restaurant.price_range,
        'place_id': restaurant.place_id,
        'all_images': all_images,
        'source': getattr(restaurant, 'source', 'dataset'),  # Include source field
        'cuisine': getattr(restaurant, 'cuisine', None),  # Include cuisine field
        'status': getattr(restaurant, 'status', 'approved')  # Include status field
    }

@restaurants_bp.route('/restaurants', methods=['GET'])
def list_restaurants():
    """Get all restaurants from the database with filtering options"""
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
        query = session.query(Restaurant)
        
        # Apply filters
        if price_range:
            query = query.filter(Restaurant.price_range == price_range)
        if min_rating:
            query = query.filter(Restaurant.rating >= float(min_rating))
        if place_id:
            query = query.filter(Restaurant.place_id == int(place_id))
        if search:
            query = query.filter(
                Restaurant.name.ilike(f'%{search}%') |
                Restaurant.description.ilike(f'%{search}%') |
                Restaurant.location.ilike(f'%{search}%')
            )
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * limit
        restaurants = query.order_by(Restaurant.rating.desc().nullslast()).offset(offset).limit(limit).all()
        
        # Serialize results
        results = [serialize_restaurant(restaurant) for restaurant in restaurants]
        
        return jsonify({
            'restaurants': results,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@restaurants_bp.route('/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant_details(restaurant_id):
    """Get detailed information about a specific restaurant"""
    session = SessionLocal()
    try:
        restaurant = session.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        # Get associated place information
        place = None
        if restaurant.place_id:
            place = session.query(Place).filter(Place.id == restaurant.place_id).first()
        
        result = serialize_restaurant(restaurant)
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

@restaurants_bp.route('/restaurants/count', methods=['GET'])
def get_restaurant_count():
    """Get total count of restaurants"""
    session = SessionLocal()
    try:
        count = session.query(Restaurant).count()
        return jsonify({'count': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@restaurants_bp.route('/restaurants/price-ranges', methods=['GET'])
def get_price_ranges():
    """Get all available price ranges"""
    session = SessionLocal()
    try:
        ranges = session.query(Restaurant.price_range).distinct().all()
        range_list = [r[0] for r in ranges if r[0]]
        return jsonify(range_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@restaurants_bp.route('/restaurants/featured', methods=['GET'])
def get_featured_restaurants():
    """Get featured restaurants (highest rated)"""
    session = SessionLocal()
    try:
        limit = int(request.args.get('limit', 6))
        
        restaurants = session.query(Restaurant).filter(
            Restaurant.rating.isnot(None)
        ).order_by(Restaurant.rating.desc()).limit(limit).all()
        
        results = [serialize_restaurant(restaurant) for restaurant in restaurants]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@restaurants_bp.route('/restaurants/<int:restaurant_id>/approve', methods=['POST'])
def approve_restaurant(restaurant_id):
    """Approve a pending restaurant"""
    session = SessionLocal()
    try:
        restaurant = session.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        restaurant.status = 'approved'
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Restaurant approved successfully',
            'restaurant_id': restaurant_id,
            'status': 'approved'
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'Failed to approve restaurant'}), 500
    finally:
        session.close()

@restaurants_bp.route('/restaurants/<int:restaurant_id>/reject', methods=['POST'])
def reject_restaurant(restaurant_id):
    """Reject a pending restaurant"""
    session = SessionLocal()
    try:
        restaurant = session.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        restaurant.status = 'rejected'
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Restaurant rejected successfully',
            'restaurant_id': restaurant_id,
            'status': 'rejected'
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'Failed to reject restaurant'}), 500
    finally:
        session.close()

@restaurants_bp.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    """Delete a restaurant by ID"""
    session = SessionLocal()
    try:
        restaurant = session.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        session.delete(restaurant)
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Restaurant deleted successfully',
            'restaurant_id': restaurant_id
        }), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': 'Failed to delete restaurant'}), 500
    finally:
        session.close()
