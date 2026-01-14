from flask import Blueprint, jsonify
from ..database import SessionLocal
from ..models import Hotel

hotels_bp = Blueprint('hotels', __name__)

@hotels_bp.route('/hotels', methods=['GET'])
def list_hotels():
    """Get all hotels from the database"""
    session = SessionLocal()
    try:
        hotels = session.query(Hotel).all()
        out = []
        for hotel in hotels:
            out.append({
                'id': hotel.id,
                'name': hotel.name,
                'location': hotel.location,
                'description': hotel.description,
                'tags': hotel.tags,
                'image_url': hotel.image_url
            })
        return jsonify(out)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@hotels_bp.route('/hotels/count', methods=['GET'])
def get_hotel_count():
    """Get total count of hotels"""
    session = SessionLocal()
    try:
        count = session.query(Hotel).count()
        return jsonify({'count': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()