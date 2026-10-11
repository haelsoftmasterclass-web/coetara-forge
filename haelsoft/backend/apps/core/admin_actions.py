from django.contrib import admin, messages
from django.utils import timezone

from .models import PublicationStatus


@admin.action(description="Publish selected records")
def publish(modeladmin, request, queryset):
    updated = 0
    for obj in queryset:
        obj.status = PublicationStatus.PUBLISHED
        try:
            obj.full_clean()
        except Exception as exc:  # validation error explains what is missing
            modeladmin.message_user(request, f"{obj}: not published. {exc}", messages.ERROR)
            continue
        obj.save()
        updated += 1
    if updated:
        modeladmin.message_user(request, f"Published {updated} record(s).", messages.SUCCESS)


@admin.action(description="Move selected records back to draft")
def unpublish(modeladmin, request, queryset):
    count = queryset.update(status=PublicationStatus.DRAFT, updated_at=timezone.now())
    modeladmin.message_user(request, f"Moved {count} record(s) to draft.", messages.SUCCESS)


PUBLICATION_ACTIONS = [publish, unpublish]
PUBLICATION_LIST_FILTERS = ("status", "is_demo")
