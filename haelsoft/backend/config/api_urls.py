from django.urls import path

from apps.contact.views import submit_enquiry
from apps.partners.views import PartnerList
from apps.people.views import ExpertiseAreaList, InstructorDetail, InstructorList, TeamMemberList
from apps.public_content.views import ContentBlockList, ImpactMetricList, site_settings
from apps.testimonials.views import TestimonialList

urlpatterns = [
    path("site-settings/", site_settings, name="site-settings"),
    path("content/<slug:page>/", ContentBlockList.as_view(), name="content-blocks"),
    path("impact-metrics/", ImpactMetricList.as_view(), name="impact-metrics"),
    path("team/", TeamMemberList.as_view(), name="team"),
    path("instructors/", InstructorList.as_view(), name="instructors"),
    path("instructors/<slug:slug>/", InstructorDetail.as_view(), name="instructor-detail"),
    path("expertise-areas/", ExpertiseAreaList.as_view(), name="expertise-areas"),
    path("partners/", PartnerList.as_view(), name="partners"),
    path("testimonials/", TestimonialList.as_view(), name="testimonials"),
    path("contact/", submit_enquiry, name="contact"),
]
