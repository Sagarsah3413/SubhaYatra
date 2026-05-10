"""
Lightweight tracking endpoints called from the frontend.
- POST /api/track/recommendation  — log a recommendation session
- POST /api/track/itinerary       — log an itinerary creation
"""

from flask import Blueprint, request, jsonify
from ..database import db
from ..models import RecommendationLog, ItineraryLog
import json

tracking_bp = Blueprint("tracking", __name__)


@tracking_bp.route("/track/recommendation", methods=["POST"])
def track_recommendation():
    data = request.get_json(silent=True) or {}
    try:
        places = data.get("places_shown", [])
        log = RecommendationLog(
            clerk_id     = data.get("clerk_id") or None,
            user_name    = data.get("user_name") or None,
            trip_type    = str(data.get("trip_type", ""))[:255],
            travel_month = str(data.get("travel_month", ""))[:50],
            travellers   = data.get("travellers"),
            duration     = str(data.get("duration", ""))[:50],
            places_shown = json.dumps(places[:50]) if places else None,
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({"ok": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@tracking_bp.route("/track/itinerary", methods=["POST"])
def track_itinerary():
    data = request.get_json(silent=True) or {}
    try:
        places = data.get("places", [])
        log = ItineraryLog(
            clerk_id      = data.get("clerk_id") or None,
            user_name     = data.get("user_name") or None,
            destination   = str(data.get("destination", ""))[:255],
            start_date    = str(data.get("start_date", ""))[:50],
            end_date      = str(data.get("end_date", ""))[:50],
            duration_days = data.get("duration_days"),
            budget        = str(data.get("budget", ""))[:100],
            travellers    = data.get("travellers"),
            trip_type     = str(data.get("trip_type", ""))[:255],
            notes         = str(data.get("notes", ""))[:1000],
            places_json   = json.dumps(places[:50]) if places else None,
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({"ok": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
