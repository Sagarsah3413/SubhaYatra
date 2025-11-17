from fastapi import APIRouter, Query
from sqlalchemy.orm import Session
from app import models, database
import os

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("/")
def search_items(q: str = Query(..., min_length=1)):
    db: Session = database.SessionLocal()
    query = f"%{q}%"

    results = []

    # Combine all places
    places = db.query(models.Hotel).filter(
        models.Hotel.name.ilike(query) |
        models.Hotel.tags.ilike(query) |
        models.Hotel.description.ilike(query)
    ).all() + db.query(models.Restaurant).filter(
        models.Restaurant.name.ilike(query) |
        models.Restaurant.tags.ilike(query) |
        models.Restaurant.description.ilike(query)
    ).all() + db.query(models.Attraction).filter(
        models.Attraction.name.ilike(query) |
        models.Attraction.tags.ilike(query) |
        models.Attraction.description.ilike(query)
    ).all()

    for p in places:
        folder_path = os.path.join("datasets", "project_imgfold", "project_images", p.name)
        images = []
        if os.path.exists(folder_path):
            for f in os.listdir(folder_path):
                if f.lower().endswith((".jpg", ".png", ".jpeg")):
                    images.append(f"datasets/project_imgfold/project_images/{p.name}/{f}")

        results.append({
            "name": p.name,
            "description": p.description,
            "location": getattr(p, "location", ""),
            "tags": getattr(p, "tags", ""),
            "images": images
        })

    # Fallback: first-letter suggestions
    if not results:
        first_letter = q[0].lower()
        all_places = db.query(models.Hotel).all() + db.query(models.Restaurant).all() + db.query(models.Attraction).all()
        for p in all_places:
            if p.name.lower().startswith(first_letter):
                folder_path = os.path.join("datasets", "project_imgfold", "project_images", p.name)
                images = []
                if os.path.exists(folder_path):
                    for f in os.listdir(folder_path):
                        if f.lower().endswith((".jpg", ".png", ".jpeg")):
                            images.append(f"datasets/project_imgfold/project_images/{p.name}/{f}")
                results.append({
                    "name": p.name,
                    "description": p.description,
                    "location": getattr(p, "location", ""),
                    "tags": getattr(p, "tags", ""),
                    "images": images
                })

    db.close()
    return {"results": results}
