from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy

# -----------------------------
# SQLAlchemy setup
# -----------------------------
engine = create_engine("sqlite:///./tourism.db", connect_args={"check_same_thread": False})
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
