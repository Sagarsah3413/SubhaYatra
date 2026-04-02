"""Restaurants routes."""

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Restaurant
from ..auth import admin_required

restaurants_bp = Blueprint('restaurants', __name__)


@restaurants_bp.route('/restaurants', methods=['GET'])
def list_restaurants():
    page        = request.args.get('page', 1, type=int)
    limit       = request.args.get('limit', 20, type=int)
    price_range = request.args.get('price_range')
    min_rating  = request.args.get('min_rating', type=float)
    place_id    = request.args.get('place_id', type=int)
    search      = request.args.get('search')
    status      = request.args.get('status', 'approved')

    q = Restaurant.query
    if status != 'all':
        q = q.filter(Restaurant.status == status)
    if price_range:
        q = q.filter(Restaurant.price_range == price_range)
    if min_rating:
        q = q.filter(Restaurant.rating >= min_rating)
    if place_id:
        q = q.filter(Restaurant.place_id == place_id)
    if search:
        q = q.filter(Restaurant.name.ilike(f'%{search}%') |
                     Restaurant.location.ilike(f'%{search}%'))

    total       = q.count()
    restaurants = q.order_by(Restaurant.rating.desc().nullslast())\
                   .offset((page - 1) * limit).limit(limit).all()

    return jsonify({'restaurants': [r.to_dict() for r in restaurants],
                    'total': total, 'page': page, 'limit': limit,
                    'pages': (total + limit - 1) // limit})


@restaurants_bp.route('/restaurants/<int:rid>', methods=['GET'])
def get_restaurant(rid):
    r    = Restaurant.query.get_or_404(rid)
    data = r.to_dict()
    if r.place:
        data['place'] = {'id': r.place.id, 'name': r.place.name,
                         'location': r.place.location}
    return jsonify(data)


@restaurants_bp.route('/restaurants/featured', methods=['GET'])
def featured_restaurants():
    limit = request.args.get('limit', 6, type=int)
    rows  = Restaurant.query.filter(Restaurant.status == 'approved',
                                    Restaurant.rating.isnot(None))\
                            .order_by(Restaurant.rating.desc()).limit(limit).all()
    return jsonify([r.to_dict() for r in rows])


@restaurants_bp.route('/restaurants/count', methods=['GET'])
def restaurant_count():
    return jsonify({'count': Restaurant.query.count()})


@restaurants_bp.route('/restaurants/<int:rid>/approve', methods=['POST'])
@admin_required
def approve_restaurant(rid):
    r = Restaurant.query.get_or_404(rid)
    r.status = 'approved'
    db.session.commit()
    return jsonify({'success': True})


@restaurants_bp.route('/restaurants/<int:rid>/reject', methods=['POST'])
@admin_required
def reject_restaurant(rid):
    r = Restaurant.query.get_or_404(rid)
    r.status = 'rejected'
    db.session.commit()
    return jsonify({'success': True})


@restaurants_bp.route('/restaurants/<int:rid>', methods=['DELETE'])
@admin_required
def delete_restaurant(rid):
    r = Restaurant.query.get_or_404(rid)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'success': True})
