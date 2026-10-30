from rest_framework import permissions


class IsAuthenticatedAndTenantMember(permissions.BasePermission):
    """
    Ensures user is authenticated and attached to a valid active business.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Check active business attached via middleware or membership
        business = getattr(request, 'business', None)
        return bool(business and business.is_active)


class IsOwnerOrManager(permissions.BasePermission):
    """Allows access only to users with OWNER or MANAGER role in the current business."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        member = getattr(request, 'business_member', None)
        return bool(member and member.role in ['OWNER', 'MANAGER'])


class IsOwnerOnly(permissions.BasePermission):
    """Restricted strictly to the OWNER (e.g. deleting store or inviting members)."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        member = getattr(request, 'business_member', None)
        return bool(member and member.role == 'OWNER')
