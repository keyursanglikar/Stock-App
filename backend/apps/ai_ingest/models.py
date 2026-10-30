from django.db import models
from common.models import TenantAwareModel


class AIJob(TenantAwareModel):
    MODES = [
        ('product_photo', 'Product Photo Analysis'),
        ('bill_photo', 'Supplier Invoice Extraction'),
        ('barcode', 'Barcode Lookup'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending in Queue'),
        ('PROCESSING', 'Analyzing Image via Vision LLM'),
        ('COMPLETED', 'Completed Successfully'),
        ('FAILED', 'Extraction Failed'),
    ]

    mode = models.CharField(max_length=20, choices=MODES, default='product_photo')
    image_url = models.URLField(max_length=500, blank=True)
    image_hash = models.CharField(max_length=64, blank=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    raw_response = models.JSONField(null=True, blank=True)
    parsed_output = models.JSONField(null=True, blank=True)
    confidence_scores = models.JSONField(null=True, blank=True)
    user_corrected_output = models.JSONField(null=True, blank=True)
    error_message = models.TextField(blank=True)

    def __str__(self):
        return f"AIJob {self.id} [{self.mode} - {self.status}]"
