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
    place_id = Column(Integer, ForeignKey('places.id'))
    all_images = Column(Text)  # JSON string of all image paths


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
