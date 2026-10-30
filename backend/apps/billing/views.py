import datetime
from decimal import Decimal
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from .models import Customer, Sale, SaleItem
from .serializers import CustomerSerializer, SaleSerializer, QuickBillCreateSerializer
from .services import GSTCalculationService
from apps.products.models import Product
from apps.inventory.services import StockMovementService, FEFOService


class QuickBillView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    @transaction.atomic
    def post(self, request):
        serializer = QuickBillCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        business = request.business

        # Customer handling
        customer = None
        if data.get('customer_phone'):
            customer, _ = Customer.objects.get_or_create(
                business=business,
                phone=data['customer_phone'].strip(),
                defaults={
                    'name': data.get('customer_name') or 'Walk-in Customer',
                    'gstin': data.get('customer_gstin', '')
                }
            )

        # Generate unique financial year sequential invoice number
        now = datetime.datetime.now()
        prefix = f"INV/{now.year}-{str(now.year + 1)[-2:]}"
        count = Sale.objects.filter(business=business, invoice_number__startswith=prefix).count() + 1
        invoice_number = f"{prefix}/{str(count).zfill(4)}"

        subtotal = Decimal("0.00")
        total_cgst = Decimal("0.00")
        total_sgst = Decimal("0.00")
        total_igst = Decimal("0.00")

        # Create Sale header
        sale = Sale.objects.create(
            business=business,
            invoice_number=invoice_number,
            customer=customer,
            payment_mode=data['payment_mode'],
            notes=data.get('notes', ''),
            created_by=request.user
        )

        for item_data in data['items']:
            product = Product.objects.get(id=item_data['product_id'], business=business)
            qty = Decimal(str(item_data['quantity']))
            unit_price = Decimal(str(item_data['unit_price']))
            discount = Decimal(str(item_data.get('discount', 0.00)))

            line_taxable = (qty * unit_price) - discount
            subtotal += line_taxable

            # Calculate GST
            taxes = GSTCalculationService.calculate_taxes(
                business_state_code=business.state_code,
                customer_state_code=data.get('customer_gstin', '')[:2] if data.get('customer_gstin') else business.state_code,
                taxable_amount=line_taxable,
                gst_rate=product.gst_rate
            )

            total_cgst += taxes['cgst']
            total_sgst += taxes['sgst']
            total_igst += taxes['igst']
            line_total = line_taxable + taxes['total_tax']

            SaleItem.objects.create(
                business=business,
                sale=sale,
                product=product,
                quantity=qty,
                unit_price=unit_price,
                cost_price=product.purchase_price,
                discount=discount,
                gst_rate=product.gst_rate,
                tax_amount=taxes['total_tax'],
                total_amount=line_total
            )

            # Auto-deduct stock with FEFO
            picks = FEFOService.pick_batches_for_sale(business, product.id, qty)
            for pick in picks:
                StockMovementService.record_movement(
                    business=business,
                    product_id=product.id,
                    movement_type='OUT',
                    quantity=pick['pick_qty'],
                    batch_id=pick['batch_id'],
                    reference_type='SALE',
                    reference_id=sale.id,
                    user=request.user
                )

        total_tax = total_cgst + total_sgst + total_igst
        grand_total = subtotal + total_tax
        paid_amount = Decimal(str(data.get('paid_amount', grand_total)))

        sale.subtotal = subtotal
        sale.tax_amount = total_tax
        sale.cgst_amount = total_cgst
        sale.sgst_amount = total_sgst
        sale.igst_amount = total_igst
        sale.total_amount = grand_total
        sale.paid_amount = paid_amount
        sale.save()

        # Update customer udhaar if unpaid
        if customer and (grand_total - paid_amount) > Decimal("0.00"):
            customer.outstanding_balance += (grand_total - paid_amount)
            customer.save(update_fields=['outstanding_balance'])

        return Response(SaleSerializer(sale).data, status=status.HTTP_201_CREATED)


class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Sale.objects.filter(business=self.request.business).order_by('-created_at')


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Customer.objects.filter(business=self.request.business, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(business=self.request.business)
