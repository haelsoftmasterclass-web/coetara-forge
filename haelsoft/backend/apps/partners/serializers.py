from rest_framework import serializers

from apps.core.fields import public_media_url

from .models import Partner


class PartnerSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)
    logo = serializers.SerializerMethodField()
    logo_alt = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ["slug", "name", "category", "category_label", "description", "website_url", "logo", "logo_alt"]

    def get_logo(self, obj) -> str | None:
        if not obj.logo_use_approved:
            return None
        return public_media_url(obj.logo, self.context)

    def get_logo_alt(self, obj) -> str:
        return (obj.logo_alt or f"{obj.name} logo") if obj.logo_use_approved and obj.logo else ""
