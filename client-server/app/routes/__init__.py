"""
Routes package for Tourism Recommendation System
"""

# Import all blueprints for easy access
from .search import search_blueprint
from .users import users_blueprint
from .rooms import rooms_blueprint
from .chat_routes import chat_bp
from .admin import admin_bp
from .places import places_bp

__all__ = [
    'search_blueprint',
    'users_blueprint', 
    'rooms_blueprint',
    'chat_bp',
    'admin_bp',
    'places_bp'
]