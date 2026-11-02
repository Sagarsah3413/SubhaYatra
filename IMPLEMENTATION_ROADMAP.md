# SubhaYatra — Implementation Roadmap

Prioritized, phased development plan derived from `PROJECT_AUDIT.md` and `FEATURE_INVENTORY.md`.
Effort: **S** (< 0.5 day), **M** (0.5–2 days), **L** (> 2 days). No code was changed; this is a plan.

This roadmap has two complementary views:
- **Product Evolution Phases** (below) — the staged journey toward a Nepal Travel Intelligence
  Platform: *Destination discovery → Explainable recommendations → Travel feasibility →
  Constraint-based itinerary planning*, on a foundation of data reliability and stability.
- **Engineering Workstream** (further down) — the original fix-first tech-debt plan that *enables*
  those phases. The product phases reference its items rather than restating them.

Effort: **S** (< 0.5 day), **M** (0.5–2 days), **L** (> 2 days).

---

## Product Evolution Phases

The product matures in five dependency-ordered phases. Each lists its goal, what it depends on, and a
measurable outcome. Honesty rule from `STRATEGY_REVIEW.md` still applies: never ship capabilities the
data cannot support (notably budget estimation — see Phase 4).

### Phase 0 — Foundation & stabilization
**Goal:** data reliability, security, backend stability, and trustworthy infrastructure — the base
everything else stands on.
**Includes:** the normalization pipeline + derived `destination_facets` dataset (DONE — see
`NORMALIZATION_REPORT.md`), the Cohere key moved server-side (DONE), and the remaining Engineering
Workstream Phase 0 security items (Flask debug, `JWT_SECRET_KEY`, CORS, committed-secret history) and
the broken-endpoint fixes (Workstream Phase 1.1–1.3).
**Depends on:** nothing (it is the base).
**Measurable outcome:** no browser-exposed keys; no 500s on GET recommendations / chat search /
place moderation; ≥95% of destinations carry parsed season + normalized difficulty + access +
coordinate-confidence (currently met for season 1,052/1,057, difficulty 1,057/1,057, access
1,057/1,057).

### Phase 1 — Destination discovery  — **IMPLEMENTED (foundation)**
**Goal:** let travellers find destinations by month, difficulty, province, and accessibility over
trustworthy normalized data.
**Status:** The Explorer (`/explore`) is live — four AND-combined filters, pagination, verified-only
map pins, served by `GET /api/places/explore` + `/explore/options` over the derived facets.
**Depends on:** Phase 0 (normalized dataset + facets API).
**Measurable outcome:** all four filters + combined filtering return correct results against 1,057
destinations (verified in `EXPLORER_API_VERIFICATION.md`); filter-engagement and result→detail
click-through tracked per `STRATEGY_REVIEW.md` §6.5.

### Phase 2 — Explainable recommendations
**Goal:** evolve the rule-based recommender so every suggestion states *why* it matches (season,
difficulty, province, access), building on the Explorer's per-card "why this matches" line.
**Depends on:** Phase 1; Engineering Workstream 1.2 (fix GET recommendation endpoints).
**Measurable outcome:** 100% of returned recommendations carry a factual, field-derived reason; zero
recommendation endpoints 500; no claim of AI personalization.

### Phase 3 — Travel feasibility
**Goal:** add season/time feasibility — tell users whether a destination/region is advisable in their
travel month, with permit and difficulty flags. (Season windows only; **not** live weather — see
`STRATEGY_REVIEW.md` §5.)
**Depends on:** Phase 2; normalized `season_months` (DONE) and `permit_hint` (DONE); a curated
safety/permit source (external, not yet sourced).
**Measurable outcome:** every destination surfaces a season-window verdict for a chosen month;
feasibility advice is sourced from real fields or flagged "unavailable" — never guessed.

### Phase 4 — Constraint-based itinerary planning
**Goal:** generate geographically coherent, time-bounded itineraries from discovery + feasibility.
**Depends on:** Phase 3; persisted itineraries + unified Clerk auth (Engineering Workstream 1.4/1.5);
a road/trek travel-time matrix (external, not yet sourced).
**Measurable outcome:** a user can generate and save a multi-day, season-valid itinerary respecting a
day budget. **Budget-constrained planning stays DEFERRED** until real cost data exists (no reliable
cost data today — `STRATEGY_REVIEW.md` §2.1, hotel price 76% placeholder).

---

## Engineering Workstream (enabling tech-debt plan)

The original fix-first plan. Its items are the concrete enabling work the product phases above depend
on. Guiding principle: fix security and stability first (Workstream Phase 0), then make broken core
features work (Workstream Phase 1), then finish partial/UI-only features (Workstream Phase 2), then
pay down tech debt (Workstream Phase 3). Items already completed this cycle are marked **[DONE]**.

**Completed this cycle:** Cohere proxy (0.1 [DONE]), committed Clerk secret replaced with placeholder
in `.env.example` (0.2 partial — history scrub still pending), chat history persistence in the
fallback path (1.6 [DONE]), the Explorer + facets API (new Phase 1 product capability), and image
presentation fixes on the Explorer/detail pages.

---

## Phase 0 — Critical security & stability

| # | What | Why (impact) | Effort | Depends on | Affected files |
|---|---|---|---|---|---|
| 0.1 | Move Cohere chat behind a backend proxy; remove `VITE_COHERE_API_KEY` from client | Key is shipped to browsers today → theft/billing abuse | M | — | client/src/pages/ChatPage.jsx, new backend route in app/routes/chat_routes.py, app/ai.py or new cohere helper, client/src/services/chatService.js |
| 0.2 | Rotate the committed Clerk secret; replace with placeholder; scrub from git history | `client-server/.env.example` contains `sk_test_...` | S–M | — | client-server/.env.example (+ git history, Clerk dashboard) |
| 0.3 | Require a strong `JWT_SECRET_KEY`; remove hardcoded default (fail fast if unset) | Forgeable admin tokens in any misconfig | S | — | client-server/app/auth.py |
| 0.4 | Env-gate Flask debug (`debug=False` in prod) | Werkzeug debugger = RCE if exposed | S | — | client-server/app/__main__.py, app/app.py |
| 0.5 | Verify Clerk session server-side; stop trusting raw `X-Clerk-User-Id` on writes | Spoofable identity on `POST /api/places`, `/api/reviews` | M–L | 0.2 | app/auth.py (new verifier), app/routes/places.py, reviews.py, users.py |
| 0.6 | Fix `maintenance/create_admin.py` (NameError) and move admin creds to env | Script crashes; plaintext passwords in source | S | 0.3 | client-server/maintenance/create_admin.py |
| 0.7 | Env-drive CORS allowlist; remove stale hardcoded Vercel origin | Brittle/over-broad CORS with credentials | S | — | client-server/app/app.py |

Phase 0 exit: no secrets in VCS, no browser-exposed keys, debug off, admin auth hardened, admin
bootstrap script works.

---

## Phase 1 — Complete partially-functional / broken core features

| # | What | Why (impact) | Effort | Depends on | Affected files |
|---|---|---|---|---|---|
| 1.1 | Define `AdminLog` model (or reuse `Admin.log_action`) so place approve/reject/delete work | Admin place moderation 500s today | S–M | — | app/models.py, app/routes/places.py |
| 1.2 | Rewrite GET recommendation endpoints to use `db.session.query` and correct fields (`clerk_id`, `user_name`) | All GET `/recommendations/*` 500 | S | — | app/routes/recommendations.py |
| 1.3 | Fix chat search/search-history handlers to key on `clerk_id` (not `user_id`) | Chat search 500s | S | — | app/routes/chat_routes.py |
| 1.4 | Unify user auth so backend wishlist works for Clerk users (verified token or shared user-JWT); send credentials from `wishlistService` and `Detailpage` | Wishlist is non-functional end-to-end | M–L | 0.5 | app/auth.py, app/routes/wishlist.py, client/src/services/wishlistService.js, client/src/pages/Detailpage.jsx, Wishlist.jsx |
| 1.5 | Wire the itinerary planner to the backend (or formally keep it local and remove dead backend routes) | Backend itinerary is orphaned; planner data is device-local only | M | 1.4 | client/src/pages/Itinerary.jsx, app/routes/itinerary.py |
| 1.6 | Fix "new chat doesn't save history" — persist messages in the Cohere/fallback path (call `/api/chat/save-local`) and create the chat record reliably | Reported bug: sidebar stays empty | S–M | 0.1 | client/src/pages/ChatPage.jsx, app/routes/chat_routes.py |
| 1.7 | Single API-base-URL config module; replace hardcoded `http://localhost:8000` and reconcile `VITE_API_URL` vs `VITE_API_BASE_URL` | Breaks on any non-localhost deploy | S–M | — | client/src/services/*.js, client/src/pages/*.jsx (SearchBar, Detailpage, Itinerary, etc.) |
| 1.8 | Make email config consistent (one var set) and surface config status | Contact/newsletter email silently fails | S | — | client-server/app/email_service.py, app/routes/users.py |

Phase 1 exit: wishlist, itinerary, recommendations (GET), chat history/search, and place moderation
all work; app runs correctly against a non-localhost backend.

---

## Phase 2 — Finish UI-only / not-implemented features

| # | What | Why (impact) | Effort | Depends on | Affected files |
|---|---|---|---|---|---|
| 2.1 | Register & fix the similar-places feature (replace `SessionLocal` with `db.session`) or remove it | Detail pages reference similar places; currently dead | M | 1.1 | app/routes/similar_places.py, app/app.py |
| 2.2 | Decide on rooms/booking: implement a real model+routes or remove the stub | README advertises bookings that don't exist | M–L | — | app/routes/rooms.py, app/routes/schemas.py, app/models.py |
| 2.3 | Decide on the image upload API (`images.py`): register+fix or remove; keep Cloudinary path as the single uploader | Dead duplicate of Cloudinary flow | M | — | app/routes/images.py, app/app.py |
| 2.4 | Complete i18n key coverage and verify language switch across pages | Partial translations | M | — | client/src/i18n/locales/*, components using `t()` |
| 2.5 | Derive chat "database coverage" numbers from live DB counts | Hardcoded "1,057" is inaccurate vs 1,263 rows | S | — | app/ai.py, client/src/pages/ChatPage.jsx |

Phase 2 exit: no advertised-but-missing features; similar places works or is cleanly removed; copy
reflects real data.

---

## Phase 3 — Refactor, de-bloat, tests, performance

| # | What | Why (impact) | Effort | Depends on | Affected files |
|---|---|---|---|---|---|
| 3.1 | Remove duplicate pages/components | Maintenance burden, confusion | M | 2.x | client/src/pages/SearchResult.jsx, NepaliCalendar.jsx, components/header/Header.old.jsx, LocationDebugPanel.jsx; consolidate Detailpage vs PlaceDetailView and the three All*Detail pages |
| 3.2 | Remove dead backend files not kept in Phase 2 | Clarity | S | 2.1–2.3 | app/routes/deps.py, schemas.py, (rooms/images/similar_places if dropped), crud.py cleanup |
| 3.3 | De-bloat repo: move `similarity.pkl`/`svd.pkl`/`vectorizer.pkl`, `tourism.db`, and images to Git LFS or out of VCS; delete duplicate `datasets/project_imgfold` | ~16k tracked files, 8.5 MB pickle, dup 6,459-file folder → slow clones | M | — | .gitignore, datasets/, client-server/tourism.db, maintenance/archive/*.db |
| 3.4 | Add a training/build script that reproduces the pickles from the CSV | Pickles are unexplained binaries | M | 3.3 | new client-server/maintenance/train_similarity.py |
| 3.5 | Add tests: backend pytest (routes/models) + frontend vitest (services) | No tests today | L | 1.x | new tests/ in client-server and client |
| 3.6 | Make PlaceView tracking non-blocking / sampled | Write-on-read risks SQLite locks under load | S–M | — | app/routes/places.py |
| 3.7 | Align README/QUICK_START with actual models/routes/deps | Doc drift misleads contributors | S | 2.x | README.md, QUICK_START.md, TEAM_SETUP_GUIDE.md |
| 3.8 | Move admin token out of localStorage (httpOnly cookie / short-lived + refresh) | XSS token theft | M | 0.3 | client/src/pages/admin/*, app/routes/admin.py, auth.py |

Phase 3 exit: lean repo, reproducible ML artifacts, tests in CI, accurate docs, hardened admin
session handling.

---

## Recommended next steps (shortlist)

1. **Phase 0.1 + 0.2 + 0.4 first** — stop the active exposures: proxy Cohere, rotate/scrub the Clerk
   secret, turn off Flask debug. (Highest risk, low-to-medium effort.)
2. **Phase 1.1–1.3** — quick wins that stop 500s (AdminLog, GET recommendations, chat search).
3. **Phase 1.4 + 1.6** — restore the two features users already noticed were broken: wishlist and
   chat history. These depend on unifying the user-auth model (1.4), so tackle that early.
4. **Phase 1.7** — add a single API base-URL config so the app is deployable beyond localhost.
5. Then proceed to Phase 2/3 for feature completion and tech-debt paydown.

Note on user context: Itinerary paging & search, the Nepal-aware AI preamble, the chat header
overlap fix, and the USD/NPR/INR currency toggle are already present in the current code; the
remaining chat-specific gap is history persistence in the fallback path (Phase 1.6).
