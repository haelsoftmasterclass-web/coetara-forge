from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from .models import ContentBlock, ContentPage, ImpactMetric, SiteSettings
from .serializers import ContentBlockSerializer, ImpactMetricSerializer, SiteSettingsSerializer


@extend_schema(responses=SiteSettingsSerializer)
@api_view(["GET"])
def site_settings(request):
    return Response(SiteSettingsSerializer(SiteSettings.load(), context={"request": request}).data)


class ContentBlockList(generics.ListAPIView):
    serializer_class = ContentBlockSerializer
    pagination_class = None

    @extend_schema(parameters=[OpenApiParameter("page", str, OpenApiParameter.PATH, enum=ContentPage.values)])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        page = self.kwargs["page"]
        if page not in ContentPage.values:
            raise NotFound("Unknown page.")
        return ContentBlock.objects.published().filter(page=page).order_by("display_order", "id")


class ImpactMetricList(generics.ListAPIView):
    serializer_class = ImpactMetricSerializer
    pagination_class = None

    def get_queryset(self):
        return ImpactMetric.objects.published().filter(is_verified=True).order_by("display_order", "-as_of")
