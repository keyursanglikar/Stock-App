import uuid
from decimal import Decimal
from django.test import TestCase
from apps.accounts.models import User, Business, BusinessMember
from apps.products.models import Product, Category, Unit
from apps.inventory.services import StockMovementService, FEFOService
from apps.inventory.models import Batch


class StockAndFEFOTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(phone="9876543210")
        self.business = Business.objects.create(
            name="Sharma Kirana & General Store",
            business_type="kirana",
            state_code="27",
            allow_negative_stock=False
        )
        self.member = BusinessMember.objects.create(
            business=self.business,
            user=self.user,
            role="OWNER"
        )
        self.unit = Unit.objects.create(business=self.business, name="Pieces", code="PCS")
        self.product = Product.objects.create(
            business=self.business,
            name="Amul Gold Milk 500ml",
            barcode="8901262010053",
            unit=self.unit,
            purchase_price=Decimal("30.00"),
            selling_price=Decimal("34.00"),
            mrp=Decimal("34.00"),
            current_stock=Decimal("0.000"),
            min_stock_alert=Decimal("5.000"),
            track_expiry=True
        )

    def test_stock_in_and_moving_average_cost(self):
        # 1. First Stock In: 10 units @ 30.00
        movement, prod = StockMovementService.record_movement(
            business=self.business,
            product_id=self.product.id,
            movement_type='IN',
            quantity=10,
            unit_cost=Decimal("30.00")
        )
        self.assertEqual(prod.current_stock, Decimal("10.000"))
        self.assertEqual(prod.purchase_price, Decimal("30.00"))

        # 2. Second Stock In: 10 units @ 32.00 (New avg cost should be 31.00)
        movement2, prod = StockMovementService.record_movement(
            business=self.business,
            product_id=self.product.id,
            movement_type='IN',
            quantity=10,
            unit_cost=Decimal("32.00")
        )
        self.assertEqual(prod.current_stock, Decimal("20.000"))
        self.assertEqual(prod.purchase_price, Decimal("31.00"))

    def test_fefo_batch_auto_picking(self):
        # Create earlier batch expiring in 2 days
        b1 = Batch.objects.create(
            business=self.business,
            product=self.product,
            batch_no="B1",
            expiry_date="2026-11-01",
            cost_price=Decimal("30.00"),
            remaining_qty=Decimal("5.000")
        )
        # Create later batch expiring in 10 days
        b2 = Batch.objects.create(
            business=self.business,
            product=self.product,
            batch_no="B2",
            expiry_date="2026-11-10",
            cost_price=Decimal("30.00"),
            remaining_qty=Decimal("10.000")
        )

        # Customer buys 7 units. FEFO must pick all 5 from B1, and 2 from B2
        picks = FEFOService.pick_batches_for_sale(self.business, self.product.id, Decimal("7.000"))
        self.assertEqual(len(picks), 2)
        self.assertEqual(picks[0]['batch_no'], "B1")
        self.assertEqual(picks[0]['pick_qty'], Decimal("5.000"))
        self.assertEqual(picks[1]['batch_no'], "B2")
        self.assertEqual(picks[1]['pick_qty'], Decimal("2.000"))
