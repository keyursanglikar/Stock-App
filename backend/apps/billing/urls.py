from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, CustomerViewSet, QuickBillView

router = DefaultRouter()
router.register(r'invoices', SaleViewSet, basename='invoice')
router.register(r'customers', CustomerViewSet, basename='customer')

urlpatterns = [
    path('pos/checkout/', QuickBillView.as_view(), name='pos_checkout'),
    path('', include(router.urls)),
]
