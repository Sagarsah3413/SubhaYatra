# SubhaYatra — Project Audit

Senior-architect, read-only audit of the SubhaYatra Nepal tourism platform.
No source files were modified. Secrets are referenced by variable NAME only; no values are printed.

---

## 1. Executive summary

SubhaYatra is a React (Vite) frontend + Flask/SQLite backend + a light ML/rule layer for Nepal
tourism. The **discovery core works** (places/hotels/restaurants listing, search, and rule-based
recommendations against a seeded SQLite database of ~1,263 destinations). However, several
**user-facing features are broken** by (a) a split, inconsistent authentication model and
(b) copy-paste route bugs, and there are **multiple High-severity security issues**.

Top issues:
1. Cohere AI key used directly in browser (`VITE_COHERE_API_KEY`) — exposed to end users.
2. A Clerk **secret** key committed in `client-server/.env.example` (`sk_test_...`).
3. Backend wishlist & itinerary require an admin-style JWT the Clerk frontend never sends → 401;
   features survive only via localStorage/demo fallbacks.
4. Several routes crash at runtime (undefined `AdminLog`; `db.query/db.close` misuse; wrong model
   fields in chat/recommendation handlers).
5. Flask runs with `debug=True`; `JWT_SECRET_KEY` has a hardcoded default.
6. Repo bloat: committed DB, 8.5 MB pickle, and a duplicated 6,459-file image folder.

Overall maturity: strong UI breadth and a working data/discovery backend, undermined by security
exposure, auth mismatch, and dead/broken code paths. Fixable in a focused Phase 0–1.

---

## 2. Architecture overview

### Frontend (`client/`, Vite, port 5173)
- React 19, React Router 7, Tailwind 4, Clerk (`@clerk/clerk-react`), Leaflet, i18next, axios.
- `main.jsx` wraps the app in `ClerkProvider` (from `VITE_CLERK_PUBLISHABLE_KEY`).
- `App.jsx` defines all routes and the homepage (hero, category filters, `SearchBar`,
  `ExploreSection`, `FamousSpots`, `NaturePlaces`, floating chat button).
- Service layer in `src/services/` wraps backend calls; `useUserSync` syncs the Clerk user to the
  backend on login/logout.

### Backend (`client-server/`, Flask, port 8000)
- App-factory `create_app()` in `app/app.py`: configures SQLite (`tourism.db`), CORS (localhost +
  one Vercel origin, `supports_credentials=True`), initializes the DB, and registers 12 blueprints
  under `/api` (chat under `/api/chat`). Entry point `python -m app` (`__main__.py`,
  `debug=True`, 0.0.0.0:8000).
- Single ORM: Flask-SQLAlchemy `db` (`database.py`). `init_db` calls `db.create_all()` on startup.
- Auth: PyJWT for admins (`auth.py`); Clerk for users via `X-Clerk-User-Id` header (not verified).

### Data / ML
- `datasets/dataset_with_all_image_path.csv` (1,263 rows, 54 cols) seeded by `maintenance/seed_db.py`
  into places/hotels/restaurants/events.
- Recommendations endpoint = rule-based keyword/season/difficulty scorer.
- Pickles (`similarity.pkl` 8.5 MB, `svd.pkl`, `vectorizer.pkl`) used only by the **unregistered**
  `similar_places.py` as a fallback → effectively unused. No training script reproduces them.

### Integrations
Clerk (auth), Cohere (frontend chat AI), Cloudinary (image uploads), Gmail/SMTP (contact +
newsletter), OpenWeatherMap (weather, client), ExchangeRate-API (currency, client), OSM/Nominatim
(geocoding), Leaflet (maps). Backend `ai.py` is a hardcoded keyword responder (no model).

---

## 3. API route table (as registered in `app.py`)

Registered: users, places, hotels, restaurants, reviews, wishlist, search, recommendations, admin,
chat (`/api/chat`), contact, itinerary. NOT registered (dead): images, rooms, similar_places.

| Method | Path | File | Auth | Status |
|---|---|---|---|---|
| GET | /api/places, /<id>, /featured, /categories, /provinces, /search | places.py | none | OK |
| GET | /api/details/<type>/<name> | places.py | none | OK |
| POST | /api/places | places.py | none (spoofable headers) | Works (Cloudinary) |
| POST | /api/places/<id>/approve, /reject | places.py | admin | **Broken** (AdminLog undefined) |
| DELETE | /api/places/<id> | places.py | admin | OK |
| GET/POST/DELETE | /api/hotels* | hotels.py | public GET / admin writes | OK |
| GET/POST/DELETE | /api/restaurants* | restaurants.py | public GET / admin writes | OK |
| POST/GET | /api/reviews, /<id>, /stats | reviews.py | none | OK (Cloudinary) |
| PATCH/DELETE | /api/reviews/<id>/status, /<id> | reviews.py | admin | OK |
| GET/POST/DELETE | /api/wishlist/<clerk_id>[/<place_id>][/check] | wishlist.py | token_required | **Blocked** (frontend sends no JWT → 401) |
| GET/POST/PUT/DELETE | /api/itineraries[/<id>] | itinerary.py | token_required | **Blocked** (frontend uses localStorage) |
| POST | /api/recommendations | recommendations.py | none | OK (rule-based) |
| GET | /api/recommendations/<id>, /user/<id>, /stats | recommendations.py | none | **Broken** (db.query/db.close, bad fields) |
| GET/DELETE | /api/search, /search/history[/<id>] | search.py | X-Clerk-User-Id required | OK |
| POST | /api/users/sync, /logout, /subscribe, /unsubscribe | users.py | none | OK |
| GET | /api/users/me | users.py | clerk header | OK |
| POST | /api/contact | contact.py | none | OK (if SMTP set) |
| POST/GET | /api/admin/login, /refresh, /logout, /register | admin.py | mixed | OK |
| GET/POST | /api/admin/dashboard, /users*, /pending, /logs, /sessions, /search-history | admin.py | admin | OK |
| POST/GET | /api/chat/new, /message, /messages, /history, /send, /ai-reply, /save-local | chat_routes.py | none | Mostly OK |
| GET/POST/DELETE | /api/chat/search*, /search-history* | chat_routes.py | none | **Broken** (Chat.user_id / SearchHistory.user_id) |
| Static | /api/images/{destinations,hotels,restaurants}/<file> | app.py | none | OK |

---

## 4. Database model catalog (`app/models.py`)

| Model | Key fields | Relationships | Used by |
|---|---|---|---|
| User | clerk_id(uniq), email, name, role, session tracking + `session_history` JSON | — | users.py, admin.py, make_superadmin.py |
| Admin | username, password(hash), role, `session_history`, `action_log` JSON | — | admin.py, reviews.py, create_admin.py |
| Place | name, location, province, type, tags, description, image_url, all_images, lat/long, best_season, activities, difficulty_level, rating, status, source | hotels, restaurants, events, views, reviews, wishlisted_by | places.py, search.py, recommendations.py, similar_places.py, seed_db.py |
| Hotel | name, location, rating, price_range, place_id, images | place | hotels.py, search.py, places.py |
| Restaurant | name, location, rating, price_range, cuisine, place_id, images | place | restaurants.py, search.py, places.py |
| Attraction | name, location, place_id | place | (unused in registered routes) |
| Event | name, venue, month_season, event_type, place_id | place | places.py detail, seed_db.py |
| PlaceView | clerk_id, user_name, place_id, viewed_at | place | places.py (write-on-read), admin.py |
| Wishlist | clerk_id, place_id OR place_identifier + denormalized place fields | place | wishlist.py, admin.py |
| Review | name, email, place, place_id, rating, review, images, status | db_place | reviews.py, admin.py |
| Recommendation | clerk_id, user_name, age, phone, travellers, trip_duration, trip_type, travel_month, recommended_places | — | recommendations.py |
| Itinerary / ItineraryItem | clerk_id, title, dates, is_public, budget / day_number, place, activity | items ↔ itinerary; item→place | itinerary.py, admin.py |
| Newsletter | email(uniq), clerk_id, is_active, preferences | — | users.py, crud.py |
| Chat / Message | clerk_id, title, is_active / chat_id, sender, content | messages ↔ chat | chat_routes.py |
| SearchHistory | clerk_id, query, query_type, response_summary, is_favorite | chat_id→chats | chat_routes.py, search.py (raw SQL), admin.py |

Issues:
- **`AdminLog` referenced in `places.py` is not defined** → latent crash on place moderation.
- `search_history` is written with an extra `user_id` column via raw SQL in `search.py` that the
  `SearchHistory` model lacks → ORM/raw-SQL schema drift.
- Several handlers reference non-existent attributes (`Chat.user_id`, `SearchHistory.user_id`,
  `Recommendation.name`/`.user_id`).

---

## 5. Authentication analysis

- **Users:** Clerk on the frontend. Backend identifies users by the **unverified** `X-Clerk-User-Id`
  header (spoofable). No server-side Clerk token verification.
- **Admins:** backend PyJWT (HS256), access + refresh tokens, `@admin_required`/`@token_required`
  decorators. Admin frontend stores tokens in `localStorage`.
- **Mismatch:** `wishlist.py` and `itinerary.py` use `@token_required` (the admin JWT scheme), which
  Clerk users can't satisfy → their backend endpoints 401. The UI hides this with localStorage/demo
  data.
- **Weaknesses:** hardcoded `JWT_SECRET_KEY` default; in-memory token blacklist; unauthenticated
  write routes (`POST /api/places`, `POST /api/reviews`) trusting spoofable headers; hardcoded admin
  password in `maintenance/create_admin.py`.

---

## 6. Environment & deployment (variable NAMES only)

**Client:** `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_API_BASE_URL`, `VITE_COHERE_API_KEY`,
`VITE_WEATHER_API_KEY`, `VITE_CURRENCY_API_KEY`, `VITE_FACEBOOK_URL`, `VITE_INSTAGRAM_URL`.
**Server:** `CLERK_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
`EMAIL_USER`, `EMAIL_PASSWORD`, `SMTP_SERVER`, `SMTP_PORT`, `SENDER_EMAIL`, `SENDER_PASSWORD`,
`JWT_SECRET_KEY`, `COHERE_API_KEY` (README only).

Risks: `client-server/.env.example` commits a Clerk **secret** key (HIGH); `client/.env.example`
commits a Clerk publishable key (low). Two different email var sets (`EMAIL_*` vs `SENDER_*`).
No `vercel.json`; root `package.json` near-empty with stray deps. Flask served via `python -m app`
with `debug=True`. `.gitignore` covers only `client-server/tourism.db`; a 1.8 MB `tourism.db`,
pickles, and ~16k files (images) are tracked.

---

## 7. Security / performance / maintainability issues (ranked)

### HIGH
| Issue | File(s) | Impact | Recommended fix |
|---|---|---|---|
| Cohere key in browser | client/src/pages/ChatPage.jsx (`VITE_COHERE_API_KEY`) | Key scraped & abused; billing risk | Proxy chat via backend endpoint holding the key |
| Committed Clerk secret | client-server/.env.example (`CLERK_API_KEY=sk_test_...`) | Leaked secret → account access | Rotate in Clerk, use placeholder, scrub git history |
| Hardcoded JWT secret default | client-server/app/auth.py | Forgeable admin tokens | Fail fast if `JWT_SECRET_KEY` unset; strong secret |
| Unauth write endpoints trust spoofable headers | places.py `POST /api/places`, reviews.py `POST /api/reviews` | Spam, forged attribution | Verify Clerk session server-side |
| Flask `debug=True` | client-server/app/__main__.py | Werkzeug debugger RCE if exposed | Env-gate debug; never on in prod |
| Admin JWT in localStorage | client/src/pages/admin/Dashboard.jsx, UserStatsCard.jsx | XSS token theft | httpOnly cookie / short-lived tokens |

### MEDIUM
| Issue | File(s) | Impact | Fix |
|---|---|---|---|
| Undefined `AdminLog` | places.py `_moderate` | approve/reject place 500s | Define model or reuse `Admin.log_action` |
| `db.query`/`db.close` + wrong fields | recommendations.py GET endpoints | 500 on all GET recs | Use `db.session.query`, correct fields |
| `Chat.user_id`/`SearchHistory.user_id` | chat_routes.py search* | 500 on chat search | Key on `clerk_id` |
| Auth-model mismatch | wishlist.py, itinerary.py vs frontend | user wishlist/itinerary 401 | Unify on verified Clerk tokens |
| Inconsistent API base URL | services + pages | breaks off-localhost | Single config module |
| Hardcoded CORS incl. stale Vercel URL | app.py | brittle deploys | Env-driven allowlist |
| create_admin.py NameError + plaintext creds | maintenance/create_admin.py | script fails; secrets in source | Parametrize; env creds |
| No tests; Pydantic imported but uninstalled | repo-wide; routes/schemas.py | regressions; dead code | Add pytest/vitest; remove/wire schemas |
| Write-on-read PlaceView | places.py GET `/places/<id>` | SQLite lock/perf under load | Make async/sampled or non-blocking |

### LOW
| Issue | File(s) | Impact | Fix |
|---|---|---|---|
| Repo bloat (DB, pickles, dup images) | datasets/, tourism.db | slow clones | Git LFS / remove from VCS; dedupe |
| Dead code | Header.old.jsx, images/rooms/similar_places/deps/schemas.py, unrouted pages | confusion | Remove or wire up |
| Doc drift | README.md, QUICK_START.md | onboarding errors | Align docs to code |
| Hardcoded "1,057" counts | ai.py, ChatPage.jsx | misleading copy | Derive from DB counts |

---

## 8. Duplication & dead code

- **Pages:** `SearchResult.jsx` (unrouted) vs `SearchResultPageNew.jsx` (routed);
  `Detailpage.jsx` (`/details`) vs `PlaceDetailView.jsx` (`/place/:id`);
  `AllNatureDetail`/`AllPlacesDetail`/`AllSpotsDetail` (near-identical listings);
  `ExploreNepal` (page) vs `ExploreSection` (homepage section);
  `NepaliCalendar.jsx` page not routed (header uses `CalendarModal`).
- **Components:** `header/Header.old.jsx` (stale), `header/LocationDebugPanel.jsx` (debug).
- **Backend dead/unregistered:** `routes/images.py`, `routes/rooms.py`, `routes/similar_places.py`,
  `routes/deps.py`, `routes/schemas.py`; `crud.py` partially used; `maintenance/archive/` with two
  empty `.db` files.
- **Data:** `datasets/project_imgfold` (6,459 files) duplicates `datasets/destination_images`.

See `IMPLEMENTATION_ROADMAP.md` for the prioritized plan and `FEATURE_INVENTORY.md` for per-feature
status.
