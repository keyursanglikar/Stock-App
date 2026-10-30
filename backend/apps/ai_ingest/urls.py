from django.urls import path
from .views import ExtractImageView, JobStatusView, FeedbackView

urlpatterns = [
    path('extract/', ExtractImageView.as_view(), name='ai_extract'),
    path('jobs/<uuid:job_id>/', JobStatusView.as_view(), name='ai_job_status'),
    path('feedback/', FeedbackView.as_view(), name='ai_feedback'),
]
