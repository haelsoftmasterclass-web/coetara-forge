from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ["subject", "enquiry_type", "name", "country", "status", "created_at"]
    list_filter = ["status", "enquiry_type", "created_at"]
    search_fields = ["subject", "name", "email"]
    date_hierarchy = "created_at"
    readonly_fields = [
        "enquiry_type",
        "name",
        "email",
        "phone",
        "country",
        "subject",
        "message",
        "consent",
        "source_page",
        "created_at",
        "updated_at",
        "resolved_at",
    ]
    fieldsets = [
        ("Enquiry", {"fields": ["enquiry_type", "subject", "message", "source_page"]}),
        ("Sender", {"fields": ["name", "email", "phone", "country", "consent"]}),
        ("Handling", {"fields": ["status", "staff_notes", "created_at", "updated_at", "resolved_at"]}),
    ]
    actions = ["mark_in_progress", "mark_resolved"]

    def has_add_permission(self, request):
        # Enquiries come only from the public form.
        return False

    @admin.action(description="Mark as in progress", permissions=["change"])
    def mark_in_progress(self, request, queryset):
        for enquiry in queryset:
            enquiry.status = "in_progress"
            enquiry.save()

    @admin.action(description="Mark as resolved", permissions=["change"])
    def mark_resolved(self, request, queryset):
        for enquiry in queryset:
            enquiry.status = "resolved"
            enquiry.save()
