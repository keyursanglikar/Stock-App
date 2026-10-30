from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Business, BusinessMember
from .serializers import SendOTPSerializer, VerifyOTPSerializer, BusinessSetupSerializer, BusinessSerializer
from apps.products.models import Category, Unit


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone'].strip()
        
        # In production: Send via SMS provider (MSG91/Twilio) and save in Redis with 5 min TTL
        # In Development/Testing: Default OTP is 123456
        return Response({
            "success": True,
            "message": f"OTP successfully sent to {phone}. (Use '123456' for instant login)",
            "dev_otp": "123456"
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone'].strip()
        otp = serializer.validated_data['otp'].strip()

        # In dev mode, verify with 123456 (or check Redis in prod)
        if otp != "123456":
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(phone=phone)
        refresh = RefreshToken.for_user(user)

        # Check existing business membership
        membership = BusinessMember.objects.select_related('business').filter(user=user).first()
        business_data = BusinessSerializer(membership.business).data if membership else None

        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": str(user.id),
                "phone": user.phone,
                "full_name": user.full_name
            },
            "business": business_data,
            "has_business": bool(business_data)
        }, status=status.HTTP_200_OK)


class BusinessSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BusinessSetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        business = Business.objects.create(
            name=data['business_name'],
            business_type=data['business_type'],
            gstin=data.get('gstin', ''),
            state_code=data.get('state_code', '27'),
            address=data.get('address', ''),
            is_active=True
        )

        BusinessMember.objects.create(
            business=business,
            user=request.user,
            role='OWNER',
            can_view_profit=True,
            can_edit_price=True
        )

        # Preload industry-specific categories and units
        self._preload_defaults(business, data['business_type'])

        return Response({
            "success": True,
            "business": BusinessSerializer(business).data
        }, status=status.HTTP_201_CREATED)

    def _preload_defaults(self, business, biz_type):
        units_to_create = [
            ('Pieces', 'PCS'),
            ('Kilograms', 'KG'),
            ('Grams', 'GM'),
            ('Litres', 'LTR'),
            ('Packets', 'PKT'),
        ]
        if biz_type == 'medical':
            units_to_create.extend([('Strips', 'STRIP'), ('Bottles', 'BTL'), ('Boxes', 'BOX')])
        elif biz_type == 'hardware':
            units_to_create.extend([('Meters', 'MTR'), ('Bundles', 'BDL'), ('Sets', 'SET')])

        for name, code in units_to_create:
            Unit.objects.get_or_create(business=business, code=code, defaults={'name': name})

        categories_by_type = {
            'kirana': ['Grains & Pulses', 'Cooking Oils & Ghee', 'Snacks & Biscuits', 'Beverages', 'Personal Care', 'Spices & Masala'],
            'medical': ['Tablets & Capsules', 'Syrups & Suspensions', 'Injections', 'Medical Devices', 'Ointments & Creams'],
            'hardware': ['Pipes & Fittings', 'Paints & Primers', 'Fasteners & Screws', 'Electricals & Wiring', 'Hand Tools'],
            'cafe': ['Hot Beverages', 'Cold Beverages', 'Bakery & Desserts', 'Fast Food', 'Raw Ingredients'],
            'restaurant': ['Starters', 'Main Course', 'Breads & Rice', 'Beverages', 'Kitchen Supplies'],
            'distributor': ['Fast Moving Bulk', 'FMCG Wholesale', 'Commodities'],
        }

        cats = categories_by_type.get(biz_type, ['General Products', 'Essentials'])
        for cat_name in cats:
            Category.objects.get_or_create(business=business, name=cat_name)
