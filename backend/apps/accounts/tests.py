from rest_framework.test import APITestCase
from rest_framework import status
from apps.accounts.models import User, Business, BusinessMember


class AccountsAndTenancyTests(APITestCase):
    def test_send_and_verify_otp(self):
        # 1. Send OTP
        res = self.client.post('/api/v1/auth/otp/send/', {'phone': '9876543210'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])

        # 2. Verify OTP
        verify_res = self.client.post('/api/v1/auth/otp/verify/', {'phone': '9876543210', 'otp': '123456'})
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', verify_res.data)
        self.assertFalse(verify_res.data['has_business'])

        # 3. Setup Business (Free for life)
        token = verify_res.data['access_token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        biz_res = self.client.post('/api/v1/auth/business/setup/', {
            'business_name': 'Gupta Medical Hall',
            'business_type': 'medical',
            'state_code': '27'
        })
        self.assertEqual(biz_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(biz_res.data['business']['name'], 'Gupta Medical Hall')
        self.assertTrue(biz_res.data['business']['is_active'])
