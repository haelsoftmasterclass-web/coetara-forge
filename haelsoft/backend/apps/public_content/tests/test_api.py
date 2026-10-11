from datetime import date

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.public_content.models import ContentBlock, ImpactMetric, Market, SiteSettings


class SiteSettingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_seeded_markets_are_planned_not_operational(self):
        data = self.client.get("/api/v1/site-settings/").json()
        codes = [m["country_code"] for m in data["markets"]]
        self.assertEqual(codes, ["NG", "GH", "KE", "RW", "UG", "ZA"])
        self.assertTrue(all(m["status"] == "planned" for m in data["markets"]))
        self.assertTrue(next(m for m in data["markets"] if m["country_code"] == "NG")["is_home_market"])

    def test_contact_fields_start_empty_so_nothing_is_invented(self):
        data = self.client.get("/api/v1/site-settings/").json()
        for field in ["contact_email", "contact_phone", "contact_address", "contact_response_note"]:
            self.assertEqual(data[field], "")

    def test_destination_urls_hidden_until_open(self):
        settings_obj = SiteSettings.load()
        settings_obj.scholarship_status = "coming_soon"
        settings_obj.scholarship_url = "https://example.org/apply"
        settings_obj.save()
        self.assertEqual(self.client.get("/api/v1/site-settings/").json()["scholarship_url"], "")
        settings_obj.scholarship_status = "open"
        settings_obj.save()
        self.assertEqual(self.client.get("/api/v1/site-settings/").json()["scholarship_url"], "https://example.org/apply")

    def test_open_scholarship_requires_url(self):
        settings_obj = SiteSettings.load()
        settings_obj.scholarship_status = "open"
        settings_obj.scholarship_url = ""
        with self.assertRaises(ValidationError):
            settings_obj.full_clean()

    def test_second_settings_row_rejected(self):
        with self.assertRaises(ValidationError):
            SiteSettings(site_name="Duplicate").full_clean()

    def test_market_code_uppercased(self):
        market = Market.objects.create(country_code="tz", name="Tanzania")
        self.assertEqual(market.country_code, "TZ")


class ImpactMetricTests(TestCase):
    def metric(self, **kwargs):
        defaults = dict(area="access", label="Learners enrolled", value="100", as_of=date(2026, 1, 1), source="LMS")
        defaults.update(kwargs)
        return ImpactMetric.objects.create(**defaults)

    def test_only_published_verified_metrics_are_public(self):
        self.metric(label="Draft", is_verified=True)
        self.metric(label="Live", is_verified=True, status="published")
        labels = [m["label"] for m in APIClient().get("/api/v1/impact-metrics/").json()]
        self.assertEqual(labels, ["Live"])

    def test_database_blocks_publishing_unverified_metric(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.metric(status="published", is_verified=False)

    def test_internal_notes_never_exposed(self):
        self.metric(status="published", is_verified=True, internal_notes="secret", verified_by="Staff")
        item = APIClient().get("/api/v1/impact-metrics/").json()[0]
        self.assertNotIn("internal_notes", item)
        self.assertNotIn("verified_by", item)


class ContentBlockTests(TestCase):
    def test_drafts_and_other_pages_hidden(self):
        ContentBlock.objects.create(page="our-story", heading="Live", body="x", status="published")
        ContentBlock.objects.create(page="our-story", heading="Draft", body="x")
        ContentBlock.objects.create(page="about", heading="Other page", body="x", status="published")
        data = APIClient().get("/api/v1/content/our-story/").json()
        self.assertEqual([b["heading"] for b in data], ["Live"])

    def test_unknown_page_is_404(self):
        self.assertEqual(APIClient().get("/api/v1/content/not-a-page/").status_code, 404)

    @override_settings(SHOW_DEMO_CONTENT=False)
    def test_demo_blocks_hidden_by_default(self):
        ContentBlock.objects.create(page="about", heading="Demo", body="x", status="published", is_demo=True)
        self.assertEqual(APIClient().get("/api/v1/content/about/").json(), [])
