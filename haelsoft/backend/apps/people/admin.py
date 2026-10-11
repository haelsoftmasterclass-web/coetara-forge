from django.contrib import admin

from apps.core.admin_actions import PUBLICATION_ACTIONS, PUBLICATION_LIST_FILTERS

from .models import ExpertiseArea, Instructor, TeamMember

PUBLICATION_FIELDS = ("Publication", {"fields": ["status", "display_order", "is_demo"]})


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "role", "is_leadership", "status", "display_order", "is_demo"]
    list_filter = ["is_leadership", *PUBLICATION_LIST_FILTERS]
    search_fields = ["name", "role", "bio"]
    prepopulated_fields = {"slug": ["name"]}
    actions = PUBLICATION_ACTIONS
    fieldsets = [
        (None, {"fields": ["name", "slug", "role", "is_leadership", "bio"]}),
        ("Photo", {"fields": ["photo", "photo_alt", "photo_approved"]}),
        ("Links", {"fields": ["linkedin_url", "website_url"]}),
        PUBLICATION_FIELDS,
        ("Internal", {"fields": ["internal_notes"]}),
    ]


@admin.register(ExpertiseArea)
class ExpertiseAreaAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ["name", "headline", "is_featured", "qualifications_verified", "status", "display_order", "is_demo"]
    list_filter = ["is_featured", "qualifications_verified", "expertise", *PUBLICATION_LIST_FILTERS]
    search_fields = ["name", "headline", "short_bio", "biography"]
    prepopulated_fields = {"slug": ["name"]}
    filter_horizontal = ["expertise"]
    actions = PUBLICATION_ACTIONS
    fieldsets = [
        (None, {"fields": ["name", "slug", "headline", "short_bio", "biography", "expertise"]}),
        ("Qualifications", {"fields": ["qualifications", "qualifications_verified"]}),
        ("Photo", {"fields": ["photo", "photo_alt", "photo_approved"]}),
        ("Links", {"fields": ["linkedin_url", "website_url"]}),
        ("Publication", {"fields": ["status", "is_featured", "display_order", "is_demo"]}),
        ("Internal", {"fields": ["internal_notes"]}),
    ]
