from sqlalchemy import Column, Integer, String, Text
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


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)


class Attraction(Base):
    __tablename__ = "attractions"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    type = Column(String)
    description = Column(Text)
    tags = Column(String)
    image_url = Column(String)
    created_at = Column(String, default=str(datetime.utcnow()))


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
    place_id = Column(Integer, ForeignKey('places.id'), nullable=False)
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


class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    sender = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
