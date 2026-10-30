from django.db import models
from common.models import TenantAwareModel, UUIDModel, TimeStampedModel


class Category(TenantAwareModel):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ('business', 'name')

    def __str__(self):
        return self.name


class Unit(TenantAwareModel):
    name = models.CharField(max_length=50) # e.g. Pieces, Kilograms, Litres, Strips
    code = models.CharField(max_length=15) # PCS, KG, LTR, STRIP

    class Meta:
        unique_together = ('business', 'code')

    def __str__(self):
        return f"{self.name} ({self.code})"


class Brand(TenantAwareModel):
    name = models.CharField(max_length=120)

    class Meta:
        unique_together = ('business', 'name')

    def __str__(self):
        return self.name


class Product(TenantAwareModel):
    GST_SLABS = [
        (0.00, '0% Exempted'),
        (5.00, '5% Standard Low'),
        (12.00, '12% Standard Medium'),
        (18.00, '18% Standard High'),
        (28.00, '28% Luxury / Sin'),
    ]

    name = models.CharField(max_length=255, db_index=True)
    barcode = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    sku = models.CharField(max_length=64, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    # Financial fields stored as DECIMAL(12,2)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text="Weighted avg cost")
    selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    mrp = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Quantities stored as DECIMAL(12,3)
    current_stock = models.DecimalField(max_digits=12, decimal_places=3, default=0.000, db_index=True)
    min_stock_alert = models.DecimalField(max_digits=12, decimal_places=3, default=5.000)
    reorder_qty = models.DecimalField(max_digits=12, decimal_places=3, default=10.000)
    
    # GST & Tax compliance
    hsn_code = models.CharField(max_length=12, blank=True, null=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, choices=GST_SLABS, default=0.00)
    
    track_expiry = models.BooleanField(default=False)
    track_batch = models.BooleanField(default=False)
    image_url = models.URLField(blank=True, null=True)
    rack_location = models.CharField(max_length=60, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['business', 'barcode']),
            models.Index(fields=['business', 'name']),
            models.Index(fields=['business', 'current_stock']),
        ]

    def __str__(self):
        return f"{self.name} (Stock: {self.current_stock})"


class GlobalProductMaster(UUIDModel, TimeStampedModel):
    """
    Shared crowdsourced master catalog across India.
    Zero-cost extraction for previously scanned barcodes!
    """
    barcode = models.CharField(max_length=64, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=120, blank=True)
    category = models.CharField(max_length=120, blank=True)
    typical_mrp = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    hsn_code = models.CharField(max_length=12, blank=True, null=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    unit_code = models.CharField(max_length=15, default='PCS')
    image_url = models.URLField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} [{self.barcode}]"
