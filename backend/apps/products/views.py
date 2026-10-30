from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from .models import Product, Category, Unit, Brand, GlobalProductMaster
from .serializers import ProductSerializer, CategorySerializer, UnitSerializer, GlobalProductMasterSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'barcode', 'sku', 'hsn_code']
    ordering_fields = ['name', 'current_stock', 'selling_price', 'created_at']

    def get_queryset(self):
        qs = Product.objects.filter(business=self.request.business, is_deleted=False)
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'low_stock':
            qs = qs.filter(current_stock__lte=models.F('min_stock_alert'))
        elif filter_type == 'out_of_stock':
            qs = qs.filter(current_stock__lte=0)
        return qs

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=['is_deleted'])

    @action(detail=False, methods=['get'], url_path='lookup-barcode')
    def lookup_barcode(self, request):
        barcode = request.query_params.get('barcode', '').strip()
        if not barcode:
            return Response({"error": "Barcode parameter required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Check shop's local product master first
        local_product = Product.objects.filter(business=request.business, barcode=barcode, is_deleted=False).first()
        if local_product:
            return Response({
                "source": "local",
                "product": ProductSerializer(local_product).data
            })

        # 2. Check crowdsourced Global Product Master
        global_product = GlobalProductMaster.objects.filter(barcode=barcode).first()
        if global_product:
            return Response({
                "source": "global",
                "product": GlobalProductMasterSerializer(global_product).data
            })

        return Response({"source": "none", "message": "Barcode not found in database"}, status=status.HTTP_404_NOT_FOUND)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Category.objects.filter(business=self.request.business, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)


class UnitViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UnitSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Unit.objects.filter(business=self.request.business, is_deleted=False)
