from django.db import models
from common.models import TenantAwareModel


class SyncLog(TenantAwareModel):
    client_mutation_id = models.UUIDField(unique=True, db_index=True)
    table_name = models.CharField(max_length=60)
    action = models.CharField(max_length=20) # CREATE, UPDATE, DELETE
    payload = models.JSONField()
    client_timestamp = models.DateTimeField()
    server_timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.table_name} {self.action} ({self.client_mutation_id})"
