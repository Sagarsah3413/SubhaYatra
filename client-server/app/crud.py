"""
Thin CRUD helpers used by routes.
All operations go through db.session (Flask-SQLAlchemy).
"""

from .database import db
from .models import User, Place, Wishlist, Newsletter


# ── Users ─────────────────────────────────────────────────────────────────────

def get_user_by_clerk_id(clerk_id: str):
    return User.query.filter_by(clerk_id=clerk_id).first()

def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()

def get_all_users():
    return User.query.all()


# ── Places ────────────────────────────────────────────────────────────────────

def get_all_places():
    return Place.query.filter_by(status='approved').all()

def get_place_by_id(place_id: int):
    return Place.query.get(place_id)

def search_places(query: str):
    return Place.query.filter(
        Place.name.ilike(f'%{query}%') | Place.location.ilike(f'%{query}%')
    ).all()


# ── Wishlist ──────────────────────────────────────────────────────────────────

def add_to_wishlist(clerk_id: str, place_id: int):
    existing = Wishlist.query.filter_by(clerk_id=clerk_id, place_id=place_id).first()
    if existing:
        return existing
    item = Wishlist(clerk_id=clerk_id, place_id=place_id)
    db.session.add(item)
    db.session.commit()
    return item

def remove_from_wishlist(clerk_id: str, place_id: int) -> bool:
    item = Wishlist.query.filter_by(clerk_id=clerk_id, place_id=place_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        return True
    return False

def is_in_wishlist(clerk_id: str, place_id: int) -> bool:
    return Wishlist.query.filter_by(clerk_id=clerk_id, place_id=place_id).first() is not None


# ── Newsletter ────────────────────────────────────────────────────────────────

def subscribe_to_newsletter(email: str, clerk_id: str = None, preferences: str = 'general'):
    sub = Newsletter.query.filter_by(email=email).first()
    if sub:
        sub.is_active   = True
        sub.preferences = preferences
        if clerk_id:
            sub.clerk_id = clerk_id
    else:
        sub = Newsletter(email=email, clerk_id=clerk_id, preferences=preferences)
        db.session.add(sub)
    db.session.commit()
    return sub

def unsubscribe_from_newsletter(email: str) -> bool:
    sub = Newsletter.query.filter_by(email=email).first()
    if sub:
        sub.is_active = False
        db.session.commit()
        return True
    return False
