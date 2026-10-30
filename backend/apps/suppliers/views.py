from rest_framework import viewsets
from common.permissions import IsAuthenticatedAndTenantMember
from .models import Supplier, Purchase
from .serializers import SupplierSerializer, PurchaseSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Supplier.objects.filter(business=self.request.business, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)


class PurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Purchase.objects.filter(business=self.request.business).order_by('-created_at')
