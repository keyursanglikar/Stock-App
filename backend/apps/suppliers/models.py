from django.db import models
from common.models import TenantAwareModel


class Supplier(TenantAwareModel):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, db_index=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True)
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        indexes = [
            models.Index(fields=['business', 'name']),
        ]

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Purchase(TenantAwareModel):
    PAYMENT_STATUS = [
        ('PAID', 'Paid'),
        ('PARTIAL', 'Partially Paid'),
        ('CREDIT', 'Unpaid / Credit'),
    ]

    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchases')
    bill_number = models.CharField(max_length=64, db_index=True)
    bill_date = models.DateField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=15, choices=PAYMENT_STATUS, default='PAID')
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Purchase Bill #{self.bill_number} - ₹{self.total_amount}"


class PurchaseItem(TenantAwareModel):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='purchase_items')
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    batch_no = models.CharField(max_length=64, blank=True)
    mfg_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} x {self.quantity} @ ₹{self.unit_cost}"
