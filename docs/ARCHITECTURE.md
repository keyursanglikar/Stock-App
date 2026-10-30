# StockWise — System Architecture Document (100% Free / Community Edition)
**Product:** Smart Inventory & Stock Alert System (India, Mobile-First, AI-Powered)  
**License:** Free & Open for all Indian Small & Medium Businesses  
**Version:** 2.0.0 (No Paywall / No Subscriptions)

---

## 1. High-Level Architecture Overview

StockWise is an **unrestricted, 100% free, offline-first mobile SaaS** tailored specifically for Indian retail and wholesale businesses (Kirana, Medical Stores, Hardware shops, Cafes, and Distributors). All features—unlimited products, sales, GST billing, multi-user access, low-stock/expiry alerts, and AI photo extractions—are permanently enabled without trials, paywalls, or payment gateways.

```mermaid
flowchart TB
    subgraph MobileApp["Mobile Client (React Native + Expo SDK 51+)"]
        UI["UI Layer (Light Orange Theme, FlashList, Tamagui)"]
        State["State (Zustand + TanStack Query)"]
        LocalDB[("Local SQLite / WatermelonDB / Sync Queue")]
        CameraScan["Camera / Barcode Scanner / Image Manipulator"]
        i18n["i18n (English, Hindi, Marathi)"]
    end

    subgraph Edge["Ingress & Edge Services"]
        CDN["Cloudflare / CloudFront"]
        LB["Nginx / ALB (SSL Termination & Rate Limiter)"]
        S3Bucket[("AWS S3 / Cloudflare R2 / Local Media Storage")]
    end

    subgraph Backend["Django 5 / DRF Backend (Python 3.12)"]
        API["REST API (/api/v1/)"]
        AuthMid["Tenant Isolation & RBAC Middleware"]
        CoreEngine["Stock Ledger & FEFO/FIFO Engine"]
        BillingEngine["GST Tax Engine (CGST/SGST/IGST)"]
        AlertEngine["Alerts & Expiry Engine"]
    end

    subgraph AsyncWorker["Async Processing & Data Layer"]
        Redis[("Redis 7 (Cache, OTP Store, Celery Broker, Locks)")]
        CeleryWorkers["Celery Workers (AI Pipeline, Reports, Sync)"]
        CeleryBeat["Celery Beat (Expiry Scans, Low-Stock Digits)"]
        MySQL[("MySQL 8 Primary DB (InnoDB, utf8mb4)")]
    end

    subgraph External["External Integrations"]
        VisionAI["Vision LLM (Claude API / OpenAI)"]
        PushService["Expo Push (FCM / APNs)"]
        WhatsAppAPI["WhatsApp Web / DeepLink (Zero cost)"]
    end

    MobileApp <-->|HTTPS / REST API| LB
    MobileApp -->|Direct Upload| S3Bucket
    MobileApp -.->|1-Tap WhatsApp Share| WhatsAppAPI
    
    LB --> API
    API --> AuthMid
    AuthMid --> CoreEngine
    AuthMid --> BillingEngine
    AuthMid --> AlertEngine
    
    API <--> Redis
    API <--> MySQL
    
    API -.->|Enqueue Tasks| Redis
    Redis <--> CeleryWorkers
    CeleryBeat --> Redis
    
    CeleryWorkers <--> MySQL
    CeleryWorkers --> S3Bucket
    CeleryWorkers <--> VisionAI
    CeleryWorkers --> PushService
```

---

## 2. Core Module Breakdown (Free Edition)

| Module | Location | Purpose & Key Responsibilities |
| :--- | :--- | :--- |
| **`accounts`** | `backend/apps/accounts` | Multi-tenant auth, phone OTP verification via Redis, JWT lifecycle (SimpleJWT), business registration, membership & RBAC (Owner, Manager, Staff). Every business is permanently active. |
| **`products`** | `backend/apps/products` | Master catalog, categories, units, variants, barcode lookups, GST/HSN mappings, and shared **Global Product Master**. |
| **`inventory`** | `backend/apps/inventory` | Append-only `StockMovement` ledger, transactional stock balance calculation, `Batch` tracking (mfg, expiry, cost), **FEFO auto-picking**, adjustments, stock-in/out. |
| **`billing`** | `backend/apps/billing` | GST POS sale generation, tax engine (inter-state IGST vs intra-state CGST/SGST), custom invoice numbering, customer udhaar (credit) ledger, PDF generation (`expo-print`/ReportLab). |
| **`suppliers`** | `backend/apps/suppliers` | Supplier profiles, purchase bills, payment ledger (cash/credit/partial), item price tracking, 1-tap "Reorder via WhatsApp" (prefilled template). |
| **`alerts`** | `backend/apps/alerts` | Periodic low-stock evaluator, expiry tiers (90/60/30/15/7 days), dead stock detector, in-app notification inbox, and Expo Push notification dispatcher. |
| **`ai_ingest`** | `backend/apps/ai_ingest` | Image preprocessing, vision LLM extraction (`product_photo`, `bill_photo`, `barcode`), confidence score calculation (< 0.8 flag), feedback loop storage into Global Product Master. |
| **`sync`** | `backend/apps/sync` | Offline-first delta synchronization (`/sync/pull`, `/sync/push`), conflict resolution (server timestamp + append-only ledger), idempotency key validation. |
| **`reports`** | `backend/apps/reports` | Unlimited P&L calculation, COGS calculation, GSTR-1/GSTR-3B summaries, stock valuation (Cost vs MRP), ABC inventory analysis, Excel/PDF exports. |

---

## 3. Database Entity Relationship (ER) Diagram

```mermaid
erDiagram
    BUSINESS ||--o{ BUSINESS_MEMBER : has
    USER ||--o{ BUSINESS_MEMBER : belongs_to
    BUSINESS ||--o{ PRODUCT : owns
    BUSINESS ||--o{ CATEGORY : defines
    BUSINESS ||--o{ UNIT : defines
    BUSINESS ||--o{ SUPPLIER : manages
    BUSINESS ||--o{ CUSTOMER : manages
    
    PRODUCT ||--o{ BATCH : tracks
    PRODUCT ||--o{ STOCK_MOVEMENT : logs
    BATCH ||--o{ STOCK_MOVEMENT : moves
    
    SUPPLIER ||--o{ PURCHASE : supplies
    PURCHASE ||--o{ PURCHASE_ITEM : contains
    PURCHASE_ITEM ||--o{ BATCH : creates
    
    CUSTOMER ||--o{ SALE : purchases
    SALE ||--o{ SALE_ITEM : contains
    SALE_ITEM ||--o{ STOCK_MOVEMENT : generates
    
    BUSINESS ||--o{ ALERT : triggers
    BUSINESS ||--o{ AI_JOB : requests

    BUSINESS {
        uuid id PK
        string name
        string business_type "kirana|hardware|medical|cafe|restaurant|distributor"
        string gstin
        string state_code "GST Place of Supply"
        string phone
        string address
        string currency "INR"
        boolean is_active "Always True"
    }

    PRODUCT {
        uuid id PK
        uuid business_id FK
        string name
        string barcode
        string sku
        decimal purchase_price "12,2"
        decimal selling_price "12,2"
        decimal mrp "12,2"
        decimal current_stock "12,3"
        decimal min_stock_alert "12,3"
        string hsn_code
        decimal gst_rate "0, 5, 12, 18, 28"
        boolean track_expiry
        boolean track_batch
    }

    BATCH {
        uuid id PK
        uuid product_id FK
        string batch_no
        date mfg_date
        date expiry_date
        decimal cost_price "12,2"
        decimal initial_qty "12,3"
        decimal remaining_qty "12,3"
    }

    STOCK_MOVEMENT {
        uuid id PK
        uuid business_id FK
        uuid product_id FK
        uuid batch_id FK
        string movement_type "IN|OUT|ADJUST|TRANSFER|WASTE|RETURN"
        decimal quantity "12,3"
        decimal unit_cost "12,2"
        string reference_type "SALE|PURCHASE|ADJUSTMENT"
        uuid reference_id
        string reason
        datetime created_at
    }

    AI_JOB {
        uuid id PK
        uuid business_id FK
        string mode "product_photo|bill_photo|barcode"
        string image_key
        string status "PENDING|PROCESSING|COMPLETED|FAILED"
        json raw_output
        json parsed_output
        decimal confidence_avg "3,2"
        json user_corrected_output
    }
```

---

## 4. AI Ingestion & Shared Global Product Master

Because the app is free, optimizing AI operating cost is critical:
1. **Deduplication:** Hash of image (`SHA-256`) and Barcode lookup check the **Global Product Master** first.
2. If another shop in India has scanned this barcode (e.g. Parle-G 800g, Dolo 650mg, Asian Paints 1L), extraction returns instantly from the database at **0 API cost**.
3. Fresh extractions run via Claude / Vision LLM, parse strictly to Pydantic schemas, and feed back into the global master upon user confirmation.

---

## 5. Offline-First Sync & Conflict Resolution

- **Stock Movements:** Append-only ledger; sales recorded while offline sync automatically when back online.
- **Transactional Atomic Lock:** Backend executes `select_for_update()` on product stock movements so multi-device kirana counters never corrupt inventory totals.
- **Zero Lockout:** No subscription validation checks; offline records are always accepted.
