from rest_framework import generics

from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialList(generics.ListAPIView):
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        qs = Testimonial.objects.published().filter(consent_given=True)
        if self.request.query_params.get("featured", "").lower() in {"1", "true"}:
            qs = qs.filter(is_featured=True)
        return qs.order_by("display_order", "-created_at")
