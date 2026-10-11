"""
Django settings for the Haelsoft EdTech API.

Every deployment-specific value comes from environment variables (see
`.env.example`). A local `.env` file is loaded for development convenience;
production should set real environment variables instead.
"""

import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def env(name: str, default: str | None = None) -> str:
    """Read a setting. An empty value counts as unset, so blank lines in .env fall back to the default."""
    value = os.environ.get(name) or default
    if value is None:
        raise ImproperlyConfigured(f"Set the {name} environment variable.")
    return value


def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


DEBUG = env_bool("DJANGO_DEBUG", False)

if DEBUG:
    SECRET_KEY = env("DJANGO_SECRET_KEY", "insecure-development-key-do-not-use-in-production")
else:
    SECRET_KEY = env("DJANGO_SECRET_KEY")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1" if DEBUG else "")

# ── Applications ────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "drf_spectacular",
    "apps.core",
    "apps.public_content",
    "apps.people",
    "apps.partners",
    "apps.testimonials",
    "apps.contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
# Keep the staff admin off the obvious /admin/ path in production if you like, e.g. "staff-7f3a/".
ADMIN_URL_PATH = env("DJANGO_ADMIN_URL_PATH", "admin/")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ── Database (PostgreSQL) ───────────────────────────────────────────────────
DATABASES = {
    "default": dj_database_url.parse(
        env("DATABASE_URL", "postgres://haelsoft:haelsoft@localhost:5432/haelsoft" if DEBUG else None),
        conn_max_age=int(env("DATABASE_CONN_MAX_AGE", "60")),
        conn_health_checks=True,
    )
}
if DATABASES["default"]["ENGINE"] != "django.db.backends.postgresql":
    raise ImproperlyConfigured("Haelsoft EdTech uses PostgreSQL. DATABASE_URL must start with postgres://")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── Auth ────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ────────────────────────────────────────────────────
LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True

# ── Static and media files ──────────────────────────────────────────────────
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = Path(env("DJANGO_MEDIA_ROOT", str(BASE_DIR / "media")))
# Public absolute base for media URLs in API responses, e.g. https://api.haelsoft.com
# Leave empty to build URLs from the incoming request.
MEDIA_PUBLIC_BASE_URL = env("MEDIA_PUBLIC_BASE_URL", "").rstrip("/")
DATA_UPLOAD_MAX_MEMORY_SIZE = 2_621_440

# ── Django REST Framework ───────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    # Phase 1 public endpoints are anonymous and read-only (plus the contact form).
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_PAGINATION_CLASS": "apps.core.pagination.StandardPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_RATES": {
        "contact": env("CONTACT_THROTTLE_RATE", "5/hour"),
    },
    # Number of trusted reverse proxies in front of Django; used to read the client IP for throttling.
    "NUM_PROXIES": int(env("DJANGO_NUM_PROXIES", "0")),
}
if DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append("rest_framework.renderers.BrowsableAPIRenderer")

SPECTACULAR_SETTINGS = {
    "TITLE": "Haelsoft EdTech API",
    "DESCRIPTION": "Public API for the Haelsoft EdTech website (Phase 1).",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "ENUM_NAME_OVERRIDES": {"LaunchStatusEnum": "apps.public_content.models.LaunchStatus"},
}
ENABLE_API_DOCS = env_bool("ENABLE_API_DOCS", DEBUG)

# Throttle counters live in the cache. Use a shared cache (e.g. Redis) when running several processes.
CACHES = {
    "default": {
        "BACKEND": env("CACHE_BACKEND", "django.core.cache.backends.locmem.LocMemCache"),
        "LOCATION": env("CACHE_LOCATION", "haelsoft"),
    }
}

# ── CORS / CSRF ─────────────────────────────────────────────────────────────
# Explicit origins only. The public API uses no cookies, so credentials stay disabled.
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "http://localhost:3000" if DEBUG else "")
CORS_ALLOW_CREDENTIALS = False
CORS_URLS_REGEX = r"^/api/.*$"
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "")

# ── Security ────────────────────────────────────────────────────────────────
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(env("DJANGO_SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", True)
    SECURE_HSTS_PRELOAD = env_bool("DJANGO_SECURE_HSTS_PRELOAD", False)
    if env_bool("DJANGO_BEHIND_TLS_PROXY", True):
        SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    # The health check is called by load balancers over plain HTTP inside the network.
    SECURE_REDIRECT_EXEMPT = [r"^api/health/$"]

# ── Email (contact notifications) ───────────────────────────────────────────
EMAIL_BACKEND = env(
    "EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend" if DEBUG else "django.core.mail.backends.smtp.EmailBackend",
)
EMAIL_HOST = env("EMAIL_HOST", "localhost")
EMAIL_PORT = int(env("EMAIL_PORT", "587"))
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", "webmaster@localhost")
# Staff inboxes notified when an enquiry arrives. Empty = enquiries are only stored.
CONTACT_NOTIFICATION_EMAILS = env_list("CONTACT_NOTIFICATION_EMAILS", "")
# Base URL of Django Admin, used for the link in notification emails.
ADMIN_BASE_URL = env("ADMIN_BASE_URL", "").rstrip("/")

# ── Content safety ──────────────────────────────────────────────────────────
# Demo records created by `manage.py seed_demo` are flagged is_demo=True and are
# hidden from every public endpoint unless this is explicitly switched on.
SHOW_DEMO_CONTENT = env_bool("SHOW_DEMO_CONTENT", False)

# ── Logging ─────────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": env("DJANGO_LOG_LEVEL", "INFO")},
}
