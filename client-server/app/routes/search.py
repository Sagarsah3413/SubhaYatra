from fastapi import APIRouter, Query
from sqlalchemy.orm import Session
from app import models, database

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("/")
def search_items(q: str = Query(..., min_length=1)):
    """
    Search hotels, restaurants, and attractions by name, tags, or description.
    Returns clean, deduplicated results for each category.
    """
    db: Session = database.SessionLocal()
    query = f"%{q}%"

    # Hotels
    hotels = db.query(models.Hotel).filter(
        models.Hotel.name.ilike(query) |
        models.Hotel.tags.ilike(query) |
        models.Hotel.description.ilike(query)
    ).all()
    hotels_list = list({h.name for h in hotels})  # remove duplicates

    # Restaurants
    restaurants = db.query(models.Restaurant).filter(
        models.Restaurant.name.ilike(query) |
        models.Restaurant.tags.ilike(query) |
        models.Restaurant.description.ilike(query)
    ).all()
    restaurants_list = list({r.name for r in restaurants})  # remove duplicates

    # Attractions
    attractions = db.query(models.Attraction).filter(
        models.Attraction.name.ilike(query) |
        models.Attraction.tags.ilike(query) |
        models.Attraction.description.ilike(query)
    ).all()
    attractions_list = list({a.name for a in attractions})  # remove duplicates

    return {
        "hotels": hotels_list,
        "restaurants": restaurants_list,
        "attractions": attractions_list,
    }
