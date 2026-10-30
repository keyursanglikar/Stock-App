import datetime
from django.urls import path
from .views import SyncPullView, SyncPushView

urlpatterns = [
    path('pull/', SyncPullView.as_view(), name='sync_pull'),
    path('push/', SyncPushView.as_view(), name='sync_push'),
]
