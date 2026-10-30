from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI Schema & Interactive Swagger UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # StockWise v1 REST API Endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/inventory/', include('apps.inventory.urls')),
    path('api/v1/billing/', include('apps.billing.urls')),
    path('api/v1/suppliers/', include('apps.suppliers.urls')),
    path('api/v1/alerts/', include('apps.alerts.urls')),
    path('api/v1/ai/', include('apps.ai_ingest.urls')),
    path('api/v1/sync/', include('apps.sync.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
]
