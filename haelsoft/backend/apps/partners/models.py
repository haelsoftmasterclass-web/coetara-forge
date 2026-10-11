from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

from apps.core.models import PublishableModel


class PartnerCategory(models.TextChoices):
    EDUCATION = "education", "Education"
    TECHNOLOGY = "technology", "Technology"
    CORPORATE = "corporate", "Corporate and employers"
    GOVERNMENT = "government", "Government and public sector"
    NONPROFIT = "nonprofit", "Non-profit and foundations"
    COMMUNITY = "community", "Community"
    OTHER = "other", "Other"


class Partner(PublishableModel):
    """An organisation with a confirmed, approved partnership."""

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=80, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=PartnerCategory.choices, db_index=True)
    description = models.TextField(blank=True, help_text="What the partnership involves, as approved by the partner.")
    website_url = models.URLField(blank=True)
    logo = models.ImageField(upload_to="partners/", blank=True)
    logo_alt = models.CharField(max_length=200, blank=True)
    logo_use_approved = models.BooleanField(
        default=False, help_text="The partner authorised Haelsoft to display this logo."
    )
    partnership_confirmed = models.BooleanField(
        default=False, help_text="The partnership is agreed and may be stated publicly."
    )
    internal_notes = models.TextField(blank=True, help_text="Staff only. Never shown publicly.")

    class Meta:
        ordering = ["display_order", "name"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(status="published") | models.Q(partnership_confirmed=True),
                name="partner_published_requires_confirmation",
            ),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        if self.status == "published" and not self.partnership_confirmed:
            raise ValidationError("Confirm the partnership before publishing it.")

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)[:70] or "partner"
            slug, n = base, 2
            while Partner.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug, n = f"{base}-{n}", n + 1
            self.slug = slug
        super().save(*args, **kwargs)
