"""
Similar Places Recommendation Route
Uses similarity.pkl, svd.pkl, and vectorizer.pkl for content-based recommendations
"""
from flask import Blueprint, jsonify, request
import pickle
import os
import csv
import numpy as np
from ..database import SessionLocal
from ..models import Place

similar_places_bp = Blueprint('similar_places', __name__)

# Load the pickle files
DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'datasets')
SIMILARITY_PATH = os.path.join(DATASETS_DIR, 'similarity.pkl')
SVD_PATH = os.path.join(DATASETS_DIR, 'svd.pkl')
VECTORIZER_PATH = os.path.join(DATASETS_DIR, 'vectorizer.pkl')
CSV_PATH = os.path.join(DATASETS_DIR, 'dataset_with_all_image_path.csv')

# Global variables to store loaded models
similarity_matrix = None
svd_model = None
vectorizer = None
place_name_to_index = None  # Maps place names to similarity matrix indices

def load_models():
    """Load the similarity models if not already loaded"""
    global similarity_matrix, svd_model, vectorizer, place_name_to_index
    
    if similarity_matrix is None:
        try:
            with open(SIMILARITY_PATH, 'rb') as f:
                similarity_matrix = pickle.load(f)
            print(f"✅ Loaded similarity matrix: {similarity_matrix.shape}")
        except Exception as e:
            print(f"❌ Error loading similarity.pkl: {e}")
    
    if svd_model is None:
        try:
            with open(SVD_PATH, 'rb') as f:
                svd_model = pickle.load(f)
            print(f"✅ Loaded SVD model")
        except Exception as e:
            print(f"❌ Error loading svd.pkl: {e}")
    
    if vectorizer is None:
        try:
            with open(VECTORIZER_PATH, 'rb') as f:
                vectorizer = pickle.load(f)
            print(f"✅ Loaded vectorizer")
        except Exception as e:
            print(f"❌ Error loading vectorizer.pkl: {e}")
    
    # Load place name to index mapping from CSV (same order as similarity matrix)
    if place_name_to_index is None:
        try:
            place_name_to_index = {}
            with open(CSV_PATH, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader):
                    destination_name = row.get('destination', '').strip().lower()
                    if destination_name:
                        place_name_to_index[destination_name] = idx
            print(f"✅ Loaded {len(place_name_to_index)} place name mappings")
        except Exception as e:
            print(f"❌ Error loading place name mappings: {e}")

@similar_places_bp.route('/places/<int:place_id>/similar', methods=['GET'])
def get_similar_places(place_id):
    """Get similar places based on content similarity"""
    try:
        # Load models if not already loaded
        load_models()
        
        if similarity_matrix is None or place_name_to_index is None:
            return jsonify({'error': 'Similarity model not available'}), 500
        
        # Get the number of recommendations (default 6)
        limit = int(request.args.get('limit', 6))
        
        # Get database session
        session = SessionLocal()
        
        try:
            # Get the current place
            current_place = session.query(Place).filter(Place.id == place_id).first()
            if not current_place:
                return jsonify({'error': 'Place not found'}), 404
            
            # Get the similarity matrix index using place name
            place_name_lower = current_place.name.strip().lower()
            
            if place_name_lower not in place_name_to_index:
                return jsonify({'error': f'Place "{current_place.name}" not in similarity matrix'}), 404
            
            place_index = place_name_to_index[place_name_lower]
            
            # Check if index is within bounds
            if place_index >= len(similarity_matrix):
                return jsonify({'error': 'Place index out of bounds'}), 404
            
            # Get similarity scores for this place
            similarity_scores = list(enumerate(similarity_matrix[place_index]))
            
            # Sort by similarity score (descending) and exclude the place itself
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
            similarity_scores = [x for x in similarity_scores if x[0] != place_index]
            
            # Get top N similar places by their indices
            top_similar_indices = [x[0] for x in similarity_scores[:limit * 2]]  # Get more to filter
            
            # Create reverse mapping: index -> place name
            index_to_name = {idx: name for name, idx in place_name_to_index.items()}
            
            # Get the actual place objects by matching names
            similar_places = []
            for idx in top_similar_indices:
                if idx in index_to_name:
                    similar_place_name = index_to_name[idx]
                    
                    # Find place in database by name (case-insensitive)
                    place = session.query(Place).filter(
                        Place.name.ilike(similar_place_name)
                    ).first()
                    
                    if place and len(similar_places) < limit:
                        # Format place data
                        place_data = {
                            'id': place.id,
                            'name': place.name,
                            'location': place.location,
                            'type': place.type,
                            'description': place.description[:200] + '...' if place.description and len(place.description) > 200 else place.description,
                            'tags': place.tags,
                            'rating': place.rating or 4.0,
                            'best_season': place.best_season,
                            'difficulty_level': place.difficulty_level,
                            'image': None
                        }
                        
                        # Get image
                        if place.image_url:
                            img_path = place.image_url.replace('\\', '/')
                            if img_path.startswith('destination_images/'):
                                place_data['image'] = f"/datasets/{img_path}"
                            elif img_path.startswith('/datasets/'):
                                place_data['image'] = img_path
                            else:
                                place_data['image'] = f"/datasets/destination_images/{img_path}"
                        
                        similar_places.append(place_data)
            
            return jsonify({
                'success': True,
                'place_id': place_id,
                'place_name': current_place.name,
                'similar_places': similar_places,
                'count': len(similar_places)
            })
            
        finally:
            session.close()
            
    except Exception as e:
        print(f"Error getting similar places: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@similar_places_bp.route('/similar/test', methods=['GET'])
def test_similarity():
    """Test endpoint to check if models are loaded"""
    load_models()
    
    return jsonify({
        'similarity_loaded': similarity_matrix is not None,
        'similarity_shape': similarity_matrix.shape if similarity_matrix is not None else None,
        'svd_loaded': svd_model is not None,
        'vectorizer_loaded': vectorizer is not None,
        'place_mappings_loaded': place_name_to_index is not None,
        'total_places_in_mapping': len(place_name_to_index) if place_name_to_index else 0
    })
