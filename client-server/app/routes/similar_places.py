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
    """Get similar places based on location proximity and content similarity"""
    try:
        # Get the number of recommendations (default 6)
        limit = int(request.args.get('limit', 6))
        
        # Get database session
        session = SessionLocal()
        
        try:
            # Get the current place
            current_place = session.query(Place).filter(Place.id == place_id).first()
            if not current_place:
                return jsonify({'error': 'Place not found'}), 404
            
            print(f"🔍 Finding similar places for: {current_place.name}")
            print(f"   Location: {current_place.location}")
            print(f"   Province: {current_place.province}")
            print(f"   Type: {current_place.type}")
            
            # Strategy: Prioritize nearby places (same location/province) with similar type
            similar_places = []
            
            # Step 1: Get places from same location (highest priority)
            if current_place.location:
                same_location_places = session.query(Place).filter(
                    Place.location.ilike(f"%{current_place.location}%"),
                    Place.id != place_id,
                    Place.status == 'approved'
                ).limit(limit * 2).all()
                
                print(f"   Found {len(same_location_places)} places in same location")
                
                for place in same_location_places:
                    if len(similar_places) >= limit:
                        break
                    similar_places.append({
                        'place': place,
                        'score': 100,  # Highest score for same location
                        'reason': 'same_location'
                    })
            
            # Step 2: If we need more, get places from same province
            if len(similar_places) < limit and current_place.province:
                same_province_places = session.query(Place).filter(
                    Place.province == current_place.province,
                    Place.id != place_id,
                    Place.status == 'approved'
                ).limit(limit * 3).all()
                
                print(f"   Found {len(same_province_places)} places in same province")
                
                # Filter out places already added
                existing_ids = {p['place'].id for p in similar_places}
                
                for place in same_province_places:
                    if len(similar_places) >= limit:
                        break
                    if place.id not in existing_ids:
                        # Bonus if same type
                        score = 80
                        if current_place.type and place.type and current_place.type.lower() == place.type.lower():
                            score = 90
                        
                        similar_places.append({
                            'place': place,
                            'score': score,
                            'reason': 'same_province'
                        })
                        existing_ids.add(place.id)
            
            # Step 3: If still need more, get places with similar type (any location)
            if len(similar_places) < limit and current_place.type:
                same_type_places = session.query(Place).filter(
                    Place.type == current_place.type,
                    Place.id != place_id,
                    Place.status == 'approved'
                ).limit(limit * 2).all()
                
                print(f"   Found {len(same_type_places)} places with same type")
                
                existing_ids = {p['place'].id for p in similar_places}
                
                for place in same_type_places:
                    if len(similar_places) >= limit:
                        break
                    if place.id not in existing_ids:
                        similar_places.append({
                            'place': place,
                            'score': 60,
                            'reason': 'same_type'
                        })
                        existing_ids.add(place.id)
            
            # Step 4: If still need more, use content similarity as fallback
            if len(similar_places) < limit:
                load_models()
                
                if similarity_matrix is not None and place_name_to_index is not None:
                    place_name_lower = current_place.name.strip().lower()
                    
                    if place_name_lower in place_name_to_index:
                        place_index = place_name_to_index[place_name_lower]
                        
                        if place_index < len(similarity_matrix):
                            # Get similarity scores
                            similarity_scores = list(enumerate(similarity_matrix[place_index]))
                            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
                            similarity_scores = [x for x in similarity_scores if x[0] != place_index]
                            
                            # Create reverse mapping
                            index_to_name = {idx: name for name, idx in place_name_to_index.items()}
                            
                            existing_ids = {p['place'].id for p in similar_places}
                            
                            for idx, sim_score in similarity_scores[:limit * 3]:
                                if len(similar_places) >= limit:
                                    break
                                
                                if idx in index_to_name:
                                    similar_place_name = index_to_name[idx]
                                    place = session.query(Place).filter(
                                        Place.name.ilike(similar_place_name),
                                        Place.status == 'approved'
                                    ).first()
                                    
                                    if place and place.id not in existing_ids:
                                        similar_places.append({
                                            'place': place,
                                            'score': 40,
                                            'reason': 'content_similar'
                                        })
                                        existing_ids.add(place.id)
            
            # Sort by score (highest first)
            similar_places.sort(key=lambda x: x['score'], reverse=True)
            
            # Format response
            formatted_places = []
            for item in similar_places[:limit]:
                place = item['place']
                
                place_data = {
                    'id': place.id,
                    'name': place.name,
                    'location': place.location,
                    'province': place.province,
                    'type': place.type,
                    'description': place.description[:200] + '...' if place.description and len(place.description) > 200 else place.description,
                    'tags': place.tags,
                    'rating': place.rating or 4.0,
                    'best_season': place.best_season,
                    'difficulty_level': place.difficulty_level,
                    'image': None,
                    'match_reason': item['reason']  # For debugging
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
                
                formatted_places.append(place_data)
            
            print(f"✅ Returning {len(formatted_places)} similar places")
            for p in formatted_places:
                print(f"   - {p['name']} ({p['location']}) - {p['match_reason']}")
            
            return jsonify({
                'success': True,
                'place_id': place_id,
                'place_name': current_place.name,
                'place_location': current_place.location,
                'place_province': current_place.province,
                'similar_places': formatted_places,
                'count': len(formatted_places)
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
