from rest_framework import serializers
from .models import Supplier, Purchase, PurchaseItem


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'phone', 'gstin', 'address', 'outstanding_balance']
        read_only_fields = ['id', 'outstanding_balance']


class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PurchaseItem
        fields = [
            'id', 'product', 'product_name', 'quantity', 'unit_cost',
            'gst_rate', 'tax_amount', 'total_amount', 'batch_no',
            'mfg_date', 'expiry_date'
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = Purchase
        fields = [
            'id', 'supplier', 'supplier_name', 'bill_number', 'bill_date',
            'subtotal', 'tax_amount', 'total_amount', 'payment_status',
            'paid_amount', 'notes', 'items', 'created_at'
        ]
