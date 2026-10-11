from django.db import models
from django.utils import timezone

from apps.core.models import TimeStampedModel


class EnquiryType(models.TextChoices):
    GENERAL = "general", "General enquiry"
    LEARNING = "learning", "Learning and courses"
    INSTRUCTOR = "instructor", "Teaching with Haelsoft"
    PARTNERSHIP = "partnership", "Partnerships"
    CORPORATE = "corporate", "Corporate training"


class EnquiryStatus(models.TextChoices):
    NEW = "new", "New"
    IN_PROGRESS = "in_progress", "In progress"
    RESOLVED = "resolved", "Resolved"


class Enquiry(TimeStampedModel):
    enquiry_type = models.CharField(max_length=20, choices=EnquiryType.choices, db_index=True)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=80)
    subject = models.CharField(max_length=160)
    message = models.TextField(max_length=5000)
    consent = models.BooleanField(help_text="Agreed to the privacy notice when submitting.")
    source_page = models.CharField(max_length=200, blank=True)

    status = models.CharField(max_length=12, choices=EnquiryStatus.choices, default=EnquiryStatus.NEW, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    staff_notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "enquiries"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "-created_at"])]

    def __str__(self):
        return f"{self.get_enquiry_type_display()}: {self.subject}"

    def save(self, *args, **kwargs):
        if self.status == EnquiryStatus.RESOLVED and self.resolved_at is None:
            self.resolved_at = timezone.now()
        elif self.status != EnquiryStatus.RESOLVED:
            self.resolved_at = None
        super().save(*args, **kwargs)
