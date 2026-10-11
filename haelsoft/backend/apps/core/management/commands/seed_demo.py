"""Create clearly labelled demo records for local development.

Every record is flagged is_demo=True and its text says it is demo content.
Public endpoints hide demo records unless SHOW_DEMO_CONTENT=true, and this
command refuses to run when DEBUG is off.
"""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.partners.models import Partner
from apps.people.models import ExpertiseArea, Instructor, TeamMember
from apps.testimonials.models import Testimonial

DEMO = "[Demo]"

INSTRUCTORS = [
    {
        "name": f"{DEMO} Amara Okafor",
        "slug": "demo-amara-okafor",
        "headline": "Sample profile: data analytics instructor",
        "short_bio": "Demo instructor record used to preview the directory layout. Replace with a real, approved profile.",
        "expertise": ["Data Analytics", "Excel", "SQL"],
        "featured": True,
    },
    {
        "name": f"{DEMO} Kwame Mensah",
        "slug": "demo-kwame-mensah",
        "headline": "Sample profile: digital marketing instructor",
        "short_bio": "Demo instructor record used to preview the directory layout. Replace with a real, approved profile.",
        "expertise": ["Digital Marketing", "Performance Marketing"],
        "featured": True,
    },
    {
        "name": f"{DEMO} Wanjiru Kamau",
        "slug": "demo-wanjiru-kamau",
        "headline": "Sample profile: software development instructor",
        "short_bio": "Demo instructor record used to preview the directory layout. Replace with a real, approved profile.",
        "expertise": ["Software Development", "Python"],
        "featured": True,
    },
    {
        "name": f"{DEMO} Unpublished Draft",
        "slug": "demo-unpublished-draft",
        "headline": "Draft profile that must never appear publicly",
        "short_bio": "This draft exists to prove drafts stay hidden.",
        "expertise": ["Project Management"],
        "featured": False,
        "status": "draft",
    },
]


class Command(BaseCommand):
    help = "Create labelled demo content for local development (refuses to run with DEBUG off)."

    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true", help="Delete existing demo records first.")

    @transaction.atomic
    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError("seed_demo only runs with DJANGO_DEBUG=true. Demo data must not reach production.")

        if options["clear"]:
            for model in (Instructor, TeamMember, Partner, Testimonial):
                model.objects.filter(is_demo=True).delete()

        biography = (
            "This is demo biography text. It shows how a full professional biography is laid out on the "
            "profile page.\n\nReplace this record with a real instructor's approved biography in Django Admin."
        )
        for order, data in enumerate(INSTRUCTORS, start=1):
            instructor, _ = Instructor.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "headline": data["headline"],
                    "short_bio": data["short_bio"],
                    "biography": biography,
                    "qualifications": "Demo qualification (not verified)",
                    "qualifications_verified": False,
                    "is_featured": data["featured"],
                    "status": data.get("status", "published"),
                    "display_order": order * 10,
                    "is_demo": True,
                },
            )
            areas = [ExpertiseArea.objects.get_or_create(name=name)[0] for name in data["expertise"]]
            instructor.expertise.set(areas)

        for order, (name, role, leadership) in enumerate(
            [
                (f"{DEMO} Team Lead", "Sample leadership role", True),
                (f"{DEMO} Programme Coordinator", "Sample team role", False),
            ],
            start=1,
        ):
            TeamMember.objects.update_or_create(
                name=name,
                defaults={
                    "role": role,
                    "is_leadership": leadership,
                    "bio": "Demo team profile used to preview the layout. Replace with a real, approved profile.",
                    "status": "published",
                    "display_order": order * 10,
                    "is_demo": True,
                },
            )

        Partner.objects.update_or_create(
            name=f"{DEMO} Sample Partner Organisation",
            defaults={
                "category": "education",
                "description": "Demo partner record used to preview the layout. It is not a real partnership.",
                "partnership_confirmed": True,
                "status": "published",
                "is_demo": True,
            },
        )

        Testimonial.objects.update_or_create(
            learner_name=f"{DEMO} Sample Learner",
            defaults={
                "quote": "This is placeholder text that previews how an approved learner testimonial is displayed. It is not a real quote.",
                "consent_given": True,
                "consent_date": timezone.localdate(),
                "consent_record": "Demo record: no real consent",
                "status": "published",
                "is_demo": True,
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo content created. It is visible only when SHOW_DEMO_CONTENT=true."))
