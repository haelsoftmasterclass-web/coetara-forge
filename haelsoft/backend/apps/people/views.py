from django.db.models import Prefetch, Q
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics

from .models import ExpertiseArea, Instructor, TeamMember
from .serializers import (
    ExpertiseAreaSerializer,
    InstructorDetailSerializer,
    InstructorListSerializer,
    TeamMemberSerializer,
)


class TeamMemberList(generics.ListAPIView):
    serializer_class = TeamMemberSerializer
    queryset = TeamMember.objects.published().order_by("-is_leadership", "display_order", "name")


def published_instructors():
    return Instructor.objects.published().prefetch_related(
        Prefetch("expertise", queryset=ExpertiseArea.objects.order_by("name"))
    )


class InstructorList(generics.ListAPIView):
    serializer_class = InstructorListSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter("search", str, description="Matches name, headline, bio or expertise."),
            OpenApiParameter("expertise", str, description="Expertise area slug."),
            OpenApiParameter("featured", bool),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = published_instructors()
        params = self.request.query_params
        search = params.get("search", "").strip()[:100]
        if search:
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(headline__icontains=search)
                | Q(short_bio__icontains=search)
                | Q(expertise__name__icontains=search)
            ).distinct()
        expertise = params.get("expertise", "").strip()
        if expertise:
            qs = qs.filter(expertise__slug=expertise)
        if params.get("featured", "").lower() in {"1", "true"}:
            qs = qs.filter(is_featured=True)
        return qs.order_by("display_order", "name")


class InstructorDetail(generics.RetrieveAPIView):
    serializer_class = InstructorDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return published_instructors()


class ExpertiseAreaList(generics.ListAPIView):
    """Expertise areas that at least one published instructor has (used for the directory filter)."""

    serializer_class = ExpertiseAreaSerializer
    pagination_class = None

    def get_queryset(self):
        return (
            ExpertiseArea.objects.filter(instructors__in=Instructor.objects.published())
            .distinct()
            .order_by("name")
        )
