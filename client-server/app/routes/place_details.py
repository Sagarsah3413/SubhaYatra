from flask import Blueprint, jsonify
from ..database import SessionLocal
from ..models import Place
from sqlalchemy import text

place_details_bp = Blueprint('place_details', __name__)


@place_details_bp.route('/places/<int:place_id>', methods=['GET'])
def get_place_details(place_id):
    """Get detailed information about a place including hotels and restaurants"""
    db = SessionLocal()
    try:
        # Get place details
        place = db.query(Place).filter(Place.id == place_id).first()
        
        if not place:
            return jsonify({'error': 'Place not found'}), 404
        
        # Format place images
        place_images = []
        if place.all_images:
            # all_images is stored as comma-separated paths
            image_paths = place.all_images.split(',')
            for img_path in image_paths[:10]:  # Limit to 10 images
                img_path = img_path.strip().replace('\\', '/')
                if img_path:
                    if img_path.startswith('/datasets/'):
                        place_images.append(img_path)
                    elif img_path.startswith('destination_images/'):
                        place_images.append(f"/datasets/{img_path}")
                    else:
                        place_images.append(f"/datasets/destination_images/{img_path}")
        
        # If no images in all_images, use image_url
        if not place_images and place.image_url:
            img_path = place.image_url.replace('\\', '/')
            if img_path.startswith('/datasets/'):
                place_images.append(img_path)
            elif img_path.startswith('destination_images/'):
                place_images.append(f"/datasets/{img_path}")
            else:
                place_images.append(f"/datasets/destination_images/{img_path}")
        
        # Get hotels near this place
        hotels_query = text("""
            SELECT id, name, location, description, tags, image_url, rating, price_range, all_images
            FROM hotels 
            WHERE place_id = :place_id OR location LIKE :location
            LIMIT 10
        """)
        hotels_result = db.execute(hotels_query, {
            'place_id': place_id,
            'location': f'%{place.location}%' if place.location else '%'
        })
        
        hotels = []
        for row in hotels_result:
            hotel_images = []
            if row[8]:  # all_images
                img_paths = row[8].split(',')
                for img_path in img_paths[:5]:
                    img_path = img_path.strip().replace('\\', '/')
                    if img_path:
                        hotel_images.append(f"/datasets/hotel_images/{img_path}")
            
            # Fallback to image_url
            if not hotel_images and row[5]:
                img_path = row[5].replace('\\', '/')
                hotel_images.append(f"/datasets/hotel_images/{img_path}")
            
            hotels.append({
                'id': row[0],
                'name': row[1],
                'location': row[2],
                'description': row[3],
                'tags': row[4],
                'image': hotel_images[0] if hotel_images else '',
                'images': hotel_images,
                'rating': row[6] or 4.0,
                'price_range': row[7] or 'Moderate'
            })
        
        # Get restaurants near this place
        restaurants_query = text("""
            SELECT id, name, location, description, tags, image_url, rating, price_range, all_images
            FROM restaurants 
            WHERE place_id = :place_id OR location LIKE :location
            LIMIT 10
        """)
        restaurants_result = db.execute(restaurants_query, {
            'place_id': place_id,
            'location': f'%{place.location}%' if place.location else '%'
        })
        
        restaurants = []
        for row in restaurants_result:
            restaurant_images = []
            if row[8]:  # all_images
                img_paths = row[8].split(',')
                for img_path in img_paths[:5]:
                    img_path = img_path.strip().replace('\\', '/')
                    if img_path:
                        restaurant_images.append(f"/datasets/restaurant_images/{img_path}")
            
            # Fallback to image_url
            if not restaurant_images and row[5]:
                img_path = row[5].replace('\\', '/')
                restaurant_images.append(f"/datasets/restaurant_images/{img_path}")
            
            restaurants.append({
                'id': row[0],
                'name': row[1],
                'location': row[2],
                'description': row[3],
                'tags': row[4],
                'image': restaurant_images[0] if restaurant_images else '',
                'images': restaurant_images,
                'rating': row[6] or 4.0,
                'price_range': row[7] or 'Moderate'
            })
        
        # Format response
        place_data = {
            'id': place.id,
            'name': place.name,
            'location': place.location,
            'type': place.type,
            'description': place.description,
            'tags': place.tags.split(',') if place.tags else [],
            'images': place_images,
            'latitude': place.latitude,
            'longitude': place.longitude,
            'best_season': place.best_season,
            'activities': place.activities.split(',') if place.activities else [],
            'difficulty_level': place.difficulty_level,
            'accessibility': place.accessibility,
            'transportation': place.transportation,
            'province': place.province,
            'rating': place.rating or 4.0,
            'hotels': hotels,
            'restaurants': restaurants
        }
        
        return jsonify({
            'success': True,
            'place': place_data
        }), 200
        
    except Exception as e:
        print(f"Error getting place details: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
