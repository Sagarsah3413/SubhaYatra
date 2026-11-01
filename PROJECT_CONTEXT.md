# SubhaYatra — Project Context

Concise orientation for a Nepal-focused tourism platform. Derived from `PROJECT_AUDIT.md`,
`FEATURE_INVENTORY.md`, and `IMPLEMENTATION_ROADMAP.md`.

## Architecture & tech stack
- **Frontend:** React 19 + Vite (port 5173), React Router 7, Tailwind 4, Clerk auth, Leaflet maps,
  i18next, axios.
- **Backend:** Flask app-factory `create_app()` (port 8000), Flask-SQLAlchemy over SQLite
  (`tourism.db`), 12 blueprints registered under `/api`. Run via `python -m app`.
- **Data/ML:** ~1,263-destination CSV seeded into the DB; recommendations are a rule-based
  keyword/season/difficulty scorer. Pickles (`similarity.pkl`, `svd.pkl`, `vectorizer.pkl`) are
  effectively unused (only the unregistered `similar_places.py` references them).
- **Integrations:** Clerk, Cohere (frontend chat), Cloudinary (uploads), Gmail/SMTP, OpenWeatherMap,
  ExchangeRate-API, OSM/Nominatim.

## Key folders
- `client/src/pages/` — ~30 pages (Explore, FamousSpots, Itinerary, ChatPage, admin/, detail pages).
- `client/src/services/` — API wrappers (places, hotels, chat, wishlist, recommendation, currency…).
- `client/src/components/`, `contexts/`, `hooks/`, `i18n/` — UI, theme, user-sync, translations.
- `client-server/app/` — `app.py`, `models.py`, `auth.py`, `ai.py`, `crud.py`, `routes/` (blueprints).
- `client-server/maintenance/` — `seed_db.py`, `create_admin.py`, `make_superadmin.py`.
- `client-server/datasets/` — CSV, pickles, image folders.

## Database & authentication flow
- **Models:** User, Admin, Place (+ Hotel/Restaurant/Event/Attraction), PlaceView, Wishlist, Review,
  Recommendation, Itinerary/ItineraryItem, Newsletter, Chat/Message, SearchHistory.
- **Users:** Clerk on the frontend; backend identifies users by the **unverified, spoofable**
  `X-Clerk-User-Id` header (no server-side token check).
- **Admins:** backend PyJWT (access + refresh), `@admin_required`/`@token_required` decorators,
  tokens stored in localStorage.
- **Mismatch:** wishlist/itinerary routes require the admin JWT the Clerk frontend never sends.

## Major features
Working: Clerk auth + user sync, explore/famous/nature listings, place detail, hotels/restaurants
browse, recommendation form (POST), reviews + moderation, admin dashboard/users/logs, maps, theme,
currency toggle, Nepali calendar UI, static pages.
Partial: global search (auth-gated), itinerary planner (localStorage only), AI chat (Cohere + local
fallback), newsletter/contact (SMTP-dependent), image gallery, i18n, weather.

## Critical bugs & known limitations
- **HIGH security:** Cohere key shipped in the browser; Clerk **secret** committed in `.env.example`;
  Flask `debug=True`; hardcoded `JWT_SECRET_KEY` default; unauthenticated writes trust spoofable headers.
- **Broken:** backend wishlist & itinerary (401 auth mismatch); GET recommendations (`db.query`
  misuse); chat search/history (nonexistent `user_id` fields); place approve/reject (undefined
  `AdminLog`); similar-places (unregistered); `create_admin.py` (NameError).
- **Not implemented:** rooms/booking; server-side user-token verification.
- **Debt:** duplicate pages/components, repo bloat (DB, pickles, duplicate image folder),
  inconsistent API base URL, no tests.

## Current development priorities
1. **Phase 0 — security:** proxy Cohere behind backend; rotate/scrub Clerk secret; disable Flask
   debug; enforce real `JWT_SECRET_KEY`; env-driven CORS.
2. **Phase 1 — fix broken core:** `AdminLog`, GET recommendations, chat search (quick 500 fixes);
   unify user auth → restore wishlist & itinerary; fix chat-history persistence; single API-base-URL.
3. **Phase 2:** finish similar-places/rooms/image-upload decisions, i18n, live-DB chat counts.
4. **Phase 3:** remove duplication, de-bloat repo, add tests, harden admin sessions.
