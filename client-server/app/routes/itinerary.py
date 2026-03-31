"""Itinerary routes — create, read, update, delete trip plans."""

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import Itinerary, ItineraryItem
from ..auth import token_required

itinerary_bp = Blueprint('itinerary', __name__)


def _own_or_admin(clerk_id):
    u = request.current_user
    return u['user_id'] == clerk_id or u['role'] == 'admin'


@itinerary_bp.route('/itineraries', methods=['GET'])
@token_required
def list_itineraries():
    clerk_id = request.current_user['user_id']
    items    = Itinerary.query.filter_by(clerk_id=clerk_id)\
                              .order_by(Itinerary.created_at.desc()).all()
    return jsonify([i.to_dict() for i in items])


@itinerary_bp.route('/itineraries', methods=['POST'])
@token_required
def create_itinerary():
    data      = request.get_json() or {}
    clerk_id  = request.current_user['user_id']
    user_name = request.headers.get('X-Clerk-User-Name')

    itin = Itinerary(
        clerk_id     = clerk_id,
        user_name    = user_name,
        title        = data.get('title', 'My Trip'),
        description  = data.get('description'),
        start_date   = data.get('start_date'),
        end_date     = data.get('end_date'),
        is_public    = data.get('is_public', False),
        total_budget = data.get('total_budget'),
    )
    db.session.add(itin)
    db.session.flush()  # get itin.id before adding items

    for item_data in data.get('items', []):
        item = ItineraryItem(
            itinerary_id = itin.id,
            day_number   = item_data.get('day_number', 1),
            place_id     = item_data.get('place_id'),
            place_name   = item_data.get('place_name'),
            activity     = item_data.get('activity'),
            notes        = item_data.get('notes'),
            order_index  = item_data.get('order_index', 0),
        )
        db.session.add(item)

    db.session.commit()
    return jsonify(itin.to_dict()), 201


@itinerary_bp.route('/itineraries/<int:iid>', methods=['GET'])
def get_itinerary(iid):
    itin = Itinerary.query.get_or_404(iid)
    # Public itineraries are viewable by anyone
    if not itin.is_public:
        # Require auth for private
        from ..auth import decode_token
        auth  = request.headers.get('Authorization', '')
        token = auth.split(' ')[1] if ' ' in auth else None
        payload = decode_token(token) if token else None
        if not payload or payload['user_id'] != itin.clerk_id:
            return jsonify({'error': 'Access denied'}), 403
    return jsonify(itin.to_dict())


@itinerary_bp.route('/itineraries/<int:iid>', methods=['PUT'])
@token_required
def update_itinerary(iid):
    itin = Itinerary.query.get_or_404(iid)
    if not _own_or_admin(itin.clerk_id):
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json() or {}
    for field in ('title', 'description', 'start_date', 'end_date',
                  'is_public', 'total_budget'):
        if field in data:
            setattr(itin, field, data[field])

    # Replace items if provided
    if 'items' in data:
        ItineraryItem.query.filter_by(itinerary_id=iid).delete()
        for item_data in data['items']:
            item = ItineraryItem(
                itinerary_id = iid,
                day_number   = item_data.get('day_number', 1),
                place_id     = item_data.get('place_id'),
                place_name   = item_data.get('place_name'),
                activity     = item_data.get('activity'),
                notes        = item_data.get('notes'),
                order_index  = item_data.get('order_index', 0),
            )
            db.session.add(item)

    db.session.commit()
    return jsonify(itin.to_dict())


@itinerary_bp.route('/itineraries/<int:iid>', methods=['DELETE'])
@token_required
def delete_itinerary(iid):
    itin = Itinerary.query.get_or_404(iid)
    if not _own_or_admin(itin.clerk_id):
        return jsonify({'error': 'Access denied'}), 403
    db.session.delete(itin)
    db.session.commit()
    return jsonify({'success': True})
