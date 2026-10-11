from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import ContentBlock, ImpactMetric, LaunchStatus, Market, SiteSettings


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = ["country_code", "name", "status", "is_home_market"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    markets = serializers.SerializerMethodField()
    course_catalogue_url = serializers.SerializerMethodField()
    scholarship_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_name",
            "tagline",
            "contact_email",
            "contact_phone",
            "contact_address",
            "contact_response_note",
            "linkedin_url",
            "x_url",
            "instagram_url",
            "facebook_url",
            "youtube_url",
            "course_catalogue_status",
            "course_catalogue_url",
            "scholarship_status",
            "scholarship_headline",
            "scholarship_summary",
            "scholarship_url",
            "markets",
        ]

    @extend_schema_field(MarketSerializer(many=True))
    def get_markets(self, obj):
        return MarketSerializer(Market.objects.all(), many=True).data

    # Destination URLs are only exposed while the destination is actually open.
    def get_course_catalogue_url(self, obj) -> str:
        return obj.course_catalogue_url if obj.course_catalogue_status == LaunchStatus.OPEN else ""

    def get_scholarship_url(self, obj) -> str:
        return obj.scholarship_url if obj.scholarship_status == LaunchStatus.OPEN else ""


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ["id", "page", "eyebrow", "heading", "body"]


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = [
            "id",
            "area",
            "label",
            "value",
            "description",
            "period_start",
            "period_end",
            "as_of",
            "source",
            "methodology",
        ]
