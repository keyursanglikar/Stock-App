from django.db import models
from common.models import TenantAwareModel, UUIDModel, TimeStampedModel


class Alert(TenantAwareModel):
    ALERT_TYPES = [
        ('LOW_STOCK', 'Low Stock Level'),
        ('EXPIRY_URGENT', 'Expiring within 7 Days'),
        ('EXPIRY_WARNING', 'Expiring within 30 Days'),
        ('EXPIRED', 'Item Expired'),
        ('DEAD_STOCK', 'No movement in 60+ Days'),
    ]

    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='alerts')
    batch = models.ForeignKey('inventory.Batch', on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    is_dismissed = models.BooleanField(default=False, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['business', 'is_dismissed', 'created_at']),
        ]

    def __str__(self):
        return f"[{self.alert_type}] {self.message}"


class NotificationToken(UUIDModel, TimeStampedModel):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='tokens')
    expo_push_token = models.CharField(max_length=255, unique=True)
    device_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.phone} - {self.expo_push_token[:15]}..."
