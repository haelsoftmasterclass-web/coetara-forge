from django.contrib import admin

from apps.core.admin_actions import PUBLICATION_ACTIONS, PUBLICATION_LIST_FILTERS

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["learner_name", "programme", "consent_given", "consent_date", "status", "is_featured", "is_demo"]
    list_filter = ["consent_given", "is_featured", *PUBLICATION_LIST_FILTERS]
    search_fields = ["learner_name", "quote", "programme"]
    actions = PUBLICATION_ACTIONS
    fieldsets = [
        (None, {"fields": ["learner_name", "quote"]}),
        ("Attribution", {"fields": ["programme", "programme_verified", "role", "location"]}),
        ("Photo", {"fields": ["photo", "photo_alt", "photo_consent"]}),
        ("Consent", {"fields": ["consent_given", "consent_date", "consent_record"]}),
        ("Publication", {"fields": ["status", "is_featured", "display_order", "is_demo"]}),
        ("Internal", {"fields": ["internal_notes"]}),
    ]
