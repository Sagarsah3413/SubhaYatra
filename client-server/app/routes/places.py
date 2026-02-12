from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import json
from ..database import SessionLocal
from ..models import Place, Hotel, Restaurant, Attraction, Event

places_bp = Blueprint('places', __name__)

UPLOAD_DIR = os.path.join(os.getcwd(), 'datasets', 'uploads')
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def serialize_place(place):
    """Serialize a place object with all fields"""
    # Parse all_images and normalize paths
    all_images = []
    if place.all_images:
        try:
            images = json.loads(place.all_images)
            # Normalize each image path
            for img in images:
                if img:
                    # Convert backslashes to forward slashes
                    img = img.replace('\\', '/')
                    # Add folder prefix if missing
                    if not img.startswith('destination_images/'):
                        img = f"destination_images/{img}"
                    all_images.append(img)
        except:
            all_images = []
    
    return {
        'id': place.id,
        'name': place.name,
        'location': place.location,
        'type': place.type or 'Place',  # Ensure type is always set
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
        'all_images': all_images,
        'created_at': place.created_at,
        'status': getattr(place, 'status', 'approved'),  # Include status, default to approved for old records
        'source': getattr(place, 'source', 'dataset')  # Include source, default to dataset
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

def serialize_event(event):
    """Serialize an event object with all fields"""
    return {
        'id': event.id,
        'name': event.name,
        'venue': event.venue,
        'month_season': event.month_season,
        'event_type': event.event_type,
        'description': event.description,
        'place_id': event.place_id
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

    # Save to DB with 'pending' status and 'user_submission' source
    session = SessionLocal()
    try:
        place = Place(
            name=name,
            location=location,
            type=ptype,
            description=description,
            tags=tags,
            image_url=image_url,
            status='pending',  # Set as pending for admin approval
            source='user_submission'  # Mark as user submission
        )
        session.add(place)
        session.commit()
        session.refresh(place)
        return jsonify({'success': True, 'place_id': place.id, 'status': 'pending'}), 201
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
        limit_param = request.args.get('limit', '20')
        
        # Support 'all' to fetch all places
        if limit_param.lower() == 'all':
            limit = None
        else:
            limit = int(limit_param)
            
        place_type = request.args.get('type')
        province = request.args.get('province')
        difficulty = request.args.get('difficulty')
        search = request.args.get('search')
        status = request.args.get('status', 'approved')  # Default to approved only
        
        # Build query
        query = session.query(Place)
        
        # Apply status filter (show only approved places by default for public)
        # Admin can pass status='all' to see all places
        if status != 'all':
            query = query.filter(Place.status == status)
        
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
        
        # Apply pagination only if limit is set
        if limit:
            offset = (page - 1) * limit
            places = query.order_by(Place.id.desc()).offset(offset).limit(limit).all()
            pages = (total + limit - 1) // limit
        else:
            # Fetch all places
            places = query.order_by(Place.id.desc()).all()
            pages = 1
        
        # Serialize results
        results = [serialize_place(place) for place in places]
        
        return jsonify({
            'places': results,
            'total': total,
            'page': page,
            'limit': limit if limit else total,
            'pages': pages
        })
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>', methods=['GET'])
def get_place_details(place_id):
    """Get detailed information about a specific place including hotels, restaurants, and events"""
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        # Get associated hotels, restaurants, and events
        hotels = session.query(Hotel).filter(Hotel.place_id == place_id).all()
        restaurants = session.query(Restaurant).filter(Restaurant.place_id == place_id).all()
        events = session.query(Event).filter(Event.place_id == place_id).all()
        
        result = serialize_place(place)
        
        # Format place images properly
        place_images = []
        if place.all_images:
            try:
                import json
                # Parse JSON string
                image_list = json.loads(place.all_images)
                for img_path in image_list[:10]:  # Limit to 10 images
                    img_path = img_path.strip().replace('\\', '/')
                    if img_path:
                        # Add destination_images prefix if not present
                        if img_path.startswith('destination_images/'):
                            place_images.append(f"/datasets/{img_path}")
                        elif img_path.startswith('/datasets/'):
                            place_images.append(img_path)
                        else:
                            place_images.append(f"/datasets/destination_images/{img_path}")
            except:
                # Fallback to comma-separated
                image_paths = place.all_images.split(',')
                for img_path in image_paths[:10]:
                    img_path = img_path.strip().replace('\\', '/')
                    if img_path:
                        if img_path.startswith('destination_images/'):
                            place_images.append(f"/datasets/{img_path}")
                        elif img_path.startswith('/datasets/'):
                            place_images.append(img_path)
                        else:
                            place_images.append(f"/datasets/destination_images/{img_path}")
        
        # Fallback to image_url if no all_images
        if not place_images and place.image_url:
            img_path = place.image_url.replace('\\', '/')
            if img_path.startswith('destination_images/'):
                place_images.append(f"/datasets/{img_path}")
            elif img_path.startswith('/datasets/'):
                place_images.append(img_path)
            else:
                place_images.append(f"/datasets/destination_images/{img_path}")
        
        result['images'] = place_images
        
        # Format hotel images
        hotel_list = []
        for hotel in hotels:
            hotel_data = serialize_hotel(hotel)
            hotel_images = []
            
            if hotel.all_images:
                try:
                    import json
                    image_list = json.loads(hotel.all_images)
                    for img_path in image_list[:5]:
                        img_path = img_path.strip().replace('\\', '/')
                        if img_path:
                            # Images already have hotel_images prefix
                            if img_path.startswith('hotel_images/'):
                                hotel_images.append(f"/datasets/{img_path}")
                            elif img_path.startswith('/datasets/'):
                                hotel_images.append(img_path)
                            else:
                                hotel_images.append(f"/datasets/{img_path}")
                except:
                    pass
            
            # Fallback to image_url
            if not hotel_images and hotel.image_url:
                img_path = hotel.image_url.replace('\\', '/')
                if img_path.startswith('hotel_images/'):
                    hotel_images.append(f"/datasets/{img_path}")
                elif img_path.startswith('/datasets/'):
                    hotel_images.append(img_path)
                else:
                    hotel_images.append(f"/datasets/{img_path}")
            
            hotel_data['images'] = hotel_images
            hotel_data['image'] = hotel_images[0] if hotel_images else ''
            hotel_list.append(hotel_data)
        
        # Format restaurant images
        restaurant_list = []
        for restaurant in restaurants:
            restaurant_data = serialize_restaurant(restaurant)
            restaurant_images = []
            
            if restaurant.all_images:
                try:
                    import json
                    image_list = json.loads(restaurant.all_images)
                    for img_path in image_list[:5]:
                        img_path = img_path.strip().replace('\\', '/')
                        if img_path:
                            # Images already have restaurant_images prefix
                            if img_path.startswith('restaurant_images/'):
                                restaurant_images.append(f"/datasets/{img_path}")
                            elif img_path.startswith('/datasets/'):
                                restaurant_images.append(img_path)
                            else:
                                restaurant_images.append(f"/datasets/{img_path}")
                except:
                    pass
            
            # Fallback to image_url
            if not restaurant_images and restaurant.image_url:
                img_path = restaurant.image_url.replace('\\', '/')
                if img_path.startswith('restaurant_images/'):
                    restaurant_images.append(f"/datasets/{img_path}")
                elif img_path.startswith('/datasets/'):
                    restaurant_images.append(img_path)
                else:
                    restaurant_images.append(f"/datasets/{img_path}")
            
            restaurant_data['images'] = restaurant_images
            restaurant_data['image'] = restaurant_images[0] if restaurant_images else ''
            restaurant_list.append(restaurant_data)
        
        result['hotels'] = hotel_list
        result['restaurants'] = restaurant_list
        
        # Format events
        event_list = [serialize_event(event) for event in events]
        result['events'] = event_list
        
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
    """Advanced search for places with improved relevance scoring - NO LIMITS"""
    session = SessionLocal()
    try:
        query_text = request.args.get('q', '')
        category = request.args.get('category')
        min_rating = request.args.get('min_rating')
        max_difficulty = request.args.get('max_difficulty')
        
        if not query_text:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Build search query with relevance scoring
        # Use CASE WHEN for relevance scoring in SQLite
        from sqlalchemy import case, func
        
        # Create relevance score based on where the match occurs
        relevance_score = case(
            # Exact name match gets highest score
            (Place.name.ilike(query_text), 100),
            # Name starts with query gets high score
            (Place.name.ilike(f'{query_text}%'), 90),
            # Name contains query gets good score
            (Place.name.ilike(f'%{query_text}%'), 80),
            # Location exact match
            (Place.location.ilike(query_text), 75),
            # Location contains query
            (Place.location.ilike(f'%{query_text}%'), 70),
            # Tags contain query
            (Place.tags.ilike(f'%{query_text}%'), 60),
            # Activities contain query
            (Place.activities.ilike(f'%{query_text}%'), 50),
            # Description contains query
            (Place.description.ilike(f'%{query_text}%'), 40),
            # Default score
            else_=0
        ).label('relevance')
        
        # Build the main query
        query = session.query(Place, relevance_score).filter(
            Place.name.ilike(f'%{query_text}%') |
            Place.description.ilike(f'%{query_text}%') |
            Place.tags.ilike(f'%{query_text}%') |
            Place.activities.ilike(f'%{query_text}%') |
            Place.location.ilike(f'%{query_text}%')
        )
        
        # Apply additional filters
        if category:
            query = query.filter(Place.type.ilike(f'%{category}%'))
        
        # Order by relevance score (highest first), then by ID
        query = query.order_by(relevance_score.desc(), Place.id.desc())
        
        # NO LIMIT - Get ALL results
        results_with_scores = query.all()
        
        # Extract places and serialize them
        places = [result[0] for result in results_with_scores]
        results = [serialize_place(place) for place in places]
        
        # Add relevance scores to results for debugging
        for i, (place, score) in enumerate(results_with_scores):
            if i < len(results):
                results[i]['relevance_score'] = score
        
        return jsonify({
            'query': query_text,
            'results': results,
            'count': len(results),
            'total_available': len(results),  # Same as count since we show all
            'unlimited': True
        })
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>', methods=['DELETE'])
def delete_place(place_id):
    """Delete a place by ID and remove associated image files"""
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        # Delete associated image files from filesystem
        deleted_files = []
        if place.image_url:
            # Handle single image_url
            if place.image_url.startswith('/datasets/uploads/'):
                filename = place.image_url.split('/')[-1]
                file_path = os.path.join(UPLOAD_DIR, filename)
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        deleted_files.append(filename)
                    except Exception as e:
                        current_app.logger.warning(f'Failed to delete file {filename}: {e}')
        
        # Handle all_images if present
        if place.all_images:
            try:
                images = json.loads(place.all_images)
                for img_path in images:
                    if img_path.startswith('/datasets/uploads/'):
                        filename = img_path.split('/')[-1]
                        file_path = os.path.join(UPLOAD_DIR, filename)
                        if os.path.exists(file_path) and filename not in deleted_files:
                            try:
                                os.remove(file_path)
                                deleted_files.append(filename)
                            except Exception as e:
                                current_app.logger.warning(f'Failed to delete file {filename}: {e}')
            except json.JSONDecodeError:
                pass
        
        # Delete the place from database
        session.delete(place)
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Place and associated files deleted successfully',
            'place_id': place_id,
            'deleted_files': deleted_files
        }), 200
    except Exception as e:
        session.rollback()
        current_app.logger.error('Failed to delete place: %s', e)
        return jsonify({'error': 'Failed to delete place'}), 500
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>/approve', methods=['POST'])
def approve_place(place_id):
    """Approve a pending place"""
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        place.status = 'approved'
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Place approved successfully',
            'place_id': place_id,
            'status': 'approved'
        }), 200
    except Exception as e:
        session.rollback()
        current_app.logger.error('Failed to approve place: %s', e)
        return jsonify({'error': 'Failed to approve place'}), 500
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>/reject', methods=['POST'])
def reject_place(place_id):
    """Reject a pending place"""
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        place.status = 'rejected'
        session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Place rejected successfully',
            'place_id': place_id,
            'status': 'rejected'
        }), 200
    except Exception as e:
        session.rollback()
        current_app.logger.error('Failed to reject place: %s', e)
        return jsonify({'error': 'Failed to reject place'}), 500
    finally:
        session.close()
