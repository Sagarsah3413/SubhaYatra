from sqlalchemy import Column, Integer, String, Text
from datetime import datetime
from .database import Base, db

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
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    chat = db.relationship("Chat", backref="messages")
