from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BatchViewSet, StockMovementViewSet, QuickStockInView, QuickStockOutView

router = DefaultRouter()
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'movements', StockMovementViewSet, basename='movement')

urlpatterns = [
    path('stock-in/', QuickStockInView.as_view(), name='quick_stock_in'),
    path('stock-out/', QuickStockOutView.as_view(), name='quick_stock_out'),
    path('', include(router.urls)),
]
