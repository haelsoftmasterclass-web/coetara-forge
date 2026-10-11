from django.contrib import admin

from apps.core.admin_actions import PUBLICATION_ACTIONS, PUBLICATION_LIST_FILTERS

from .models import Partner


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "partnership_confirmed", "logo_use_approved", "status", "display_order", "is_demo"]
    list_filter = ["category", "partnership_confirmed", "logo_use_approved", *PUBLICATION_LIST_FILTERS]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ["name"]}
    actions = PUBLICATION_ACTIONS
    fieldsets = [
        (None, {"fields": ["name", "slug", "category", "description", "website_url"]}),
        ("Approvals", {"fields": ["partnership_confirmed", "logo", "logo_alt", "logo_use_approved"]}),
        ("Publication", {"fields": ["status", "display_order", "is_demo"]}),
        ("Internal", {"fields": ["internal_notes"]}),
    ]
