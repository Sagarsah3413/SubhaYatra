"""
Destination facets — read-only in-memory index.

Loads the APPROVED derived facets from
`client-server/datasets/derived/destination_facets.json` (produced by the normalization stage)
and exposes constraint-aware filtering (month / difficulty / province / access) with AND logic.

Deliberately additive and non-invasive:
  - Does NOT touch the Place DB model, the seed process, or any existing endpoint.
  - Does NOT compute budget, route, popularity, or safety.
  - Missing/unresolved facet values never match a filter (null != match).
  - Only `coord_status == "verified"` coordinates are exposed for map pins.

The dataset is small (~1,057 rows); a loaded list + simple scans are more than fast enough and
avoid any schema migration.
"""

import json
import os
from functools import lru_cache

_FACETS_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..",
    "datasets", "derived", "destination_facets.json",
)

# Allowed enum values for validation (source of truth = normalization stage).
VALID_DIFFICULTY = {"Easy", "Moderate", "Hard"}
VALID_ACCESS = {"Road", "Road+Hike", "Trek", "Fly-in"}
VALID_PROVINCES = {"Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"}


@lru_cache(maxsize=1)
def _load():
    """Load and cache the facets JSON once. Returns [] if the file is absent."""
    path = os.path.abspath(_FACETS_PATH)
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def all_facets():
    """Return the full list of facet records (cached, read-only)."""
    return _load()


def _public_record(rec):
    """
    Project a facet record to the public API shape.

    Coordinates are only populated when verified; otherwise null, and `map_pin_allowed`
    tells the client whether a pin may be shown.
    """
    verified = rec.get("coord_status") == "verified"
    return {
        "id": rec.get("destination_id"),
        "name": rec.get("destination"),
        "province": rec.get("province_name"),
        "province_code": rec.get("province_code"),
        "district": rec.get("district"),
        "category": rec.get("category"),
        "season_months": rec.get("season_months"),          # list[int] | null
        "season_status": rec.get("season_status"),
        "season_note": rec.get("season_note"),
        "difficulty": rec.get("difficulty"),                 # Easy|Moderate|Hard | null
        "permit_hint": rec.get("permit_hint", False),
        "access_type": rec.get("access_type"),               # primary enum | null
        "primary_access": rec.get("primary_access"),
        "access_modes": rec.get("access_modes", []),
        "access_confidence": rec.get("access_confidence"),   # high|medium|low | null
        "coord_status": rec.get("coord_status"),
        "latitude": rec.get("latitude") if verified else None,
        "longitude": rec.get("longitude") if verified else None,
        "map_pin_allowed": verified,
        "description": rec.get("description"),
        "image_path": rec.get("image_path"),
    }


def _matches(rec, month, difficulty, province, access):
    """
    AND-logic match. A record matches ONLY when it has a real, non-null value for each
    requested facet. Missing/unresolved data never matches.
    """
    if month is not None:
        months = rec.get("season_months")
        if not months or month not in months:
            return False
    if difficulty is not None:
        if rec.get("difficulty") != difficulty:
            return False
    if province is not None:
        if rec.get("province_name") != province:
            return False
    if access is not None:
        # Match against the full set of detected modes (not just the primary),
        # so "Road" matches a Road+Hike destination's Road component too.
        modes = set(rec.get("access_modes") or [])
        primary = rec.get("primary_access")
        if primary:
            modes.add(primary)
        if not modes or access not in modes:
            return False
    return True


def filter_facets(month=None, difficulty=None, province=None, access=None,
                  page=1, limit=20):
    """
    Filter facets with AND logic and paginate.

    Returns (results, meta). Raises ValueError on invalid parameters so the route can
    return a clean 400.
    """
    # ── Validation ──────────────────────────────────────────────────────────
    if month is not None:
        if not (1 <= month <= 12):
            raise ValueError("month must be an integer between 1 and 12")
    if difficulty is not None and difficulty not in VALID_DIFFICULTY:
        raise ValueError(f"difficulty must be one of {sorted(VALID_DIFFICULTY)}")
    if province is not None and province not in VALID_PROVINCES:
        raise ValueError(f"province must be one of {sorted(VALID_PROVINCES)}")
    if access is not None and access not in VALID_ACCESS:
        raise ValueError(f"access must be one of {sorted(VALID_ACCESS)}")
    if page < 1:
        raise ValueError("page must be >= 1")
    if not (1 <= limit <= 100):
        raise ValueError("limit must be between 1 and 100")

    matched = [r for r in _load() if _matches(r, month, difficulty, province, access)]
    total = len(matched)
    pages = (total + limit - 1) // limit if total else 0
    start = (page - 1) * limit
    page_items = matched[start:start + limit]

    meta = {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "filters": {
            "month": month, "difficulty": difficulty,
            "province": province, "access": access,
        },
    }
    return [_public_record(r) for r in page_items], meta


def filter_options():
    """Return the valid filter values + per-value availability counts (coverage)."""
    data = _load()
    prov = {p: 0 for p in VALID_PROVINCES}
    diff = {d: 0 for d in VALID_DIFFICULTY}
    acc = {a: 0 for a in VALID_ACCESS}
    month = {m: 0 for m in range(1, 13)}
    for r in data:
        if r.get("province_name") in prov:
            prov[r["province_name"]] += 1
        if r.get("difficulty") in diff:
            diff[r["difficulty"]] += 1
        modes = set(r.get("access_modes") or [])
        if r.get("primary_access"):
            modes.add(r["primary_access"])
        for a in modes:
            if a in acc:
                acc[a] += 1
        for m in (r.get("season_months") or []):
            if m in month:
                month[m] += 1
    return {
        "total_destinations": len(data),
        "provinces": prov,
        "difficulties": diff,
        "access_types": acc,
        "months": month,
    }
