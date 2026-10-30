from rest_framework import serializers
from .models import Batch, StockMovement


class BatchSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Batch
        fields = [
            'id', 'product', 'product_name', 'batch_no',
            'mfg_date', 'expiry_date', 'cost_price', 'initial_qty',
            'remaining_qty', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    batch_no = serializers.CharField(source='batch.batch_no', read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            'id', 'product', 'product_name', 'batch', 'batch_no',
            'movement_type', 'quantity', 'unit_cost', 'reference_type',
            'reference_id', 'reason', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class QuickStockInSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.DecimalField(max_digits=12, decimal_places=3)
    cost_price = serializers.DecimalField(max_digits=12, decimal_places=2)
    batch_no = serializers.CharField(max_length=64, required=False, allow_blank=True)
    mfg_date = serializers.DateField(required=False, allow_null=True)
    expiry_date = serializers.DateField(required=False, allow_null=True)
    supplier_id = serializers.UUIDField(required=False, allow_null=True)


class QuickStockOutSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.DecimalField(max_digits=12, decimal_places=3)
    movement_type = serializers.ChoiceField(choices=['OUT', 'WASTE', 'RETURN', 'ADJUST'], default='OUT')
    reason = serializers.CharField(required=False, allow_blank=True)
