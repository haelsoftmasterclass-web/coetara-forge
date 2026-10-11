from django.conf import settings


def public_media_url(file, context) -> str | None:
    """Absolute URL for an uploaded file, or None when none is set."""
    if not file:
        return None
    url = file.url
    if settings.MEDIA_PUBLIC_BASE_URL:
        return f"{settings.MEDIA_PUBLIC_BASE_URL}{url}"
    request = context.get("request")
    return request.build_absolute_uri(url) if request else url
