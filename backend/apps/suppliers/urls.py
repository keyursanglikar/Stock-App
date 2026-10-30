from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, PurchaseViewSet

router = DefaultRouter()
router.register(r'contacts', SupplierViewSet, basename='supplier')
router.register(r'bills', PurchaseViewSet, basename='purchase')

urlpatterns = [
    path('', include(router.urls)),
]
