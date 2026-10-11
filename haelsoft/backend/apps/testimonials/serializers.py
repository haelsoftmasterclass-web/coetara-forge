from rest_framework import serializers

from apps.core.fields import public_media_url

from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    programme = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    photo_alt = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ["id", "learner_name", "quote", "programme", "role", "location", "photo", "photo_alt", "is_featured"]

    def get_programme(self, obj) -> str:
        return obj.programme if obj.programme_verified else ""

    def get_photo(self, obj) -> str | None:
        if not obj.photo_consent:
            return None
        return public_media_url(obj.photo, self.context)

    def get_photo_alt(self, obj) -> str:
        return (obj.photo_alt or f"Photo of {obj.learner_name}") if obj.photo_consent and obj.photo else ""
