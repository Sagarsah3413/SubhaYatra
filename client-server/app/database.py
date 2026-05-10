from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy

import os as _os
_DB_PATH = _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))), "tourism.db")

# -----------------------------
# SQLAlchemy setup
# -----------------------------
engine = create_engine(f"sqlite:///{_DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# -----------------------------
# Flask-SQLAlchemy setup
# -----------------------------
db = SQLAlchemy()

def init_db():
    """Initialize database with all models"""
    # Import all models to ensure they're registered with Base
    from . import models
    
    # Create all tables for SQLAlchemy models
    Base.metadata.create_all(bind=engine)
    
    print("✅ Database initialized successfully")

def init_flask_db(app):
    """Initialize Flask-SQLAlchemy tables (Chat, Message, SearchHistory, tracking tables)"""
    with app.app_context():
        # Ensure all db.Model subclasses are imported before create_all
        from . import models  # noqa — registers User, SearchLog, RecommendationLog, ItineraryLog
        db.create_all()
        print("✅ Flask-SQLAlchemy tables created successfully")
