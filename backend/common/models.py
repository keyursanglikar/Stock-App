import uuid
from django.db import models


class UUIDModel(models.Model):
    """Abstract base model with client-generated or server UUID4 primary key."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    """Abstract model tracking creation and update timestamps."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TenantAwareModel(UUIDModel, TimeStampedModel):
    """
    Abstract model enforcing multi-tenant isolation.
    Every tenant record is linked to a business_id with indexing.
    """
    business = models.ForeignKey(
        'accounts.Business',
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_set",
        db_index=True
    )
    is_deleted = models.BooleanField(default=False, db_index=True)

    class Meta:
        abstract = True
