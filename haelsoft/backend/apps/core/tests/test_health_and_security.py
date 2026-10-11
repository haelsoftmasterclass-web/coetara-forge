from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class HealthTests(TestCase):
    def test_health_reports_ok_without_infrastructure_details(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})


class PublicApiSafetyTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_read_only_endpoints_reject_writes(self):
        for url in ["/api/v1/team/", "/api/v1/instructors/", "/api/v1/partners/", "/api/v1/testimonials/", "/api/v1/site-settings/"]:
            response = self.client.post(url, {"name": "x"}, format="json")
            self.assertEqual(response.status_code, 405, url)

    def test_contact_endpoint_does_not_list_enquiries(self):
        self.assertEqual(self.client.get("/api/v1/contact/").status_code, 405)

    def test_cors_allows_only_configured_origin(self):
        allowed = self.client.get("/api/v1/site-settings/", HTTP_ORIGIN="http://localhost:3000")
        self.assertEqual(allowed.headers.get("Access-Control-Allow-Origin"), "http://localhost:3000")
        blocked = self.client.get("/api/v1/site-settings/", HTTP_ORIGIN="https://evil.example")
        self.assertNotIn("Access-Control-Allow-Origin", blocked.headers)

    def test_admin_requires_staff_login(self):
        response = self.client.get("/admin/contact/enquiry/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response.headers["Location"])

    def test_non_staff_user_cannot_open_admin(self):
        user = get_user_model().objects.create_user("learner", password="a-long-password-123")
        self.client.force_login(user)
        response = self.client.get("/admin/contact/enquiry/")
        self.assertEqual(response.status_code, 302)
