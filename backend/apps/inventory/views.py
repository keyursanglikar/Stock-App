from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from .models import Batch, StockMovement
from .serializers import BatchSerializer, StockMovementSerializer, QuickStockInSerializer, QuickStockOutSerializer
from .services import StockMovementService, FEFOService


class BatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Batch.objects.filter(business=self.request.business).order_by('expiry_date')


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return StockMovement.objects.filter(business=self.request.business).order_by('-created_at')


class QuickStockInView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    def post(self, request):
        serializer = QuickStockInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        batch = None
        if data.get('batch_no'):
            batch, _ = Batch.objects.get_or_create(
                business=request.business,
                product_id=data['product_id'],
                batch_no=data['batch_no'],
                defaults={
                    'cost_price': data['cost_price'],
                    'mfg_date': data.get('mfg_date'),
                    'expiry_date': data.get('expiry_date'),
                }
            )

        movement, product = StockMovementService.record_movement(
            business=request.business,
            product_id=data['product_id'],
            movement_type='IN',
            quantity=data['quantity'],
            unit_cost=data['cost_price'],
            batch_id=batch.id if batch else None,
            reference_type='QUICK_STOCK_IN',
            user=request.user
        )

        return Response({
            "success": True,
            "product_id": str(product.id),
            "new_stock": str(product.current_stock),
            "movement_id": str(movement.id)
        }, status=status.HTTP_201_CREATED)


class QuickStockOutView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    def post(self, request):
        serializer = QuickStockOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Use FEFO auto-picking for products tracking expiry
        picks = FEFOService.pick_batches_for_sale(
            business=request.business,
            product_id=data['product_id'],
            required_qty=data['quantity']
        )

        total_moved = 0
        for pick in picks:
            movement, product = StockMovementService.record_movement(
                business=request.business,
                product_id=data['product_id'],
                movement_type=data['movement_type'],
                quantity=pick['pick_qty'],
                batch_id=pick['batch_id'],
                reference_type='QUICK_STOCK_OUT',
                reason=data.get('reason', ''),
                user=request.user
            )

        return Response({
            "success": True,
            "product_id": str(product.id),
            "new_stock": str(product.current_stock),
            "batches_picked": picks
        }, status=status.HTTP_200_OK)
