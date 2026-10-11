from django.contrib import admin

from apps.core.admin_actions import PUBLICATION_ACTIONS, PUBLICATION_LIST_FILTERS

from .models import ContentBlock, ImpactMetric, Market, SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Brand", {"fields": ["site_name", "tagline"]}),
        (
            "Public contact details",
            {
                "description": "Leave any field blank to hide it on the website. Only enter confirmed details.",
                "fields": ["contact_email", "contact_phone", "contact_address", "contact_response_note"],
            },
        ),
        ("Social links", {"fields": ["linkedin_url", "x_url", "instagram_url", "facebook_url", "youtube_url"]}),
        ("Course catalogue", {"fields": ["course_catalogue_status", "course_catalogue_url"]}),
        (
            "Scholarship campaign",
            {"fields": ["scholarship_status", "scholarship_headline", "scholarship_summary", "scholarship_url"]},
        ),
    ]

    def has_add_permission(self, request):
        return super().has_add_permission(request) and not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ["name", "country_code", "status", "is_home_market", "display_order"]
    list_editable = ["status", "display_order"]
    list_filter = ["status"]


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ["heading", "page", "status", "display_order", "is_demo", "updated_at"]
    list_filter = ["page", *PUBLICATION_LIST_FILTERS]
    search_fields = ["heading", "body"]
    actions = PUBLICATION_ACTIONS


@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ["label", "value", "area", "as_of", "is_verified", "status", "is_demo"]
    list_filter = ["area", "is_verified", *PUBLICATION_LIST_FILTERS]
    search_fields = ["label", "source"]
    actions = PUBLICATION_ACTIONS
    fieldsets = [
        (None, {"fields": ["area", "label", "value", "description"]}),
        ("Evidence", {"fields": ["period_start", "period_end", "as_of", "source", "methodology", "is_verified", "verified_by"]}),
        ("Publication", {"fields": ["status", "display_order", "is_demo"]}),
        ("Internal", {"fields": ["internal_notes"]}),
    ]
