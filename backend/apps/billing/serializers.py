from rest_framework import serializers
from .models import Customer, Sale, SaleItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'gstin', 'address', 'outstanding_balance']
        read_only_fields = ['id', 'outstanding_balance']


class SaleItemCreateSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.DecimalField(max_digits=12, decimal_places=3)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2)
    discount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    batch_id = serializers.UUIDField(required=False, allow_null=True)


class QuickBillCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(required=False, allow_blank=True)
    customer_phone = serializers.CharField(required=False, allow_blank=True)
    customer_gstin = serializers.CharField(required=False, allow_blank=True)
    payment_mode = serializers.ChoiceField(choices=Sale.PAYMENT_MODES, default='CASH')
    paid_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    items = SaleItemCreateSerializer(many=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class SaleItemDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'tax_amount', 'total_amount']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemDetailSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Sale
        fields = [
            'id', 'invoice_number', 'customer', 'customer_name', 'subtotal',
            'discount_amount', 'tax_amount', 'cgst_amount', 'sgst_amount',
            'igst_amount', 'total_amount', 'payment_mode', 'paid_amount',
            'items', 'created_at'
        ]
