from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import PublishableModel


class Testimonial(PublishableModel):
    """A learner's own words, published only with recorded consent."""

    learner_name = models.CharField(max_length=120)
    quote = models.TextField(max_length=1200)
    programme = models.CharField(max_length=160, blank=True, help_text="Course or programme the learner took.")
    programme_verified = models.BooleanField(default=False, help_text="Enrolment in this programme has been checked.")
    role = models.CharField(max_length=120, blank=True, help_text="Only if the learner approved showing it.")
    location = models.CharField(max_length=120, blank=True, help_text="Only if the learner approved showing it.")
    photo = models.ImageField(upload_to="testimonials/", blank=True)
    photo_alt = models.CharField(max_length=200, blank=True)
    photo_consent = models.BooleanField(default=False, help_text="The learner consented to their photo being shown.")
    consent_given = models.BooleanField(default=False, help_text="The learner consented to this quote being published.")
    consent_date = models.DateField(null=True, blank=True)
    consent_record = models.CharField(
        max_length=240, blank=True, help_text="Staff only. Where the consent evidence is stored."
    )
    is_featured = models.BooleanField(default=False)
    internal_notes = models.TextField(blank=True, help_text="Staff only. Never shown publicly.")

    class Meta:
        ordering = ["display_order", "-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(status="published") | models.Q(consent_given=True),
                name="testimonial_published_requires_consent",
            ),
        ]

    def __str__(self):
        return f"{self.learner_name}: {self.quote[:40]}"

    def clean(self):
        if self.status == "published":
            if not self.consent_given:
                raise ValidationError({"consent_given": "Record the learner's consent before publishing."})
            if not self.consent_date:
                raise ValidationError({"consent_date": "Record when consent was given."})
