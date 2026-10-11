from datetime import date

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.testimonials.models import Testimonial


@override_settings(SHOW_DEMO_CONTENT=False)
class TestimonialApiTests(TestCase):
    def test_only_published_consented_testimonials_listed(self):
        Testimonial.objects.create(
            learner_name="Consented", quote="Real words", consent_given=True, consent_date=date(2026, 5, 1), status="published"
        )
        Testimonial.objects.create(learner_name="Draft", quote="Not yet", consent_given=True)
        Testimonial.objects.create(learner_name="Demo", quote="x", consent_given=True, status="published", is_demo=True)
        data = APIClient().get("/api/v1/testimonials/").json()
        self.assertEqual([t["learner_name"] for t in data["results"]], ["Consented"])
        self.assertNotIn("consent_record", data["results"][0])

    def test_publishing_without_consent_is_blocked(self):
        with self.assertRaises(ValidationError):
            Testimonial(learner_name="X", quote="Y", status="published").full_clean()
        with self.assertRaises(IntegrityError), transaction.atomic():
            Testimonial.objects.create(learner_name="X", quote="Y", status="published")

    def test_unverified_programme_and_unconsented_photo_hidden(self):
        Testimonial.objects.create(
            learner_name="L",
            quote="Q",
            programme="Data Analytics",
            photo="testimonials/l.jpg",
            consent_given=True,
            consent_date=date(2026, 5, 1),
            status="published",
        )
        item = APIClient().get("/api/v1/testimonials/").json()["results"][0]
        self.assertEqual(item["programme"], "")
        self.assertIsNone(item["photo"])
