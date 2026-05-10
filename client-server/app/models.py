from sqlalchemy import Column, Integer, String, Text, Float
from datetime import datetime
from .database import Base, db
from sqlalchemy import ForeignKey, DateTime

# ------------------ SQLAlchemy MODELS ------------------

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)
    rating = Column(Float)
    price_range = Column(String)  # budget, mid-range, luxury
    place_id = Column(Integer, ForeignKey('places.id'))
    all_images = Column(Text)  # JSON string of all image paths
    source = Column(String, default='dataset')  # 'dataset' or 'user_submission'
    status = Column(String, default='approved')  # 'pending', 'approved', 'rejected'


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)
    rating = Column(Float)
    price_range = Column(String)  # budget, mid-range, luxury
    cuisine = Column(String)  # Cuisine type (e.g., Nepali, Indian, Chinese)
    place_id = Column(Integer, ForeignKey('places.id'))
    all_images = Column(Text)  # JSON string of all image paths
    source = Column(String, default='dataset')  # 'dataset' or 'user_submission'
    status = Column(String, default='approved')  # 'pending', 'approved', 'rejected'


class Attraction(Base):
    __tablename__ = "attractions"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)
    rating = Column(Float)
    place_id = Column(Integer, ForeignKey('places.id'))
    all_images = Column(Text)  # JSON string of all image paths


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    venue = Column(String)
    month_season = Column(String)
    event_type = Column(String)
    description = Column(Text)
    place_id = Column(Integer, ForeignKey('places.id'))


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    type = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    best_season = Column(String)
    activities = Column(Text)
    difficulty_level = Column(String)
    accessibility = Column(Text)
    transportation = Column(Text)
    province = Column(String)
    rating = Column(Float)  # Added to match dataset
    all_images = Column(Text)  # JSON string of all image paths
    created_at = Column(String, default=str(datetime.utcnow()))
    status = Column(String, default='approved')  # 'pending', 'approved', 'rejected'
    source = Column(String, default='dataset')  # 'dataset' or 'user_submission'


# ------------------ ADMIN MODEL ------------------

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


# ------------------ BOOKING MODEL ------------------

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    user_name = Column(String)
    user_email = Column(String)
    place_name = Column(String, nullable=False)
    place_location = Column(String)
    booking_date = Column(DateTime, default=datetime.utcnow)
    travel_date = Column(DateTime)
    number_of_people = Column(Integer, default=1)
    total_price = Column(String)
    status = Column(String, default="confirmed")  # confirmed, cancelled, completed
    special_requests = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# ------------------ WISHLIST MODEL ------------------

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    place_id = Column(Integer, ForeignKey('places.id'), nullable=True)  # Nullable for string identifiers
    place_identifier = Column(String, nullable=True)  # For places without database ID
    place_name = Column(String, nullable=True)  # Store place name directly
    place_type = Column(String, nullable=True)  # Store place type
    place_location = Column(String, nullable=True)  # Store location
    place_image_url = Column(String, nullable=True)  # Store image URL
    place_description = Column(Text, nullable=True)  # Store description
    created_at = Column(DateTime, default=datetime.utcnow)


# ------------------ NEWSLETTER MODEL ------------------

class Newsletter(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for unsubscribed
    preferences = Column(String, default="general")  # travel tips, deals, news, etc.


# ------------------ FLASK-SQLALCHEMY MODELS ------------------

class Chat(db.Model):
    __tablename__ = "chat"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    title = db.Column(db.String, default="New Chat")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)


class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    sender = db.Column(db.String, nullable=False)  # 'user' or 'bot'
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SearchHistory(db.Model):
    __tablename__ = "search_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=True)
    query = db.Column(db.String, nullable=False)
    query_type = db.Column(db.String, default="general")  # general, place, hotel, restaurant, etc.
    response_summary = db.Column(db.Text)  # Brief summary of the AI response
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False)


# ------------------ RECOMMENDATION MODEL ------------------

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)
    travellers = Column(Integer, nullable=False)
    trip_duration = Column(String, nullable=False)  # 1-3, 4-7, 8-14, 15+
    trip_type = Column(String, nullable=False)  # Natural, Trekking, Cultural, Village, Urban
    travel_month = Column(String, nullable=True)  # Preferred travel month
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Recommended places (stored as JSON string)
    recommended_places = Column(Text)  # JSON array of place IDs


# ------------------ REVIEW MODEL ------------------

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    place = Column(String, nullable=False)
    visit_date = Column(String)
    type = Column(String, nullable=False)  # Nature, Cultural, Adventure, City, Relaxation
    rating = Column(Integer, nullable=False)  # 1-5
    review = Column(Text, nullable=False)
    recommend = Column(String, default="yes")  # yes or no
    images = Column(Text)  # JSON string of image paths
    status = Column(String, default="pending")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime)
    admin_notes = Column(Text)  # Admin can add notes about the review


# ─────────────────────────────────────────────
# USER SYNC (Clerk)
# ─────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"
    id          = db.Column(db.Integer, primary_key=True)
    clerk_id    = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email       = db.Column(db.String(255), unique=True, nullable=False)
    name        = db.Column(db.String(255), nullable=True)
    avatar_url  = db.Column(db.String(512), nullable=True)
    role        = db.Column(db.String(20),  default="user")
    is_active   = db.Column(db.Boolean,     default=True)
    last_login  = db.Column(db.DateTime,    nullable=True)
    last_logout = db.Column(db.DateTime,    nullable=True)
    last_seen   = db.Column(db.DateTime,    nullable=True)
    last_ip     = db.Column(db.String(64),  nullable=True)
    last_user_agent = db.Column(db.String(512), nullable=True)
    total_logins    = db.Column(db.Integer, default=0)
    session_history = db.Column(db.Text,    nullable=True)
    created_at  = db.Column(db.DateTime,    default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime,    default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_session_history(self):
        import json
        return json.loads(self.session_history) if self.session_history else []

    def record_login(self, ip=None, ua=None):
        import json
        now = datetime.utcnow()
        self.last_login = now; self.last_seen = now; self.last_ip = ip
        self.last_user_agent = (ua or "")[:512]
        self.total_logins = (self.total_logins or 0) + 1
        h = self.get_session_history()
        h.append({"login_at": now.isoformat(), "logout_at": None,
                  "duration_seconds": None, "ip": ip, "user_agent": (ua or "")[:120]})
        self.session_history = json.dumps(h[-50:])

    def to_dict(self):
        return {
            "id": self.id, "clerk_id": self.clerk_id, "email": self.email,
            "name": self.name, "avatar_url": self.avatar_url, "role": self.role,
            "is_active": self.is_active, "total_logins": self.total_logins,
            "last_login":  self.last_login.isoformat()  if self.last_login  else None,
            "last_logout": self.last_logout.isoformat() if self.last_logout else None,
            "last_seen":   self.last_seen.isoformat()   if self.last_seen   else None,
            "last_ip": self.last_ip,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def to_admin_dict(self):
        return {**self.to_dict(), "session_history": self.get_session_history(), "activity": {}}


class SearchLog(db.Model):
    __tablename__ = "search_logs"
    id           = db.Column(db.Integer, primary_key=True)
    clerk_id     = db.Column(db.String(128), nullable=True, index=True)
    user_name    = db.Column(db.String(255), nullable=True)
    query        = db.Column(db.String(512), nullable=False, index=True)
    category     = db.Column(db.String(50),  default="all")
    result_count = db.Column(db.Integer,     default=0)
    device       = db.Column(db.String(255), nullable=True)
    created_at   = db.Column(db.DateTime,    default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "clerk_id": self.clerk_id, "user_name": self.user_name,
            "query": self.query, "category": self.category,
            "result_count": self.result_count, "device": self.device,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class RecommendationLog(db.Model):
    __tablename__ = "recommendation_logs"
    id           = db.Column(db.Integer, primary_key=True)
    clerk_id     = db.Column(db.String(128), nullable=True, index=True)
    user_name    = db.Column(db.String(255), nullable=True)
    trip_type    = db.Column(db.String(255), nullable=True)
    travel_month = db.Column(db.String(50),  nullable=True)
    travellers   = db.Column(db.Integer,     nullable=True)
    duration     = db.Column(db.String(50),  nullable=True)
    places_shown = db.Column(db.Text,        nullable=True)
    created_at   = db.Column(db.DateTime,    default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id, "clerk_id": self.clerk_id, "user_name": self.user_name,
            "trip_type": self.trip_type, "travel_month": self.travel_month,
            "travellers": self.travellers, "duration": self.duration,
            "places_shown": json.loads(self.places_shown) if self.places_shown else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class ItineraryLog(db.Model):
    __tablename__ = "itinerary_logs"
    id            = db.Column(db.Integer, primary_key=True)
    clerk_id      = db.Column(db.String(128), nullable=True, index=True)
    user_name     = db.Column(db.String(255), nullable=True)
    destination   = db.Column(db.String(255), nullable=True)
    start_date    = db.Column(db.String(50),  nullable=True)
    end_date      = db.Column(db.String(50),  nullable=True)
    duration_days = db.Column(db.Integer,     nullable=True)
    budget        = db.Column(db.String(100), nullable=True)
    travellers    = db.Column(db.Integer,     nullable=True)
    trip_type     = db.Column(db.String(255), nullable=True)
    notes         = db.Column(db.Text,        nullable=True)
    places_json   = db.Column(db.Text,        nullable=True)
    created_at    = db.Column(db.DateTime,    default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id, "clerk_id": self.clerk_id, "user_name": self.user_name,
            "destination": self.destination, "start_date": self.start_date,
            "end_date": self.end_date, "duration_days": self.duration_days,
            "budget": self.budget, "travellers": self.travellers,
            "trip_type": self.trip_type, "notes": self.notes,
            "places": json.loads(self.places_json) if self.places_json else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─────────────────────────────────────────────
# SAVED ITINERARY
# ─────────────────────────────────────────────

class SavedItinerary(db.Model):
    __tablename__ = "saved_itineraries"
    id           = db.Column(db.Integer, primary_key=True)
    clerk_id     = db.Column(db.String(128), nullable=False, index=True)
    user_name    = db.Column(db.String(255), nullable=True)
    title        = db.Column(db.String(255), nullable=False)
    destinations = db.Column(db.String(512), nullable=True)   # comma-separated
    duration     = db.Column(db.String(50),  nullable=True)
    budget_level = db.Column(db.String(50),  nullable=True)
    total_cost   = db.Column(db.Integer,     nullable=True)
    start_date   = db.Column(db.String(50),  nullable=True)
    end_date     = db.Column(db.String(50),  nullable=True)
    notes        = db.Column(db.Text,        nullable=True)
    itinerary_json = db.Column(db.Text,      nullable=False)  # full JSON blob
    created_at   = db.Column(db.DateTime,    default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime,    default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id, "clerk_id": self.clerk_id, "user_name": self.user_name,
            "title": self.title, "destinations": self.destinations,
            "duration": self.duration, "budget_level": self.budget_level,
            "total_cost": self.total_cost, "start_date": self.start_date,
            "end_date": self.end_date, "notes": self.notes,
            "itinerary": json.loads(self.itinerary_json) if self.itinerary_json else {},
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_summary(self):
        return {
            "id": self.id, "clerk_id": self.clerk_id, "user_name": self.user_name,
            "title": self.title, "destinations": self.destinations,
            "duration": self.duration, "budget_level": self.budget_level,
            "total_cost": self.total_cost, "start_date": self.start_date,
            "end_date": self.end_date,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
