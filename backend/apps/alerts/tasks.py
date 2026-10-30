import datetime
from celery import shared_task
from django.db.models import F
from apps.accounts.models import Business
from apps.products.models import Product
from apps.inventory.models import Batch
from apps.alerts.models import Alert


@shared_task
def scan_all_businesses_for_alerts():
    """
    Celery Beat automated morning job to evaluate:
    1. Low Stock levels across all stores
    2. Expiry dates in 7-day, 30-day, and expired categories
    """
    today = datetime.date.today()
    in_7_days = today + datetime.timedelta(days=7)
    in_30_days = today + datetime.timedelta(days=30)

    for business in Business.objects.filter(is_active=True):
        # 1. Low stock detection
        low_stock_products = Product.objects.filter(
            business=business,
            is_deleted=False,
            current_stock__lte=F('min_stock_alert')
        )
        for prod in low_stock_products:
            msg = f"{prod.name} is running low ({prod.current_stock} left, min alert is {prod.min_stock_alert})."
            Alert.objects.get_or_create(
                business=business,
                product=prod,
                alert_type='LOW_STOCK',
                is_dismissed=False,
                defaults={'message': msg}
            )

        # 2. Expiry detection
        expiring_batches = Batch.objects.filter(
            business=business,
            remaining_qty__gt=0,
            expiry_date__lte=in_30_days
        ).select_related('product')

        for b in expiring_batches:
            if b.expiry_date < today:
                atype = 'EXPIRED'
                msg = f"BATCH EXPIRED: {b.product.name} (Batch {b.batch_no}) expired on {b.expiry_date}."
            elif b.expiry_date <= in_7_days:
                atype = 'EXPIRY_URGENT'
                msg = f"EXPIRING IN 7 DAYS: {b.product.name} (Batch {b.batch_no}) expires on {b.expiry_date}."
            else:
                atype = 'EXPIRY_WARNING'
                msg = f"Expiring Soon (30d): {b.product.name} (Batch {b.batch_no}) expires on {b.expiry_date}."

            Alert.objects.get_or_create(
                business=business,
                product=b.product,
                batch=b,
                alert_type=atype,
                is_dismissed=False,
                defaults={'message': msg}
            )
