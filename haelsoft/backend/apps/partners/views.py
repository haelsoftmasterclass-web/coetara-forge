from rest_framework import generics

from .models import Partner, PartnerCategory
from .serializers import PartnerSerializer


class PartnerList(generics.ListAPIView):
    serializer_class = PartnerSerializer

    def get_queryset(self):
        qs = Partner.objects.published().filter(partnership_confirmed=True)
        category = self.request.query_params.get("category", "")
        if category in PartnerCategory.values:
            qs = qs.filter(category=category)
        return qs.order_by("display_order", "name")
