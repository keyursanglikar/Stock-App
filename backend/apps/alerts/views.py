from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from .models import Alert
from rest_framework import serializers


class AlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    batch_no = serializers.CharField(source='batch.batch_no', read_only=True)

    class Meta:
        model = Alert
        fields = [
            'id', 'alert_type', 'product', 'product_name',
            'batch', 'batch_no', 'message', 'is_dismissed', 'created_at'
        ]


class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get_queryset(self):
        return Alert.objects.filter(
            business=self.request.business,
            is_dismissed=False
        ).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='dismiss')
    def dismiss(self, request, pk=None):
        alert = self.get_object()
        alert.is_dismissed = True
        alert.save(update_fields=['is_dismissed'])
        return Response({"success": True})
