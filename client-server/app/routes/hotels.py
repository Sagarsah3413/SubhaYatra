"""Hotels routes."""

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Hotel
from ..auth import admin_required

hotels_bp = Blueprint('hotels', __name__)


@hotels_bp.route('/hotels', methods=['GET'])
def list_hotels():
    page        = request.args.get('page', 1, type=int)
    limit       = request.args.get('limit', 20, type=int)
    price_range = request.args.get('price_range')
    min_rating  = request.args.get('min_rating', type=float)
    place_id    = request.args.get('place_id', type=int)
    search      = request.args.get('search')
    status      = request.args.get('status', 'approved')

    q = Hotel.query
    if status != 'all':
        q = q.filter(Hotel.status == status)
    if price_range:
        q = q.filter(Hotel.price_range == price_range)
    if min_rating:
        q = q.filter(Hotel.rating >= min_rating)
    if place_id:
        q = q.filter(Hotel.place_id == place_id)
    if search:
        q = q.filter(Hotel.name.ilike(f'%{search}%') |
                     Hotel.location.ilike(f'%{search}%'))

    total  = q.count()
    hotels = q.order_by(Hotel.rating.desc().nullslast())\
               .offset((page - 1) * limit).limit(limit).all()

    return jsonify({'hotels': [h.to_dict() for h in hotels],
                    'total': total, 'page': page, 'limit': limit,
                    'pages': (total + limit - 1) // limit})


@hotels_bp.route('/hotels/<int:hid>', methods=['GET'])
def get_hotel(hid):
    hotel = Hotel.query.get_or_404(hid)
    data  = hotel.to_dict()
    if hotel.place:
        data['place'] = {'id': hotel.place.id, 'name': hotel.place.name,
                         'location': hotel.place.location}
    return jsonify(data)


@hotels_bp.route('/hotels/featured', methods=['GET'])
def featured_hotels():
    limit  = request.args.get('limit', 6, type=int)
    hotels = Hotel.query.filter(Hotel.status == 'approved', Hotel.rating.isnot(None))\
                        .order_by(Hotel.rating.desc()).limit(limit).all()
    return jsonify([h.to_dict() for h in hotels])


@hotels_bp.route('/hotels/count', methods=['GET'])
def hotel_count():
    return jsonify({'count': Hotel.query.count()})


@hotels_bp.route('/hotels/<int:hid>/approve', methods=['POST'])
@admin_required
def approve_hotel(hid):
    hotel = Hotel.query.get_or_404(hid)
    hotel.status = 'approved'
    db.session.commit()
    return jsonify({'success': True})


@hotels_bp.route('/hotels/<int:hid>/reject', methods=['POST'])
@admin_required
def reject_hotel(hid):
    hotel = Hotel.query.get_or_404(hid)
    hotel.status = 'rejected'
    db.session.commit()
    return jsonify({'success': True})


@hotels_bp.route('/hotels/<int:hid>', methods=['DELETE'])
@admin_required
def delete_hotel(hid):
    hotel = Hotel.query.get_or_404(hid)
    db.session.delete(hotel)
    db.session.commit()
    return jsonify({'success': True})
