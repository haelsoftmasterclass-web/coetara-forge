import re

from rest_framework import serializers

from .models import Enquiry

PHONE_RE = re.compile(r"^\+?[0-9 ()\-]{7,20}$")


def _clean_text(value: str) -> str:
    # Collapse runs of whitespace in single-line fields and strip control characters.
    return re.sub(r"\s+", " ", re.sub(r"[\x00-\x1f\x7f]", " ", value)).strip()


class EnquirySerializer(serializers.ModelSerializer):
    # Honeypot: hidden from people, often filled in by bots. Must stay empty.
    company_website = serializers.CharField(required=False, allow_blank=True, write_only=True, max_length=200)
    consent = serializers.BooleanField()

    class Meta:
        model = Enquiry
        fields = [
            "enquiry_type",
            "name",
            "email",
            "phone",
            "country",
            "subject",
            "message",
            "consent",
            "source_page",
            "company_website",
        ]
        extra_kwargs = {
            "name": {"min_length": 2},
            "subject": {"min_length": 3},
            "message": {"min_length": 20},
            "country": {"min_length": 2},
            "source_page": {"write_only": True},
        }

    def validate_name(self, value):
        return _clean_text(value)

    def validate_subject(self, value):
        return _clean_text(value)

    def validate_country(self, value):
        return _clean_text(value)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        value = value.strip()
        if value and not PHONE_RE.match(value):
            raise serializers.ValidationError("Enter a valid phone number, including the country code.")
        return value

    def validate_message(self, value):
        value = value.replace("\x00", "").strip()
        if len(value) < 20:
            raise serializers.ValidationError("Please tell us a little more (at least 20 characters).")
        return value

    def validate_source_page(self, value):
        return value[:200] if value.startswith("/") else ""

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("Please confirm you have read the privacy notice.")
        return value

    def create(self, validated_data):
        validated_data.pop("company_website", None)
        return super().create(validated_data)
