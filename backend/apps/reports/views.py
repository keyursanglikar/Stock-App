import datetime
from decimal import Decimal
from django.db.models import Sum, F
from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from apps.billing.models import Sale, SaleItem
from apps.products.models import Product
from apps.alerts.models import Alert


class DashboardReportView(APIView):
    """
    Ultra-fast summary widgets for today's sales, profit, low stock count, and active alerts.
    """
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get(self, request):
        business = request.business
        today = datetime.date.today()

        today_sales = Sale.objects.filter(
            business=business,
            created_at__date=today
        ).aggregate(
            total_rev=Sum('total_amount'),
            total_tax=Sum('tax_amount')
        )

        today_items = SaleItem.objects.filter(
            business=business,
            sale__created_at__date=today
        )

        # Revenue minus Cost of Goods Sold (COGS)
        revenue = today_sales['total_rev'] or Decimal("0.00")
        cogs = sum((item.quantity * item.cost_price for item in today_items), Decimal("0.00"))
        gross_profit = revenue - cogs

        low_stock_count = Product.objects.filter(
            business=business,
            is_deleted=False,
            current_stock__lte=F('min_stock_alert')
        ).count()

        alerts_count = Alert.objects.filter(
            business=business,
            is_dismissed=False
        ).count()

        # Total stock valuation at purchase price & MRP
        stock_val = Product.objects.filter(business=business, is_deleted=False).aggregate(
            cost_val=Sum(F('current_stock') * F('purchase_price')),
            mrp_val=Sum(F('current_stock') * F('mrp'))
        )

        return Response({
            "today_revenue": str(revenue),
            "today_profit": str(gross_profit),
            "low_stock_count": low_stock_count,
            "alerts_count": alerts_count,
            "stock_valuation_cost": str(stock_val['cost_val'] or "0.00"),
            "stock_valuation_mrp": str(stock_val['mrp_val'] or "0.00"),
        })
