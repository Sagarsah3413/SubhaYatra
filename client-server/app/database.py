from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

DATABASE_URL = "sqlite:///./tourism.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ❌ Disable auto table creation
def init_db():
    pass

# ============================
# Models for admin analytics
# ============================

class UserActivity(Base):
    __tablename__ = "user_activity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    event = Column(String, nullable=False)  # e.g., "login" or "logout"
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


