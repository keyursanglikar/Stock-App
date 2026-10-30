# ==============================================================================
# StockWise — Production Deployment & User Distribution Guide
# ==============================================================================

To distribute StockWise to real users (shop owners, distributors, retailers), follow these two production steps:
1. **Deploy the Backend Server** to the cloud (AWS EC2 / Railway / Render / DigitalOcean) so users outside your local Wi-Fi can access the API.
2. **Build the Standalone APK / App Bundle** for users to install directly on their Android devices.

---

## 1. Cloud Backend Deployment (5 Minutes on Render / Railway / AWS)

Your backend has Docker and Gunicorn configured:

### Option A: 1-Click Deploy to Render / Railway
1. Push this repository to **GitHub**.
2. Create a new **Web Service** on [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Connect your GitHub repository.
4. Set Build Command:
   ```bash
   pip install -r backend/requirements.txt && python backend/manage.py migrate
   ```
5. Set Start Command:
   ```bash
   cd backend && gunicorn stockwise.wsgi:application --bind 0.0.0.0:$PORT
   ```
6. Add Environment Variables:
   - `DEBUG`: `False`
   - `SECRET_KEY`: `[generate a secure 50-char secret]`
   - `GEMINI_API_KEY`: `<YOUR_GEMINI_API_KEY>`
   - `GEMINI_MODEL`: `gemini-3.5-flash`

Once deployed, Render/Railway gives you a public HTTPS URL (e.g. `https://stockwise-api.onrender.com`).

---

## 2. Update Mobile Client with Public URL

In [`mobile/src/api/client.ts`](file:///f:/FREELANCE\SOFTGENIX-IT-SOLUTIONS\STOCK-APP\mobile\src\api\client.ts):
```typescript
// Replace local IP with your production domain:
export const API_BASE_URL = 'https://stockwise-api.onrender.com/api/v1';
```

---

## 3. Build Standalone Android APK for Users (No Expo Go Needed!)

Users do **not** need Expo Go installed. You can build a direct `.apk` file that anyone can download and install:

```powershell
cd mobile

# 1. Login to your free Expo account (create one at https://expo.dev if needed)
eas login

# 2. Configure project ID
eas build:configure

# 3. Generate direct installable APK for Android users
eas build --platform android --profile preview
```

When the build finishes, EAS prints a **download link for the `.apk` file**. 
You can send this APK directly to your users over WhatsApp or upload it to Google Drive/Play Store.
