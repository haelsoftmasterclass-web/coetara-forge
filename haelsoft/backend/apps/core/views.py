from django.db import connection
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response


@extend_schema(
    responses=inline_serializer("Health", {"status": serializers.CharField(), "database": serializers.CharField()})
)
@api_view(["GET"])
@throttle_classes([])
def health(request):
    """Liveness and database reachability. Reveals no versions, hosts or settings."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        database = "ok"
    except Exception:
        database = "unavailable"
    ok = database == "ok"
    return Response({"status": "ok" if ok else "degraded", "database": database}, status=200 if ok else 503)
