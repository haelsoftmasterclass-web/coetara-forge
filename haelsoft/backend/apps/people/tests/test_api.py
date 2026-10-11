from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.people.models import ExpertiseArea, Instructor, TeamMember


def make_instructor(name, **kwargs):
    defaults = dict(headline="Headline", short_bio="Short bio", biography="Full bio", status="published")
    defaults.update(kwargs)
    return Instructor.objects.create(name=name, **defaults)


@override_settings(SHOW_DEMO_CONTENT=False)
class InstructorApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sql = ExpertiseArea.objects.create(name="SQL")
        self.ada = make_instructor("Ada Obi", is_featured=True, qualifications="BSc Computer Science", internal_notes="private")
        self.ada.expertise.add(self.sql)
        make_instructor("Draft Person", status="draft")
        make_instructor("Archived Person", status="archived")
        make_instructor("Demo Person", is_demo=True)

    def test_list_shows_only_published_non_demo(self):
        data = self.client.get("/api/v1/instructors/").json()
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["results"][0]["slug"], "ada-obi")

    def test_list_is_paginated(self):
        for i in range(15):
            make_instructor(f"Person {i:02d}")
        data = self.client.get("/api/v1/instructors/").json()
        self.assertEqual(data["count"], 16)
        self.assertEqual(len(data["results"]), 12)
        self.assertIsNotNone(data["next"])

    def test_search_and_expertise_filter(self):
        make_instructor("Kofi Boateng", headline="Marketing lead")
        self.assertEqual(self.client.get("/api/v1/instructors/?search=marketing").json()["count"], 1)
        self.assertEqual(self.client.get("/api/v1/instructors/?search=sql").json()["results"][0]["name"], "Ada Obi")
        self.assertEqual(self.client.get("/api/v1/instructors/?expertise=sql").json()["count"], 1)
        self.assertEqual(self.client.get("/api/v1/instructors/?featured=true").json()["count"], 1)

    def test_detail_by_slug(self):
        data = self.client.get("/api/v1/instructors/ada-obi/").json()
        self.assertEqual(data["name"], "Ada Obi")
        self.assertEqual(data["expertise"], [{"name": "SQL", "slug": "sql"}])
        self.assertEqual(data["courses"], [])
        self.assertNotIn("internal_notes", data)

    def test_unknown_slug_returns_404(self):
        self.assertEqual(self.client.get("/api/v1/instructors/does-not-exist/").status_code, 404)

    def test_draft_and_demo_slugs_return_404(self):
        self.assertEqual(self.client.get("/api/v1/instructors/draft-person/").status_code, 404)
        self.assertEqual(self.client.get("/api/v1/instructors/demo-person/").status_code, 404)

    def test_unverified_qualifications_hidden(self):
        self.assertEqual(self.client.get("/api/v1/instructors/ada-obi/").json()["qualifications"], [])
        self.ada.qualifications_verified = True
        self.ada.save()
        self.assertEqual(self.client.get("/api/v1/instructors/ada-obi/").json()["qualifications"], ["BSc Computer Science"])

    def test_unapproved_photo_hidden(self):
        self.ada.photo = "instructors/ada.jpg"
        self.ada.photo_alt = "Ada smiling"
        self.ada.save()
        self.assertIsNone(self.client.get("/api/v1/instructors/ada-obi/").json()["photo"])
        self.ada.photo_approved = True
        self.ada.save()
        self.assertTrue(self.client.get("/api/v1/instructors/ada-obi/").json()["photo"].endswith("/media/instructors/ada.jpg"))

    def test_expertise_areas_only_from_published_instructors(self):
        hidden = ExpertiseArea.objects.create(name="Hidden Skill")
        Instructor.objects.get(slug="draft-person").expertise.add(hidden)
        names = [a["name"] for a in self.client.get("/api/v1/expertise-areas/").json()]
        self.assertEqual(names, ["SQL"])

    @override_settings(SHOW_DEMO_CONTENT=True)
    def test_demo_visible_only_when_enabled(self):
        self.assertEqual(self.client.get("/api/v1/instructors/").json()["count"], 2)

    def test_slugs_are_unique(self):
        twin = make_instructor("Ada Obi")
        self.assertEqual(twin.slug, "ada-obi-2")


@override_settings(SHOW_DEMO_CONTENT=False)
class TeamApiTests(TestCase):
    def test_only_published_members_with_leadership_first(self):
        TeamMember.objects.create(name="Staff", role="Coordinator", status="published", display_order=1)
        TeamMember.objects.create(name="Lead", role="Director", is_leadership=True, status="published", display_order=5)
        TeamMember.objects.create(name="Hidden", role="Draft", status="draft")
        data = APIClient().get("/api/v1/team/").json()
        self.assertEqual([m["name"] for m in data["results"]], ["Lead", "Staff"])
        self.assertNotIn("internal_notes", data["results"][0])
