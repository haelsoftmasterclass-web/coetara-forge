from django.db import migrations

# Initial target markets from the Phase 1 brief. They are provisional: every one
# starts as "planned" so the website never presents them as operational.
MARKETS = [
    ("NG", "Nigeria", True),
    ("GH", "Ghana", False),
    ("KE", "Kenya", False),
    ("RW", "Rwanda", False),
    ("UG", "Uganda", False),
    ("ZA", "South Africa", False),
]


def forwards(apps, schema_editor):
    Market = apps.get_model("public_content", "Market")
    for order, (code, name, home) in enumerate(MARKETS, start=1):
        Market.objects.get_or_create(
            country_code=code,
            defaults={"name": name, "is_home_market": home, "status": "planned", "display_order": order * 10},
        )
    SiteSettings = apps.get_model("public_content", "SiteSettings")
    if not SiteSettings.objects.exists():
        SiteSettings.objects.create(site_name="Haelsoft EdTech")


def backwards(apps, schema_editor):
    Market = apps.get_model("public_content", "Market")
    Market.objects.filter(country_code__in=[m[0] for m in MARKETS], status="planned").delete()


class Migration(migrations.Migration):
    dependencies = [("public_content", "0001_initial")]

    operations = [migrations.RunPython(forwards, backwards)]
