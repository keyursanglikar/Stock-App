from django.utils.deprecation import MiddlewareMixin
from apps.accounts.models import Business, BusinessMember


class TenantResolutionMiddleware(MiddlewareMixin):
    """
    Resolves the active Business from:
    1. Header `X-Business-ID`
    2. Fallback to the user's primary/first Business membership
    Attaches `request.business` and `request.business_member` to the request.
    """
    def process_request(self, request):
        request.business = None
        request.business_member = None

        if hasattr(request, 'user') and request.user.is_authenticated:
            business_id = request.headers.get('X-Business-ID')
            
            if business_id:
                member = BusinessMember.objects.select_related('business').filter(
                    user=request.user,
                    business_id=business_id,
                    business__is_active=True
                ).first()
            else:
                member = BusinessMember.objects.select_related('business').filter(
                    user=request.user,
                    business__is_active=True
                ).first()

            if member:
                request.business = member.business
                request.business_member = member
