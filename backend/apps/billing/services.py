from decimal import Decimal


class GSTCalculationService:
    @staticmethod
    def calculate_taxes(business_state_code, customer_state_code, taxable_amount, gst_rate):
        """
        Determines whether to charge intra-state (CGST + SGST) or inter-state (IGST).
        All amounts in Decimal.
        """
        taxable = Decimal(str(taxable_amount))
        rate = Decimal(str(gst_rate))
        
        total_tax = (taxable * (rate / Decimal("100.0"))).quantize(Decimal("0.01"))

        # Default to business state if customer state not provided
        cust_state = (customer_state_code or business_state_code).strip()
        biz_state = (business_state_code or "27").strip()

        if cust_state == biz_state:
            half_tax = (total_tax / Decimal("2.0")).quantize(Decimal("0.01"))
            return {
                'cgst': half_tax,
                'sgst': half_tax,
                'igst': Decimal("0.00"),
                'total_tax': total_tax
            }
        else:
            return {
                'cgst': Decimal("0.00"),
                'sgst': Decimal("0.00"),
                'igst': total_tax,
                'total_tax': total_tax
            }
