# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routes import users, rooms

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Tourism Recommendation System Backend")

# CORS setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully!"}

# Include routers
app.include_router(users.router)
app.include_router(rooms.router)
