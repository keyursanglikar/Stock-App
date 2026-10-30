from django.db import models
from common.models import TenantAwareModel


class Customer(TenantAwareModel):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, db_index=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True)
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Udhaar balance")

    class Meta:
        indexes = [
            models.Index(fields=['business', 'phone']),
        ]

    def __str__(self):
        return f"{self.name} ({self.phone}) - Udhaar: ₹{self.outstanding_balance}"


class Sale(TenantAwareModel):
    PAYMENT_MODES = [
        ('CASH', 'Cash'),
        ('UPI', 'UPI / QR'),
        ('CARD', 'Card'),
        ('CREDIT', 'Udhaar / Store Credit'),
        ('SPLIT', 'Split Payment'),
    ]

    invoice_number = models.CharField(max_length=64, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    
    # Financials
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    round_off = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    payment_mode = models.CharField(max_length=15, choices=PAYMENT_MODES, default='CASH')
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ('business', 'invoice_number')
        indexes = [
            models.Index(fields=['business', 'created_at']),
        ]

    def __str__(self):
        return f"Bill #{self.invoice_number} - ₹{self.total_amount}"


class SaleItem(TenantAwareModel):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='sale_items')
    batch = models.ForeignKey('inventory.Batch', on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2) # Selling price per unit
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00) # Purchase price at time of sale
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
