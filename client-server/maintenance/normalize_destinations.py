"""
Destination data normalization (read-only, reproducible).

Reads the ORIGINAL seed CSV without modifying it, applies the human-approved mappings from
DATA_REVIEW_WORKSHEET.md / DATA_READINESS_REPORT.md, and writes a SEPARATE derived dataset plus a
NORMALIZATION_REPORT.md. It does NOT touch the application UI, API, DB schema, recommender, or the
source CSV.

Scope (intentionally limited):
  - season  -> season_months (int set 1..12) + status + preserved note
  - difficulty_level -> Easy | Moderate | Hard  (+ permit_hint)
  - accessibility -> Road | Road+Hike | Trek | Fly-in | null  (+ permit_hint)
  - province code 1..7 -> official name
  - coordinates -> cleaned floats + coord_status (verified | suspect | unreliable)
  - transportation -> kept VERBATIM (display only)

Explicitly NOT computed: budget, route, safety, popularity, rating.

Idempotent: deterministic output; rerunning overwrites the derived files in place and never creates
duplicates or alters the source. Preserves all input records (one derived record per input row).

Usage (from client-server/):
    .venv\\Scripts\\python.exe maintenance\\normalize_destinations.py
"""

import csv
import json
import os
import re
from collections import Counter

# ── Paths (resolved relative to this file; source is read-only) ─────────────────
HERE = os.path.dirname(os.path.abspath(__file__))
CLIENT_SERVER = os.path.abspath(os.path.join(HERE, ".."))
REPO_ROOT = os.path.abspath(os.path.join(CLIENT_SERVER, ".."))
SOURCE_CSV = os.path.join(CLIENT_SERVER, "datasets", "dataset_with_all_image_path.csv")
# Derived output goes to a NEW, separate location — never overwrites source datasets.
OUT_DIR = os.path.join(CLIENT_SERVER, "datasets", "derived")
OUT_JSON = os.path.join(OUT_DIR, "destination_facets.json")
OUT_CSV = os.path.join(OUT_DIR, "destination_facets.csv")
REPORT_MD = os.path.join(REPO_ROOT, "NORMALIZATION_REPORT.md")

NEPAL_BOUNDS = (26.3, 30.5, 80.0, 88.3)  # lat_min, lat_max, lon_min, lon_max

# ── Approved mappings (source of truth = completed worksheet) ───────────────────

PROVINCE_NAMES = {
    "1": "Koshi", "2": "Madhesh", "3": "Bagmati", "4": "Gandaki",
    "5": "Lumbini", "6": "Karnali", "7": "Sudurpashchim",
}

# Season-name convention (approved): Spring 3-5, Summer 6-8, Autumn 9-11, Winter 12,1,2
SEASON_NAME_MONTHS = {
    "spring": [3, 4, 5],
    "summer": [6, 7, 8],
    "monsoon": [6, 7, 8],
    "autumn": [9, 10, 11],
    "winter": [12, 1, 2],
}
MONTH_ABBR = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7,
    "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
    "march": 3, "april": 4, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

# Approved per-value overrides for exceptional season strings (worksheet Section A).
# value -> (months_or_None, status, note)
SEASON_OVERRIDES = {
    "chisapani area": (None, "unparsed", "raw value is a location, not a season"),
    "nov\u2013dec (every 5 yrs)": ([11, 12], "caveat", "every 5 yrs"),
    "all year, best oct-apr": (list(range(1, 13)), "caveat", "best Oct-Apr"),
    "all year, best oct-mar": (list(range(1, 13)), "caveat", "best Oct-Mar"),
    "all year, esp. jan": (list(range(1, 13)), "caveat", "esp. Jan"),
    "mar-may (rhododendron bloom)": ([3, 4, 5], "parsed", "Rhododendron Bloom"),
    "mar\u2013may (sal tree blossoms)": ([3, 4, 5], "parsed", "Sal tree blossoms"),
}

# Difficulty: single-tier (deterministic) + hybrids (approved round-up).
DIFFICULTY_MAP = {
    "easy": "Easy", "very easy": "Easy",
    "moderate": "Moderate", "medium": "Moderate",
    "hard": "Hard", "challenging": "Hard", "very difficult": "Hard", "high": "Hard",
    # hybrids -> round up to harder tier (approved policy)
    "easy-moderate": "Moderate", "easy\u2013moderate": "Moderate", "easy\u2013medium": "Moderate",
    "medium\u2013hard": "Hard", "moderate-high": "Hard",
    # permit-embedded (approved split)
    "hard (permit)": "Hard",
}
DIFFICULTY_PERMIT = {"hard (permit)"}

# Accessibility: approved per-value decisions for the ambiguous set (worksheet Section C).
# raw(lowered) -> (access_type, permit_hint, confidence)
# confidence reflects how certain the approved decision is:
#   high   - clear single intended mode
#   low    - conflicting/ambiguous description that a human had to arbitrate (flag for review)
ACCESS_OVERRIDES = {
    "road, easy": ("Road", False, "high"),
    "road, moderate": ("Road", False, "high"),
    "road + trek, moderate": ("Road+Hike", False, "high"),
    "trek route,road accessible": ("Road+Hike", False, "low"),
    "road accessible, trekking paths": ("Road+Hike", False, "low"),
    "road accessible, possibly walking trails in remote wards": ("Road", False, "low"),
    "road accessible,short hike from nearest roadhead": ("Road+Hike", False, "high"),
    "road accessible,short hike from nearest roadhead ": ("Road+Hike", False, "high"),
    "road accessible,walking": ("Road+Hike", False, "low"),
    "remote trek, challenging": ("Trek", False, "high"),
    "road + permit": ("Road", True, "high"),
}

# Mode precedence (approved rule): used to pick primary_access when multiple modes present.
# Fly-in outranks Trek outranks Road (air travel is the dominant logistical constraint).
ACCESS_PRECEDENCE = ["Fly-in", "Trek", "Road"]


def normalize_season(raw):
    """Return (months_sorted_or_None, status, note). Never guesses; unparsed -> null."""
    if not raw:
        return None, "unparsed", None
    key = raw.strip().lower()
    if key in SEASON_OVERRIDES:
        months, status, note = SEASON_OVERRIDES[key]
        return (sorted(set(months)) if months else None), status, note

    note = None
    text = raw
    # Capture any parenthetical annotation as a note, then drop it for parsing.
    paren = re.findall(r"\(([^)]*)\)", text)
    if paren:
        note = "; ".join(p.strip() for p in paren)
        text = re.sub(r"\([^)]*\)", " ", text)

    t = text.lower().replace("\u2013", "-").replace("\u2014", "-")
    # All-year forms
    if re.search(r"\b(all\s*year|year[-\s]*round)\b", t):
        return list(range(1, 13)), "parsed", note

    months = set()

    # Named seasons
    for name, mset in SEASON_NAME_MONTHS.items():
        if re.search(r"\b" + name + r"\b", t):
            months.update(mset)

    # Month ranges and single months. Split on separators first.
    for part in re.split(r"[,/;]", t):
        part = part.strip()
        if not part:
            continue
        rng = re.search(r"([a-z]+)\s*(?:-|to)\s*([a-z]+)", part)
        if rng:
            a = MONTH_ABBR.get(rng.group(1))
            b = MONTH_ABBR.get(rng.group(2))
            if a and b:
                m = a
                while True:
                    months.add(m)
                    if m == b:
                        break
                    m = m % 12 + 1
            continue
        single = re.search(r"\b([a-z]+)\b", part)
        if single:
            mm = MONTH_ABBR.get(single.group(1))
            if mm:
                months.add(mm)

    if not months:
        return None, "unparsed", note
    return sorted(months), "parsed", note


def normalize_difficulty(raw):
    """Return (enum_or_None, permit_hint, source_raw). Unknown -> null (never guess)."""
    if not raw:
        return None, False, raw
    key = raw.strip().lower()
    enum = DIFFICULTY_MAP.get(key)
    permit = key in DIFFICULTY_PERMIT
    return enum, permit, raw.strip()


def _detect_modes(t):
    """Return the set of distinct access modes present in a (lowercased) access string."""
    modes = []
    if any(w in t for w in ("flight", "fly", "air", "helicopter", "lukla", "expedition")):
        modes.append("Fly-in")
    if any(w in t for w in ("trek", "trail", "foot", "hike", "walk", "stairs", "footpath")):
        modes.append("Trek")
    if any(w in t for w in ("road", "highway", "jeep", "vehicle", "drive", "cable car", "train")):
        modes.append("Road")
    return modes


def _primary_from_modes(modes):
    """Pick primary_access by approved precedence; 'Road'+'Trek' collapses to 'Road+Hike'."""
    if not modes:
        return None
    mset = set(modes)
    if "Road" in mset and "Trek" in mset and "Fly-in" not in mset:
        return "Road+Hike"
    for m in ACCESS_PRECEDENCE:
        if m in mset:
            return m
    return modes[0]


def _is_verbose(t):
    """Heuristic: a descriptive/route sentence rather than a terse mode label."""
    return len(t.split()) > 3 or " via " in t or "accessible" in t


def normalize_access(raw):
    """
    Classify an accessibility string.

    Returns a dict:
      access_type      : primary enum (Road | Road+Hike | Trek | Fly-in) or None
      access_modes     : list of distinct modes detected (may be multiple)
      primary_access   : same as access_type (explicit, per-approval precedence)
      permit_hint      : bool
      access_confidence: 'high' | 'medium' | 'low' | None (None only when no mode at all)

    Confidence rules:
      high   - exact approved override marked high, OR a single clear terse mode keyword
      medium - verbose description resolved via keyword inference
      low    - approved override marked low (human-arbitrated conflict), OR a genuine
               conflicting signal the classifier cannot resolve cleanly (flag for review)
    Never guesses: no mode keyword -> access_type None.
    """
    if not raw or raw.strip().upper() == "NO":
        return {
            "access_type": None, "access_modes": [], "primary_access": None,
            "permit_hint": False, "access_confidence": None,
        }

    key = raw.strip().lower()
    permit = "permit" in key

    # Approved per-value overrides take precedence and carry their own confidence.
    if key in ACCESS_OVERRIDES:
        atype, oper_permit, conf = ACCESS_OVERRIDES[key]
        modes = _detect_modes(key)
        if not modes and atype:
            modes = ["Road+Hike"] if atype == "Road+Hike" else [atype]
        # Represent a Road+Hike primary via its component modes for transparency.
        if atype == "Road+Hike" and "Road" not in modes:
            modes = sorted(set(modes) | {"Road", "Trek"})
        return {
            "access_type": atype,
            "access_modes": modes,
            "primary_access": atype,
            "permit_hint": bool(permit or oper_permit),
            "access_confidence": conf,
        }

    modes = _detect_modes(key)
    if not modes:
        return {
            "access_type": None, "access_modes": [], "primary_access": None,
            "permit_hint": permit, "access_confidence": None,
        }

    primary = _primary_from_modes(modes)

    # Confidence: terse single-mode = high; verbose keyword inference = medium.
    if len(modes) == 1 and not _is_verbose(key):
        confidence = "high"
    else:
        confidence = "medium"

    return {
        "access_type": primary,
        "access_modes": modes,
        "primary_access": primary,
        "permit_hint": permit,
        "access_confidence": confidence,
    }


def normalize_coord(raw):
    """Return (float_or_None, raw_had_degree). Strips a degree suffix; non-numeric -> None."""
    if raw is None:
        return None, False
    s = raw.strip()
    had_deg = "\u00b0" in s
    m = re.search(r"-?\d+\.?\d*", s)
    if not m:
        return None, had_deg
    try:
        return float(m.group()), had_deg
    except ValueError:
        return None, had_deg


def detect_interpolated_runs(coords):
    """Flag indices inside constant-increment runs (>=4) with tiny non-zero steps (synthetic)."""
    flagged = set()
    n = len(coords)
    i = 0
    while i < n - 2:
        a, b, c = coords[i], coords[i + 1], coords[i + 2]
        if a and b and c:
            step = (round(b[0] - a[0], 4), round(b[1] - a[1], 4))
            if step != (0.0, 0.0) and abs(step[0]) < 0.02 and abs(step[1]) < 0.02:
                j = i
                run = [i]
                while j + 1 < n and coords[j] and coords[j + 1] and \
                        (round(coords[j + 1][0] - coords[j][0], 4),
                         round(coords[j + 1][1] - coords[j][1], 4)) == step:
                    run.append(j + 1)
                    j += 1
                if len(run) >= 4:
                    flagged.update(run)
                    i = j
                    continue
        i += 1
    return flagged


def main():
    if not os.path.exists(SOURCE_CSV):
        raise SystemExit(f"Source CSV not found (read-only expected): {SOURCE_CSV}")

    with open(SOURCE_CSV, encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        rows = list(reader)

    total_in = len(rows)

    # First pass: parse coordinates (needed for interpolation run detection in row order).
    coords = []
    deg_count = 0
    for r in rows:
        lat, lad = normalize_coord(r.get("latitude"))
        lon, lod = normalize_coord(r.get("longitude"))
        if lad or lod:
            deg_count += 1
        coords.append((lat, lon) if (lat is not None and lon is not None) else None)
    interp = detect_interpolated_runs(coords)

    records = []
    cov = {
        "season_parsed": 0, "season_caveat": 0, "season_unparsed": 0,
        "difficulty_mapped": 0, "difficulty_null": 0, "permit_hint": 0,
        "access_mapped": 0, "access_null": 0,
        "access_high": 0, "access_medium": 0, "access_low": 0,
        "coord_verified": 0, "coord_suspect": 0, "coord_unreliable": 0,
        "image_missing": 0,
    }
    access_dist = Counter()
    difficulty_dist = Counter()
    unresolved_season = []
    unresolved_access = []
    unreliable_coords = []
    low_conf_access = []
    multi_mode_access = []

    for i, r in enumerate(rows):
        s_months, s_status, s_note = normalize_season(r.get("best_season"))
        d_enum, d_permit, d_src = normalize_difficulty(r.get("difficulty_level"))
        acc = normalize_access(r.get("accessibility"))
        a_type = acc["access_type"]
        a_permit = acc["permit_hint"]
        permit_hint = bool(d_permit or a_permit)

        lat, lon = (coords[i] if coords[i] else (None, None))
        if lat is None or lon is None:
            coord_status = "unreliable"
            lat = lon = None
            unreliable_coords.append(r.get("destination", f"row{i}"))
        elif not (NEPAL_BOUNDS[0] <= lat <= NEPAL_BOUNDS[1] and NEPAL_BOUNDS[2] <= lon <= NEPAL_BOUNDS[3]):
            coord_status = "unreliable"
            lat = lon = None
            unreliable_coords.append(r.get("destination", f"row{i}"))
        elif i in interp:
            coord_status = "suspect"
        else:
            coord_status = "verified"

        prov_code = (r.get("province") or "").strip()
        province_name = PROVINCE_NAMES.get(prov_code)

        image_path = (r.get("destination_image_path") or "").strip() or None
        if image_path is None:
            cov["image_missing"] += 1

        rec = {
            "destination_id": (r.get("destination_id") or "").strip(),
            "destination": (r.get("destination") or "").strip(),
            "province_code": prov_code or None,
            "province_name": province_name,
            "district": (r.get("district") or "").strip() or None,
            "category": (r.get("main_category") or "").strip() or None,
            "season_months": s_months,
            "season_status": s_status,
            "season_note": s_note,
            "season_raw": (r.get("best_season") or "").strip(),
            "difficulty": d_enum,
            "difficulty_raw": d_src,
            "permit_hint": permit_hint,
            "access_type": a_type,
            "access_modes": acc["access_modes"],
            "primary_access": acc["primary_access"],
            "access_confidence": acc["access_confidence"],
            "access_raw": (r.get("accessibility") or "").strip(),  # original, preserved
            "transportation": (r.get("transportation") or "").strip(),  # VERBATIM, display-only
            "latitude": lat,
            "longitude": lon,
            "coord_status": coord_status,
            "description": (r.get("description") or "").strip(),
            "image_path": image_path,
        }
        records.append(rec)

        # Coverage tallies
        cov[f"season_{s_status}"] = cov.get(f"season_{s_status}", 0) + 1
        if d_enum:
            cov["difficulty_mapped"] += 1
            difficulty_dist[d_enum] += 1
        else:
            cov["difficulty_null"] += 1
        if permit_hint:
            cov["permit_hint"] += 1
        if a_type:
            cov["access_mapped"] += 1
            access_dist[a_type] += 1
            conf = acc["access_confidence"]
            if conf:
                cov[f"access_{conf}"] += 1
            if conf == "low":
                low_conf_access.append((rec["destination"], rec["access_raw"], a_type))
        else:
            cov["access_null"] += 1
        if len(acc["access_modes"]) > 1:
            multi_mode_access.append((rec["destination"], rec["access_raw"],
                                      acc["access_modes"], acc["primary_access"]))
        cov[f"coord_{coord_status}"] += 1
        if s_status == "unparsed":
            unresolved_season.append((rec["destination"], rec["season_raw"]))
        if a_type is None and (r.get("accessibility") or "").strip() and (r.get("accessibility") or "").strip().upper() != "NO":
            unresolved_access.append((rec["destination"], rec["access_raw"]))

    # ── Write derived outputs (separate dir; overwrite own output only) ──────────
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(records, fh, ensure_ascii=False, indent=2)

    csv_fields = [
        "destination_id", "destination", "province_code", "province_name", "district",
        "category", "season_months", "season_status", "season_note", "difficulty",
        "permit_hint", "access_type", "primary_access", "access_modes", "access_confidence",
        "coord_status", "latitude", "longitude", "image_path",
    ]
    with open(OUT_CSV, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=csv_fields, extrasaction="ignore")
        w.writeheader()
        for rec in records:
            row = dict(rec)
            if isinstance(row.get("season_months"), list):
                row["season_months"] = ";".join(str(m) for m in row["season_months"])
            if isinstance(row.get("access_modes"), list):
                row["access_modes"] = ";".join(row["access_modes"])
            w.writerow(row)

    # ── Validation: all records preserved, no duplicates ────────────────────────
    total_out = len(records)
    ids = [r["destination_id"] for r in records]
    unique_ids = len(set(ids))
    preserved = (total_out == total_in)

    _write_report(total_in, total_out, preserved, unique_ids, cov, access_dist,
                  difficulty_dist, deg_count, len(interp), unresolved_season,
                  unresolved_access, unreliable_coords, low_conf_access, multi_mode_access)

    # Console validation summary
    print(f"Input records : {total_in}")
    print(f"Output records: {total_out}  (preserved={preserved})")
    print(f"Unique destination_id: {unique_ids}")
    print(f"Season: parsed={cov['season_parsed']} caveat={cov['season_caveat']} unparsed={cov['season_unparsed']}")
    print(f"Difficulty: mapped={cov['difficulty_mapped']} null={cov['difficulty_null']} {dict(difficulty_dist)}")
    print(f"Access: mapped={cov['access_mapped']} null={cov['access_null']} {dict(access_dist)}")
    print(f"Access confidence: high={cov['access_high']} medium={cov['access_medium']} low={cov['access_low']}")
    print(f"Multi-mode access records: {len(multi_mode_access)}")
    print(f"Coords: verified={cov['coord_verified']} suspect={cov['coord_suspect']} unreliable={cov['coord_unreliable']} (degree-suffix rows={deg_count})")
    print(f"Wrote: {OUT_JSON}")
    print(f"Wrote: {OUT_CSV}")
    print(f"Wrote: {REPORT_MD}")
    if not preserved:
        raise SystemExit("VALIDATION FAILED: record count mismatch")


def _write_report(total_in, total_out, preserved, unique_ids, cov, access_dist,
                  difficulty_dist, deg_count, interp_rows, unresolved_season,
                  unresolved_access, unreliable_coords, low_conf_access, multi_mode_access):
    def pct(n):
        return f"{n/total_in*100:.1f}%" if total_in else "0%"

    lines = []
    lines.append("# Normalization Report — Destination Facets\n")
    lines.append("Generated by `client-server/maintenance/normalize_destinations.py` from the "
                 "**read-only** source CSV using the human-approved worksheet mappings. The source "
                 "CSV, application UI/API, DB schema, and recommender were NOT modified. No budget, "
                 "route, safety, or popularity values were computed.\n")
    lines.append("## Record preservation\n")
    lines.append(f"- Input records: **{total_in}**")
    lines.append(f"- Output records: **{total_out}**")
    lines.append(f"- All records preserved: **{'YES' if preserved else 'NO'}**")
    lines.append(f"- Unique `destination_id`: **{unique_ids}** (no duplicates created)\n")
    lines.append("## Season coverage\n")
    lines.append(f"- Parsed to months: **{cov['season_parsed']}** ({pct(cov['season_parsed'])})")
    lines.append(f"- Parsed with caveat note: **{cov['season_caveat']}** ({pct(cov['season_caveat'])})")
    lines.append(f"- Unparsed (stored null, never guessed): **{cov['season_unparsed']}** ({pct(cov['season_unparsed'])})\n")
    if unresolved_season:
        lines.append("Unresolved season values (null):")
        for name, raw in unresolved_season:
            lines.append(f"  - `{name}` → raw `{raw}`")
        lines.append("")
    lines.append("## Difficulty coverage\n")
    lines.append(f"- Mapped to enum: **{cov['difficulty_mapped']}** ({pct(cov['difficulty_mapped'])}) — {dict(difficulty_dist)}")
    lines.append(f"- Unmapped (null): **{cov['difficulty_null']}**")
    lines.append(f"- Permit hint flagged: **{cov['permit_hint']}**\n")
    lines.append("## Accessibility coverage\n")
    lines.append(f"- Mapped to primary enum: **{cov['access_mapped']}** ({pct(cov['access_mapped'])}) — {dict(access_dist)}")
    lines.append(f"- Null (empty/'NO'/unclassified, never guessed): **{cov['access_null']}**")
    lines.append(f"- Confidence: **high {cov['access_high']}** · **medium {cov['access_medium']}** · "
                 f"**low {cov['access_low']}**")
    lines.append("- Original `access_raw` and `transportation` preserved; `access_modes` lists all "
                 "detected modes, `primary_access` applies the approved precedence (Fly-in > Trek > "
                 "Road; Road+Trek → Road+Hike).\n")
    lines.append(f"### Low-confidence accessibility — flagged for review (**{len(low_conf_access)}**)\n")
    if low_conf_access:
        lines.append("| Destination | access_raw | primary_access |")
        lines.append("|---|---|---|")
        for name, raw, atype in low_conf_access:
            lines.append(f"| {name} | `{raw}` | {atype} |")
        lines.append("")
    else:
        lines.append("_None._\n")
    lines.append(f"### Multiple access modes (**{len(multi_mode_access)}**)\n")
    if multi_mode_access:
        lines.append("| Destination | access_raw | access_modes | primary_access |")
        lines.append("|---|---|---|---|")
        for name, raw, modes, primary in multi_mode_access:
            lines.append(f"| {name} | `{raw}` | {', '.join(modes)} | {primary} |")
        lines.append("")
    else:
        lines.append("_None._\n")
    if unresolved_access:
        lines.append(f"Accessibility values left null for review (**{len(unresolved_access)}**):")
        for name, raw in unresolved_access[:40]:
            lines.append(f"  - `{name}` → raw `{raw}`")
        if len(unresolved_access) > 40:
            lines.append(f"  - … and {len(unresolved_access) - 40} more")
        lines.append("")
    lines.append("## Coordinate validation\n")
    lines.append(f"- Verified (numeric, in Nepal bounds, not interpolated): **{cov['coord_verified']}**")
    lines.append(f"- Suspect (interpolated-run pattern; usable for filters, NOT maps): **{cov['coord_suspect']}** ({interp_rows} rows flagged)")
    lines.append(f"- Unreliable (non-numeric/out-of-bounds; no coordinates, NOT map pins): **{cov['coord_unreliable']}**")
    lines.append(f"- Rows that carried a degree `°` suffix (stripped): **{deg_count}**\n")
    if unreliable_coords:
        lines.append("Unreliable-coordinate records (kept in catalog, no map pin):")
        for name in unreliable_coords:
            lines.append(f"  - `{name}`")
        lines.append("")
    lines.append("## Other\n")
    lines.append(f"- Destination images missing (placeholder at display): **{cov['image_missing']}** ({pct(cov['image_missing'])})")
    lines.append("- `transportation` preserved verbatim as descriptive text (never faceted).\n")
    lines.append("## Outputs\n")
    lines.append("- `client-server/datasets/derived/destination_facets.json`")
    lines.append("- `client-server/datasets/derived/destination_facets.csv`")
    lines.append("- This report: `NORMALIZATION_REPORT.md`\n")
    lines.append("Rerunning the script is safe and idempotent: it reads the same source, overwrites "
                 "only these derived files, and never alters source data or creates duplicates.\n")

    with open(REPORT_MD, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


if __name__ == "__main__":
    main()
