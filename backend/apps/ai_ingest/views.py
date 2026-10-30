from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from common.permissions import IsAuthenticatedAndTenantMember
from .models import AIJob
from .tasks import process_vision_ai_job
from apps.products.models import GlobalProductMaster


class ExtractImageView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    def post(self, request):
        mode = request.data.get('mode', 'product_photo')
        image_url = request.data.get('image_url', '')
        image_hash = request.data.get('image_hash', '')

        # Check Global Master first for zero-cost caching
        if image_hash:
            cached_job = AIJob.objects.filter(image_hash=image_hash, status='COMPLETED').first()
            if cached_job and cached_job.parsed_output:
                return Response({
                    "job_id": str(cached_job.id),
                    "status": "COMPLETED",
                    "source": "cache",
                    "data": cached_job.parsed_output,
                    "confidence_scores": cached_job.confidence_scores
                }, status=status.HTTP_200_OK)

        job = AIJob.objects.create(
            business=request.business,
            mode=mode,
            image_url=image_url,
            image_hash=image_hash,
            status='PENDING'
        )

        # Trigger Celery async task
        process_vision_ai_job.delay(str(job.id))

        return Response({
            "job_id": str(job.id),
            "status": "PENDING",
            "message": "AI extraction queued."
        }, status=status.HTTP_202_ACCEPTED)


class JobStatusView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    def get(self, request, job_id):
        job = AIJob.objects.filter(id=job_id, business=request.business).first()
        if not job:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "job_id": str(job.id),
            "status": job.status,
            "data": job.parsed_output,
            "confidence_scores": job.confidence_scores,
            "error": job.error_message
        })


class FeedbackView(APIView):
    permission_classes = [IsAuthenticatedAndTenantMember]

    def post(self, request):
        """
        Feedback loop: Receives user-confirmed fields and updates the shared Global Product Master.
        Next time any Indian store scans this barcode, AI cost is 0!
        """
        job_id = request.data.get('job_id')
        corrected_data = request.data.get('corrected_data', {})

        job = AIJob.objects.filter(id=job_id, business=request.business).first()
        if job:
            job.user_corrected_output = corrected_data
            job.save(update_fields=['user_corrected_output'])

        barcode = corrected_data.get('barcode')
        if barcode:
            GlobalProductMaster.objects.update_or_create(
                barcode=barcode,
                defaults={
                    'name': corrected_data.get('name', ''),
                    'brand': corrected_data.get('brand', ''),
                    'category': corrected_data.get('category', ''),
                    'typical_mrp': corrected_data.get('mrp'),
                    'hsn_code': corrected_data.get('hsn_code'),
                    'gst_rate': corrected_data.get('gst_rate', 0.00),
                    'unit_code': corrected_data.get('unit', 'PCS'),
                    'verified': True
                }
            )

        return Response({"success": True, "message": "Feedback recorded into Global Master"})
