import logging

from django.conf import settings
from django.core.mail import send_mail

from .models import Enquiry

logger = logging.getLogger(__name__)


def notify_staff(enquiry: Enquiry) -> None:
    """Tell staff a new enquiry exists. The message body stays in the database, not in email or logs."""
    recipients = settings.CONTACT_NOTIFICATION_EMAILS
    if not recipients:
        return
    link = f"{settings.ADMIN_BASE_URL}/contact/enquiry/{enquiry.pk}/change/" if settings.ADMIN_BASE_URL else ""
    body = (
        f"A new {enquiry.get_enquiry_type_display().lower()} enquiry was received.\n\n"
        f"Subject: {enquiry.subject}\n"
        f"Country: {enquiry.country}\n\n"
        + (f"Open it in Django Admin: {link}\n" if link else "Open it in Django Admin under Contact > Enquiries.\n")
    )
    try:
        send_mail(
            subject=f"[Haelsoft] New {enquiry.get_enquiry_type_display().lower()} enquiry",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
        )
    except Exception:
        # The enquiry is already saved, so the visitor still gets an accurate confirmation.
        logger.exception("Could not send the enquiry notification for enquiry id=%s", enquiry.pk)
