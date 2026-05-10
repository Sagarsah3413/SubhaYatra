"""
Saved Itineraries CRUD API
GET    /api/itineraries              — list user's saved itineraries
POST   /api/itineraries              — save a new itinerary
GET    /api/itineraries/<id>         — get full itinerary detail
PUT    /api/itineraries/<id>         — update itinerary
DELETE /api/itineraries/<id>         — delete itinerary
GET    /api/admin/itineraries        — admin: all itineraries (paginated)
GET    /api/admin/itineraries/stats  — admin: analytics
"""

from flask import Blueprint, request, jsonify
from sqlalchemy import func, desc
from datetime import datetime
import json

from ..database import db
from ..models import SavedItinerary
from ..auth import admin_required

saved_itineraries_bp = Blueprint("saved_itineraries", __name__)


def _clerk_id_from_request():
    return request.args.get("clerk_id", "").strip() or \
           (request.get_json(silent=True) or {}).get("clerk_id", "")


# ── User endpoints ────────────────────────────────────────────────────────────

@saved_itineraries_bp.route("/itineraries", methods=["GET"])
def list_itineraries():
    clerk_id = request.args.get("clerk_id", "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id required"}), 400

    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    q = SavedItinerary.query.filter_by(clerk_id=clerk_id).order_by(
        desc(SavedItinerary.updated_at)
    )
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        "itineraries": [i.to_summary() for i in items],
        "total": total, "page": page, "per_page": per_page,
    }), 200


@saved_itineraries_bp.route("/itineraries", methods=["POST"])
def save_itinerary():
    data = request.get_json(silent=True) or {}
    clerk_id = data.get("clerk_id", "").strip()
    if not clerk_id:
        return jsonify({"error": "clerk_id required"}), 400

    itinerary_data = data.get("itinerary", {})
    if not itinerary_data:
        return jsonify({"error": "itinerary data required"}), 400

    try:
        destinations = itinerary_data.get("destinations", [])
        dest_str = ", ".join(destinations) if isinstance(destinations, list) else str(destinations)

        record = SavedItinerary(
            clerk_id       = clerk_id,
            user_name      = data.get("user_name") or None,
            title          = itinerary_data.get("title", "My Itinerary")[:255],
            destinations   = dest_str[:512],
            duration       = str(itinerary_data.get("duration", ""))[:50],
            budget_level   = str(itinerary_data.get("budgetLevel", ""))[:50],
            total_cost     = itinerary_data.get("totalCost"),
            start_date     = data.get("start_date", "")[:50],
            end_date       = data.get("end_date", "")[:50],
            notes          = data.get("notes", "")[:2000],
            itinerary_json = json.dumps(itinerary_data),
        )
        db.session.add(record)
        db.session.commit()
        return jsonify({"ok": True, "id": record.id, "itinerary": record.to_summary()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@saved_itineraries_bp.route("/itineraries/<int:itin_id>", methods=["GET"])
def get_itinerary(itin_id):
    clerk_id = request.args.get("clerk_id", "").strip()
    record = SavedItinerary.query.get(itin_id)
    if not record:
        return jsonify({"error": "Not found"}), 404
    if clerk_id and record.clerk_id != clerk_id:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify(record.to_dict()), 200


@saved_itineraries_bp.route("/itineraries/<int:itin_id>", methods=["PUT"])
def update_itinerary(itin_id):
    data = request.get_json(silent=True) or {}
    clerk_id = data.get("clerk_id", "").strip()

    record = SavedItinerary.query.get(itin_id)
    if not record:
        return jsonify({"error": "Not found"}), 404
    if clerk_id and record.clerk_id != clerk_id:
        return jsonify({"error": "Forbidden"}), 403

    try:
        if "title" in data:
            record.title = data["title"][:255]
        if "notes" in data:
            record.notes = data["notes"][:2000]
        if "start_date" in data:
            record.start_date = data["start_date"][:50]
        if "end_date" in data:
            record.end_date = data["end_date"][:50]
        if "itinerary" in data:
            itin = data["itinerary"]
            record.itinerary_json = json.dumps(itin)
            record.title = itin.get("title", record.title)[:255]
            dests = itin.get("destinations", [])
            record.destinations = (", ".join(dests) if isinstance(dests, list) else str(dests))[:512]
            record.duration    = str(itin.get("duration", record.duration))[:50]
            record.budget_level= str(itin.get("budgetLevel", record.budget_level))[:50]
            record.total_cost  = itin.get("totalCost", record.total_cost)
        record.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"ok": True, "itinerary": record.to_summary()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@saved_itineraries_bp.route("/itineraries/<int:itin_id>", methods=["DELETE"])
def delete_itinerary(itin_id):
    clerk_id = request.args.get("clerk_id", "").strip()
    record = SavedItinerary.query.get(itin_id)
    if not record:
        return jsonify({"error": "Not found"}), 404
    if clerk_id and record.clerk_id != clerk_id:
        return jsonify({"error": "Forbidden"}), 403
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"ok": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ── Admin endpoints ───────────────────────────────────────────────────────────

@saved_itineraries_bp.route("/admin/itineraries", methods=["GET"])
@admin_required
def admin_list_itineraries():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 30, type=int)
    q_str    = request.args.get("q", "").strip()
    dest     = request.args.get("destination", "").strip()
    user     = request.args.get("user", "").strip()

    query = SavedItinerary.query
    if q_str:
        like = f"%{q_str}%"
        query = query.filter(
            SavedItinerary.title.ilike(like) |
            SavedItinerary.destinations.ilike(like) |
            SavedItinerary.user_name.ilike(like)
        )
    if dest:
        query = query.filter(SavedItinerary.destinations.ilike(f"%{dest}%"))
    if user:
        query = query.filter(
            SavedItinerary.user_name.ilike(f"%{user}%") |
            SavedItinerary.clerk_id.ilike(f"%{user}%")
        )

    total = query.count()
    items = query.order_by(desc(SavedItinerary.created_at)).offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        "itineraries": [i.to_summary() for i in items],
        "total": total, "page": page, "per_page": per_page,
    }), 200


@saved_itineraries_bp.route("/admin/itineraries/stats", methods=["GET"])
@admin_required
def admin_itinerary_stats():
    total = SavedItinerary.query.count()

    # Top destinations
    all_dests: dict = {}
    for (d,) in db.session.query(SavedItinerary.destinations).all():
        if d:
            for part in d.split(","):
                part = part.strip()
                if part:
                    all_dests[part] = all_dests.get(part, 0) + 1
    top_dests = sorted(all_dests.items(), key=lambda x: x[1], reverse=True)[:10]

    # Budget distribution
    budget_dist = db.session.query(
        SavedItinerary.budget_level, func.count(SavedItinerary.id)
    ).group_by(SavedItinerary.budget_level).all()

    # Recent saves
    recent = SavedItinerary.query.order_by(desc(SavedItinerary.created_at)).limit(5).all()

    return jsonify({
        "total": total,
        "top_destinations": [{"destination": d, "count": c} for d, c in top_dests],
        "budget_distribution": [{"budget": b or "unknown", "count": c} for b, c in budget_dist],
        "recent": [i.to_summary() for i in recent],
    }), 200
