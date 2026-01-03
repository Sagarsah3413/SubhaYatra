from sqlalchemy.orm import Session
from . import models

# ------------------ USER CRUD ------------------

def create_user(db: Session, user_data: dict):
    """Create a new user"""
    user = models.User(**user_data)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()

def get_all_users(db: Session):
    """Get all users"""
    return db.query(models.User).all()

# ------------------ ROOM CRUD ------------------

def create_room(db: Session, room_data: dict):
    """Create a new room"""
    room = models.Room(**room_data)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

def get_all_rooms(db: Session):
    """Get all rooms"""
    return db.query(models.Room).all()

# ------------------ GENERAL CRUD ------------------

def get_all_places(db: Session):
    """Get all places"""
    return db.query(models.Place).all()

def get_place_by_id(db: Session, place_id: int):
    """Get place by ID"""
    return db.query(models.Place).filter(models.Place.id == place_id).first()

def search_places(db: Session, query: str):
    """Search places by name or location"""
    return db.query(models.Place).filter(
        (models.Place.name.contains(query)) | 
        (models.Place.location.contains(query))
    ).all()


# ------------------ WISHLIST CRUD ------------------

def add_to_wishlist(db: Session, user_id: str, place_id: int):
    """Add place to user's wishlist"""
    # Check if already in wishlist
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id == place_id
    ).first()
    
    if existing:
        return existing
    
    wishlist_item = models.Wishlist(user_id=user_id, place_id=place_id)
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    return wishlist_item

def remove_from_wishlist(db: Session, user_id: str, place_id: int):
    """Remove place from user's wishlist"""
    wishlist_item = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id == place_id
    ).first()
    
    if wishlist_item:
        db.delete(wishlist_item)
        db.commit()
        return True
    return False

def get_user_wishlist(db: Session, user_id: str):
    """Get all places in user's wishlist with place details"""
    return db.query(models.Wishlist, models.Place).join(
        models.Place, models.Wishlist.place_id == models.Place.id
    ).filter(models.Wishlist.user_id == user_id).all()

def is_in_wishlist(db: Session, user_id: str, place_id: int):
    """Check if place is in user's wishlist"""
    return db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id == place_id
    ).first() is not None
