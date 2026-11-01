# Explorer API — Integration Verification

Focused audit of the destination-facets Explorer API before frontend work. Scope limited to:
`app/facets.py`, `app/routes/places.py`, `app/models.py` (Place), `tests/test_explore_facets.py`,
and `datasets/derived/destination_facets.json`. All findings are backed by direct read-only checks
against the running app and the derived dataset. **No application code, schema, CSV, or normalization
rule was changed.**

**Verdict:** The Explorer API is functionally correct on all eight audit points. There is **one
architectural issue (not a runtime bug)** worth a decision before frontend work: the endpoint serves
description/image from the **facet JSON snapshot**, not from the live `Place` record (Finding 4). The
data is currently identical, so there is no user-visible defect today — but it is not what the
requirement literally asked for. Smallest fix proposed below; recommend deferring unless live-edit
freshness is required for the MVP.

---

## 1. Facet → Place mapping is a perfect 1:1 bijection

Measured across all records:

| Check | Result |
|---|---|
| Facet records | 1,057 |
| Place rows in DB | 1,057 |
| Facet `destination_id` → `Place.id` match | **1,057 / 1,057** |
| Facet `destination` → `Place.name` (case-insensitive) match | **1,057 / 1,057** |
| Rows where the id-join and name-join resolve to **different** Places | **0** |

Every facet record maps to exactly one Place, and both candidate keys agree on the same Place for
every row. ✔

## 2. Authoritative join key

**`destination_id` → `Place.id`** is authoritative. Evidence: `destination_id` is 100% populated,
unique (1,057 distinct, 0 blank), integer-typed, and matches `Place.id` exactly. Name also happens to
be unique and fully matching today, but names are free-text (case/spacing/duplication risk in
general), so **id is the correct key**.

> Note: the current Explorer endpoint does **not actually perform this join at request time** — it
> serves from the JSON (see Finding 4). The key analysis above confirms the join *would* be exact if
> performed, which matters for the proposed fix.

## 3. Unmatched / duplicate / ambiguous mappings

- Unmatched facet records: **0** (all 1,057 match a Place by id and by name).
- Duplicate `destination_id`: **0**. Duplicate `destination` name: **0** (1,057 distinct).
- Ambiguous (id-join vs name-join disagreement): **0**.

No orphans, duplicates, or ambiguity. ✔

## 4. Source of description & images — ARCHITECTURAL FINDING (not fabricated, but not from Place)

- Facet `description` is **byte-identical** to `Place.description` for **1,057 / 1,057** records.
  Image paths likewise match (`facet.image_path` vs `Place.image_url`). So the data is **not
  fabricated and not altered** — it is a faithful copy taken at normalization time. ✔ (no fabrication)
- **However**, `app/facets.py::_public_record()` returns `description` and `image_path` **from the
  facet JSON**, and the endpoint never loads the `Place` row. The requirement states images and
  descriptions should "come from the existing Place records." Today the copy is identical, so there
  is **no user-visible defect**, but strictly the data comes from a **snapshot**, not the live record.

**Why this is a latent risk, not a current bug:** if an admin later edits a Place's description/image
in the DB, the Explorer would still show the stale JSON copy until the facets file is regenerated.

**Smallest fix (proposed, NOT applied — awaiting your decision):** in the `/places/explore` route,
after filtering facet records, batch-load the matching `Place` rows by id
(`Place.query.filter(Place.id.in_(ids))`) and overlay `description`/`image_url` from the Place onto
each result, keeping all facet-only fields (season/difficulty/access/coord_status) from the JSON.
This is ~5 lines in `explore_places()`, adds one indexed query per page (<=100 ids), changes no
schema, and makes Finding 4 literally true. **Recommendation:** defer unless live Place edits must be
reflected during the MVP; the MVP dataset is static, so the snapshot is acceptable and simpler.

## 5. Access filtering semantics (incl. multi-mode)

`_matches()` matches `access=X` when `X` is in the destination's **full detected mode set**
(`access_modes` ∪ `primary_access`), not just the primary. Verified behavior:

| Query | Matches | Total |
|---|---|---|
| `access=Road` | any destination whose modes include Road | 925 |
| `access=Trek` | any whose modes include Trek | 295 |
| `access=Road+Hike` | primary is Road+Hike (its modes are `[Trek, Road]`) | 162 |
| `access=Fly-in` | any whose modes include Fly-in | 13 |

Multi-mode destinations: **175**. A `Road+Hike` destination (modes `[Trek, Road]`, primary
`Road+Hike`) is therefore reachable by **all three** of `Road`, `Trek`, and `Road+Hike` filters —
intended, since such a place is genuinely road-and-trek accessible. ✔

## 6. `/api/places/explore/options` counts — accurate, overlap explained

Per-mode availability (options) equals the corresponding filter `total` exactly:

| Access | options count | filter `total` | match |
|---|---|---|---|
| Road | 925 | 925 | ✔ |
| Trek | 295 | 295 | ✔ |
| Road+Hike | 162 | 162 | ✔ |
| Fly-in | 13 | 13 | ✔ |

**Overlap explanation (required):** the access counts sum to **1,395 across 1,057 destinations**
because each destination is counted once **per mode it supports**. 175 multi-mode destinations are
counted in multiple buckets (e.g. a Road+Hike place counts under Road, Trek, and Road+Hike). The
counts are **membership counts, not partitions** — they intentionally do not sum to 1,057. Province
(sums to 1,057) and difficulty (sums to 1,057) are partitions; access and month are membership counts
(a destination's season spans multiple months). This is correct and now documented.

Province counts: Bagmati 365 · Koshi 220 · Madhesh 189 · Lumbini 122 · Sudurpashchim 56 · Karnali 53
· Gandaki 52 (= 1,057). Difficulty: Easy 541 · Moderate 444 · Hard 72 (= 1,057).

## 7. Season & difficulty null exclusion

- `null difficulty` in dataset: **0** → every record is filterable by difficulty; `difficulty=X`
  returns only exact-enum matches (verified: all results for `Hard` are `Hard`). ✔
- `null season_months` in dataset: **1** (`Chisapani area`, status `unparsed`). The month filter
  requires `season_months` to be present **and** contain the month (`if not months or month not in
  months: return False`), so this record **never** appears in any month-filtered result (verified for
  `month=6`: all results contain 6). ✔ Missing data is never treated as a match.

## 8. Coordinate restriction consistency

`_public_record()` returns `latitude`/`longitude` only when `coord_status == "verified"`, else
`null`, and sets `map_pin_allowed = (coord_status == "verified")`. Full-dataset projection check:

| coord_status | count | coords exposed? | map_pin_allowed |
|---|---|---|---|
| verified | 866 | yes | true |
| suspect | 187 | no (null) | false |
| unreliable | 4 | no (null) | false |

Inconsistent projections (verified-but-no-coords, or non-verified-but-coords-exposed): **0**. Only
verified coordinates can become map pins, consistently. ✔

---

## Test evidence

`tests/test_explore_facets.py` — **17 tests, all passing** (`Ran 17 tests ... OK`), covering: each
individual filter, combined AND logic, the AND-subset invariant, empty results (200 + empty list),
invalid month/difficulty/province/access/pagination (400), null-never-matches, verified-only
coordinates, pagination shape, the options endpoint, and backward compatibility of the existing
`/api/places` contract. The broader suite (explore + cohere) runs 25/25 green.

**Coverage note (honest):** tests assert `_public_record` coordinate behavior through the endpoint,
but there is no test asserting that description/image equal the live `Place` record (Finding 4). If
the proposed fix is applied, add one test for that overlay; if deferred, add a test asserting the
snapshot matches Place at load time.

---

## Summary of findings

| # | Area | Status |
|---|---|---|
| 1 | 1:1 facet→Place mapping | ✔ Pass (1,057/1,057) |
| 2 | Authoritative join key = `destination_id`→`Place.id` | ✔ Confirmed |
| 3 | Unmatched / duplicate / ambiguous | ✔ None |
| 4 | Description/images not fabricated | ✔ Not fabricated — **but served from JSON snapshot, not live Place** (architectural finding; smallest fix proposed, deferral recommended) |
| 5 | Access semantics incl. multi-mode | ✔ Correct |
| 6 | Options counts + overlap explained | ✔ Accurate; membership vs partition documented |
| 7 | Season/difficulty null exclusion | ✔ Correct (1 null season never matches) |
| 8 | Coordinate restriction consistency | ✔ Consistent (0 violations) |

**No runtime defect found.** The single architectural finding (#4) is a snapshot-vs-live-source
decision, not a bug; no code was changed pending your call. Audit complete — stopping here.

---

## Decision log

**Finding 4 — DEFERRED (accepted technical limitation).** By decision, the Explorer serves
`description`/`image` from the facet JSON snapshot rather than the live `Place` record. This is an
accepted limitation for the static-dataset MVP: edits to a `Place` in the DB will not appear in the
Explorer until the facets file is regenerated. The backend is intentionally left unchanged. Revisit
(apply the ~5-line id-overlay in `explore_places()` + a freshness test) only if/when live Place edits
must be reflected during Explorer use.
