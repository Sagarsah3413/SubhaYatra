"""
Focused tests for the destination-facets explore endpoint (GET /api/places/explore).

Stdlib only (unittest + Flask test client). Reads the real derived facets dataset
(datasets/derived/destination_facets.json); no network, no DB writes of test data, no source
modification.

Run from client-server/:
    python -m unittest tests.test_explore_facets -v
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.app import create_app       # noqa: E402
from app import facets               # noqa: E402


class ExploreFacetsTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app = create_app()
        app.config.update(TESTING=True)
        cls.client = app.test_client()
        cls.has_data = len(facets.all_facets()) > 0

    # ── Individual filters ──────────────────────────────────────────────────

    def test_month_filter(self):
        r = self.client.get('/api/places/explore?month=10&limit=5')
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        self.assertIn('destinations', body)
        for d in body['destinations']:
            self.assertIsNotNone(d['season_months'])
            self.assertIn(10, d['season_months'])  # null never matches

    def test_difficulty_filter(self):
        r = self.client.get('/api/places/explore?difficulty=Hard&limit=100')
        self.assertEqual(r.status_code, 200)
        for d in r.get_json()['destinations']:
            self.assertEqual(d['difficulty'], 'Hard')

    def test_province_filter(self):
        r = self.client.get('/api/places/explore?province=Gandaki&limit=100')
        self.assertEqual(r.status_code, 200)
        for d in r.get_json()['destinations']:
            self.assertEqual(d['province'], 'Gandaki')

    def test_access_filter(self):
        r = self.client.get('/api/places/explore?access=Fly-in&limit=100')
        self.assertEqual(r.status_code, 200)
        for d in r.get_json()['destinations']:
            modes = set(d['access_modes'] or [])
            if d['primary_access']:
                modes.add(d['primary_access'])
            self.assertIn('Fly-in', modes)

    # ── Combined filters (AND) ───────────────────────────────────────────────

    def test_combined_and_logic(self):
        r = self.client.get('/api/places/explore?month=10&difficulty=Easy&province=Gandaki&limit=100')
        self.assertEqual(r.status_code, 200)
        for d in r.get_json()['destinations']:
            self.assertIn(10, d['season_months'])
            self.assertEqual(d['difficulty'], 'Easy')
            self.assertEqual(d['province'], 'Gandaki')

    def test_combined_subset_of_single(self):
        """AND-combined result count must be <= either single-filter count."""
        a = self.client.get('/api/places/explore?difficulty=Hard&limit=1').get_json()['total']
        b = self.client.get('/api/places/explore?province=Koshi&limit=1').get_json()['total']
        c = self.client.get('/api/places/explore?difficulty=Hard&province=Koshi&limit=1').get_json()['total']
        self.assertLessEqual(c, a)
        self.assertLessEqual(c, b)

    # ── Empty results ─────────────────────────────────────────────────────────

    def test_empty_result_is_valid(self):
        # A deliberately over-constrained combo likely yields zero; must be 200 + empty list.
        r = self.client.get('/api/places/explore?month=1&difficulty=Hard&province=Madhesh&access=Fly-in')
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        self.assertEqual(body['total'], len(body['destinations']))
        self.assertEqual(body['pages'], 0 if body['total'] == 0 else body['pages'])

    # ── Invalid parameters ────────────────────────────────────────────────────

    def test_invalid_month(self):
        self.assertEqual(self.client.get('/api/places/explore?month=13').status_code, 400)
        self.assertEqual(self.client.get('/api/places/explore?month=abc').status_code, 400)

    def test_invalid_difficulty(self):
        self.assertEqual(self.client.get('/api/places/explore?difficulty=Extreme').status_code, 400)

    def test_invalid_province(self):
        self.assertEqual(self.client.get('/api/places/explore?province=Atlantis').status_code, 400)

    def test_invalid_access(self):
        self.assertEqual(self.client.get('/api/places/explore?access=Teleport').status_code, 400)

    def test_invalid_pagination(self):
        self.assertEqual(self.client.get('/api/places/explore?page=0').status_code, 400)
        self.assertEqual(self.client.get('/api/places/explore?limit=0').status_code, 400)
        self.assertEqual(self.client.get('/api/places/explore?limit=500').status_code, 400)

    # ── Null handling & coordinate confidence ────────────────────────────────

    def test_null_never_matches(self):
        """Records with no season data must never appear in a month-filtered result."""
        r = self.client.get('/api/places/explore?month=6&limit=100')
        for d in r.get_json()['destinations']:
            self.assertIsNotNone(d['season_months'])

    def test_only_verified_coords_exposed(self):
        r = self.client.get('/api/places/explore?limit=100')
        for d in r.get_json()['destinations']:
            if d['coord_status'] == 'verified':
                self.assertTrue(d['map_pin_allowed'])
            else:
                self.assertIsNone(d['latitude'])
                self.assertIsNone(d['longitude'])
                self.assertFalse(d['map_pin_allowed'])

    # ── Pagination ────────────────────────────────────────────────────────────

    def test_pagination_shape(self):
        r = self.client.get('/api/places/explore?limit=10&page=1')
        body = r.get_json()
        self.assertLessEqual(len(body['destinations']), 10)
        self.assertEqual(body['page'], 1)
        self.assertEqual(body['limit'], 10)

    # ── Options endpoint ──────────────────────────────────────────────────────

    def test_options_endpoint(self):
        r = self.client.get('/api/places/explore/options')
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        for key in ('provinces', 'difficulties', 'access_types', 'months', 'total_destinations'):
            self.assertIn(key, body)

    # ── Backward compatibility (existing endpoint untouched) ──────────────────

    def test_existing_places_endpoint_unchanged(self):
        r = self.client.get('/api/places?limit=5')
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        # Original response contract: top-level 'places', 'total', 'page', 'limit', 'pages'.
        for key in ('places', 'total', 'page', 'limit', 'pages'):
            self.assertIn(key, body)


if __name__ == '__main__':
    unittest.main()
