from rest_framework import serializers

from apps.core.fields import public_media_url

from .models import ExpertiseArea, Instructor, TeamMember


class ApprovedPhotoMixin(serializers.Serializer):
    photo = serializers.SerializerMethodField()
    photo_alt = serializers.SerializerMethodField()

    def get_photo(self, obj) -> str | None:
        if not obj.photo_approved:
            return None
        return public_media_url(obj.photo, self.context)

    def get_photo_alt(self, obj) -> str:
        return obj.photo_alt if obj.photo_approved and obj.photo else ""


class TeamMemberSerializer(ApprovedPhotoMixin, serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["slug", "name", "role", "is_leadership", "bio", "photo", "photo_alt", "linkedin_url", "website_url"]


class ExpertiseAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertiseArea
        fields = ["name", "slug"]


class InstructorListSerializer(ApprovedPhotoMixin, serializers.ModelSerializer):
    expertise = ExpertiseAreaSerializer(many=True, read_only=True)

    class Meta:
        model = Instructor
        fields = ["slug", "name", "headline", "short_bio", "expertise", "photo", "photo_alt", "is_featured"]


class InstructorDetailSerializer(InstructorListSerializer):
    qualifications = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()

    class Meta(InstructorListSerializer.Meta):
        fields = InstructorListSerializer.Meta.fields + [
            "biography",
            "qualifications",
            "linkedin_url",
            "website_url",
            "courses",
        ]

    def get_qualifications(self, obj) -> list[str]:
        return obj.qualification_list if obj.qualifications_verified else []

    def get_courses(self, obj) -> list[dict]:
        # Extension point: the course catalogue arrives in a later phase.
        return []
