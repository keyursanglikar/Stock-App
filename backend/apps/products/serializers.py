from rest_framework import serializers
from .models import Product, Category, Unit, Brand, GlobalProductMaster


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name', 'code']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    unit_code = serializers.CharField(source='unit.code', read_only=True)
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'barcode', 'sku', 'category', 'category_name',
            'unit', 'unit_code', 'brand', 'purchase_price', 'selling_price',
            'mrp', 'current_stock', 'min_stock_alert', 'reorder_qty',
            'hsn_code', 'gst_rate', 'track_expiry', 'track_batch',
            'image_url', 'rack_location', 'is_low_stock', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_is_low_stock(self, obj):
        return obj.current_stock <= obj.min_stock_alert


class GlobalProductMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalProductMaster
        fields = '__all__'
