# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.hash import bcrypt

# User CRUD
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        mobile=user.mobile,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session):
    return db.query(models.User).all()

# Room CRUD
def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(
        name=room.name,
        description=room.description,
        price=room.price,
        image=room.image
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_rooms(db: Session):
    return db.query(models.Room).all()
