from rest_framework import serializers
from .models import User, Business, BusinessMember


class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'id', 'name', 'business_type', 'gstin', 'state_code',
            'phone', 'address', 'logo_url', 'is_active', 'allow_negative_stock'
        ]
        read_only_fields = ['id', 'is_active']


class BusinessSetupSerializer(serializers.Serializer):
    business_name = serializers.CharField(max_length=200)
    business_type = serializers.ChoiceField(choices=Business.BUSINESS_TYPES, default='kirana')
    gstin = serializers.CharField(max_length=15, required=False, allow_blank=True)
    state_code = serializers.CharField(max_length=2, default='27')
    address = serializers.CharField(required=False, allow_blank=True)
