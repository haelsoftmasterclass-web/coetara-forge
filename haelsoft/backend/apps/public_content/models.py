from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import PublishableModel, TimeStampedModel


class LaunchStatus(models.TextChoices):
    NOT_ANNOUNCED = "not_announced", "Not announced"
    COMING_SOON = "coming_soon", "Coming soon"
    OPEN = "open", "Open"
    CLOSED = "closed", "Closed"


class SiteSettings(TimeStampedModel):
    """Single row of safe, public site configuration edited by staff.

    Every contact field is optional: the website hides any field left blank,
    so nothing has to be invented to launch.
    """

    site_name = models.CharField(max_length=80, default="Haelsoft EdTech")
    tagline = models.CharField(max_length=160, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=40, blank=True)
    contact_address = models.TextField(blank=True)
    contact_response_note = models.CharField(
        max_length=200,
        blank=True,
        help_text="Response expectation shown on the contact page, e.g. 'We reply within two working days'. Leave blank if not confirmed.",
    )
    linkedin_url = models.URLField(blank=True)
    x_url = models.URLField(blank=True, verbose_name="X (Twitter) URL")
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    course_catalogue_status = models.CharField(
        max_length=20, choices=LaunchStatus.choices, default=LaunchStatus.COMING_SOON
    )
    course_catalogue_url = models.URLField(blank=True, help_text="Only used when the catalogue status is Open.")
    scholarship_status = models.CharField(
        max_length=20, choices=LaunchStatus.choices, default=LaunchStatus.NOT_ANNOUNCED
    )
    scholarship_headline = models.CharField(max_length=160, blank=True)
    scholarship_summary = models.TextField(blank=True)
    scholarship_url = models.URLField(blank=True, help_text="Only used when the scholarship status is Open.")

    class Meta:
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def __str__(self):
        return "Site settings"

    def clean(self):
        if self.pk is None and SiteSettings.objects.exists():
            raise ValidationError("Site settings already exist. Edit the existing record.")
        if self.course_catalogue_status == LaunchStatus.OPEN and not self.course_catalogue_url:
            raise ValidationError({"course_catalogue_url": "Add the catalogue URL before marking it open."})
        if self.scholarship_status == LaunchStatus.OPEN and not self.scholarship_url:
            raise ValidationError({"scholarship_url": "Add the application URL before marking scholarships open."})

    @classmethod
    def load(cls) -> "SiteSettings":
        obj = cls.objects.order_by("pk").first()
        return obj if obj is not None else cls()


class MarketStatus(models.TextChoices):
    PLANNED = "planned", "Planned"
    ACTIVE = "active", "Active"
    PAUSED = "paused", "Paused"


class Market(TimeStampedModel):
    """A country Haelsoft EdTech targets. Planned markets must not be described as operational."""

    country_code = models.CharField(max_length=2, unique=True, help_text="ISO 3166-1 alpha-2, e.g. NG")
    name = models.CharField(max_length=80)
    status = models.CharField(max_length=10, choices=MarketStatus.choices, default=MarketStatus.PLANNED)
    is_home_market = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.country_code = self.country_code.upper()
        super().save(*args, **kwargs)


class ContentPage(models.TextChoices):
    HOME = "home", "Homepage"
    ABOUT = "about", "About"
    OUR_STORY = "our-story", "Our Story"
    OUR_IMPACT = "our-impact", "Our Impact"


class ContentBlock(PublishableModel):
    """Editable narrative sections (for example founding milestones on Our Story).

    Pages show these only when staff publish them; otherwise the page keeps its
    honest default copy.
    """

    page = models.CharField(max_length=20, choices=ContentPage.choices, db_index=True)
    eyebrow = models.CharField(max_length=60, blank=True, help_text="Short label, e.g. a year or theme.")
    heading = models.CharField(max_length=160)
    body = models.TextField(help_text="Plain text. Blank lines start new paragraphs.")

    class Meta:
        ordering = ["page", "display_order", "id"]

    def __str__(self):
        return f"{self.get_page_display()}: {self.heading}"


class ImpactArea(models.TextChoices):
    ACCESS = "access", "Access to learning"
    SKILLS = "skills", "Skills developed"
    ENGAGEMENT = "engagement", "Learner engagement"
    COMPLETION = "completion", "Course completion"
    SCHOLARSHIPS = "scholarships", "Scholarships"
    CAREERS = "careers", "Career progression"


class ImpactMetric(PublishableModel):
    """A dated, sourced outcome figure. Shown publicly only when published AND verified."""

    area = models.CharField(max_length=20, choices=ImpactArea.choices)
    label = models.CharField(max_length=120, help_text="e.g. 'Learners enrolled'")
    value = models.CharField(max_length=40, help_text="Display value exactly as verified, e.g. '1,240' or '82%'.")
    description = models.CharField(max_length=240, blank=True)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    as_of = models.DateField(help_text="Date the figure was measured.")
    source = models.CharField(max_length=200, help_text="Where the figure comes from, e.g. 'LMS enrolment records'.")
    methodology = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False, help_text="Tick only after the figure has been checked against its source.")
    verified_by = models.CharField(max_length=120, blank=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["display_order", "-as_of"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(status="published") | models.Q(is_verified=True),
                name="impact_metric_published_requires_verification",
            ),
        ]

    def __str__(self):
        return f"{self.label}: {self.value}"

    def clean(self):
        if self.status == "published" and not self.is_verified:
            raise ValidationError("Verify the figure against its source before publishing it.")
        if self.period_start and self.period_end and self.period_start > self.period_end:
            raise ValidationError({"period_end": "The period must end after it starts."})
