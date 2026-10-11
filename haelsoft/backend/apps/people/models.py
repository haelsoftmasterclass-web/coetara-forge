from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

from apps.core.models import PublishableModel, TimeStampedModel


def _unique_slug(instance, value: str) -> str:
    base = slugify(value)[:70] or "profile"
    slug, n = base, 2
    model = type(instance)
    while model.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
        slug = f"{base}-{n}"
        n += 1
    return slug


class TeamMember(PublishableModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True, blank=True)
    role = models.CharField(max_length=120)
    is_leadership = models.BooleanField(default=False, help_text="Shown in the leadership group.")
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="team/", blank=True)
    photo_alt = models.CharField(max_length=200, blank=True)
    photo_approved = models.BooleanField(default=False, help_text="The person approved this photo for public use.")
    linkedin_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    internal_notes = models.TextField(blank=True, help_text="Staff only. Never shown publicly.")

    class Meta:
        ordering = ["-is_leadership", "display_order", "name"]
        indexes = [models.Index(fields=["status", "display_order"])]

    def __str__(self):
        return f"{self.name} ({self.role})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(self, self.name)
        super().save(*args, **kwargs)


class ExpertiseArea(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=80, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:80]
        super().save(*args, **kwargs)


class Instructor(PublishableModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True, blank=True, help_text="Used in the profile URL.")
    headline = models.CharField(max_length=160, help_text="Professional headline, e.g. 'Data analyst and SQL trainer'.")
    short_bio = models.CharField(max_length=280, help_text="One or two sentences for the directory card.")
    biography = models.TextField(help_text="Full professional biography. Blank lines start new paragraphs.")
    expertise = models.ManyToManyField(ExpertiseArea, blank=True, related_name="instructors")
    qualifications = models.TextField(blank=True, help_text="One qualification per line.")
    qualifications_verified = models.BooleanField(
        default=False, help_text="Qualifications are shown publicly only when this is ticked."
    )
    photo = models.ImageField(upload_to="instructors/", blank=True)
    photo_alt = models.CharField(max_length=200, blank=True)
    photo_approved = models.BooleanField(default=False, help_text="The instructor approved this photo for public use.")
    linkedin_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False, help_text="Eligible for the homepage feature.")
    internal_notes = models.TextField(blank=True, help_text="Staff only. Never shown publicly.")

    class Meta:
        ordering = ["display_order", "name"]
        indexes = [models.Index(fields=["status", "is_featured", "display_order"])]

    def __str__(self):
        return self.name

    def clean(self):
        if self.photo and self.photo_approved and not self.photo_alt:
            raise ValidationError({"photo_alt": "Describe the photo for screen-reader users."})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(self, self.name)
        super().save(*args, **kwargs)

    @property
    def qualification_list(self) -> list[str]:
        return [line.strip() for line in self.qualifications.splitlines() if line.strip()]
