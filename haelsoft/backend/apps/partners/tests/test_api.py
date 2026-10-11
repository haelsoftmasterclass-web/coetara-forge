from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.partners.models import Partner


@override_settings(SHOW_DEMO_CONTENT=False)
class PartnerApiTests(TestCase):
    def test_only_published_confirmed_partners_listed(self):
        Partner.objects.create(name="Live Org", category="education", partnership_confirmed=True, status="published")
        Partner.objects.create(name="Draft Org", category="education", partnership_confirmed=True)
        data = APIClient().get("/api/v1/partners/").json()
        self.assertEqual([p["name"] for p in data["results"]], ["Live Org"])
        self.assertEqual(data["results"][0]["category_label"], "Education")

    def test_cannot_publish_unconfirmed_partnership(self):
        with self.assertRaises(ValidationError):
            Partner(name="Rumoured", category="corporate", status="published").full_clean()
        with self.assertRaises(IntegrityError), transaction.atomic():
            Partner.objects.create(name="Rumoured", category="corporate", status="published")

    def test_logo_hidden_without_authorisation(self):
        partner = Partner.objects.create(
            name="Org", category="technology", partnership_confirmed=True, status="published", logo="partners/org.png"
        )
        item = APIClient().get("/api/v1/partners/").json()["results"][0]
        self.assertIsNone(item["logo"])
        partner.logo_use_approved = True
        partner.save()
        item = APIClient().get("/api/v1/partners/").json()["results"][0]
        self.assertTrue(item["logo"].endswith("/media/partners/org.png"))
        self.assertEqual(item["logo_alt"], "Org logo")

    def test_category_filter(self):
        Partner.objects.create(name="A", category="education", partnership_confirmed=True, status="published")
        Partner.objects.create(name="B", category="corporate", partnership_confirmed=True, status="published")
        data = APIClient().get("/api/v1/partners/?category=corporate").json()
        self.assertEqual([p["name"] for p in data["results"]], ["B"])
