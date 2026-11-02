# SubhaYatra — Feature Inventory

Every user-facing feature traced frontend page → service → backend route → model/data.
Status is one of: **Fully functional | Partially functional | UI only | Broken | Not implemented**.
Based on a read-only review of the current code (no runtime execution).

---

## Auth

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| User sign-in / sign-up | SignIn.jsx, SignUp.jsx, main.jsx ClerkProvider | — (Clerk hosted) | — | Fully functional | Clerk handles auth; publishable key in `main.jsx`. |
| User sync to backend | hooks/useUserSync.js | POST /api/users/sync, /logout | User + session_history | Fully functional | Upserts user, records sessions. Identity via unverified header. |
| Admin login | pages/admin/Login.jsx | POST /api/admin/login, /refresh | Admin (PyJWT) | Fully functional | Issues access/refresh tokens; stored in localStorage. |
| Admin route guard | pages/admin/AdminRoute.jsx | @admin_required | Admin | Fully functional | Dashboard gated by token in localStorage. |
| Server-side user token verification | — | (none) | — | Not implemented | Backend trusts `X-Clerk-User-Id` header; no Clerk JWT check. |

## Discovery

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Explore destinations | ExploreSection.jsx, ExploreNepal.jsx, AllPlacesDetail.jsx, placesService.js | GET /api/places* | Place | Fully functional | Pagination/filters work; images served from datasets. |
| Famous spots | FamousSpots.jsx, AllSpotsDetail.jsx | GET /api/places (filtered) | Place | Fully functional | Lists from DB. |
| Nature places | NaturePlaces.jsx, AllNatureDetail.jsx | GET /api/places (filtered) | Place | Fully functional | Near-duplicate listing pages. |
| Place detail | PlaceDetailView.jsx (`/place/:id`), Detailpage.jsx (`/details`) | GET /api/places/<id>, /details/<type>/<name> | Place + hotels/restaurants/events | Fully functional | Two detail renderers (duplication). GET logs a PlaceView on each view. |
| Global search | SearchBar.jsx, SearchModal.jsx, SearchResultPageNew.jsx, SearchDropdownList.jsx | GET /api/search | Place/Hotel/Restaurant | Partially functional | Requires `X-Clerk-User-Id`; returns 401 for signed-out users (by design). `SearchResult.jsx` is unrouted dead page. |
| Explorer (constraint discovery) | pages/explorer/ (ExplorerPage, ExplorerFilters, DestinationCard, ExplorerMap, explorerUtils), explorerService.js; route `/explore`; Header nav | GET /api/places/explore, /api/places/explore/options | Derived `destination_facets` (from app/facets.py) | Fully functional | Four AND-combined filters (month/difficulty/province/accessibility), pagination (resets on filter change), per-card "why this matches" from real fields, access-confidence tiers, verified-only map pins. Serves from the facet JSON snapshot (documented limitation, `EXPLORER_API_VERIFICATION.md`). Verified end-to-end. |
| Hotels browse | HotelSection, hotelService.js | GET /api/hotels* | Hotel | Fully functional | Filters, featured, count. |
| Restaurants browse | RestaurantSection, placesService.js | GET /api/restaurants* | Restaurant | Fully functional | Filters, featured, count. |
| Similar places | (detail pages) | GET /api/places/<id>/similar | Place + pickles | Broken | `similar_places.py` imports nonexistent `SessionLocal` and is **not registered** in app.py. |

## Planning

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Itinerary planner | Itinerary.jsx | (localStorage only) | — | Partially functional | Build/generate/save work client-side; **paging & destination search implemented** (`destinationPage`, `DESTINATIONS_PER_PAGE=6`, filter+slice). Saves to `localStorage`, not backend. |
| Itinerary persistence (backend) | — | GET/POST/PUT/DELETE /api/itineraries | Itinerary, ItineraryItem | Broken | Routes exist but require admin-style JWT; frontend never calls them. Orphaned. |
| Recommendation form | RecommendationPage.jsx, RecommendationResults.jsx, recommendationService.js | POST /api/recommendations | Recommendation, Place | Fully functional | Rule-based scorer returns 30–50 matches and persists request. |
| Saved/user recommendations | — | GET /api/recommendations/<id>, /user/<id>, /stats | Recommendation | Broken | `db.query`/`db.close` + nonexistent fields → 500. |

## AI

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| AI chat assistant | ChatPage.jsx, chatService.js | POST /api/chat/cohere (proxy), /send, /new, /ai-reply; cohere_helper.py | Chat, Message | Partially functional | Cohere answers with a Nepal-aware preamble + USD/NPR/INR toggle, now **proxied server-side — key is backend-only (`COHERE_API_KEY`), no longer in the browser.** Local keyword fallback when the proxy is unavailable. |
| Backend AI responder | — | app/ai.py `get_ai_reply` | Place (DB lookup) | Partially functional | ~900-line hardcoded keyword responder; no model. Only reached when frontend uses `/api/chat/send`. |
| Chat history persistence | ChatPage.jsx sidebar | POST /api/chat/new,/send,/save-local; GET /api/chat/history,/messages | Chat, Message | Fully functional | Fixed: the Cohere/fallback path now persists via `/save-local`, so new-chat history is saved (prior "empty sidebar" bug resolved). |
| Chat search / search-history | ChatPage.jsx | GET/POST/DELETE /api/chat/search*, /search-history* | Chat, SearchHistory | Broken | Handlers use `Chat.user_id`/`SearchHistory.user_id` which don't exist → 500. |

## Commerce / Hotels

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Hotel listings & detail | HotelSection, hotelService.js | GET /api/hotels, /<id> | Hotel | Fully functional | — |
| Rooms / booking | — | routes/rooms.py (unregistered) | (none; schemas.py Pydantic) | Not implemented | `rooms.py` imports nonexistent `SessionLocal`, not registered; no booking model. README "bookings" = 0. |

## Content

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Reviews | WriteReview.jsx | POST/GET /api/reviews, /stats | Review | Fully functional | Cloudinary image upload; submissions default to `pending`. |
| Review moderation | admin Dashboard | PATCH /api/reviews/<id>/status | Review, Admin.action_log | Fully functional | Admin approves/rejects. |
| Wishlist | Wishlist.jsx, WishlistButton.jsx, wishlistService.js, Detailpage.jsx | GET/POST/DELETE /api/wishlist/* | Wishlist, Place | Broken | Backend routes `@token_required`; frontend sends no JWT → 401. `wishlistService` falls back to hardcoded demo data; `Detailpage` wishlist calls will fail silently. |
| Nepali calendar | components/header/CalendarModal.jsx, NepaliCalendar.jsx (page unrouted), data/nepaliMonths.js, nepaliFestivals.js | — | static data | Fully functional (UI) | Client-side BS calendar via `@nakarmi23/bikram-sambat`. Page component unrouted; modal used instead. |
| Newsletter subscribe | Footer, NewsletterArchive.jsx | POST /api/users/subscribe, /unsubscribe | Newsletter | Partially functional | Subscribe persists; welcome email only if SMTP configured. Archive page is static UI. |
| Contact form | Contact.jsx (+ Leaflet map) | POST /api/contact | — (email) | Partially functional | Sends email only if `SENDER_PASSWORD` set; otherwise returns failure. Map works. |
| Image gallery / upload | ImageGallery.jsx, SmartImage.jsx, imageService.js | GET /api/images/* (static); routes/images.py (unregistered) | Place/Hotel/Restaurant.all_images | Partially functional | Dataset image serving works; the upload/delete/stats API (`images.py`) is unregistered dead code. Submission uploads go through Cloudinary in places/reviews. |
| About / FAQ / Help / Terms / Privacy | About.jsx, FAQ.jsx, Help.jsx, TermsOfService.jsx, PrivacyPolicy.jsx | — | static | Fully functional (UI) | Static informational pages. |

## Admin

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Admin dashboard stats | admin/Dashboard.jsx | GET /api/admin/dashboard | Place/Hotel/Restaurant/Review/User | Fully functional | Pulls live Clerk user list; counts + review stats. |
| User management | admin/Dashboard.jsx | GET /api/admin/users*, activate/deactivate, sync-from-clerk | User | Fully functional | Rich per-user activity + session history. |
| Pending submissions moderation | admin Dashboard | GET /api/admin/pending; hotels/restaurants approve/reject | Place/Hotel/Restaurant/Review | Partially functional | Hotels/restaurants/reviews OK; **place approve/reject broken** (AdminLog undefined). |
| Admin audit logs / sessions | admin Dashboard | GET /api/admin/logs, /sessions, /search-history | Admin JSON logs | Fully functional | — |
| Create admin / superadmin | — | maintenance/create_admin.py, make_superadmin.py | Admin / User | Broken / Partially | `create_admin.py` NameError (`ROLE`/`USERNAME` undefined) + plaintext creds; `make_superadmin.py` works but targets a hardcoded email. |

## Platform

| Feature | Frontend | Backend | Data/Model | Status | Evidence / Notes |
|---|---|---|---|---|---|
| Currency switch | ChatPage.jsx (USD/NPR/INR toggle), services/currencyService.js | — | external API | Fully functional | ChatPage cycles USD/NPR/INR; service caches rates, demo fallback without key. |
| i18n / language | i18n/index.js, CustomLanguageDropdown.jsx | — | locale files | Partially functional | i18next configured; coverage depends on translated keys. |
| Weather | services/weatherService.js | — | OpenWeatherMap | Partially functional | Works with key; demo fallback otherwise. |
| Maps / geolocation | Contact.jsx, useLocation.js, geocodingService.js, reverseGeocode/ | — | Leaflet/OSM/Nominatim | Fully functional | Client-side; no key needed. |
| Theme (dark/light) | contexts/ThemeContext.jsx, main.jsx | — | localStorage | Fully functional | Applied before paint to avoid flash. |
| Splash screen | SplashScreen.jsx | — | sessionStorage | Fully functional | Shows once per session. |

---

### Status roll-up
- **Fully functional:** discovery (places/hotels/restaurants/detail), recommendation POST, reviews
  + moderation, admin dashboard/users/logs, Clerk auth + user sync, maps, theme, currency toggle,
  Nepali calendar UI, static content pages.
- **Partially functional:** global search (auth-gated), itinerary planner (localStorage only),
  AI chat (Cohere now proxied server-side; local fallback), newsletter/contact (email depends on
  SMTP), image gallery (serve OK, upload API dead), i18n, weather.
- **Newly fully functional (this cycle):** the Explorer (constraint-based discovery over the
  normalized dataset) and chat history persistence.
- **Broken:** backend wishlist, backend itinerary persistence, GET recommendations, chat
  search/search-history, place approve/reject, similar places, `create_admin.py`.
- **Not implemented:** rooms/booking, server-side user-token verification.
