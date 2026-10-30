from django.urls import path
from .views import SendOTPView, VerifyOTPView, BusinessSetupView

urlpatterns = [
    path('otp/send/', SendOTPView.as_view(), name='otp_send'),
    path('otp/verify/', VerifyOTPView.as_view(), name='otp_verify'),
    path('business/setup/', BusinessSetupView.as_view(), name='business_setup'),
]
