# app/crud.py
from passlib.hash import bcrypt

def create_user(db, user):
    hashed_password = bcrypt.hash(user['password'])
    from .models import User  # Only import models when needed
    db_user = User(
        username=user['username'],
        email=user['email'],
        mobile=user['mobile'],
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db, email):
    from .models import User
    return db.query(User).filter(User.email == email).first()

def get_users(db):
    from .models import User
    return db.query(User).all()

def create_room(db, room):
    from .models import Room
    db_room = Room(
        name=room['name'],
        description=room['description'],
        price=room['price'],
        image=room['image']
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_rooms(db):
    from .models import Room
    return db.query(Room).all()
