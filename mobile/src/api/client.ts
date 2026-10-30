import axios from 'axios';
import { useAuthStore } from '../state/authStore';

// In Expo on a real device, 10.0.2.2 only works on Android emulators.
// We use your local LAN IP (10.214.72.7) so both real phones and emulators can reach the Django backend!
export const API_BASE_URL = 'http://10.214.72.7:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const { token, business } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (business?.id) {
    config.headers['X-Business-ID'] = business.id;
  }
  return config;
});
