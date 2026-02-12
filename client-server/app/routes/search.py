# app/routes/search.py

from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import models
import os

# IMPORTANT: blueprint name must be UNIQUE
search_blueprint = Blueprint('search_bp', __name__)

BASE_IMAGE_DIR = "datasets/project_imgfold/project_images"


# ---------------------- Helper: Get Images ----------------------
def get_images_for_place(place_name):
    folder_path = os.path.join(BASE_IMAGE_DIR, place_name)
    images = []

    if os.path.exists(folder_path):
        for file in os.listdir(folder_path):
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                images.append(
                    os.path.join(BASE_IMAGE_DIR, place_name, file).replace("\\", "/")
                )

    return images


# ---------------------- SEARCH ROUTE ----------------------
@search_blueprint.route("/search", methods=["GET"])
def search_items():
    q = request.args.get("q", "")
    category = request.args.get("category", "all")  # all, place, hotel, restaurant
    db = SessionLocal()
    
    # Create search patterns for better matching
    query_exact = q.lower()  # Exact match (case-insensitive)
    query_start = f"{q}%"    # Starts with query
    query_word = f"% {q}%"   # Word boundary match
    query_any = f"%{q}%"     # Contains query anywhere
    
    results = []

    def calculate_relevance_score(obj, search_term):
        """Calculate relevance score based on where the match occurs"""
        search_lower = search_term.lower()
        name_lower = (obj.name or "").lower()
        location_lower = (obj.location or "").lower()
        tags_lower = (obj.tags or "").lower()
        desc_lower = (obj.description or "").lower()
        
        score = 0
        
        # Exact name match (highest priority)
        if name_lower == search_lower:
            score += 100
        # Name starts with search term
        elif name_lower.startswith(search_lower):
            score += 80
        # Name contains search term as a word
        elif f" {search_lower}" in name_lower or f"-{search_lower}" in name_lower:
            score += 60
        # Name contains search term anywhere
        elif search_lower in name_lower:
            score += 40
        
        # Location matches
        if search_lower in location_lower:
            if location_lower.startswith(search_lower):
                score += 30
            else:
                score += 15
        
        # Tags matches (important for categorization)
        if search_lower in tags_lower:
            # Check if it's a complete tag match
            tags_list = [tag.strip().lower() for tag in tags_lower.split(',')]
            if search_lower in tags_list:
                score += 25
            else:
                score += 10
        
        # Description matches (lower priority)
        if search_lower in desc_lower:
            score += 5
        
        return score

    def add_result(obj, obj_type):
        # Calculate relevance score
        relevance = calculate_relevance_score(obj, q)
        
        # Use image_url from database if available (for all types)
        if hasattr(obj, 'image_url') and obj.image_url:
            image_url = obj.image_url
            # Parse all_images if available
            if hasattr(obj, 'all_images') and obj.all_images:
                try:
                    import json
                    all_images_raw = json.loads(obj.all_images) if isinstance(obj.all_images, str) else obj.all_images
                    # Normalize paths
                    all_images = []
                    for img in all_images_raw:
                        if img:
                            # Convert backslashes to forward slashes
                            img = img.replace('\\', '/')
                            # Add folder prefix if missing based on type
                            if obj_type == 'Hotel' and not img.startswith('hotel_images/'):
                                img = f"hotel_images/{img}"
                            elif obj_type == 'Restaurant' and not img.startswith('restaurant_images/'):
                                img = f"restaurant_images/{img}"
                            elif obj_type == 'Place' and not img.startswith('destination_images/'):
                                img = f"destination_images/{img}"
                            all_images.append(img)
                except:
                    all_images = [obj.image_url]
            else:
                all_images = [obj.image_url]
        else:
            # Fallback to folder images (legacy support)
            images = get_images_for_place(obj.name)
            image_url = images[0] if images else None
            all_images = images
            
        results.append({
            "name": obj.name,
            "type": obj_type,
            "description": obj.description or "",
            "location": obj.location or "",
            "tags": obj.tags or "",
            "image_url": image_url,
            "all_images": all_images,
            "images": all_images,  # Keep for backward compatibility
            "relevance_score": relevance
        })

    # Search based on category filter with improved query logic
    if category == "all" or category == "place":
        # Places (New tourism places data) - Only show approved places
        places = db.query(models.Place).filter(
            models.Place.name.ilike(query_any) |
            models.Place.tags.ilike(query_any) |
            models.Place.description.ilike(query_any) |
            models.Place.location.ilike(query_any)
        ).all()
        for p in places:
            add_result(p, "Place")

    if category == "all" or category == "hotel":
        # Hotels
        hotels = db.query(models.Hotel).filter(
            models.Hotel.name.ilike(query_any) |
            models.Hotel.tags.ilike(query_any) |
            models.Hotel.description.ilike(query_any) |
            models.Hotel.location.ilike(query_any)
        ).all()
        for h in hotels:
            add_result(h, "Hotel")

    if category == "all" or category == "restaurant":
        # Restaurants
        restaurants = db.query(models.Restaurant).filter(
            models.Restaurant.name.ilike(query_any) |
            models.Restaurant.tags.ilike(query_any) |
            models.Restaurant.description.ilike(query_any) |
            models.Restaurant.location.ilike(query_any)
        ).all()
        for r in restaurants:
            add_result(r, "Restaurant")

    if category == "all" or category == "attraction":
        # Attractions
        attractions = db.query(models.Attraction).filter(
            models.Attraction.name.ilike(query_any) |
            models.Attraction.tags.ilike(query_any) |
            models.Attraction.description.ilike(query_any)
        ).all()
        for a in attractions:
            add_result(a, "Attraction")

    # Sort results by relevance score (highest first)
    results.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    db.close()
    return jsonify({
        "results": results, 
        "category": category,
        "count": len(results),
        "unlimited": True
    })


# ---------------------- DETAILS ROUTE ----------------------
@search_blueprint.route("/details/<string:type>/<string:name>", methods=["GET"])
def get_details(type, name):
    db = SessionLocal()
    obj = None

    t = type.lower()

    if t == "place":
        obj = db.query(models.Place).filter(models.Place.name == name).first()
    elif t == "hotel":
        obj = db.query(models.Hotel).filter(models.Hotel.name == name).first()
    elif t == "restaurant":
        obj = db.query(models.Restaurant).filter(models.Restaurant.name == name).first()
    elif t == "attraction":
        obj = db.query(models.Attraction).filter(models.Attraction.name == name).first()

    if not obj:
        db.close()
        return jsonify({"error": f"No {type} found with name '{name}'"}), 404

    # Handle images - use image_url from database if available (for all types)
    if hasattr(obj, 'image_url') and obj.image_url:
        image_url = obj.image_url
        # Parse all_images if available
        if hasattr(obj, 'all_images') and obj.all_images:
            try:
                import json
                all_images_raw = json.loads(obj.all_images) if isinstance(obj.all_images, str) else obj.all_images
                # Normalize paths
                all_images = []
                for img in all_images_raw:
                    if img:
                        # Convert backslashes to forward slashes
                        img = img.replace('\\', '/')
                        # Add folder prefix if missing based on type
                        if t == 'hotel' and not img.startswith('hotel_images/'):
                            img = f"hotel_images/{img}"
                        elif t == 'restaurant' and not img.startswith('restaurant_images/'):
                            img = f"restaurant_images/{img}"
                        elif t == 'place' and not img.startswith('destination_images/'):
                            img = f"destination_images/{img}"
                        all_images.append(img)
            except:
                all_images = [obj.image_url]
        else:
            all_images = [obj.image_url]
    else:
        # Fallback to folder images (legacy support)
        images = get_images_for_place(obj.name)
        image_url = images[0] if images else None
        all_images = images

    result = {
        "name": obj.name,
        "description": obj.description or "",
        "location": obj.location or "",
        "tags": obj.tags or "",
        "image_url": image_url,
        "all_images": all_images,
        "images": all_images,  # Keep for backward compatibility
        "wikipedia_url": f"https://en.wikipedia.org/wiki/{obj.name.replace(' ', '_')}"
    }

    db.close()
    return jsonify(result)
