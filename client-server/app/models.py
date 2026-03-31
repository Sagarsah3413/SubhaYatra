"""
Models — Tourism Recommendation System
Two combined tables replace the old split approach:
  users       : Clerk profile + session tracking + login/logout history (JSON)
  admins      : Admin profile + session tracking + action log (JSON)
"""

import json
from datetime import datetime
from .database import db


# ─────────────────────────────────────────────
# MIXINS
# ─────────────────────────────────────────────

class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

class ModerationMixin:
    """status: pending|approved|rejected  source: dataset|user_submission"""
    status = db.Column(db.String(20), default='approved', nullable=False)
    source = db.Column(db.String(20), default='dataset',  nullable=False)

class UserTrackMixin:
    """Clerk user who created/submitted this record."""
    clerk_id  = db.Column(db.String(128), nullable=True, index=True)
    user_name = db.Column(db.String(128), nullable=True)


# ─────────────────────────────────────────────
# USER  (one table — profile + sessions + history)
# ─────────────────────────────────────────────

class User(TimestampMixin, db.Model):
    """
    Everything about a user in one table.
    Clerk profile fields + current session info + full session history as JSON.
    session_history JSON schema (last 50 kept):
      [{ login_at, logout_at, duration_seconds, ip, user_agent }, ...]
    """
    __tablename__ = 'users'

    # Clerk profile
    id          = db.Column(db.Integer, primary_key=True)
    clerk_id    = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email       = db.Column(db.String(255), unique=True, nullable=False)
    name        = db.Column(db.String(255), nullable=True)
    avatar_url  = db.Column(db.String(512), nullable=True)
    role        = db.Column(db.String(20),  default='user', nullable=False)
    is_active   = db.Column(db.Boolean,     default=True,   nullable=False)
    # Session tracking
    last_login      = db.Column(db.DateTime,    nullable=True)
    last_logout     = db.Column(db.DateTime,    nullable=True)
    last_seen       = db.Column(db.DateTime,    nullable=True)
    last_ip         = db.Column(db.String(64),  nullable=True)
    last_user_agent = db.Column(db.String(512), nullable=True)
    total_logins    = db.Column(db.Integer, default=0, nullable=False)
    # Full history — JSON array, capped at 50 entries
    session_history = db.Column(db.Text, nullable=True)

    # ── helpers ──────────────────────────────────────────────────────────────

    def get_session_history(self):
        return json.loads(self.session_history) if self.session_history else []

    def record_login(self, ip=None, ua=None):
        now = datetime.utcnow()
        self.last_login     = now
        self.last_seen      = now
        self.last_ip        = ip
        self.last_user_agent= (ua or '')[:512]
        self.total_logins   = (self.total_logins or 0) + 1
        history = self.get_session_history()
        history.append({
            'login_at': now.isoformat(), 'logout_at': None,
            'duration_seconds': None, 'ip': ip,
            'user_agent': (ua or '')[:120],
        })
        self.session_history = json.dumps(history[-50:])

    def record_logout(self):
        now = datetime.utcnow()
        self.last_logout = now
        self.last_seen   = now
        history = self.get_session_history()
        for entry in reversed(history):
            if entry.get('logout_at') is None and entry.get('login_at'):
                entry['logout_at'] = now.isoformat()
                try:
                    login_dt = datetime.fromisoformat(entry['login_at'])
                    entry['duration_seconds'] = int((now - login_dt).total_seconds())
                except Exception:
                    pass
                break
        self.session_history = json.dumps(history)

    def to_dict(self):
        return {
            'id': self.id, 'clerk_id': self.clerk_id,
            'email': self.email, 'name': self.name,
            'avatar_url': self.avatar_url, 'role': self.role,
            'is_active': self.is_active,
            'last_login':  self.last_login.isoformat()  if self.last_login  else None,
            'last_logout': self.last_logout.isoformat() if self.last_logout else None,
            'last_seen':   self.last_seen.isoformat()   if self.last_seen   else None,
            'last_ip': self.last_ip, 'total_logins': self.total_logins,
            'created_at': self.created_at.isoformat(),
        }

    def to_admin_dict(self):
        return {**self.to_dict(),
                'session_history': self.get_session_history(),
                'activity': {}}  # activity counts filled by admin route


# ─────────────────────────────────────────────
# ADMIN  (one table — profile + sessions + action log)
# ─────────────────────────────────────────────

class Admin(TimestampMixin, db.Model):
    """
    Everything about an admin in one table.
    Profile + session tracking + full action audit log as JSON.
    session_history JSON: [{ login_at, logout_at, duration_seconds, ip }, ...]
    action_log JSON (last 100): [{ at, action, target_type, target_id, notes }, ...]
    """
    __tablename__ = 'admins'

    # Profile
    id          = db.Column(db.Integer, primary_key=True)
    username    = db.Column(db.String(100), unique=True, nullable=False)
    password    = db.Column(db.String(255), nullable=False)
    email       = db.Column(db.String(255), unique=True, nullable=True)
    role        = db.Column(db.String(20),  default='moderator', nullable=False)
    is_active   = db.Column(db.Boolean,     default=True, nullable=False)
    # Session tracking
    last_login      = db.Column(db.DateTime,    nullable=True)
    last_logout     = db.Column(db.DateTime,    nullable=True)
    last_ip         = db.Column(db.String(64),  nullable=True)
    total_logins    = db.Column(db.Integer, default=0, nullable=False)
    session_history = db.Column(db.Text, nullable=True)  # JSON, last 50
    # Action audit log
    action_log      = db.Column(db.Text, nullable=True)  # JSON, last 100

    # ── helpers ──────────────────────────────────────────────────────────────

    def get_session_history(self):
        return json.loads(self.session_history) if self.session_history else []

    def get_action_log(self):
        return json.loads(self.action_log) if self.action_log else []

    def record_login(self, ip=None, ua=None):
        now = datetime.utcnow()
        self.last_login  = now
        self.last_ip     = ip
        self.total_logins = (self.total_logins or 0) + 1
        history = self.get_session_history()
        history.append({
            'login_at': now.isoformat(), 'logout_at': None,
            'duration_seconds': None, 'ip': ip,
            'user_agent': (ua or '')[:120],
        })
        self.session_history = json.dumps(history[-50:])

    def record_logout(self):
        now = datetime.utcnow()
        self.last_logout = now
        history = self.get_session_history()
        for entry in reversed(history):
            if entry.get('logout_at') is None and entry.get('login_at'):
                entry['logout_at'] = now.isoformat()
                try:
                    login_dt = datetime.fromisoformat(entry['login_at'])
                    entry['duration_seconds'] = int((now - login_dt).total_seconds())
                except Exception:
                    pass
                break
        self.session_history = json.dumps(history)

    def log_action(self, action, target_type=None, target_id=None, notes=None):
        """Append one action to the audit log."""
        log = self.get_action_log()
        log.append({
            'at': datetime.utcnow().isoformat(),
            'action': action, 'target_type': target_type,
            'target_id': target_id, 'notes': notes,
        })
        self.action_log = json.dumps(log[-100:])

    def to_dict(self):
        return {
            'id': self.id, 'username': self.username,
            'email': self.email, 'role': self.role,
            'is_active': self.is_active,
            'last_login':  self.last_login.isoformat()  if self.last_login  else None,
            'last_logout': self.last_logout.isoformat() if self.last_logout else None,
            'last_ip': self.last_ip, 'total_logins': self.total_logins,
            'created_at': self.created_at.isoformat(),
        }

    def to_full_dict(self):
        return {**self.to_dict(),
                'session_history': self.get_session_history(),
                'action_log':      self.get_action_log()}


# ─────────────────────────────────────────────
# CORE TOURISM CONTENT
# ─────────────────────────────────────────────

class Place(TimestampMixin, ModerationMixin, UserTrackMixin, db.Model):
    __tablename__ = 'places'
    id               = db.Column(db.Integer, primary_key=True)
    name             = db.Column(db.String(255), nullable=False)
    location         = db.Column(db.String(255), nullable=True)
    province         = db.Column(db.String(100), nullable=True)
    type             = db.Column(db.String(100), nullable=True)
    description      = db.Column(db.Text,        nullable=True)
    tags             = db.Column(db.String(512),  nullable=True)
    image_url        = db.Column(db.String(512),  nullable=True)
    all_images       = db.Column(db.Text,         nullable=True)
    latitude         = db.Column(db.Float, nullable=True)
    longitude        = db.Column(db.Float, nullable=True)
    best_season      = db.Column(db.String(100), nullable=True)
    activities       = db.Column(db.Text,        nullable=True)
    difficulty_level = db.Column(db.String(50),  nullable=True)
    accessibility    = db.Column(db.Text,        nullable=True)
    transportation   = db.Column(db.Text,        nullable=True)
    rating           = db.Column(db.Float,       nullable=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'location': self.location,
            'province': self.province, 'type': self.type,
            'description': self.description, 'tags': self.tags,
            'image_url': self.image_url,
            'all_images': json.loads(self.all_images) if self.all_images else [],
            'latitude': self.latitude, 'longitude': self.longitude,
            'best_season': self.best_season, 'activities': self.activities,
            'difficulty_level': self.difficulty_level,
            'accessibility': self.accessibility, 'transportation': self.transportation,
            'rating': self.rating, 'status': self.status, 'source': self.source,
            'submitted_by': self.clerk_id, 'created_at': self.created_at.isoformat(),
        }


class Hotel(TimestampMixin, ModerationMixin, UserTrackMixin, db.Model):
    __tablename__ = 'hotels'
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    location    = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text,        nullable=True)
    tags        = db.Column(db.String(512),  nullable=True)
    image_url   = db.Column(db.String(512),  nullable=True)
    all_images  = db.Column(db.Text,         nullable=True)
    rating      = db.Column(db.Float,        nullable=True)
    price_range = db.Column(db.String(100),  nullable=True)
    place_id    = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True, index=True)
    place       = db.relationship('Place', backref='hotels', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'location': self.location,
            'description': self.description, 'tags': self.tags,
            'image_url': self.image_url,
            'all_images': json.loads(self.all_images) if self.all_images else [],
            'rating': self.rating, 'price_range': self.price_range,
            'place_id': self.place_id, 'status': self.status, 'source': self.source,
            'submitted_by': self.clerk_id, 'created_at': self.created_at.isoformat(),
        }


class Restaurant(TimestampMixin, ModerationMixin, UserTrackMixin, db.Model):
    __tablename__ = 'restaurants'
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    location    = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text,        nullable=True)
    tags        = db.Column(db.String(512),  nullable=True)
    image_url   = db.Column(db.String(512),  nullable=True)
    all_images  = db.Column(db.Text,         nullable=True)
    rating      = db.Column(db.Float,        nullable=True)
    price_range = db.Column(db.String(100),  nullable=True)
    cuisine     = db.Column(db.String(100),  nullable=True)
    place_id    = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True, index=True)
    place       = db.relationship('Place', backref='restaurants', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'location': self.location,
            'description': self.description, 'tags': self.tags,
            'image_url': self.image_url,
            'all_images': json.loads(self.all_images) if self.all_images else [],
            'rating': self.rating, 'price_range': self.price_range,
            'cuisine': self.cuisine, 'place_id': self.place_id,
            'status': self.status, 'source': self.source,
            'submitted_by': self.clerk_id, 'created_at': self.created_at.isoformat(),
        }


class Attraction(TimestampMixin, db.Model):
    __tablename__ = 'attractions'
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    location    = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text,        nullable=True)
    tags        = db.Column(db.String(512),  nullable=True)
    image_url   = db.Column(db.String(512),  nullable=True)
    all_images  = db.Column(db.Text,         nullable=True)
    rating      = db.Column(db.Float,        nullable=True)
    place_id    = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True, index=True)
    place       = db.relationship('Place', backref='attractions', lazy=True)


class Event(TimestampMixin, db.Model):
    __tablename__ = 'events'
    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(255), nullable=False)
    venue        = db.Column(db.String(255), nullable=True)
    month_season = db.Column(db.String(100), nullable=True)
    event_type   = db.Column(db.String(100), nullable=True)
    description  = db.Column(db.Text,        nullable=True)
    place_id     = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True, index=True)
    place        = db.relationship('Place', backref='events', lazy=True)


# ─────────────────────────────────────────────
# USER ACTIVITY TRACKING
# ─────────────────────────────────────────────

class PlaceView(db.Model):
    __tablename__ = 'place_views'
    id        = db.Column(db.Integer, primary_key=True)
    clerk_id  = db.Column(db.String(128), nullable=True, index=True)
    user_name = db.Column(db.String(128), nullable=True)
    place_id  = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False, index=True)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    place     = db.relationship('Place', backref='views', lazy=True)
class Wishlist(TimestampMixin, db.Model):
    __tablename__ = 'wishlists'
    id                = db.Column(db.Integer, primary_key=True)
    clerk_id          = db.Column(db.String(128), nullable=False, index=True)
    user_name         = db.Column(db.String(128), nullable=True)
    place_id          = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True)
    place_identifier  = db.Column(db.String(255), nullable=True)
    place_name        = db.Column(db.String(255), nullable=True)
    place_type        = db.Column(db.String(100), nullable=True)
    place_location    = db.Column(db.String(255), nullable=True)
    place_image_url   = db.Column(db.String(512), nullable=True)
    place_description = db.Column(db.Text,        nullable=True)
    place             = db.relationship('Place', backref='wishlisted_by', lazy=True)


# ─────────────────────────────────────────────
# REVIEWS
# ─────────────────────────────────────────────

class Review(TimestampMixin, UserTrackMixin, db.Model):
    __tablename__ = 'reviews'
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    email       = db.Column(db.String(255), nullable=False)
    place       = db.Column(db.String(255), nullable=False)
    place_id    = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True, index=True)
    visit_date  = db.Column(db.String(50),  nullable=True)
    type        = db.Column(db.String(50),  nullable=True)
    rating      = db.Column(db.Integer,     nullable=False)
    review      = db.Column(db.Text,        nullable=False)
    recommend   = db.Column(db.String(10),  default='yes')
    images      = db.Column(db.Text,        nullable=True)
    status      = db.Column(db.String(20),  default='pending', nullable=False)
    approved_at = db.Column(db.DateTime,    nullable=True)
    admin_notes = db.Column(db.Text,        nullable=True)
    db_place    = db.relationship('Place', backref='reviews', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'email': self.email,
            'place': self.place, 'place_id': self.place_id,
            'visit_date': self.visit_date, 'type': self.type,
            'rating': self.rating, 'review': self.review,
            'recommend': self.recommend,
            'images': json.loads(self.images) if self.images else [],
            'status': self.status, 'clerk_id': self.clerk_id,
            'user_name': self.user_name,
            'created_at': self.created_at.isoformat(),
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'admin_notes': self.admin_notes,
        }
class Recommendation(TimestampMixin, db.Model):
    __tablename__ = 'recommendations'
    id                 = db.Column(db.Integer, primary_key=True)
    clerk_id           = db.Column(db.String(128), nullable=False, index=True)
    user_name          = db.Column(db.String(255), nullable=False)
    age                = db.Column(db.Integer,     nullable=False)
    phone              = db.Column(db.String(20),  nullable=False)
    travellers         = db.Column(db.Integer,     nullable=False)
    trip_duration      = db.Column(db.String(20),  nullable=False)
    trip_type          = db.Column(db.String(255), nullable=False)
    travel_month       = db.Column(db.String(50),  nullable=True)
    recommended_places = db.Column(db.Text,        nullable=True)


# ─────────────────────────────────────────────
# ITINERARY
# ─────────────────────────────────────────────

class Itinerary(TimestampMixin, db.Model):
    __tablename__ = 'itineraries'
    id           = db.Column(db.Integer, primary_key=True)
    clerk_id     = db.Column(db.String(128), nullable=False, index=True)
    user_name    = db.Column(db.String(255), nullable=True)
    title        = db.Column(db.String(255), nullable=False)
    description  = db.Column(db.Text,        nullable=True)
    start_date   = db.Column(db.DateTime,    nullable=True)
    end_date     = db.Column(db.DateTime,    nullable=True)
    is_public    = db.Column(db.Boolean,     default=False)
    total_budget = db.Column(db.String(50),  nullable=True)
    items        = db.relationship('ItineraryItem', backref='itinerary',
                                   lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id, 'clerk_id': self.clerk_id, 'user_name': self.user_name,
            'title': self.title, 'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date':   self.end_date.isoformat()   if self.end_date   else None,
            'is_public': self.is_public, 'total_budget': self.total_budget,
            'items': [i.to_dict() for i in self.items],
            'created_at': self.created_at.isoformat(),
        }


class ItineraryItem(db.Model):
    __tablename__ = 'itinerary_items'
    id           = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False, index=True)
    day_number   = db.Column(db.Integer, nullable=False)
    place_id     = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=True)
    place_name   = db.Column(db.String(255), nullable=True)
    activity     = db.Column(db.String(512), nullable=True)
    notes        = db.Column(db.Text,        nullable=True)
    order_index  = db.Column(db.Integer,     default=0)
    place        = db.relationship('Place', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'day_number': self.day_number,
            'place_id': self.place_id, 'place_name': self.place_name,
            'activity': self.activity, 'notes': self.notes,
            'order_index': self.order_index,
        }


# ─────────────────────────────────────────────
# NEWSLETTER
# ─────────────────────────────────────────────

class Newsletter(TimestampMixin, db.Model):
    __tablename__ = 'newsletter_subscribers'
    id          = db.Column(db.Integer, primary_key=True)
    email       = db.Column(db.String(255), unique=True, nullable=False)
    clerk_id    = db.Column(db.String(128), nullable=True, index=True)
    is_active   = db.Column(db.Boolean, default=True, nullable=False)
    preferences = db.Column(db.String(255), default='general')


# ─────────────────────────────────────────────
# CHAT
# ─────────────────────────────────────────────

class Chat(TimestampMixin, db.Model):
    __tablename__ = 'chats'
    id        = db.Column(db.Integer, primary_key=True)
    clerk_id  = db.Column(db.String(128), nullable=False, index=True)
    user_name = db.Column(db.String(255), nullable=True)
    title     = db.Column(db.String(255), default='New Chat')
    is_active = db.Column(db.Boolean,     default=True)
    messages  = db.relationship('Message', backref='chat',
                                lazy=True, cascade='all, delete-orphan')


class Message(TimestampMixin, db.Model):
    __tablename__ = 'messages'
    id      = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.id'), nullable=False, index=True)
    sender  = db.Column(db.String(10), nullable=False)
    content = db.Column(db.Text,       nullable=False)


class SearchHistory(TimestampMixin, db.Model):
    __tablename__ = 'search_history'
    id               = db.Column(db.Integer, primary_key=True)
    clerk_id         = db.Column(db.String(128), nullable=True, index=True)
    user_name        = db.Column(db.String(255), nullable=True)
    chat_id          = db.Column(db.Integer, db.ForeignKey('chats.id'), nullable=True)
    query            = db.Column(db.String(512), nullable=False)
    query_type       = db.Column(db.String(50),  default='general')
    response_summary = db.Column(db.Text,        nullable=True)
    is_favorite      = db.Column(db.Boolean,     default=False)
