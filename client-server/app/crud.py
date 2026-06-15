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
    """Add place to user's wishlist (for database places with numeric ID)"""
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

def add_to_wishlist_with_data(db: Session, user_id: str, place_identifier: str, 
                               name: str, place_type: str, location: str, 
                               image_url: str, description: str):
    """Add place to user's wishlist with full data (for places without database ID)"""
    # Check if already in wishlist
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_identifier == place_identifier
    ).first()
    
    if existing:
        return existing
    
    wishlist_item = models.Wishlist(
        user_id=user_id,
        place_identifier=place_identifier,
        place_name=name,
        place_type=place_type,
        place_location=location,
        place_image_url=image_url,
        place_description=description
    )
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    return wishlist_item

def remove_from_wishlist(db: Session, user_id: str, place_id: int):
    """Remove place from user's wishlist (for database places with numeric ID)"""
    wishlist_item = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id == place_id
    ).first()
    
    if wishlist_item:
        db.delete(wishlist_item)
        db.commit()
        return True
    return False

def remove_from_wishlist_by_identifier(db: Session, user_id: str, place_identifier: str):
    """Remove place from user's wishlist by string identifier"""
    wishlist_item = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_identifier == place_identifier
    ).first()
    
    if wishlist_item:
        db.delete(wishlist_item)
        db.commit()
        return True
    return False

def get_user_wishlist(db: Session, user_id: str):
    """Get all places in user's wishlist with place details"""
    # Get wishlist items with database places
    db_places = db.query(models.Wishlist, models.Place).join(
        models.Place, models.Wishlist.place_id == models.Place.id
    ).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id.isnot(None)
    ).all()
    
    # Get wishlist items with string identifiers (no database place)
    identifier_places = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_identifier.isnot(None)
    ).all()
    
    # Combine both types
    result = []
    
    # Add database places
    for wishlist_item, place in db_places:
        result.append((wishlist_item, place))
    
    # Add identifier places (create pseudo-place objects)
    for wishlist_item in identifier_places:
        # Create a pseudo-place object from stored data
        pseudo_place = type('obj', (object,), {
            'id': None,
            'name': wishlist_item.place_name,
            'location': wishlist_item.place_location,
            'type': wishlist_item.place_type,
            'description': wishlist_item.place_description,
            'image_url': wishlist_item.place_image_url,
            'tags': ''
        })()
        result.append((wishlist_item, pseudo_place))
    
    return result

def is_in_wishlist(db: Session, user_id: str, place_id: int):
    """Check if place is in user's wishlist (for database places with numeric ID)"""
    return db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_id == place_id
    ).first() is not None

def is_in_wishlist_by_identifier(db: Session, user_id: str, place_identifier: str):
    """Check if place is in user's wishlist by string identifier"""
    return db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.place_identifier == place_identifier
    ).first() is not None


# ------------------ NEWSLETTER CRUD ------------------

def subscribe_to_newsletter(db: Session, email: str, preferences: str = "general"):
    """Subscribe email to newsletter"""
    # Check if already subscribed
    existing = db.query(models.Newsletter).filter(models.Newsletter.email == email).first()
    
    if existing:
        if existing.is_active == 0:
            # Reactivate subscription
            existing.is_active = 1
            existing.preferences = preferences
            db.commit()
            db.refresh(existing)
            return existing
        else:
            return existing  # Already subscribed
    
    # Create new subscription
    newsletter_sub = models.Newsletter(email=email, preferences=preferences)
    db.add(newsletter_sub)
    db.commit()
    db.refresh(newsletter_sub)
    return newsletter_sub

def unsubscribe_from_newsletter(db: Session, email: str):
    """Unsubscribe email from newsletter"""
    subscriber = db.query(models.Newsletter).filter(models.Newsletter.email == email).first()
    
    if subscriber:
        subscriber.is_active = 0
        db.commit()
        return True
    return False

def get_newsletter_subscribers(db: Session, active_only: bool = True):
    """Get all newsletter subscribers"""
    query = db.query(models.Newsletter)
    if active_only:
        query = query.filter(models.Newsletter.is_active == 1)
    return query.all()

def get_subscriber_by_email(db: Session, email: str):
    """Get newsletter subscriber by email"""
    return db.query(models.Newsletter).filter(models.Newsletter.email == email).first()
