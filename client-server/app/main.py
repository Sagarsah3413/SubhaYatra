# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # <-- add this
from . import models, database
from .routes import search  # import your search router

# create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Tourism Recommendation System Backend")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve static images from datasets folder
app.mount("/datasets", StaticFiles(directory="datasets"), name="datasets")

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully!"}

# include routers
app.include_router(search.router)
# app.include_router(users.router)
# app.include_router(rooms.router)
