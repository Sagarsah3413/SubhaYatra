"""
Database configuration — single Flask-SQLAlchemy instance.
All models use db.Model; no dual-ORM setup.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    """
    Bind db to the Flask app and create all tables.
    Call once inside create_app().
    """
    db.init_app(app)
    with app.app_context():
        # Import models so SQLAlchemy registers them before create_all
        from . import models  # noqa: F401
        db.create_all()
        print("✅ Database initialized — all tables created.")


def get_db():
    """
    Yield a scoped session for use in route handlers.
    Usage:
        session = get_db()
        try:
            ...
        finally:
            session.close()
    """
    return db.session
