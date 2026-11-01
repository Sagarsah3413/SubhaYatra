# Strategy Review — Critique of PRODUCT_STRATEGY.md

A product reviewer's critical companion to `PRODUCT_STRATEGY.md`. It does **not** replace that
document; it records where the strategy must be corrected before any build. Every claim here is tied
to evidence from a direct, read-only inspection of the seed dataset and the recommender code. No
application code was modified.

**Evidence base (independently re-verified for this review):**
`client-server/datasets/dataset_with_all_image_path.csv` — **1,057 rows, 55 columns**. Field checks
via the project venv (`csv` module):

| Field | Fill | Distinct | Note |
|---|---|---|---|
| destination | 100% | 1,057 | unique names |
| province | 100% | 7 | coded 1–7 (needs label map) |
| district | 100% | 113 | |
| main_category | 100% | 7 | clean taxonomy |
| best_season | 100% | 56 | **free-text ranges** ("Oct–Dec", "All Year") |
| difficulty_level | 100% | 14 | inconsistent variants (Easy–Moderate / Medium / …) |
| latitude / longitude | 100% | 678 / 740 | ~300 carry a `°` suffix; ~133 in constant-increment runs (likely interpolated) |
| destination rating | — | — | **no rating column exists**; `attraction_total_reviews` implausible (700k+) |
| destination cost/budget | — | — | **no field**; only `hotel_price_1..3`, of which **805/1,057 (76.2%) = placeholder "NO"** |

---

## 1. Verdict in one line

`PRODUCT_STRATEGY.md` is honest about the *data* but still proposes three "differentiators," two of
which the data cannot support and competitors already do. Cut to the one thing that is both real and
uncrowded — a **structured, filterable season / difficulty / access layer** — and ship it as a
one-week MVP. Everything heavier is gated on that MVP showing demand.

---

## 2. The seven corrections (what changed and why)

### 2.1 Re-grade the "Constraint-aware Route Builder" to *Hard / needs new data*
- **Original claim:** feasible now on existing data (time + geography version).
- **Rejected because:** the route builder needs a road/trek **travel-time matrix that does not exist**
  in the dataset. The strategy calls it "a small curated table" — this is wrong. Across 1,057
  destinations it is hundreds of curated edges at minimum, trek times vary by fitness and season, and
  Nepal road-time data is patchy. This is a major data-authoring project, equal in risk to the budget
  gap, not an MVP input.
- **Compounding limitation:** geographic sequencing relies on coordinates, and ~133 rows (~13%) sit in
  suspicious constant-increment runs (likely interpolated for lesser-known places) — so routing would
  misplace exactly the obscure destinations feature #3 wants to surface.
- **Decision:** **Deferred to Phase 2+**, dependency flagged as a first-class blocker.

### 2.2 Demote "Off-the-Beaten-Path Discovery" from core differentiator
- **Original claim:** a core differentiator (dataset is heavy on rural/lesser-known places).
- **Rejected because:** honest ranking of "hidden" places needs a trustworthy **popularity/obscurity
  signal** — which the strategy itself admits we do not have (no reliable rating; review counts are
  implausible). You cannot headline a feature you have shown you cannot rank honestly.
- **Compounding limitation:** the lesser-known rows are the ones with the suspect coordinates (2.1).
- **Decision:** **Deferred** until a credible popularity signal and cleaned coordinates exist.

### 2.3 Reframe the lead differentiator as a *data layer*, not a planner
- **Original claim:** the planner/route-builder is the headline.
- **Changed because:** the planner is crowded (Section 3) and data-blocked (2.1). The one asset the
  data genuinely backs is **structured When/Where/Access facts** (season + difficulty + province +
  category, all 100% filled). The defensible move is exposing that as a **filterable layer**, not as
  prose. See Section 3 for the honest competitive framing (no "unique" claim without evidence).
- **Decision:** lead with the **structured destination-intelligence layer**; the planner becomes a
  later view on top of it.

### 2.4 Split "Season & Safety Advisor"
- **Season (retained, Phase 1):** `best_season` is 100% filled and parseable into month ranges. Doable
  on existing data with careful normalization.
- **Safety (deferred):** requires an authoritative source (Nepal Tourism Board) that has **no API**
  (manual curation that drifts) plus real-time risk (landslides, closures) we have **no feed** for.
  Shipping "safety" on guesswork would be dangerous and dishonest.
- **Decision:** ship **Season**, defer **Safety** until a real, maintainable source is committed.

### 2.5 Replace the MVP with a single-filter Explorer
- **Original MVP:** auth fix + itinerary persistence + Season Advisor + Route Builder — three large
  efforts.
- **Changed because:** that is not the *smallest useful* thing and it front-loads the blocked/hard
  work. The smallest thing that tests the core thesis is a **month + difficulty + province filter over
  existing destinations** (Section 6). It needs no travel-time matrix, no budgets, no routing, no auth
  changes, no new external API.
- **Decision:** MVP = the filter Explorer; everything else is Phase 2+.

### 2.6 Add a "demand is unvalidated" risk
- **Gap:** the strategy scrutinizes data rigorously but never admits it has **no evidence anyone wants
  a Nepal trip planner**. "Travelers want a constraint-aware plan" is a hypothesis stated as a problem.
- **Decision:** demand validation is now the MVP's explicit *purpose* (Section 7), and an open risk.

### 2.7 Fix the weather-data assumption
- **Error:** the strategy lists **OpenWeatherMap** as the cheap enabler for season windows.
  OpenWeatherMap provides a **5–7 day forecast**, which cannot tell anyone whether October suits the
  Annapurna Circuit. Season windows require **climate normals** (historical monthly patterns), a
  different data product.
- **Decision:** the MVP's seasonality comes **only** from the parsed `best_season` field (editorial,
  from the dataset), with **no live-weather claim**. If live climate context is wanted later, source
  normals explicitly (Section 5).

---

## 3. Competitive reality — no "unique advantage" claimed

Per the added requirement, this review makes **no claim of unique competitive advantage**. Here is
what already exists and what SubhaYatra could do *differently* (not "uniquely").

**What existing platforms already offer** (observed via web search; rephrased for licensing
compliance):
- **Trip/route planning with travel times and reference budgets:** NepaYatra, Find Your Nepal,
  TakeYourBackpack's Nepal planner, AI-trek tools (peaknepal/TrekkrOS).
- **Best-time-to-visit / season guidance:** every trekking agency, Lonely Planet, and the Nepal
  Tourism Board publish this.
- **Permit / TIMS information:** the Nepal Tourism Board and registered agencies, authoritatively.
- **"Hidden gems" lists:** standard travel-blog and portal content.
- **Discovery, hotels, restaurants, reviews, maps, chatbot:** global commodity (Google, Booking,
  TripAdvisor).

**What SubhaYatra could do differently (a usability angle, not a data monopoly):**
Existing sources publish season/difficulty/permit facts as **unstructured prose, one article per
destination or trek**. The *difference* SubhaYatra can offer is making those same facts **structured
and queryable across all of Nepal at once** — e.g. "show everything worth visiting *in October* that
is *Easy* in *Gandaki province*." The facts are not proprietary; the **structured, filterable
presentation** is the differentiator.

**Honest caveat:** this is a UX/data-structuring advantage, **not a defensible moat**. The underlying
facts are public and copyable, and a competitor could structure them too. The only durable edge would
be **sustained editorial quality and coverage** — which is ongoing labor, not code. This review does
**not** assert the layer is unique; it asserts it is *currently under-served in structured form*, which
is a weaker but evidence-supported claim.

---

## 4. The structured When/Where/Access data model (target shape)

This is the normalization the MVP produces at **seed time** from fields the dataset already has. It is
a derived read-model, **not** a schema rewrite and **not** new scraped data.

Per destination (derived from existing columns):

| Attribute | Derived from | Transformation | Confidence |
|---|---|---|---|
| `season_months` | `best_season` (free text, 56 variants) | parse ranges → 12-slot month set (bitmask or array) | Medium — parser must handle "All Year", dual ranges, en-dash/hyphen |
| `difficulty` | `difficulty_level` (14 variants) | normalize → enum {Easy, Moderate, Hard} | Medium — collapse `Medium`→Moderate, `Easy–Moderate`→pick rule |
| `province` | province code 1–7 | map code → official province name | High |
| `district` | `district` | trim/standardize | High |
| `category` | `main_category` (7 values) | pass-through | High |
| `access_type` | `accessibility`/`transportation` (119 variants) | normalize → {Road, Trail, Road+Trek, …} | Low–Medium — free text, needs a mapping table |
| `coordinates` | `latitude`/`longitude` | strip `°`; validate within Nepal (26.3–30.5 N, 80–88.3 E); **flag** constant-increment rows | Medium — ~13% suspect, must carry a `coord_confidence` flag |
| `coord_confidence` | derived | `verified` \| `suspect` (synthetic-run heuristic) | — |

**Explicitly excluded from the model (no reliable source):** cost/budget, destination rating/
popularity, travel time between destinations, real-time safety. These are absent or untrustworthy in
the data and must not be synthesized.

---

## 5. Seasonality data — requirements and source limitations

- **MVP source:** the dataset's `best_season` field only (100% filled, editorial). It yields a
  *static, editorial* "best months" set per destination — adequate to answer "what suits October."
- **What it is NOT:** it is not live weather, not a forecast, not climate-normal modeling. The MVP must
  present it as **editorial guidance from curated data**, with no real-time or predictive claim.
- **Known limitations:**
  - 56 distinct free-text variants → the parser will have edge cases; un-parseable values must fall
    back to "season data unavailable," never a guess.
  - The field's own accuracy is unverified (it came with the dataset); treat it as **claimed, not
    validated**. The data-validation step (Section 6.3) spot-checks it.
- **If live/climate context is wanted later (Phase 2+):** source **climate normals** (e.g. historical
  monthly temperature/precipitation), not OpenWeatherMap forecasts. OpenWeatherMap's existing key is
  fine for a *current conditions* widget but cannot power season windows.

---

## 6. The one-week MVP — "Best Time & Access" Explorer

A filterable explorer over the existing 1,057 destinations, built entirely on verified fields. Its
real job is to **test demand** for structured Nepal trip intelligence before investing in the hard
(route/budget/safety) work.

### 6.1 Exact scope
- A single Explorer view with three filters: **Month**, **Difficulty**, **Province** (category
  optional if cheap).
- Returns the destinations whose parsed `season_months` include the chosen month, filtered by
  difficulty/province, ordered by season fit then category diversity.
- Each result shows a structured chip row: **best months · difficulty · province/district · access
  type**, plus the existing name, image, and description.
- Reuses existing destination data and the existing listing UI components; adds the derived fields at
  seed time and one filter endpoint. **No new page framework, no redesign.**

### 6.2 Required data fields (all already present; see Section 4)
- Input to derivation: `best_season`, `difficulty_level`, `province`, `district`, `main_category`,
  `accessibility`/`transportation`, `latitude`, `longitude`, `destination`, `description`, image path.
- Derived at seed time: `season_months`, normalized `difficulty`, province label, `access_type`,
  cleaned coordinates + `coord_confidence`.
- **Not required / not used:** any cost, rating, travel-time, or safety field.

### 6.3 Data validation process (do this before shipping — the MVP's integrity depends on it)
1. **Season parser audit:** parse all 1,057 `best_season` values; report the count that parse cleanly
   vs. fall back to "unavailable." Manually eyeball 30 random parsed results against the raw string.
2. **Difficulty normalization audit:** map all 14 variants to the 3-enum; have a human confirm the
   mapping table (e.g. does "Medium" = Moderate?).
3. **Coordinate validation:** strip `°`, check Nepal bounds, mark the constant-increment runs as
   `suspect`; report the verified-vs-suspect split. Suspect rows still display but without any
   map/precision claim.
4. **Access normalization:** build the free-text→enum mapping for `accessibility`; flag unmapped
   values.
5. **Honesty gate:** any destination whose season can't be parsed shows "season data unavailable" —
   never a fabricated month. Ship the coverage numbers publicly in an internal dashboard so the team
   sees real data quality.

### 6.4 User journey
1. User lands on Explorer, picks **"I'm travelling in October," difficulty "Easy," province "any."**
2. Sees a ranked list of destinations whose curated best-months include October, each with a clear
   season/difficulty/access chip row.
3. Opens a destination → existing detail view, now showing the structured When/Where/Access facts up
   front.
4. (Measurement) The session is the test: did the user filter, refine, and open results — i.e. does
   structured season/access browsing create engagement the generic listing did not?

### 6.5 Success metrics
- **Filter engagement rate:** % of Explorer sessions that apply ≥1 filter and change it ≥once
  (primary — tests whether structured intelligence is wanted).
- **Result→detail click-through:** % of filtered sessions that open a destination from results.
- **Season-data coverage:** % of catalog with a cleanly parsed `season_months` (data-quality KPI,
  reported honestly).
- **Coordinate confidence:** verified-vs-suspect ratio (data-quality KPI).
- **Return-to-refine:** sessions that return to re-filter (weak signal of planning intent).
- **Explicitly avoid vanity metrics:** total destinations listed, pageviews, chatbot message counts.

### 6.6 Explicitly out of scope (do NOT build in the MVP)
- Budget / cost estimation — no reliable cost data (76% placeholder; no destination field).
- Route planning / travel-time sequencing — no travel-time matrix; suspect coordinates.
- Safety advisories — no authoritative, maintainable source or real-time feed.
- Hidden-destination ranking — no trustworthy popularity signal.
- Itinerary persistence, wishlist, auth changes — valuable but separate; not needed to test demand.
- Live weather / climate modeling — forecast ≠ season window.
- ML similarity / SVD — no training data or script; drop.

---

## 7. Demand-validation risk (the risk the strategy omitted)

- **We have zero evidence that users want a Nepal trip-intelligence tool.** The problem statement is a
  reasonable hypothesis, not a validated need. The entire reposition rests on it.
- **The MVP exists primarily to retire this risk cheaply.** If the single-filter Explorer shows no
  filter engagement, the "intelligence/planning" thesis is likely dead — and we will have learned it in
  ~one week instead of after building routing, budgets, and a safety pipeline.
- **Decision rule:** do not fund Phase 2 (route builder, persisted itineraries, external data
  sourcing) until the MVP shows meaningful filter-engagement and result click-through. Define the
  threshold *before* launch to avoid rationalizing a weak result.

---

## 8. What the original strategy got right (retain unchanged)

- Killing budget-constrained planning on evidence (no cost data).
- Removing rooms/booking and the dead ML pickles.
- De-emphasizing hotels/restaurants/discovery as commodity.
- Naming the auth/persistence debt as a hard blocker for any *saved* planning (still true — just not
  needed for the demand-test MVP).
- Admitting the real moat, if any, is sustained editorial labor, not code.

---

### Sources
- `PRODUCT_STRATEGY.md` (document under review) and the audit docs it cites.
- Dataset: `client-server/datasets/dataset_with_all_image_path.csv` — read-only re-verification
  (1,057 rows, 55 cols; field fill/distinct counts and the 76.2% hotel-price placeholder confirmed
  directly).
- Code: `client-server/app/routes/recommendations.py`, `client-server/app/models.py`.
- Competitive context (web search; rephrased for licensing compliance): NepaYatra, Find Your Nepal,
  TakeYourBackpack Nepal planner, peaknepal/TrekkrOS, Nepal Tourism Board. No unique-advantage claim is
  made on the basis of these.
