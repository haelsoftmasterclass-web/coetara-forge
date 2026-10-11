import logging

from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .notifications import notify_staff
from .serializers import EnquirySerializer

logger = logging.getLogger(__name__)


class ContactThrottle(AnonRateThrottle):
    """Per-IP limit on contact submissions (CONTACT_THROTTLE_RATE, default 5/hour)."""

    scope = "contact"


@extend_schema(
    request=EnquirySerializer,
    responses={201: inline_serializer("EnquiryReceived", {"detail": serializers.CharField()})},
)
@api_view(["POST"])
@throttle_classes([ContactThrottle])
def submit_enquiry(request):
    serializer = EnquirySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if serializer.validated_data.get("company_website"):
        # Honeypot filled: almost certainly automated. Respond as normal but store nothing.
        logger.info("Discarded a contact submission that filled the honeypot field.")
        return Response({"detail": "Thank you. Your message has been received."}, status=status.HTTP_201_CREATED)
    enquiry = serializer.save()
    notify_staff(enquiry)
    return Response({"detail": "Thank you. Your message has been received."}, status=status.HTTP_201_CREATED)
