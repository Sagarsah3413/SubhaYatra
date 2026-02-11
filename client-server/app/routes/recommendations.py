from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Recommendation, Place
import json
from datetime import datetime

recommendations_bp = Blueprint('recommendations', __name__)


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        pass  # Session will be closed after use


def get_trip_type_mapping(trip_type_str):
    """Map frontend trip type to database tags/types based on actual dataset"""
    mapping = {
        # Natural Attractions - matches main_category and tags from dataset
        "⛰️ Natural Attractions": {
            "tags": ["mountain", "nature", "viewpoint", "hill town", "waterfall", "lake", "valley", 
                    "scenic", "wildlife", "birdwatching", "tea garden", "picnic spot", "hidden valley",
                    "temple", "pilgrimage", "hill", "trekking start", "river", "conservation",
                    "hot springs", "rural", "offbeat", "pond", "pokhari", "landscape", "sunrise",
                    "sunset", "forest", "garden", "park", "natural", "stream"],
            "main_category": ["Natural Attractions"],
            "activities": ["photography", "sightseeing", "nature walks", "picnic", "wildlife safari", 
                          "birdwatching", "short hike", "walks", "market tour", "local experience",
                          "viewing", "tour", "boating", "camping"]
        },
        # Trekking & Adventures - matches dataset trekking/adventure entries
        "🧗 Trekking & Adventures": {
            "tags": ["trekking", "adventure", "mountain", "climbing", "trek", "expedition", 
                    "remote trekking", "wilderness", "biodiversity", "scenic", "high altitude",
                    "base camp", "hiking", "trail", "peak", "summit", "alpine"],
            "main_category": ["Trekking & Adventure"],
            "activities": ["trek to base camp", "mountain climbing", "trekking", "camping", 
                          "hiking", "climbing", "expedition", "photography", "adventure"]
        },
        # Cultural & Religious - matches temples, pilgrimage sites
        "🛕 Cultural & Religious": {
            "tags": ["temple", "pilgrimage", "cultural village", "religious", "heritage", 
                    "unesco", "monastery", "spiritual", "historical", "cultural", "limbu",
                    "city", "local", "offbeat", "shrine", "stupa", "gumba", "gompa",
                    "hindu", "buddhist", "sacred", "holy", "dham", "mandir"],
            "main_category": ["Cultural & Religious Sites"],
            "activities": ["worship", "cultural tour", "cultural tours", "temple visit", 
                          "religious fair", "holy bathing", "photography", "sightseeing",
                          "pilgrimage", "meditation", "prayer"]
        },
        # Village & Rural - matches village tourism entries
        "🏡 Village & Rural": {
            "tags": ["village", "rural", "cultural village", "traditional", "local", "ethnic", 
                    "homestay", "limbu", "sherpa", "tharu", "offbeat", "cultural", "community",
                    "indigenous", "hamlet", "settlement", "countryside", "agriculture"],
            "main_category": ["Village & Rural Tourism", "Cultural & Religious Sites"],
            "activities": ["cultural tours", "local experience", "market tour", "photography", 
                          "village tour", "homestay", "cultural tour", "community visit",
                          "traditional", "farming"]
        },
        # Urban & Modern - for cities and modern attractions
        "🏙️ Urban & Modern": {
            "tags": ["urban", "city", "modern", "shopping", "bazaar", "market", "town", "cultural",
                    "hub", "center", "municipality", "metro", "commercial"],
            "main_category": ["Urban & Modern Attractions"],
            "activities": ["market tour", "shopping", "sightseeing", "local experience", "photography",
                          "dining", "entertainment", "nightlife"]
        }
    }
    return mapping.get(trip_type_str, {"tags": [], "main_category": [], "activities": []})


def calculate_match_score(place, trip_type_mappings_list, duration_days, travel_month=None):
    """
    Calculate how well a place matches the user's preferences
    trip_type_mappings_list: List of mapping dicts for each selected trip type
    travel_month: User's preferred travel month (e.g., "March", "October")
    """
    score = 0
    
    # Get place data (all lowercase for matching)
    # Handle both comma and semicolon separators in tags
    place_tags = (place.tags or "").lower().replace(';', ',')
    place_type = (place.type or "").lower()
    place_activities = (place.activities or "").lower().replace(';', ',')
    place_description = (place.description or "").lower()
    place_best_season = (place.best_season or "").lower()
    
    # Month-based season matching (HIGHEST PRIORITY)
    if travel_month:
        month_season_map = {
            "January": ["winter", "jan", "january", "dec-feb", "oct-mar", "nov-mar"],
            "February": ["winter", "feb", "february", "dec-feb", "jan-mar", "oct-mar", "nov-mar"],
            "March": ["spring", "mar", "march", "mar-may", "feb-apr", "oct-mar", "nov-mar"],
            "April": ["spring", "apr", "april", "mar-may", "mar-jun", "feb-apr"],
            "May": ["spring", "may", "mar-may", "apr-jun", "mar-jun"],
            "June": ["summer", "monsoon", "jun", "june", "apr-jun", "may-jul", "mar-jun"],
            "July": ["summer", "monsoon", "jul", "july", "may-jul", "jun-aug"],
            "August": ["summer", "monsoon", "aug", "august", "jun-aug", "jul-sep"],
            "September": ["autumn", "fall", "sep", "september", "sep-nov", "jul-sep", "aug-oct"],
            "October": ["autumn", "fall", "oct", "october", "sep-nov", "oct-dec", "aug-oct", "oct-mar"],
            "November": ["autumn", "fall", "nov", "november", "sep-nov", "oct-dec", "nov-jan", "oct-mar", "nov-mar"],
            "December": ["winter", "dec", "december", "oct-dec", "nov-jan", "dec-feb"]
        }
        
        month_keywords = month_season_map.get(travel_month, [])
        month_matched = False
        
        for keyword in month_keywords:
            if keyword in place_best_season:
                score += 20  # High bonus for season match
                month_matched = True
                break
        
        # Penalty for places that explicitly don't match the season
        if not month_matched and place_best_season:
            # Check if place has a specific season that doesn't include user's month
            opposite_seasons = {
                "January": ["summer", "monsoon", "jun", "jul", "aug"],
                "February": ["summer", "monsoon", "jun", "jul", "aug"],
                "March": ["monsoon", "jul", "aug"],
                "April": ["winter", "monsoon", "jul", "aug", "dec", "jan"],
                "May": ["winter", "monsoon", "dec", "jan", "feb"],
                "June": ["winter", "dec", "jan", "feb"],
                "July": ["winter", "dec", "jan", "feb"],
                "August": ["winter", "dec", "jan", "feb"],
                "September": ["winter", "dec", "jan", "feb"],
                "October": ["summer", "monsoon", "jun", "jul", "aug"],
                "November": ["summer", "monsoon", "jun", "jul", "aug"],
                "December": ["summer", "monsoon", "jun", "jul", "aug"]
            }
            
            opposite_keywords = opposite_seasons.get(travel_month, [])
            for keyword in opposite_keywords:
                if keyword in place_best_season and len(place_best_season) < 20:  # Specific season mentioned
                    score -= 10  # Penalty for wrong season
                    break
    
    # Tag matching (most important) - check all trip types
    matched_types = 0
    for trip_mapping in trip_type_mappings_list:
        type_matched = False
        
        # Check tags
        for tag in trip_mapping["tags"]:
            if tag in place_tags or tag in place_description:
                score += 10
                type_matched = True
                break
        
        # Check main_category match (high value)
        if not type_matched:
            for category in trip_mapping["main_category"]:
                if category.lower() in place_type.lower():
                    score += 12  # Higher score for category match
                    type_matched = True
                    break
        
        # Check activities match
        if not type_matched:
            for activity in trip_mapping["activities"]:
                if activity in place_activities:
                    score += 8
                    type_matched = True
                    break
        
        if type_matched:
            matched_types += 1
    
    # Bonus for matching multiple trip types (versatile destinations)
    if matched_types > 1:
        score += matched_types * 5  # 5 bonus points per additional type matched
    
    # Duration matching based on difficulty_level
    if duration_days <= 3:
        # Short trips - prefer easily accessible places
        if place.accessibility and "road accessible" in place.accessibility.lower():
            score += 5
        if place.difficulty_level and place.difficulty_level.lower() == "easy":
            score += 4
    elif duration_days <= 7:
        # Medium trips - moderate difficulty OK
        if place.difficulty_level and place.difficulty_level.lower() in ["moderate", "easy"]:
            score += 3
    else:
        # Long trips - all difficulty levels OK, prefer challenging
        if place.difficulty_level and place.difficulty_level.lower() in ["hard", "moderate"]:
            score += 5
    
    # Rating boost (if available)
    if hasattr(place, 'rating') and place.rating:
        score += place.rating * 2
    
    # Province diversity (slight boost for variety)
    if place.province:
        score += 1
    
    return score


def get_duration_days(duration_str):
    """Convert duration string to average days"""
    duration_map = {
        "1-3": 2,
        "4-7": 5,
        "8-14": 11,
        "15+": 20
    }
    return duration_map.get(duration_str, 5)


@recommendations_bp.route('/recommendations', methods=['POST'])
def create_recommendation():
    """Create a new recommendation request and return personalized results"""
    db = SessionLocal()
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'age', 'phone', 'travellers', 'tripDuration', 'travelMonth']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Handle both single tripType and multiple tripTypes
        trip_types = []
        if 'tripTypes' in data and isinstance(data['tripTypes'], list):
            trip_types = data['tripTypes']
        elif 'tripType' in data:
            trip_types = [data['tripType']]
        
        if not trip_types:
            return jsonify({'error': 'At least one trip type must be selected'}), 400
        
        # Get user_id from request (you might get this from auth token)
        user_id = data.get('userId', 'anonymous')
        
        # Get trip type mappings for matching - now handles multiple types with full mapping
        trip_type_mappings_list = [get_trip_type_mapping(trip_type) for trip_type in trip_types]
        duration_days = get_duration_days(data['tripDuration'])
        travel_month = data.get('travelMonth')  # Get travel month
        
        # Query places from database
        all_places = db.query(Place).all()
        
        # Calculate match scores for each place
        place_scores = []
        for place in all_places:
            score = calculate_match_score(place, trip_type_mappings_list, duration_days, travel_month)
            if score > 0:  # Only include places with some match
                # Determine which trip types this place matches
                matched_types = []
                # Handle both comma and semicolon separators
                place_tags = (place.tags or "").lower().replace(';', ',')
                place_type = (place.type or "").lower()
                place_activities = (place.activities or "").lower().replace(';', ',')
                place_description = (place.description or "").lower()
                
                for i, trip_type in enumerate(trip_types):
                    trip_mapping = trip_type_mappings_list[i]
                    
                    # Check if place matches this trip type
                    matches = False
                    for tag in trip_mapping["tags"]:
                        if tag in place_tags or tag in place_description:
                            matches = True
                            break
                    
                    if not matches:
                        for category in trip_mapping["main_category"]:
                            if category.lower() in place_type.lower():
                                matches = True
                                break
                    
                    if not matches:
                        for activity in trip_mapping["activities"]:
                            if activity in place_activities:
                                matches = True
                                break
                    
                    if matches:
                        matched_types.append(trip_type)
                
                place_scores.append({
                    'place': place,
                    'score': score,
                    'matched_types': matched_types
                })
        
        # Sort by score (highest first) and get top recommendations
        place_scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Return more recommendations - increased from 10/15 to 30/50
        num_recommendations = min(50 if len(trip_types) > 1 else 30, len(place_scores))
        top_recommendations = place_scores[:num_recommendations]
        
        # Format recommendations for response
        recommended_places = []
        recommended_place_ids = []
        
        for item in top_recommendations:
            place = item['place']
            recommended_place_ids.append(place.id)
            
            # Determine recommended duration based on place type and user duration
            if duration_days <= 3:
                rec_duration = "1-2 days recommended"
            elif duration_days <= 7:
                rec_duration = "2-4 days recommended"
            else:
                rec_duration = "3-7 days recommended"
            
            # Format image URL for frontend
            image_url = ""
            if place.image_url:
                # Convert backslashes to forward slashes
                image_path = place.image_url.replace('\\', '/')
                
                # Check if path already starts with /datasets or destination_images
                if image_path.startswith('/datasets/'):
                    image_url = image_path
                elif image_path.startswith('destination_images/'):
                    image_url = f"/datasets/{image_path}"
                else:
                    # Assume it's a relative path from destination_images
                    image_url = f"/datasets/destination_images/{image_path}"
            
            recommended_places.append({
                'id': place.id,
                'name': place.name,
                'type': place.type or "Destination",
                'matched_types': item['matched_types'],  # All types this place matches
                'description': place.description or "Discover this amazing destination",
                'image': image_url,
                'rating': place.rating or 4.0,
                'duration': rec_duration,
                'location': place.location or "",
                'tags': place.tags or "",
                'activities': place.activities or "",
                'best_season': place.best_season or "",
                'difficulty_level': place.difficulty_level or "Moderate",
                'latitude': place.latitude,
                'longitude': place.longitude,
                'match_score': item['score'],
                'is_versatile': len(item['matched_types']) > 1  # Matches multiple preferences
            })
        
        # Save recommendation to database (store all trip types)
        recommendation = Recommendation(
            user_id=user_id,
            name=data['name'],
            age=int(data['age']),
            phone=data['phone'],
            travellers=int(data['travellers']),
            trip_duration=data['tripDuration'],
            trip_type=json.dumps(trip_types),  # Store as JSON array
            travel_month=travel_month,  # Store travel month
            recommended_places=json.dumps(recommended_place_ids),
            created_at=datetime.utcnow()
        )
        
        db.add(recommendation)
        db.commit()
        db.refresh(recommendation)
        
        return jsonify({
            'success': True,
            'recommendation_id': recommendation.id,
            'recommendations': recommended_places,
            'total_matches': len(recommended_places),
            'preferences': {
                'name': data['name'],
                'age': data['age'],
                'travellers': data['travellers'],
                'tripDuration': data['tripDuration'],
                'travelMonth': travel_month,
                'tripTypes': trip_types,
                'multiple_types': len(trip_types) > 1
            }
        }), 200
        
    except Exception as e:
        db.rollback()
        print(f"Error creating recommendation: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


@recommendations_bp.route('/recommendations/<int:recommendation_id>', methods=['GET'])
def get_recommendation(recommendation_id):
    """Get a specific recommendation by ID"""
    db = SessionLocal()
    try:
        recommendation = db.query(Recommendation).filter(
            Recommendation.id == recommendation_id
        ).first()
        
        if not recommendation:
            return jsonify({'error': 'Recommendation not found'}), 404
        
        # Get recommended places
        place_ids = json.loads(recommendation.recommended_places)
        places = db.query(Place).filter(Place.id.in_(place_ids)).all()
        
        # Format response
        recommended_places = []
        for place in places:
            recommended_places.append({
                'id': place.id,
                'name': place.name,
                'type': recommendation.trip_type,
                'description': place.description,
                'image': place.image_url,
                'rating': place.rating or 4.5,
                'location': place.location,
                'tags': place.tags,
                'activities': place.activities
            })
        
        return jsonify({
            'success': True,
            'recommendation': {
                'id': recommendation.id,
                'name': recommendation.name,
                'age': recommendation.age,
                'travellers': recommendation.travellers,
                'trip_duration': recommendation.trip_duration,
                'trip_type': recommendation.trip_type,
                'created_at': recommendation.created_at.isoformat(),
                'recommended_places': recommended_places
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting recommendation: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


@recommendations_bp.route('/recommendations/user/<user_id>', methods=['GET'])
def get_user_recommendations(user_id):
    """Get all recommendations for a specific user"""
    db = SessionLocal()
    try:
        recommendations = db.query(Recommendation).filter(
            Recommendation.user_id == user_id
        ).order_by(Recommendation.created_at.desc()).all()
        
        result = []
        for rec in recommendations:
            result.append({
                'id': rec.id,
                'name': rec.name,
                'trip_type': rec.trip_type,
                'trip_duration': rec.trip_duration,
                'travellers': rec.travellers,
                'created_at': rec.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'recommendations': result,
            'total': len(result)
        }), 200
        
    except Exception as e:
        print(f"Error getting user recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


@recommendations_bp.route('/recommendations/stats', methods=['GET'])
def get_recommendation_stats():
    """Get statistics about recommendations"""
    db = SessionLocal()
    try:
        total_recommendations = db.query(Recommendation).count()
        
        # Get popular trip types
        from sqlalchemy import func
        trip_types = db.query(
            Recommendation.trip_type,
            func.count(Recommendation.id).label('count')
        ).group_by(Recommendation.trip_type).all()
        
        # Get popular durations
        durations = db.query(
            Recommendation.trip_duration,
            func.count(Recommendation.id).label('count')
        ).group_by(Recommendation.trip_duration).all()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_recommendations': total_recommendations,
                'popular_trip_types': [{'type': t[0], 'count': t[1]} for t in trip_types],
                'popular_durations': [{'duration': d[0], 'count': d[1]} for d in durations]
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting stats: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
