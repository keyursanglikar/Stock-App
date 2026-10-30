import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockwise.settings')

app = Celery('stockwise')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Celery Beat Scheduled Tasks
app.conf.beat_schedule = {
    'scan-low-stock-and-expiries-every-morning': {
        'task': 'apps.alerts.tasks.scan_all_businesses_for_alerts',
        'schedule': crontab(hour=7, minute=0), # Run daily at 7:00 AM IST
    },
}
