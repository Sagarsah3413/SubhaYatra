from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
import os
import json
import random
from ..database import SessionLocal
from ..models import Place, Hotel, Restaurant

images_bp = Blueprint('images', __name__)

# Image directories
DATASETS_DIR = os.path.join(os.getcwd(), 'datasets')
DESTINATION_IMAGES_DIR = os.path.join(DATASETS_DIR, 'destination_images')
HOTEL_IMAGES_DIR = os.path.join(DATASETS_DIR, 'hotel_images')
RESTAURANT_IMAGES_DIR = os.path.join(DATASETS_DIR, 'restaurant_images')
UPLOADS_DIR = os.path.join(DATASETS_DIR, 'uploads')

# Ensure directories exist
for directory in [DESTINATION_IMAGES_DIR, HOTEL_IMAGES_DIR, RESTAURANT_IMAGES_DIR, UPLOADS_DIR]:
    os.makedirs(directory, exist_ok=True)

def get_image_directory(item_type):
    """Get the appropriate image directory based on item type"""
    type_map = {
        'Place': DESTINATION_IMAGES_DIR,
        'Destination': DESTINATION_IMAGES_DIR,
        'Attraction': DESTINATION_IMAGES_DIR,
        'Hotel': HOTEL_IMAGES_DIR,
        'Restaurant': RESTAURANT_IMAGES_DIR,
        'restaurant': RESTAURANT_IMAGES_DIR,
        'hotel': HOTEL_IMAGES_DIR,
        'place': DESTINATION_IMAGES_DIR
    }
    return type_map.get(item_type, DESTINATION_IMAGES_DIR)

def get_folder_name(item_type):
    """Get the folder name for URL construction"""
    type_map = {
        'Place': 'destination_images',
        'Destination': 'destination_images',
        'Attraction': 'destination_images',
        'Hotel': 'hotel_images',
        'Restaurant': 'restaurant_images',
        'restaurant': 'restaurant_images',
        'hotel': 'hotel_images',
        'place': 'destination_images'
    }
    return type_map.get(item_type, 'destination_images')

@images_bp.route('/images/upload', methods=['POST'])
def upload_image():
    """Upload a new image for an item"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        item_type = request.form.get('type', 'Place')
        item_id = request.form.get('item_id')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not item_id:
            return jsonify({'error': 'Item ID is required'}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Get the appropriate directory
        upload_dir = get_image_directory(item_type)
        folder_name = get_folder_name(item_type)
        
        # Create item-specific subdirectory
        item_dir = os.path.join(upload_dir, f"item_{item_id}")
        os.makedirs(item_dir, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(item_dir, filename)
        file.save(file_path)
        
        # Construct the URL path
        image_url = f"/datasets/{folder_name}/item_{item_id}/{filename}"
        
        # Update the database
        session = SessionLocal()
        try:
            if item_type.lower() == 'hotel':
                item = session.query(Hotel).filter(Hotel.id == item_id).first()
            elif item_type.lower() == 'restaurant':
                item = session.query(Restaurant).filter(Restaurant.id == item_id).first()
            else:
                item = session.query(Place).filter(Place.id == item_id).first()
            
            if item:
                # Update all_images field
                current_images = json.loads(item.all_images) if item.all_images else []
                current_images.append(image_url)
                item.all_images = json.dumps(current_images)
                
                # Set as primary image if it's the first one
                if not item.image_url:
                    item.image_url = image_url
                
                session.commit()
            
            return jsonify({
                'success': True,
                'image_url': image_url,
                'message': 'Image uploaded successfully'
            }), 201
            
        finally:
            session.close()
            
    except Exception as e:
        current_app.logger.error(f'Error uploading image: {e}')
        return jsonify({'error': 'Failed to upload image'}), 500

@images_bp.route('/images/delete', methods=['DELETE'])
def delete_image():
    """Delete an image"""
    try:
        data = request.get_json()
        image_path = data.get('image_path')
        
        if not image_path:
            return jsonify({'error': 'Image path is required'}), 400
        
        # Convert URL path to file system path
        if image_path.startswith('/datasets/'):
            file_path = os.path.join(DATASETS_DIR, image_path[10:])  # Remove '/datasets/'
        else:
            return jsonify({'error': 'Invalid image path'}), 400
        
        # Delete the file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Update database records
        session = SessionLocal()
        try:
            # Check all tables for this image
            for model in [Place, Hotel, Restaurant]:
                items = session.query(model).filter(
                    (model.image_url == image_path) |
                    (model.all_images.like(f'%{image_path}%'))
                ).all()
                
                for item in items:
                    # Remove from all_images
                    if item.all_images:
                        current_images = json.loads(item.all_images)
                        if image_path in current_images:
                            current_images.remove(image_path)
                            item.all_images = json.dumps(current_images)
                    
                    # Clear primary image if it matches
                    if item.image_url == image_path:
                        # Set to first remaining image or None
                        remaining_images = json.loads(item.all_images) if item.all_images else []
                        item.image_url = remaining_images[0] if remaining_images else None
            
            session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Image deleted successfully'
            })
            
        finally:
            session.close()
            
    except Exception as e:
        current_app.logger.error(f'Error deleting image: {e}')
        return jsonify({'error': 'Failed to delete image'}), 500

@images_bp.route('/images/random', methods=['GET'])
def get_random_images():
    """Get random images from a specific category"""
    try:
        item_type = request.args.get('type', 'Place')
        count = int(request.args.get('count', 6))
        
        # Get the appropriate directory
        image_dir = get_image_directory(item_type)
        folder_name = get_folder_name(item_type)
        
        if not os.path.exists(image_dir):
            return jsonify([])
        
        # Get all subdirectories (each represents an item)
        subdirs = [d for d in os.listdir(image_dir) if os.path.isdir(os.path.join(image_dir, d))]
        
        random_images = []
        selected_dirs = random.sample(subdirs, min(count, len(subdirs)))
        
        for subdir in selected_dirs:
            subdir_path = os.path.join(image_dir, subdir)
            image_files = [f for f in os.listdir(subdir_path) 
                          if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            
            if image_files:
                random_image = random.choice(image_files)
                image_url = f"/datasets/{folder_name}/{subdir}/{random_image}"
                random_images.append({
                    'url': image_url,
                    'directory': subdir,
                    'filename': random_image
                })
        
        return jsonify(random_images)
        
    except Exception as e:
        current_app.logger.error(f'Error getting random images: {e}')
        return jsonify([])

@images_bp.route('/images/list/<item_type>/<int:item_id>', methods=['GET'])
def list_item_images(item_type, item_id):
    """List all images for a specific item"""
    try:
        session = SessionLocal()
        try:
            # Get the item from database
            if item_type.lower() == 'hotel':
                item = session.query(Hotel).filter(Hotel.id == item_id).first()
            elif item_type.lower() == 'restaurant':
                item = session.query(Restaurant).filter(Restaurant.id == item_id).first()
            else:
                item = session.query(Place).filter(Place.id == item_id).first()
            
            if not item:
                return jsonify({'error': 'Item not found'}), 404
            
            # Get all images
            images = []
            if item.all_images:
                images = json.loads(item.all_images)
            elif item.image_url:
                images = [item.image_url]
            
            return jsonify({
                'item_id': item_id,
                'item_type': item_type,
                'item_name': item.name,
                'primary_image': item.image_url,
                'all_images': images,
                'image_count': len(images)
            })
            
        finally:
            session.close()
            
    except Exception as e:
        current_app.logger.error(f'Error listing images: {e}')
        return jsonify({'error': 'Failed to list images'}), 500

@images_bp.route('/images/stats', methods=['GET'])
def get_image_stats():
    """Get statistics about images in the system"""
    try:
        stats = {
            'destination_images': 0,
            'hotel_images': 0,
            'restaurant_images': 0,
            'total_images': 0
        }
        
        # Count images in each directory
        for img_type, directory in [
            ('destination_images', DESTINATION_IMAGES_DIR),
            ('hotel_images', HOTEL_IMAGES_DIR),
            ('restaurant_images', RESTAURANT_IMAGES_DIR)
        ]:
            if os.path.exists(directory):
                count = 0
                for root, dirs, files in os.walk(directory):
                    count += len([f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))])
                stats[img_type] = count
                stats['total_images'] += count
        
        # Get database stats
        session = SessionLocal()
        try:
            stats['places_with_images'] = session.query(Place).filter(Place.image_url.isnot(None)).count()
            stats['hotels_with_images'] = session.query(Hotel).filter(Hotel.image_url.isnot(None)).count()
            stats['restaurants_with_images'] = session.query(Restaurant).filter(Restaurant.image_url.isnot(None)).count()
            
            stats['total_places'] = session.query(Place).count()
            stats['total_hotels'] = session.query(Hotel).count()
            stats['total_restaurants'] = session.query(Restaurant).count()
            
        finally:
            session.close()
        
        return jsonify(stats)
        
    except Exception as e:
        current_app.logger.error(f'Error getting image stats: {e}')
        return jsonify({'error': 'Failed to get image statistics'}), 500