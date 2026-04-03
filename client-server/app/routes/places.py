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

def _fix_img(path):
    """Convert any image path to /datasets/... format that Flask serves."""
    if not path or path == 'null': return None
    p = path.strip().replace('\\', '/')
    if p.startswith('http'): return p
    if p.startswith('/api/images/destinations/'):
        return '/datasets/destination_images/' + p[len('/api/images/destinations/'):]
    if p.startswith('/api/images/hotels/'):
        return '/datasets/hotel_images/' + p[len('/api/images/hotels/'):]
    if p.startswith('/api/images/restaurants/'):
        return '/datasets/restaurant_images/' + p[len('/api/images/restaurants/'):]
    if p.startswith('/datasets/'): return p
    if p.startswith('destination_images/') or p.startswith('hotel_images/') or p.startswith('restaurant_images/'):
        return f'/datasets/{p}'
    return None


def _parse_images(raw):
    if not raw: return []
    try:
        imgs = json.loads(raw)
        return [u for u in (_fix_img(i) for i in imgs) if u]
    except Exception:
        return []


def serialize_place(place):
    imgs = _parse_images(place.all_images)
    return {
        'id': place.id, 'name': place.name, 'location': place.location,
        'type': place.type or 'Place', 'description': place.description,
        'tags': place.tags, 'image_url': _fix_img(place.image_url),
        'latitude': place.latitude, 'longitude': place.longitude,
        'best_season': place.best_season, 'activities': place.activities,
        'difficulty_level': place.difficulty_level, 'accessibility': place.accessibility,
        'transportation': place.transportation, 'province': place.province,
        'all_images': imgs, 'created_at': str(place.created_at) if place.created_at else None,
        'status': getattr(place, 'status', 'approved'),
        'source': getattr(place, 'source', 'dataset'),
    }


def serialize_hotel(hotel):
    imgs = _parse_images(hotel.all_images)
    return {
        'id': hotel.id, 'name': hotel.name, 'location': hotel.location,
        'description': hotel.description, 'tags': hotel.tags,
        'image_url': _fix_img(hotel.image_url), 'rating': hotel.rating,
        'price_range': hotel.price_range, 'place_id': hotel.place_id,
        'all_images': imgs, 'source': getattr(hotel, 'source', 'dataset'),
    }


def serialize_restaurant(restaurant):
    imgs = _parse_images(restaurant.all_images)
    return {
        'id': restaurant.id, 'name': restaurant.name, 'location': restaurant.location,
        'description': restaurant.description, 'tags': restaurant.tags,
        'image_url': _fix_img(restaurant.image_url), 'rating': restaurant.rating,
        'price_range': restaurant.price_range,
        'cuisine': getattr(restaurant, 'cuisine', None),
        'place_id': restaurant.place_id,
        'all_images': imgs, 'source': getattr(restaurant, 'source', 'dataset'),
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
    submission_type = request.form.get('submission_type', 'place')  # Default to 'place'
    
    # Type-specific fields
    price_range = request.form.get('price_range')
    rating = request.form.get('rating')
    cuisine = request.form.get('cuisine')
    price_level = request.form.get('price_level')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    # Handle file uploads (image_1, image_2 etc.)
    image_url = None
    all_images = []
    cover_index = int(request.form.get('cover_index', 0))
    
    # Collect all uploaded images
    for key in sorted(request.files.keys()):
        f = request.files[key]
        if f and f.filename:
            filename = secure_filename(f.filename)
            save_path = os.path.join(UPLOAD_DIR, filename)
            f.save(save_path)
            img_path = f"/datasets/uploads/{filename}"
            all_images.append(img_path)
    
    # Set cover image
    if all_images:
        image_url = all_images[cover_index] if cover_index < len(all_images) else all_images[0]

    # Save to DB based on submission type
    session = SessionLocal()
    try:
        if submission_type == 'hotel':
            # Create hotel entry
            hotel = Hotel(
                name=name,
                location=location,
                description=description,
                tags=tags,
                image_url=image_url,
                rating=float(rating) if rating else None,  # Don't set default rating
                price_range=price_range or 'Mid-range ($30-80)',
                all_images=json.dumps(all_images) if all_images else None,
                source='user_submission',  # Mark as user submission
                status='pending'  # Set as pending for admin approval
            )
            session.add(hotel)
            session.commit()
            session.refresh(hotel)
            return jsonify({'success': True, 'hotel_id': hotel.id, 'status': 'pending', 'type': 'hotel'}), 201
            
        elif submission_type == 'restaurant':
            # Create restaurant entry
            restaurant = Restaurant(
                name=name,
                location=location,
                description=description,
                tags=tags,
                image_url=image_url,
                rating=float(rating) if rating else None,  # Don't set default rating
                price_range=price_level or '$ (Moderate)',
                cuisine=cuisine,  # Add cuisine field
                all_images=json.dumps(all_images) if all_images else None,
                source='user_submission',  # Mark as user submission
                status='pending'  # Set as pending for admin approval
            )
            session.add(restaurant)
            session.commit()
            session.refresh(restaurant)
            return jsonify({'success': True, 'restaurant_id': restaurant.id, 'status': 'pending', 'type': 'restaurant'}), 201
            
        else:
            # Create place entry (default)
            place = Place(
                name=name,
                location=location,
                type=ptype,
                description=description,
                tags=tags,
                image_url=image_url,
                all_images=json.dumps(all_images) if all_images else None,
                status='pending',  # Set as pending for admin approval
                source='user_submission'  # Mark as user submission
            )
            session.add(place)
            session.commit()
            session.refresh(place)
            return jsonify({'success': True, 'place_id': place.id, 'status': 'pending', 'type': 'place'}), 201
            
    except Exception as e:
        session.rollback()
        current_app.logger.error('Failed to create submission: %s', e)
        return jsonify({'error': 'internal server error'}), 500
    finally:
        session.close()

@places_bp.route('/places/<int:place_id>', methods=['GET'])
def get_place_details(place_id):
    session = SessionLocal()
    try:
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        hotels = session.query(Hotel).filter(Hotel.place_id == place_id).all()
        restaurants = session.query(Restaurant).filter(Restaurant.place_id == place_id).all()
        events = session.query(Event).filter(Event.place_id == place_id).all()
        result = serialize_place(place)
        result['images'] = result['all_images']
        hotel_list = []
        for h in hotels:
            hd = serialize_hotel(h)
            hd['images'] = hd['all_images']
            hd['image'] = hd['all_images'][0] if hd['all_images'] else ''
            hotel_list.append(hd)
        restaurant_list = []
        for r in restaurants:
            rd = serialize_restaurant(r)
            rd['images'] = rd['all_images']
            rd['image'] = rd['all_images'][0] if rd['all_images'] else ''
            restaurant_list.append(rd)
        result['hotels'] = hotel_list
        result['restaurants'] = restaurant_list
        result['events'] = [serialize_event(e) for e in events]
        return jsonify(result)
    finally:
        session.close()


@places_bp.route('/places/<int:place_id>/similar', methods=['GET'])
def get_similar_places(place_id):
    """Return similar places based on shared tags and type."""
    from urllib.parse import quote as url_quote
    session = SessionLocal()
    try:
        limit = int(request.args.get('limit', 6))
        place = session.query(Place).filter(Place.id == place_id).first()
        if not place:
            return jsonify({'success': False, 'error': 'Place not found'}), 404

        # Build tag set from this place
        raw_tags = (place.tags or '').lower().replace(';', ',')
        tag_set = {t.strip() for t in raw_tags.split(',') if t.strip()}
        place_type = (place.type or '').lower()

        # Score all other approved places
        candidates = session.query(Place).filter(
            Place.id != place_id,
            Place.status == 'approved'
        ).all()

        scored = []
        for c in candidates:
            score = 0
            c_tags = (c.tags or '').lower().replace(';', ',')
            c_tag_set = {t.strip() for t in c_tags.split(',') if t.strip()}
            score += len(tag_set & c_tag_set) * 3
            if (c.type or '').lower() == place_type:
                score += 5
            if c.province and c.province == place.province:
                score += 2
            if score > 0:
                scored.append((score, c))

        scored.sort(key=lambda x: x[0], reverse=True)
        similar = [c for _, c in scored[:limit]]

        def fix_img(path):
            if not path or path == 'null': return None
            path = path.strip()
            if path.startswith('http'): return path
            if path.startswith('/api/'):
                parts = path.split('/')
                prefix = '/'.join(parts[:4])
                rest = '/'.join(url_quote(p, safe='') for p in parts[4:])
                return f"{prefix}/{rest}"
            return None

        results = []
        for p in similar:
            imgs = []
            if p.all_images:
                try:
                    for img in json.loads(p.all_images):
                        u = fix_img(img)
                        if u: imgs.append(u)
                except Exception:
                    pass
            if not imgs and p.image_url:
                u = fix_img(p.image_url)
                if u: imgs.append(u)
            results.append({
                'id': p.id, 'name': p.name, 'type': p.type,
                'location': p.location, 'description': p.description,
                'tags': p.tags, 'rating': p.rating,
                'image': imgs[0] if imgs else None,
                'all_images': imgs,
            })

        return jsonify({'success': True, 'similar_places': results, 'total': len(results)})
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
