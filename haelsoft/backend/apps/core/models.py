from django.conf import settings
from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublicationStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class PublishableQuerySet(models.QuerySet):
    def published(self):
        """Records that may appear on the public website.

        Demo records (seeded for local development) are excluded unless
        SHOW_DEMO_CONTENT is switched on, so they can never leak to production
        by accident.
        """
        qs = self.filter(status=PublicationStatus.PUBLISHED)
        if not settings.SHOW_DEMO_CONTENT:
            qs = qs.filter(is_demo=False)
        return qs


class PublishableModel(TimeStampedModel):
    """Shared publication workflow for staff-managed public content."""

    status = models.CharField(
        max_length=12,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        db_index=True,
        help_text="Only published records appear on the public website.",
    )
    published_at = models.DateTimeField(null=True, blank=True, editable=False)
    display_order = models.PositiveIntegerField(default=100, help_text="Lower numbers appear first.")
    is_demo = models.BooleanField(
        default=False,
        help_text="Development sample data. Never shown publicly unless SHOW_DEMO_CONTENT is enabled.",
    )

    objects = PublishableQuerySet.as_manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.status == PublicationStatus.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
