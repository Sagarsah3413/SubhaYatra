# Data Review Worksheet — Human Sign-off

Companion to `DATA_READINESS_REPORT.md`. This worksheet lists **only** the values that need human
judgment before the normalization mappings are frozen. For each, fill the **Approved mapping** column
(and add a note if you override the proposal). Deterministic auto-mappings are **not** listed here —
they are shown once at the end for reference and need no row-by-row sign-off.

All frequencies are measured directly from
`client-server/datasets/dataset_with_all_image_path.csv` (1,057 rows). No CSV, code, DB, or existing
report was modified. No value or count was invented.

**Legend:** `DET` = deterministic rule (listed for confirmation only, low risk) · `JUDG` = judgment
call (reviewer decision needed).

---

## Section A — Season (best_season) exceptional values

These are the free-text season entries the parser cannot safely auto-resolve, or that carry meaning
beyond plain months. The 52 clean variants (~1,043 rows) are deterministic and not listed here.

| # | Raw value | Count | Type | Proposed mapping | Reason for uncertainty | **Approved mapping** |
|---|---|---|---|---|---|---|
| A1 | `Chisapani area` | 1 | JUDG | `season_months = null`, `status = unparsed` | Not a season at all — looks like a misplaced location string | ____________ |
| A2 | `Nov–Dec (every 5 yrs)` | 1 | JUDG | months {11,12} + `season_note = "every 5 yrs"` | Months are clear but event is periodic, not an annual window | ____________ |
| A3 | `All year, best Oct-Apr` | 1 | JUDG | months {1–12} + note "best Oct–Apr" | "best" sub-window: keep all-year, or narrow to Oct–Apr? | ____________ |
| A4 | `All year, best Oct-Mar` | 1 | JUDG | months {1–12} + note "best Oct–Mar" | same ambiguity as A3 | ____________ |
| A5 | `All year, esp. Jan` | 1 | JUDG | months {1–12} + note "esp. Jan" | same ambiguity as A3 | ____________ |
| A6 | `Mar-May (Rhododendron Bloom)` | 1 | DET | months {3,4,5} + note "Rhododendron Bloom" | Months unambiguous; confirm we preserve the annotation as a display note | ____________ |
| A7 | `Mar–May (Sal tree blossoms)` | 1 | DET | months {3,4,5} + note "Sal tree blossoms" | same as A6 | ____________ |

Season items needing a reviewer decision: **5 JUDG (A1–A5)** + **2 DET to confirm (A6–A7)**.

---

## Section B — Difficulty (difficulty_level)

Target enum: **Easy / Moderate / Hard**. The 10 single-tier variants (Easy, Very Easy, Moderate,
Medium, Hard, Challenging, Very Difficult, High — ~1,025 rows) are deterministic (see reference list).
Listed below: the **hybrid/range values** (24 rows) whose resolution depends on the **round-up
policy**, plus the 1 permit-embedded value.

**Policy to approve first:** hybrids round **up** to the harder tier (never understate difficulty).
If you reject this, mark each row individually.

Policy decision — round hybrids up to harder tier?  ☐ Approve   ☐ Reject (resolve per-row below)

| # | Raw value | Count | Type | Proposed (round-up) | Reason for uncertainty | **Approved mapping** |
|---|---|---|---|---|---|---|
| B1 | `Easy-Moderate` | 9 | JUDG | Moderate | Hybrid — round up vs. average | ____________ |
| B2 | `Easy–Medium` | 6 | JUDG | Moderate | Hybrid (en-dash + synonym) | ____________ |
| B3 | `Easy–Moderate` | 4 | JUDG | Moderate | Hybrid (en-dash) — same as B1 | ____________ |
| B4 | `Medium–Hard` | 4 | JUDG | Hard | Hybrid — round up | ____________ |
| B5 | `Moderate-High` | 2 | JUDG | Hard | "High" treated as Hard; round up | ____________ |
| B6 | `Hard (permit)` | 1 | JUDG | difficulty = Hard **+** `permit_hint = true` | Conflates difficulty with a permit flag — split into two fields | ____________ |

Hybrid rows covered: 9+6+4+4+2 = **25 rows** across B1–B5 (the report's "~24"; exact = 25), plus B6.
Difficulty items needing decision: **6 rows-of-distinct-values (B1–B6)** + **1 policy toggle**.

---

## Section C — Accessibility

Target enum: **Road / Road+Hike / Trek / Fly-in** (classified from `accessibility`). The clear
single-mode phrasings are deterministic (see reference). Listed below: values that mix access with
difficulty, assert two modes at once, or carry a permit signal.

Policy to approve first: when an `accessibility` value also contains a difficulty word
(e.g. "Road, Easy"), **ignore the difficulty token here** (difficulty comes only from Section B).
Approve?  ☐ Yes   ☐ No

| # | Raw value | Count | Type | Proposed access_type | Reason for uncertainty | **Approved mapping** |
|---|---|---|---|---|---|---|
| C1 | `Road, Easy` | 17 | JUDG | Road (ignore "Easy") | Access + difficulty mixed in one field | ____________ |
| C2 | `Road, Moderate` | 7 | JUDG | Road (ignore "Moderate") | same as C1 | ____________ |
| C3 | `Road + Trek, Moderate` | 2 | JUDG | Road+Hike (ignore "Moderate") | Dual mode + difficulty token | ____________ |
| C4 | `Trek route,Road accessible` | 1 | JUDG | Road+Hike **or** Trek? | Asserts both road and trek — tie-break needed | ____________ |
| C5 | `Road accessible, trekking paths` | 1 | JUDG | Road+Hike **or** Trek? | same tie as C4 | ____________ |
| C6 | `Road Accessible, possibly walking trails in remote wards` | 1 | JUDG | Road (or Road+Hike?) | "possibly" — hedged secondary mode | ____________ |
| C7 | `Road Accessible,Short hike from nearest roadhead` | 1 | JUDG | Road+Hike | Confirm short-hike ⇒ Road+Hike | ____________ |
| C8 | `Road accessible,short hike from nearest roadhead` | 1 | JUDG | Road+Hike | same as C7 (case variant) | ____________ |
| C9 | `Road Accessible,walking` | 1 | JUDG | Road+Hike (or Road?) | "walking" ambiguous (urban walk vs hike) | ____________ |
| C10 | `Remote Trek, Challenging` | 1 | JUDG | Trek (ignore "Challenging") | Trek + difficulty token | ____________ |
| C11 | `Road + permit` | 1 | JUDG | Road **+** `permit_hint = true` | Carries a permit signal to surface separately | ____________ |

Accessibility items needing decision: **11 distinct values (C1–C11)** + **1 policy toggle** + a
**20-sample spot-check** of the auto-classifier on the remaining verbose one-off phrasings
(e.g. "Road access via Ilam Bazaar and local trails") — tick when done: ☐

---

## Section D — Coordinates

No per-value mapping to fill — these are acknowledgements of how flagged coordinates are treated.
Confirm each policy.

| # | Issue | Count | Type | Proposed handling | **Approve? (Y/N)** |
|---|---|---|---|---|---|
| D1 | Placeholder/non-numeric coords (e.g. `(approx)`, `(Upper Mustang)`) | 4 | JUDG | `coord_status = unreliable`; keep record & filters; **no map pin** | ______ |
| D2 | Interpolated runs (+0.005/+0.005 signature) | 187 (26 runs) | JUDG | `coord_status = suspect`; usable for filtering; **not for maps/routing** | ______ |
| D3 | Degree `°` suffix present | 294 | DET | strip `°`, parse numeric (confirm) | ______ |
| D4 | In-bounds verified coords | ~862 | DET | `coord_status = verified` (confirm bounds 26.3–30.5 N, 80.0–88.3 E) | ______ |

The 4 unreliable records (for D1 reference): `majibari`, `yara (yara ghara area)`, `luri gompa`,
`chhusang`.

---

## Reference — deterministic mappings (NO sign-off needed; shown for transparency)

These apply automatically; listed so the reviewer can see what is *not* up for debate.

**Season (sample of 52 auto-mapped variants):** `Oct–Dec`→{10,11,12} (245) · `All Year`/`Year-round`→
{1–12} (225) · `Oct–Mar`→{10,11,12,1,2,3} (170) · `Spring/Autumn` family→{3,4,5,9,10,11} (108) ·
`Mar–May, Sep–Nov` family→{3,4,5,9,10,11} (103) · `Sep–Nov`→{9,10,11} (35) · `Mar–Nov`→{3–11} (31) · …

**Difficulty (single-tier, deterministic):** `Easy` (538) & `Very Easy` (3) → Easy · `Moderate` (413)
& `Medium` (12) → Moderate · `Hard` (55), `Challenging` (6), `Very Difficult` (3), `High` (1) → Hard.

**Accessibility (clear single-mode, deterministic):** `Road`/`Road Accessible`/`Road Access`/
`Accessible by road` → Road · `Trail`/`Foot`/`Trek`/`Trek route` → Trek · `Road + Short Hike`/
`Road/Trail`/`Road + Trekking` → Road+Hike · `Flight + Trekking`/`Flight to Lukla + Trekking` → Fly-in.

**Note:** `transportation` (1,047 distinct free-text values) is **display-only**, never faceted — no
sign-off needed.

---

## How to complete this worksheet
1. Tick the three **policy toggles** (difficulty round-up, accessibility difficulty-token rule) and
   the coordinate policies (D1–D4).
2. Fill the **Approved mapping** column for A1–A7, B1–B6, C1–C11 (accept the proposal or override).
3. Do the C spot-check of the auto-classifier and tick it.
4. Return the file; the frozen mappings then drive the read-only normalization script.
