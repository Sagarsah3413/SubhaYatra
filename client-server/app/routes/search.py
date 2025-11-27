# app/routes/search.py
from flask import Blueprint, request, jsonify
from ..database import SessionLocal
from .. import models
import os

search_blueprint = Blueprint('search', __name__)
BASE_IMAGE_DIR = "datasets/project_imgfold/project_images"

def get_images_for_place(place_name):
    folder_path = os.path.join(BASE_IMAGE_DIR, place_name)
    images = []
    if os.path.exists(folder_path):
        for file in os.listdir(folder_path):
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                images.append(os.path.join("datasets/project_imgfold/project_images", place_name, file).replace("\\", "/"))
    return images

@search_blueprint.route("/search/", methods=["GET"])
def search_items():
    q = request.args.get("q", "")
    db = SessionLocal()
    query = f"%{q}%"
    results = []

    def add_result(obj, obj_type):
        results.append({
            "name": obj.name,
            "type": obj_type,
            "description": obj.description or "",
            "location": obj.location or "",
            "tags": obj.tags or "",
            "images": get_images_for_place(obj.name)
        })

    # Hotels
    hotels = db.query(models.Hotel).filter(
        models.Hotel.name.ilike(query) |
        models.Hotel.tags.ilike(query) |
        models.Hotel.description.ilike(query)
    ).all()
    for h in hotels:
        add_result(h, "Hotel")

    # Restaurants
    restaurants = db.query(models.Restaurant).filter(
        models.Restaurant.name.ilike(query) |
        models.Restaurant.tags.ilike(query) |
        models.Restaurant.description.ilike(query)
    ).all()
    for r in restaurants:
        add_result(r, "Restaurant")

    # Attractions
    attractions = db.query(models.Attraction).filter(
        models.Attraction.name.ilike(query) |
        models.Attraction.tags.ilike(query) |
        models.Attraction.description.ilike(query)
    ).all()
    for a in attractions:
        add_result(a, "Attraction")

    db.close()
    return jsonify({"results": results})
