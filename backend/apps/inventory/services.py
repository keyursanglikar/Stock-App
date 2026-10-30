from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from apps.inventory.models import StockMovement, Batch
from apps.products.models import Product


class StockMovementService:
    @staticmethod
    @transaction.atomic
    def record_movement(business, product_id, movement_type, quantity, unit_cost=Decimal("0.00"),
                        batch_id=None, reference_type="", reference_id=None, reason="", user=None):
        """
        Appends an immutable movement record and transactionally updates cached current_stock.
        Uses select_for_update() to guarantee race condition safety across multi-device POS counters.
        """
        product = Product.objects.select_for_update().get(id=product_id, business=business)
        qty = Decimal(str(quantity))

        if movement_type in ['OUT', 'WASTE', 'RETURN']:
            if not business.allow_negative_stock and (product.current_stock - qty) < Decimal("0.000"):
                raise ValidationError(f"Insufficient stock for {product.name}. Current: {product.current_stock}, Requested: {qty}")
            new_stock = product.current_stock - qty
        elif movement_type == 'IN':
            new_stock = product.current_stock + qty
            # Update moving weighted-average cost
            total_value = (product.current_stock * product.purchase_price) + (qty * Decimal(str(unit_cost)))
            if new_stock > Decimal("0.000"):
                product.purchase_price = (total_value / new_stock).quantize(Decimal("0.01"))
        elif movement_type == 'ADJUST':
            new_stock = qty  # Explicit target stock level
            qty_delta = new_stock - product.current_stock
            qty = qty_delta

        product.current_stock = new_stock
        product.save(update_fields=['current_stock', 'purchase_price', 'updated_at'])

        # Handle batch remaining quantity update if applicable
        batch = None
        if batch_id:
            batch = Batch.objects.select_for_update().get(id=batch_id, business=business)
            if movement_type in ['OUT', 'WASTE', 'RETURN']:
                batch.remaining_qty = max(Decimal("0.000"), batch.remaining_qty - qty)
            elif movement_type == 'IN':
                batch.remaining_qty += qty
            batch.save(update_fields=['remaining_qty', 'updated_at'])

        movement = StockMovement.objects.create(
            business=business,
            product=product,
            batch=batch,
            movement_type=movement_type,
            quantity=qty,
            unit_cost=unit_cost,
            reference_type=reference_type,
            reference_id=reference_id,
            reason=reason,
            user=user
        )
        return movement, product


class FEFOService:
    @staticmethod
    def pick_batches_for_sale(business, product_id, required_qty):
        """
        First-Expiry-First-Out (FEFO) batch picker for medicines and perishable food items.
        Returns a list of dicts: [{'batch': batch_obj, 'pick_qty': Decimal}]
        """
        remaining_needed = Decimal(str(required_qty))
        batches = Batch.objects.filter(
            business=business,
            product_id=product_id,
            remaining_qty__gt=0
        ).order_by('expiry_date')

        picks = []
        for batch in batches:
            if remaining_needed <= Decimal("0.000"):
                break
            available = batch.remaining_qty
            to_take = min(available, remaining_needed)
            picks.append({
                'batch_id': str(batch.id),
                'batch_no': batch.batch_no,
                'expiry_date': str(batch.expiry_date),
                'pick_qty': to_take
            })
            remaining_needed -= to_take

        if remaining_needed > Decimal("0.000"):
            # If not enough batch quantity tracked, remainder goes unassigned
            picks.append({
                'batch_id': None,
                'batch_no': 'UNBATCHED',
                'expiry_date': None,
                'pick_qty': remaining_needed
            })

        return picks
