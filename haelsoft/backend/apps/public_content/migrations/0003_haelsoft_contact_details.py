from django.db import migrations

# Contact details supplied by Haelsoft on 2026-10-11. Only fills blank fields,
# so anything staff have already edited in Django Admin is never overwritten.
CONTACT = {
    "contact_phone": "+234 706 282 7560",
    "contact_email": "info@haelsoftmasterclass.com",
}


def forwards(apps, schema_editor):
    SiteSettings = apps.get_model("public_content", "SiteSettings")
    settings_obj = SiteSettings.objects.order_by("pk").first()
    if settings_obj is None:
        return
    changed = [field for field, value in CONTACT.items() if not getattr(settings_obj, field)]
    for field in changed:
        setattr(settings_obj, field, CONTACT[field])
    if changed:
        settings_obj.save(update_fields=changed)


def backwards(apps, schema_editor):
    SiteSettings = apps.get_model("public_content", "SiteSettings")
    for field, value in CONTACT.items():
        SiteSettings.objects.filter(**{field: value}).update(**{field: ""})


class Migration(migrations.Migration):
    dependencies = [("public_content", "0002_initial_markets_and_settings")]

    operations = [migrations.RunPython(forwards, backwards)]
