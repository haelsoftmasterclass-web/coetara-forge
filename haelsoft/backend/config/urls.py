from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.core.views import health

admin.site.site_header = "Haelsoft EdTech administration"
admin.site.site_title = "Haelsoft EdTech admin"
admin.site.index_title = "Content and enquiries"

urlpatterns = [
    path(settings.ADMIN_URL_PATH, admin.site.urls),
    path("api/health/", health, name="health"),
    path("api/v1/", include("config.api_urls")),
]

if settings.ENABLE_API_DOCS:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="api-docs"),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
