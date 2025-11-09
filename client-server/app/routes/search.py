from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, database

router = APIRouter(prefix="/search", tags=["Search"])

# 🧭 Full Search Endpoint
@router.get("")
def search_all(q: str = Query(..., min_length=1), db: Session = Depends(database.SessionLocal)):
    q_like = f"%{q.lower()}%"

    hotels = db.query(models.Hotel).filter(
        func.lower(models.Hotel.name).like(q_like) |
        func.lower(models.Hotel.description).like(q_like) |
        func.lower(models.Hotel.tags).like(q_like)
    ).all()

    restaurants = db.query(models.Restaurant).filter(
        func.lower(models.Restaurant.name).like(q_like) |
        func.lower(models.Restaurant.description).like(q_like) |
        func.lower(models.Restaurant.tags).like(q_like)
    ).all()

    attractions = db.query(models.Attraction).filter(
        func.lower(models.Attraction.name).like(q_like) |
        func.lower(models.Attraction.description).like(q_like) |
        func.lower(models.Attraction.tags).like(q_like)
    ).all()

    results = []
    for h in hotels:
        results.append({"category": "Hotel", "name": h.name, "location": h.location, "description": h.description})
    for r in restaurants:
        results.append({"category": "Restaurant", "name": r.name, "location": r.location, "description": r.description})
    for a in attractions:
        results.append({"category": "Attraction", "name": a.name, "location": a.location, "description": a.description})

    return results


# 💡 Autocomplete Suggestions
@router.get("/suggestions")
def search_suggestions(q: str = Query(..., min_length=1), db: Session = Depends(database.SessionLocal)):
    q_like = f"%{q.lower()}%"
    results = []

    hotel_names = db.query(models.Hotel.name).filter(func.lower(models.Hotel.name).like(q_like)).limit(5).all()
    restaurant_names = db.query(models.Restaurant.name).filter(func.lower(models.Restaurant.name).like(q_like)).limit(5).all()
    attraction_names = db.query(models.Attraction.name).filter(func.lower(models.Attraction.name).like(q_like)).limit(5).all()

    results.extend([h[0] for h in hotel_names])
    results.extend([r[0] for r in restaurant_names])
    results.extend([a[0] for a in attraction_names])

    return list(dict.fromkeys(results))  # remove duplicates
