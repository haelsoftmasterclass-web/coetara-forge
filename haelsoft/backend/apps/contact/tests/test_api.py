from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.contact.models import Enquiry

VALID = {
    "enquiry_type": "partnership",
    "name": "  Chidi   Nwosu ",
    "email": "Chidi@Example.com",
    "phone": "+234 801 234 5678",
    "country": "Nigeria",
    "subject": "Partnering on a learning programme",
    "message": "We would like to discuss a partnership for our staff training programme.",
    "consent": True,
    "source_page": "/contact",
}


class ContactApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def post(self, **overrides):
        payload = {**VALID, **overrides}
        return self.client.post("/api/v1/contact/", payload, format="json")

    def test_valid_enquiry_is_stored_and_normalised(self):
        response = self.post()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"detail": "Thank you. Your message has been received."})
        enquiry = Enquiry.objects.get()
        self.assertEqual(enquiry.name, "Chidi Nwosu")
        self.assertEqual(enquiry.email, "chidi@example.com")
        self.assertEqual(enquiry.status, "new")
        self.assertIsNotNone(enquiry.created_at)

    def test_required_fields_and_formats_validated(self):
        response = self.client.post("/api/v1/contact/", {}, format="json")
        self.assertEqual(response.status_code, 400)
        errors = response.json()
        for field in ["enquiry_type", "name", "email", "country", "subject", "message", "consent"]:
            self.assertIn(field, errors)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_invalid_values_rejected(self):
        cases = {
            "email": "not-an-email",
            "enquiry_type": "sales",
            "phone": "call me maybe",
            "message": "Too short",
            "consent": False,
        }
        for field, value in cases.items():
            cache.clear()
            response = self.post(**{field: value})
            self.assertEqual(response.status_code, 400, field)
            self.assertIn(field, response.json())

    def test_phone_is_optional(self):
        self.assertEqual(self.post(phone="").status_code, 201)

    def test_external_source_page_discarded(self):
        self.post(source_page="https://evil.example/")
        self.assertEqual(Enquiry.objects.get().source_page, "")

    def test_honeypot_submission_not_stored(self):
        response = self.post(company_website="http://spam.example")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_rate_limited_per_client(self):
        statuses = [self.post().status_code for _ in range(6)]
        self.assertEqual(statuses[:5], [201] * 5)
        self.assertEqual(statuses[5], 429)

    @override_settings(CONTACT_NOTIFICATION_EMAILS=["team@example.org"], ADMIN_BASE_URL="https://api.example.org/admin")
    def test_staff_notification_excludes_message_body(self):
        self.post()
        self.assertEqual(len(mail.outbox), 1)
        self.assertNotIn(VALID["message"], mail.outbox[0].body)
        self.assertIn("/contact/enquiry/", mail.outbox[0].body)

    def test_status_transitions_record_resolution_time(self):
        self.post()
        enquiry = Enquiry.objects.get()
        enquiry.status = "resolved"
        enquiry.save()
        self.assertIsNotNone(enquiry.resolved_at)
        enquiry.status = "in_progress"
        enquiry.save()
        self.assertIsNone(enquiry.resolved_at)
