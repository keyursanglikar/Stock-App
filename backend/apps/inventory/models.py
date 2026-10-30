from django.db import models
from common.models import TenantAwareModel


class Batch(TenantAwareModel):
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='batches')
    batch_no = models.CharField(max_length=64, db_index=True)
    mfg_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True, db_index=True)
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    initial_qty = models.DecimalField(max_digits=12, decimal_places=3, default=0.000)
    remaining_qty = models.DecimalField(max_digits=12, decimal_places=3, default=0.000, db_index=True)

    class Meta:
        unique_together = ('business', 'product', 'batch_no')
        indexes = [
            models.Index(fields=['business', 'product', 'expiry_date']),
        ]

    def __str__(self):
        return f"{self.product.name} - Batch: {self.batch_no} (Rem: {self.remaining_qty})"


class StockMovement(TenantAwareModel):
    MOVEMENT_TYPES = [
        ('IN', 'Stock In (Purchase/Opening)'),
        ('OUT', 'Stock Out (Sale)'),
        ('ADJUST', 'Stock Adjustment'),
        ('WASTE', 'Damage / Expiry Write-off'),
        ('RETURN', 'Supplier Return'),
    ]

    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='movements')
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name='movements')
    movement_type = models.CharField(max_length=15, choices=MOVEMENT_TYPES)
    quantity = models.DecimalField(max_digits=12, decimal_places=3) # Positive for additions, negative or positive handled by type
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    reference_type = models.CharField(max_length=50, blank=True) # SALE, PURCHASE, AUDIT
    reference_id = models.UUIDField(null=True, blank=True)
    reason = models.TextField(blank=True)
    user = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['business', 'product', 'created_at']),
        ]

    def __str__(self):
        return f"{self.movement_type} {self.quantity} x {self.product.name}"
