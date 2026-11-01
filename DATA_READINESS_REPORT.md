# Data Readiness Report — SubhaYatra Destination Dataset

Pre-implementation data-validation phase for the approved single-filter Explorer MVP
(`STRATEGY_REVIEW.md`). This report audits the seed dataset, proposes normalization mappings for the
MVP's facet fields (season, difficulty, access), validates coordinates, and separates what can be
normalized automatically from what needs human verification.

**Method:** direct read-only analysis of
`client-server/datasets/dataset_with_all_image_path.csv` using the project venv (`csv` module). The
original CSV was **not modified**. No records were discarded; every problematic record is surfaced and
flagged, not dropped. No application code or schema was changed. All counts below are measured, not
estimated.

**Dataset:** 1,057 destination rows, 55 columns, one wide (denormalized) row per destination.

---

## 1. Record audit — field coverage (measured)

| Field | Fill | Distinct | MVP role | Note |
|---|---|---|---|---|
| destination | 100% | 1,057 | key | no duplicate names |
| province | 100% | 7 | filter | coded 1–7; needs code→name map |
| district | 100% | 113 | display | |
| main_category | 100% | 7 | filter/display | clean taxonomy |
| best_season | 100% | 56 | **filter (month)** | free-text; see §2 |
| difficulty_level | 100% | 14 | **filter** | see §3 |
| accessibility | 100% | 119 | **facet/display** | normalizable; see §4 |
| transportation | ~99% | **1,047** | **display only** | free-text prose, not a facet; see §4 |
| latitude / longitude | 100% non-empty | 678 / 740 | map/confidence | 294 have `°` suffix; 4 placeholder; 187 interpolated; see §5 |
| description | 100% | — | display | |
| destination_image_path | 89.1% | — | display | ~11% missing |
| hotel*/restaurant* price & image | 9–22% | — | **excluded** | 76% hotel-price placeholder "NO"; no destination cost/rating field |

No cost, rating, popularity, or travel-time field exists — consistent with `STRATEGY_REVIEW.md`. The
MVP uses only the first six rows above; cost/rating/booking columns are out of scope.

---

## 2. best_season — all 56 variants → proposed month mapping

`best_season` is 100% filled but free-text with inconsistent separators (`–` en-dash, `-` hyphen, `,`,
`;`, `/`) and mixed forms (month ranges, named seasons, "All Year", annotated). Proposed target:
`season_months` = set of month numbers {1..12}.

**Season-name convention (for Nepal):** Spring = Mar–May (3–5), Summer/Monsoon = Jun–Aug (6–8),
Autumn = Sep–Nov (9–11), Winter = Dec–Feb (12,1,2).

### 2a. Auto-normalizable (clear month ranges & standard season names) — 52 of 56 variants, ~1,043 rows

Representative examples (count · raw → months):

| Raw value | Count | → Months |
|---|---|---|
| `Oct–Dec` | 245 | 10,11,12 |
| `All Year` / `All year` / `Year-round` | 202+5+18 | 1–12 |
| `Oct–Mar` / `Oct-Mar` | 150+20 | 10,11,12,1,2,3 |
| `Spring/Autumn` / `Spring–Autumn` / `Spring-Autumn` / `Spring, Autumn` / `Autumn/Spring` / `Autumn–Spring` | 73+16+9+4+2+4 | 3,4,5,9,10,11 |
| `March–May, Sep–Nov` / `Mar–May, Sep–Nov` / variants | 51+24+14+9+5 | 3,4,5,9,10,11 |
| `Sep–Nov` | 35 | 9,10,11 |
| `Mar–Nov` | 31 | 3–11 |
| `Oct–Nov` | 30 | 10,11 |
| `Oct–Feb` | 21 | 10,11,12,1,2 |
| `Mar–May` / `Spring` | 11+5 | 3,4,5 |
| `Jun–Sep` / `Monsoon (Jun–Sep)` / `Jun–Sep (Monsoon)` | 10+1+1 | 6,7,8,9 |
| `Apr–Oct` / `Apr-Oct` / `Apr to Oct` | 8+1+2 | 4–10 |
| `May–Oct` / `May-Oct` | 8+1 | 5–10 |
| `Oct–Apr` | 6 | 10,11,12,1,2,3,4 |
| `Sep–Dec` | 5 | 9,10,11,12 |
| `Nov–Feb` | 2 | 11,12,1,2 |
| `Aug–Oct` | 2 | 8,9,10 |
| `Apr–Jun, Sep–Nov` | 2 | 4,5,6,9,10,11 |
| `Mar–Jun` | 1 | 3,4,5,6 |
| `Mar–Oct` | 1 | 3–10 |
| `Spring, Summer` | 1 | 3,4,5,6,7,8 |
| `Winter (Snow), Autumn` | 1 | 12,1,2,9,10,11 |
| `Monsoon/Autumn` / `Autumn/Winter` | 2+1 | 6,7,8,9,10,11 / 9,10,11,12,1,2 |

Parser rules: split on `,`/`;`/`/`; normalize dashes; expand month ranges with wraparound (Oct→Mar);
map season names via the convention above; parenthetical month hints (e.g. "Monsoon (Jun–Sep)") use
the explicit months.

### 2b. Requires human verification — 4 variants, ~4 rows (DO NOT auto-map)

| Raw value | Count | Problem | Proposed handling |
|---|---|---|---|
| `Chisapani area` | 1 | not a season (looks like a misplaced location) | flag `season_unparsed`; human review |
| `Nov–Dec (every 5 yrs)` | 1 | periodic event, not an annual window | map base months 11,12 **+** flag `season_caveat` for human note |
| `All year, best Oct-Apr` / `All year, best Oct-Mar` / `All year, esp. Jan` | 3 | "best" sub-window ambiguity | map 1–12; optionally capture preferred sub-window after human review |
| `Mar-May (Rhododendron Bloom)` / `Mar–May (Sal tree blossoms)` / `Nov–Dec (every 5 yrs)` | 3 | annotated — months are clear but the annotation carries meaning | auto-map the months, **preserve** the annotation as a display note |

Honesty gate: any value that cannot be confidently parsed (e.g. `Chisapani area`) is stored as
`season_months = null` with `season_status = "unparsed"` and shown as "season data unavailable" — never
guessed.

---

## 3. difficulty_level — all 14 variants → {Easy, Moderate, Hard}

100% filled, 14 variants. Proposed enum: **Easy · Moderate · Hard**.

### 3a. Auto-normalizable — 11 variants, ~1,049 rows

| Raw | Count | → Enum | Rule |
|---|---|---|---|
| `Easy` | 538 | Easy | direct |
| `Very Easy` | 3 | Easy | collapse |
| `Moderate` | 413 | Moderate | direct |
| `Medium` | 12 | Moderate | synonym |
| `Hard` | 55 | Hard | direct |
| `Challenging` | 6 | Hard | synonym |
| `Very Difficult` | 3 | Hard | collapse |
| `High` | 1 | Hard | synonym |
| `Easy-Moderate` / `Easy–Moderate` / `Easy–Medium` | 9+4+6 | Moderate | **round up** to the harder bound (conservative/safe) |
| `Medium–Hard` | 4 | Hard | round up |
| `Moderate-High` | 2 | Hard | round up |

**Decision rule for hybrids:** round **up** to the harder tier, so difficulty is never understated
(safer for trekkers). This rule needs sign-off (see 3b).

### 3b. Requires human confirmation — 1 variant + the rounding policy

| Raw | Count | Issue | Proposed |
|---|---|---|---|
| `Hard (permit)` | 1 | difficulty + a permit flag conflated | map difficulty→Hard **and** set a separate `permit_hint = true`; human to confirm permit meaning |
| *(policy)* rounding hybrids up | 24 | "Easy-Moderate"→Moderate is a judgment call | **human to approve** the round-up rule before it's applied |

---

## 4. accessibility & transportation → proposed access normalization

Two separate columns. Finding: **`transportation` is unusable as a facet** (1,047 distinct values — it
is free-text travel directions like "From Kathmandu, drive to Dharan and continue uphill…", often
duplicated/garbled). Recommendation: **keep `transportation` as display-only prose; do not facet it.**

**`accessibility` (119 variants) is normalizable** to a small enum: **Road · Road+Hike · Trek ·
Fly-in**. The 119 variants are verbose phrasings of a few underlying modes.

### 4a. Auto-normalizable by keyword rules — majority of rows

Proposed keyword classifier (applied to lowercased `accessibility`):

| Target enum | Match rule (keywords) | Example raw values (count) | ~Rows |
|---|---|---|---|
| **Road** | contains road/highway/jeep AND no trek/hike/flight/trail | `Road` (351), `Road Accessible` (130), `Road Access` (80), `Accessible by road` (22) | ~760 |
| **Road+Hike** | road/jeep **and** hike/walk/short trek/short hike | `Road + Trek` (19), `Road/Trail` (17), `Road + Short Hike` (16), `Road + Trekking` (12) | ~140 |
| **Trek** | trail/trek/foot with no road | `Trail` (56), `Foot` (15), `Trek` (6), `Trek route` (6), `Long Trek (multi-day)` (5) | ~110 |
| **Fly-in** | flight/air/helicopter/lukla | `Flight + Trekking` (5), `Flight to Lukla + Trekking` (1), `Foot, Helicopter` (1) | ~10 |

### 4b. Requires human verification — ambiguous / mixed-signal values

| Raw value (examples) | Count | Why ambiguous | Proposed |
|---|---|---|---|
| `Road, Easy` / `Road, Moderate` | 17 / 7 | mixes access with difficulty | classify access=Road; **ignore** the difficulty token here (difficulty comes from §3) — confirm |
| `Trek route,Road accessible` / `Road accessible, trekking paths` | 2 | both road and trek asserted | default Road+Hike or Trek? human to pick |
| `Road + permit` / `Remote Trek, Challenging` | 1 / 1 | carries permit/difficulty signal | access=Road / Trek; surface permit/difficulty separately |
| long route descriptions (`Road access via Ilam Bazaar and local trails`, etc.) | ~30 one-offs | verbose; keyword rule should catch, but spot-check | auto-classify, then **human spot-check 20 samples** |
| `(empty)` transportation rows = `NO` (10) | 10 | placeholder, not data | treat as missing; display nothing |

Honesty gate: any `accessibility` value the classifier can't confidently bucket is stored as
`access_type = null` ("access info unavailable"), not guessed.

---

## 5. Coordinate validation (measured)

| Check | Result |
|---|---|
| Rows with numeric lat/lon present | 1,053 of 1,057 |
| Rows with a `°` degree suffix (parse as string, strip before use) | **294** |
| Rows with **non-numeric placeholder** coordinates (unreliable) | **4** |
| Rows inside Nepal bounds (26.3–30.5 N, 80.0–88.3 E) after cleaning | 1,049 of 1,053 numeric |
| Rows in **constant-increment runs** (likely interpolated/synthetic) | **187 rows across 26 runs** |

### 5a. The 4 placeholder-coordinate records (flag `coord_status = "unreliable"`, keep & display without map)
- row 820 **majibari** — lat `(Lamjung area)`, lon `(see source)`
- row 823 **yara (yara ghara area)** — lat `(Upper Mustang)`, lon `(approx)`
- row 824 **luri gompa** — lat `(approx)`, lon `(approx)`
- row 825 **chhusang** — lat `(approx)`, lon `(approx)`

These are **not discarded** — they remain in the catalog and in season/difficulty filters, but carry
no usable coordinate and must not be placed on a map.

### 5b. Interpolated-run pattern (flag `coord_status = "suspect"`)
26 runs of 4+ consecutive rows share an identical tiny step (dominant signature **+0.005, +0.005** per
row; example runs start at indices 98 (len 7), 106 (len 13), 119 (len 9)). This is a strong synthetic
signature — coordinates generated by linear interpolation for lesser-known places, not measured. These
187 rows are **kept and usable for season/difficulty filtering**, but their coordinates are flagged
`suspect` and should not be presented as precise map pins or used for distance/routing (relevant only
to deferred Phase-2 routing).

### 5c. Confidence tiers (proposed)
- `verified` — numeric, in-bounds, not in an interpolated run (~862 rows).
- `suspect` — numeric but in an interpolated run (187 rows).
- `unreliable` — placeholder/non-numeric (4 rows).

---

## 6. Missing & ambiguous values (surfaced, not dropped)

| Issue | Count | Handling |
|---|---|---|
| `best_season` unparseable (`Chisapani area`) | 1 | `season_status = unparsed`; human review |
| `best_season` with caveats/annotations | ~6 | map months + preserve note |
| `difficulty` hybrid needing round-up policy sign-off | 24 | pending human approval of the round-up rule |
| `difficulty` with embedded permit flag | 1 | split into difficulty + permit_hint |
| `accessibility` ambiguous/mixed | ~35 | classify + human spot-check |
| placeholder coordinates | 4 | `coord_status = unreliable` |
| interpolated coordinates | 187 | `coord_status = suspect` |
| `destination_image_path` missing | ~115 (10.9%) | show placeholder image; no fabrication |
| hotel/restaurant price `NO` | 805 (76%) | excluded from MVP entirely |

No record is removed. Every row remains filterable on the fields that *are* reliable (season,
difficulty, province, category), with explicit status flags where data is weak.

---

## 7. Auto-normalized vs. human-verification split (summary)

**Can be normalized automatically (deterministic rules, no judgment):**
- `best_season` → `season_months` for 52/56 variants (~1,043 rows).
- `difficulty_level` → enum for 11/14 variants (~1,025 rows of non-hybrid; hybrids pending policy).
- `accessibility` → `access_type` for the clear Road/Trek/Fly-in/Road+Hike cases (majority).
- Coordinate cleaning: strip `°`, numeric parse, bounds check, run-detection → `coord_status`.
- province code → name; category pass-through.

**Requires human verification before applying:**
- 4 `best_season` values (1 non-season, periodic/annotated cases).
- The difficulty **round-up policy** for 24 hybrid rows + the 1 permit-embedded value.
- ~35 ambiguous `accessibility` values + a 20-sample spot-check of the keyword classifier.
- Confirmation that `transportation` stays display-only (not faceted).
- Acknowledgement that 187 `suspect` + 4 `unreliable` coordinates will not power maps/routing.

---

## 8. Proposed data model (derived read-model — for approval)

A **derived, seed-time read-model** computed from existing columns. It is **not** a schema rewrite and
adds **no** scraped/fabricated data. Original CSV and current DB schema remain untouched until
approved.

```
DestinationFacets (derived at seed time, per destination)
├─ destination            : str        (from destination; key)
├─ province_name          : str        (province code 1–7 → name)
├─ district               : str        (pass-through)
├─ category               : str        (main_category, 7 values)
├─ season_months          : int[]|null (parsed from best_season; null = unparsed)
├─ season_status          : enum       ("parsed" | "unparsed" | "caveat")
├─ season_note            : str|null   (preserved annotation, e.g. "Rhododendron Bloom")
├─ difficulty             : enum       ("Easy" | "Moderate" | "Hard")
├─ difficulty_source      : str        (raw value, for traceability)
├─ permit_hint            : bool       (from "Hard (permit)" / "Road + permit")
├─ access_type            : enum|null  ("Road" | "Road+Hike" | "Trek" | "Fly-in" | null)
├─ access_raw             : str        (original accessibility text, display)
├─ transportation_prose   : str        (display-only; never faceted)
├─ latitude, longitude    : float|null (cleaned; null if unreliable)
├─ coord_status           : enum       ("verified" | "suspect" | "unreliable")
├─ description            : str
└─ image_path             : str|null   (null → placeholder, 10.9% of rows)
```

MVP filters operate on: `season_months` (month), `difficulty`, `province_name` (+ optional
`category`). `coord_status` gates map display. Cost/rating/popularity/travel-time are **absent by
design**.

---

## 9. Approval requested

Before any implementation (seed-time normalization script, filter endpoint, Explorer UI), please
confirm:

1. The **season convention** (Spring 3–5 / Summer 6–8 / Autumn 9–11 / Winter 12,1,2) and the 52
   auto-mappings in §2a.
2. The **difficulty round-up rule** for the 24 hybrid values (§3), and the `Hard (permit)` split.
3. The **access enum** {Road, Road+Hike, Trek, Fly-in} and that `transportation` stays display-only
   (§4).
4. The **coordinate confidence tiers** and that `suspect`/`unreliable` rows stay in the catalog but are
   excluded from maps/routing (§5).
5. The **derived data model** in §8.
6. That the ~40 human-verification items (§7) are reviewed by a person before the mappings are frozen
   (I can produce a reviewer worksheet listing each raw value + proposed mapping for sign-off).

No CSV, code, or schema has been changed. On approval, the next step is a read-only normalization
**script** that writes the derived facets (into a new table or a generated file — your choice), with a
coverage dashboard so data quality stays visible.
