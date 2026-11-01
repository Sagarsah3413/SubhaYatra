"""
Focused tests for the backend Cohere chat proxy (POST /api/chat/cohere).

Uses only the stdlib (unittest + unittest.mock); Cohere's network call is mocked,
so no real API key is required and no request leaves the machine.

Run from client-server/ with the project venv, e.g.:
    python -m unittest tests.test_cohere_proxy -v
"""

import os
import sys
import unittest
from unittest.mock import patch, MagicMock

import requests

# Make the `app` package importable when run from client-server/.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.app import create_app  # noqa: E402
from app import cohere_helper   # noqa: E402


class CohereProxyTestCase(unittest.TestCase):
    def setUp(self):
        app = create_app()
        app.config.update(TESTING=True)
        self.client = app.test_client()

    # ── Input validation ──────────────────────────────────────────────────

    def test_missing_message_returns_400(self):
        resp = self.client.post("/api/chat/cohere", json={})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("error", resp.get_json())

    def test_blank_message_returns_400(self):
        resp = self.client.post("/api/chat/cohere", json={"message": "   "})
        self.assertEqual(resp.status_code, 400)

    def test_overlong_message_returns_400(self):
        huge = "a" * 5000  # exceeds MAX_MESSAGE_LENGTH (4000)
        resp = self.client.post("/api/chat/cohere", json={"message": huge})
        self.assertEqual(resp.status_code, 400)

    # ── Not configured → fallback signal ────────────────────────────────────

    @patch.object(cohere_helper, "is_configured", return_value=False)
    def test_unconfigured_returns_503_with_fallback(self, _mock_cfg):
        resp = self.client.post("/api/chat/cohere", json={"message": "Hi"})
        self.assertEqual(resp.status_code, 503)
        body = resp.get_json()
        self.assertTrue(body.get("fallback"))

    # ── Happy path (mocked Cohere HTTP) ─────────────────────────────────────

    @patch.object(cohere_helper, "is_configured", return_value=True)
    @patch.dict(os.environ, {"COHERE_API_KEY": "test-key-123"})
    @patch("app.cohere_helper.requests.post")
    def test_successful_reply(self, mock_post, _mock_cfg):
        mock_resp = MagicMock()
        mock_resp.raise_for_status.return_value = None
        mock_resp.json.return_value = {"text": "Namaste! Pokhara is lovely."}
        mock_post.return_value = mock_resp

        resp = self.client.post(
            "/api/chat/cohere",
            json={"message": "Tell me about Pokhara", "currency": "NPR"},
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.get_json()["reply"], "Namaste! Pokhara is lovely.")

        # The key must be sent to Cohere in the Authorization header,
        # and the request must carry our system preamble.
        _, kwargs = mock_post.call_args
        self.assertEqual(kwargs["headers"]["Authorization"], "Bearer test-key-123")
        self.assertIn("preamble", kwargs["json"])
        self.assertIn("SubhaYatra", kwargs["json"]["preamble"])
        # NPR currency should localize the preamble.
        self.assertIn("NPR", kwargs["json"]["preamble"])

    # ── Upstream failure → fallback signal, no secret leak ──────────────────

    @patch.object(cohere_helper, "is_configured", return_value=True)
    @patch.dict(os.environ, {"COHERE_API_KEY": "test-key-123"})
    @patch("app.cohere_helper.requests.post")
    def test_upstream_http_error_returns_502_fallback(self, mock_post, _mock_cfg):
        err_resp = MagicMock()
        err_resp.status_code = 401
        http_err = requests.HTTPError(response=err_resp)
        mock_resp = MagicMock()
        mock_resp.raise_for_status.side_effect = http_err
        mock_post.return_value = mock_resp

        resp = self.client.post("/api/chat/cohere", json={"message": "Hi"})
        self.assertEqual(resp.status_code, 502)
        body = resp.get_json()
        self.assertTrue(body.get("fallback"))
        # Never leak the key or internal details in the error body.
        self.assertNotIn("test-key-123", resp.get_data(as_text=True))

    @patch.object(cohere_helper, "is_configured", return_value=True)
    @patch.dict(os.environ, {"COHERE_API_KEY": "test-key-123"})
    @patch("app.cohere_helper.requests.post")
    def test_network_error_returns_504_fallback(self, mock_post, _mock_cfg):
        mock_post.side_effect = requests.ConnectionError("boom")
        resp = self.client.post("/api/chat/cohere", json={"message": "Hi"})
        self.assertEqual(resp.status_code, 504)
        self.assertTrue(resp.get_json().get("fallback"))

    # ── Helper: key is required to generate a reply ─────────────────────────

    @patch.dict(os.environ, {}, clear=True)
    def test_generate_reply_without_key_raises(self):
        with self.assertRaises(RuntimeError):
            cohere_helper.generate_reply("Hi")


if __name__ == "__main__":
    unittest.main()
