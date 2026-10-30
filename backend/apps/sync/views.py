from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import IsAuthenticatedAndTenantMember
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from apps.sync.models import SyncLog


class SyncPullView(APIView):
    """
    Returns data modified since a given timestamp for client local database replication.
    """
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get(self, request):
        since = request.query_params.get('since')
        qs = Product.objects.filter(business=request.business)
        if since:
            qs = qs.filter(updated_at__gt=since)

        return Response({
            "server_time": datetime.datetime.now().isoformat(),
            "products": ProductSerializer(qs, many=True).data
        })


class SyncPushView(APIView):
    """
    Receives an array of mutations created offline and safely commits them idempotently.
    """
    permission_classes = [IsAuthenticatedAndTenantMember]

    def post(self, request):
        mutations = request.data.get('mutations', [])
        applied = []

        for m in mutations:
            client_id = m.get('client_mutation_id')
            # Check idempotency
            if SyncLog.objects.filter(client_mutation_id=client_id).exists():
                applied.append(client_id)
                continue

            SyncLog.objects.create(
                business=request.business,
                client_mutation_id=client_id,
                table_name=m.get('table', 'product'),
                action=m.get('action', 'CREATE'),
                payload=m.get('payload', {}),
                client_timestamp=m.get('timestamp')
            )
            applied.append(client_id)

        return Response({"success": True, "applied_ids": applied})
