"""
Search route — name-first relevance search, saves to history for logged-in users.
"""

from flask import Blueprint, request, jsonify
from sqlalchemy import case, func
from ..database import db
from ..models import Place, Hotel, Restaurant

search_bp = Blueprint('search', __name__)


def _search_places(query, limit=10):
    q = query.lower()
    # Always match on name; only broaden to location/tags for queries >= 3 chars
    name_filter = Place.name.ilike(f'%{query}%')
    if len(q) >= 3:
        broad = (
            Place.name.ilike(f'%{query}%') |
            Place.location.ilike(f'%{query}%') |
            Place.tags.ilike(f'%{query}%')
        )
    else:
        broad = name_filter

    places = (
        Place.query
        .filter(Place.status == 'approved', broad)
        .order_by(
            # name starts with query → highest priority
            case(
                (func.lower(Place.name).like(f'{q}%'), 0),
                (func.lower(Place.name).like(f'%{q}%'), 1),
                else_=2
            ),
            Place.name
        )
        .limit(limit)
        .all()
    )
    return places


def _search_hotels(query, limit=10):
    q = query.lower()
    broad = Hotel.name.ilike(f'%{query}%')
    if len(q) >= 3:
        broad = broad | Hotel.location.ilike(f'%{query}%')

    return (
        Hotel.query
        .filter(Hotel.status == 'approved', broad)
        .order_by(
            case(
                (func.lower(Hotel.name).like(f'{q}%'), 0),
                (func.lower(Hotel.name).like(f'%{q}%'), 1),
                else_=2
            ),
            Hotel.name
        )
        .limit(limit)
        .all()
    )


def _search_restaurants(query, limit=10):
    q = query.lower()
    broad = Restaurant.name.ilike(f'%{query}%')
    if len(q) >= 3:
        broad = broad | Restaurant.location.ilike(f'%{query}%')

    return (
        Restaurant.query
        .filter(Restaurant.status == 'approved', broad)
        .order_by(
            case(
                (func.lower(Restaurant.name).like(f'{q}%'), 0),
                (func.lower(Restaurant.name).like(f'%{q}%'), 1),
                else_=2
            ),
            Restaurant.name
        )
        .limit(limit)
        .all()
    )


@search_bp.route('/search', methods=['GET'])
def search():
    query    = request.args.get('q', '').strip()
    category = request.args.get('category', 'all')
    clerk_id = request.headers.get('X-Clerk-User-Id')
    user_name = request.headers.get('X-Clerk-User-Name', '')

    if not query:
        return jsonify({'error': 'Query required'}), 400

    if not clerk_id:
        return jsonify({'error': 'Login required to search', 'auth_required': True}), 401

    results = {'places': [], 'hotels': [], 'restaurants': []}

    if category in ('all', 'place', 'places'):
        results['places'] = [p.to_dict() for p in _search_places(query)]

    if category in ('all', 'hotel', 'hotels'):
        results['hotels'] = [h.to_dict() for h in _search_hotels(query)]

    if category in ('all', 'restaurant', 'restaurants'):
        results['restaurants'] = [r.to_dict() for r in _search_restaurants(query)]

    total = sum(len(v) for v in results.values())

    # Save to history
    try:
        from sqlalchemy import text
        db.session.execute(text(
            "INSERT INTO search_history (clerk_id, user_name, query, query_type, response_summary, created_at, user_id) "
            "VALUES (:cid, :uname, :q, :qt, :rs, CURRENT_TIMESTAMP, :uid)"
        ), {'cid': clerk_id, 'uname': user_name, 'q': query,
            'qt': category, 'rs': f"{total} results", 'uid': clerk_id or ''})
        db.session.commit()
    except Exception:
        db.session.rollback()

    return jsonify({'query': query, 'results': results, 'total': total})


@search_bp.route('/search/history', methods=['GET'])
def get_search_history():
    clerk_id = request.headers.get('X-Clerk-User-Id')
    if not clerk_id:
        return jsonify({'error': 'Login required'}), 401
    from sqlalchemy import text
    rows = db.session.execute(text(
        "SELECT id, query, query_type, created_at FROM search_history "
        "WHERE clerk_id = :cid ORDER BY created_at DESC LIMIT 10"
    ), {'cid': clerk_id}).fetchall()
    return jsonify([{
        'id': r[0], 'query': r[1],
        'query_type': r[2], 'at': r[3],
    } for r in rows])


@search_bp.route('/search/history/<int:entry_id>', methods=['DELETE'])
def delete_search_entry(entry_id):
    clerk_id = request.headers.get('X-Clerk-User-Id')
    if not clerk_id:
        return jsonify({'error': 'Login required'}), 401
    from sqlalchemy import text
    db.session.execute(text(
        "DELETE FROM search_history WHERE id = :id AND clerk_id = :cid"
    ), {'id': entry_id, 'cid': clerk_id})
    db.session.commit()
    return jsonify({'message': 'Deleted'})
