# StockWise — Smart AI Inventory & Stock Alert System (100% Free Edition)
**Mobile-First, AI-Powered, Offline-First Stock & GST Billing for Indian Small Businesses.**

Designed specifically for **Kirana Stores, Medical Stores & Pharmacies, Hardware Outlets, Cafes, and Distributors**.

---

## 🚀 Key Highlights

1. **100% Free Forever:** No subscriptions, no trials, no paywalls, and no payment gateways.
2. **AI Photo Extraction (under 10s):** Photograph a product packaging or supplier bill, and Claude Vision LLM extracts all item details, MRP, batch, and expiry.
3. **Smart Orange Highlights:** Fields extracted with $< 0.8$ confidence are highlighted in vibrant orange so the shop owner only reviews what needs attention.
4. **Shared Global Product Master:** Feedback loop updates a shared barcode catalog across India. If another shop scanned it, extraction is instant at **0 API cost**.
5. **FEFO Auto-Picking:** First-Expiry-First-Out automatically selects the closest-to-expire batch for medicines and perishable foods during sales.
6. **GST Ready:** POS billing with intra-state (CGST + SGST) vs inter-state (IGST) calculation and customer Udhaar ledger.

---

## ⚡ Quickstart Setup (under 10 minutes)

### 1. Prerequisites
- Python 3.12+ (tested on Python 3.13)
- Node.js 18+ & npm
- Docker & Docker Compose (optional for MySQL/Redis containerization)

---

### 2. Backend Setup

```bash
# Clone and enter workspace
cd backend

# Create & activate virtualenv
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (uses SQLite by default for zero-friction setup, or MySQL if configured in .env)
python manage.py migrate

# Run the test suite to verify atomic stock locks and FEFO logic
python manage.py test apps.inventory.tests apps.accounts.tests

# Start development API server
python manage.py runserver 0.0.0.0:8000
```
API runs at `http://127.0.0.1:8000/`.  
Interactive OpenAPI 3.0 documentation: `http://127.0.0.1:8000/api/docs/`.

---

### 3. Mobile App Setup

```bash
cd mobile

# Install mobile dependencies
npm install

# Start Expo development server
npx expo start
```
- Press `a` to open on Android Emulator.
- Scan QR code with the **Expo Go** app on your physical Android/iOS phone.

---

## 📱 Mobile UI Architecture

- **Theme:** Clean White (`#FFFFFF`) with Brand Orange (`#FF7A00`) CTAs and Highlights.
- **Bottom Tabs:**
  - 🏠 **Home:** Real-time today's sales, profit, low stock count, and stock valuation.
  - 📦 **Stock:** Virtualized item list with low-stock / out-of-stock chips and barcode search.
  - **+ Scan (Center Floating Orange Button):** 1-tap rapid camera scan for products & bills.
  - ⚡ **Bills:** Lightning POS billing with Cash, UPI, and Udhaar / Khata ledger.
  - 🔔 **Alerts:** Expiry warnings (7-day, 30-day, expired) and low-stock alerts.
  - ⚙️ **Settings:** Store profile, multi-language (English / Hindi / Marathi), and CSV export.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/otp/send/` | Send phone OTP (Mock `123456` in dev mode) |
| `POST` | `/api/v1/auth/otp/verify/` | Verify OTP and return JWT access/refresh tokens |
| `POST` | `/api/v1/auth/business/setup/` | Create free shop profile with preloaded categories & units |
| `GET/POST`| `/api/v1/products/items/` | Product catalog with low-stock filters |
| `GET` | `/api/v1/products/items/lookup-barcode/?barcode=...` | Fast local + Global Product Master lookup |
| `POST` | `/api/v1/inventory/stock-in/` | Transactional stock-in with moving weighted-average cost |
| `POST` | `/api/v1/inventory/stock-out/` | FEFO batch auto-picking stock deduction |
| `POST` | `/api/v1/billing/pos/checkout/` | Fast POS sale, GST calculation, customer udhaar update |
| `POST` | `/api/v1/ai/extract/` | Async Vision LLM extraction for product/bill photo |
| `GET` | `/api/v1/ai/jobs/{id}/` | Poll AI extraction status and confidence scores |
| `POST` | `/api/v1/ai/feedback/` | Store user corrections into crowdsourced Global Product Master |
| `GET` | `/api/v1/reports/dashboard/` | Today's revenue, profit (Rev - COGS), valuation |
