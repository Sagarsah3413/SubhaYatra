# app/schemas.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    mobile: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    mobile: str

    class Config:
        orm_mode = True

class RoomCreate(BaseModel):
    name: str
    description: str
    price: float
    image: str

class RoomResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str

    class Config:
       from_attributes = True
