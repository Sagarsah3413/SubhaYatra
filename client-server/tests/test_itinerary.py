"""
Focused tests for the itinerary routes (/api/itineraries).

Stdlib only (unittest + Flask test client). Clerk-authenticated end users are
identified by the `X-Clerk-User-Id` header (see app/auth.clerk_user_required).

These tests hit the real sqlite DB like the other suites, so every record is
created under a clearly test-only clerk_id and removed in tearDown — the suite
is idempotent and leaves no residue.

Run from client-server/:
    python -m unittest tests.test_itinerary -v
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.app import create_app              # noqa: E402
from app.database import db                 # noqa: E402
from app.models import Itinerary            # noqa: E402

# Test-only Clerk ids so cleanup never touches real user data.
USER_A = "test-itin-user-a"
USER_B = "test-itin-user-b"


class ItineraryRoutesTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config.update(TESTING=True)
        cls.client = cls.app.test_client()

    def tearDown(self):
        # Remove any itineraries created by the test users (cascades to items).
        with self.app.app_context():
            rows = Itinerary.query.filter(
                Itinerary.clerk_id.in_([USER_A, USER_B])
            ).all()
            for row in rows:
                db.session.delete(row)
            db.session.commit()

    # ── Helpers ───────────────────────────────────────────────────────────

    def _create(self, clerk_id, **body):
        body.setdefault("title", "Test Trip")
        return self.client.post(
            "/api/itineraries",
            json=body,
            headers={"X-Clerk-User-Id": clerk_id},
        )

    # ── Auth: header required for create ────────────────────────────────────

    def test_create_requires_header(self):
        resp = self.client.post("/api/itineraries", json={"title": "No Auth"})
        self.assertEqual(resp.status_code, 401)
        self.assertIn("error", resp.get_json())

    def test_create_with_header_returns_201_and_items(self):
        resp = self._create(
            USER_A,
            title="Pokhara Weekend",
            items=[
                {"day_number": 1, "place_name": "Phewa Lake", "order_index": 0},
                {"day_number": 2, "place_name": "Sarangkot", "order_index": 1},
            ],
        )
        self.assertEqual(resp.status_code, 201)
        body = resp.get_json()
        self.assertEqual(body["title"], "Pokhara Weekend")
        self.assertEqual(body["clerk_id"], USER_A)
        self.assertEqual(len(body["items"]), 2)
        self.assertEqual(body["items"][0]["place_name"], "Phewa Lake")

    # ── List isolation ───────────────────────────────────────────────────────

    def test_list_requires_header(self):
        resp = self.client.get("/api/itineraries")
        self.assertEqual(resp.status_code, 401)

    def test_list_returns_only_callers_itineraries(self):
        self._create(USER_A, title="A trip")
        self._create(USER_B, title="B trip 1")
        self._create(USER_B, title="B trip 2")

        resp_a = self.client.get(
            "/api/itineraries", headers={"X-Clerk-User-Id": USER_A}
        )
        resp_b = self.client.get(
            "/api/itineraries", headers={"X-Clerk-User-Id": USER_B}
        )
        self.assertEqual(resp_a.status_code, 200)
        self.assertEqual(resp_b.status_code, 200)

        a_titles = {i["title"] for i in resp_a.get_json()}
        b_titles = {i["title"] for i in resp_b.get_json()}
        self.assertIn("A trip", a_titles)
        self.assertNotIn("A trip", b_titles)
        self.assertEqual({"B trip 1", "B trip 2"}, b_titles & {"B trip 1", "B trip 2"})
        self.assertNotIn("B trip 1", a_titles)

    # ── Read: public vs private ───────────────────────────────────────────────

    def test_owner_can_read_private_itinerary(self):
        iid = self._create(USER_A, title="Private", is_public=False).get_json()["id"]
        resp = self.client.get(
            f"/api/itineraries/{iid}", headers={"X-Clerk-User-Id": USER_A}
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["title"], "Private")

    def test_non_owner_denied_private_itinerary(self):
        iid = self._create(USER_A, title="Private", is_public=False).get_json()["id"]
        resp = self.client.get(
            f"/api/itineraries/{iid}", headers={"X-Clerk-User-Id": USER_B}
        )
        self.assertEqual(resp.status_code, 403)

    def test_public_itinerary_readable_without_header(self):
        iid = self._create(USER_A, title="Public", is_public=True).get_json()["id"]
        resp = self.client.get(f"/api/itineraries/{iid}")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["title"], "Public")

    # ── Update: ownership enforced ─────────────────────────────────────────────

    def test_update_denied_for_non_owner(self):
        iid = self._create(USER_A, title="Orig").get_json()["id"]
        resp = self.client.put(
            f"/api/itineraries/{iid}",
            json={"title": "Hijacked"},
            headers={"X-Clerk-User-Id": USER_B},
        )
        self.assertEqual(resp.status_code, 403)

    def test_update_works_for_owner(self):
        iid = self._create(USER_A, title="Orig").get_json()["id"]
        resp = self.client.put(
            f"/api/itineraries/{iid}",
            json={"title": "Updated", "items": [{"day_number": 1, "place_name": "X"}]},
            headers={"X-Clerk-User-Id": USER_A},
        )
        self.assertEqual(resp.status_code, 200)
        body = resp.get_json()
        self.assertEqual(body["title"], "Updated")
        self.assertEqual(len(body["items"]), 1)

    # ── Delete: ownership enforced ─────────────────────────────────────────────

    def test_delete_denied_for_non_owner(self):
        iid = self._create(USER_A, title="Keep").get_json()["id"]
        resp = self.client.delete(
            f"/api/itineraries/{iid}", headers={"X-Clerk-User-Id": USER_B}
        )
        self.assertEqual(resp.status_code, 403)

    def test_delete_works_for_owner(self):
        iid = self._create(USER_A, title="Remove").get_json()["id"]
        resp = self.client.delete(
            f"/api/itineraries/{iid}", headers={"X-Clerk-User-Id": USER_A}
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.get_json().get("success"))

    # ── Input validation: 400, never 500 ──────────────────────────────────────

    def test_invalid_title_type_returns_400(self):
        resp = self.client.post(
            "/api/itineraries",
            json={"title": 123},
            headers={"X-Clerk-User-Id": USER_A},
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.get_json())

    def test_invalid_items_type_returns_400(self):
        resp = self.client.post(
            "/api/itineraries",
            json={"title": "Bad items", "items": "not-a-list"},
            headers={"X-Clerk-User-Id": USER_A},
        )
        self.assertEqual(resp.status_code, 400)


if __name__ == "__main__":
    unittest.main()
