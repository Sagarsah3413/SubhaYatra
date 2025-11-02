# app/routes/rooms.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud, database

router = APIRouter(prefix="/rooms", tags=["Rooms"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.RoomResponse)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    return crud.create_room(db, room)

@router.get("/", response_model=list[schemas.RoomResponse])
def read_rooms(db: Session = Depends(get_db)):
    return crud.get_rooms(db)
