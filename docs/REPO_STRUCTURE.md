# StockWise Monorepo Structure (Free & Open Community Edition)

```text
STOCK-APP/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml             # Pytest, ruff lint, docker build
│       └── mobile-ci.yml              # Jest, TypeScript check
├── backend/                           # Django 5 + Python 3.12 Backend
│   ├── manage.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── stockwise/                     # Root Django project settings
│   │   ├── __init__.py                # Celery app import
│   │   ├── celery.py                  # Celery app instance & beat schedule
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                # Database, DRF, JWT, AWS S3/local storage
│   │   │   ├── local.py               # Development settings
│   │   │   └── production.py          # Prod settings (Security headers, Sentry)
│   │   ├── urls.py                    # Root URL router (/api/v1/)
│   │   └── wsgi.py
│   ├── common/                        # Shared base utilities & middleware
│   │   ├── models.py                  # UUIDModel, TimeStampedModel, TenantAwareModel
│   │   ├── middleware.py              # TenantResolutionMiddleware
│   │   ├── permissions.py             # TenantPermission, RolePermission
│   │   ├── pagination.py              # Standard & cursor pagination
│   │   └── exceptions.py              # Standardized API exception handler
│   ├── apps/
│   │   ├── accounts/                  # Phone OTP Auth, Users, Business, Membership
│   │   │   ├── models.py              # User, Business, BusinessMember
│   │   │   ├── serializers.py         # OTPRequestSerializer, BusinessSetupSerializer
│   │   │   ├── views.py               # AuthViewset, BusinessViewset
│   │   │   └── urls.py
│   │   ├── products/                  # Master catalog & Global Product Master
│   │   │   ├── models.py              # Product, Category, Unit, Brand, GlobalProductMaster
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── inventory/                 # Stock movements, Batches, FEFO, Adjustments
│   │   │   ├── models.py              # Batch, StockMovement, StockAdjustment
│   │   │   ├── services.py            # FEFOService, StockMovementService (Atomic)
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── billing/                   # Sales, POS, GST Engine, Customer Udhaar
│   │   │   ├── models.py              # Customer, Sale, SaleItem, SalePayment
│   │   │   ├── services.py            # GSTCalculationService
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── suppliers/                 # Suppliers, Purchases, Purchase Items
│   │   │   ├── models.py              # Supplier, Purchase, PurchaseItem, PurchasePayment
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── alerts/                    # Expiry, Low-stock, Dead-stock, Push Notifications
│   │   │   ├── models.py              # Alert, NotificationToken
│   │   │   ├── tasks.py               # Celery Beat scan tasks (hourly/daily)
│   │   │   ├── services.py            # PushNotificationService
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── ai_ingest/                 # Vision LLM pipeline, S3 presigned URLs, Feedback
│   │   │   ├── models.py              # AIJob
│   │   │   ├── tasks.py               # Celery LLM extraction tasks
│   │   │   ├── services.py            # VisionLLMClient (Claude/OpenAI), BarcodeLookup
│   │   │   ├── views.py               # ExtractView, JobStatusView, FeedbackView
│   │   │   └── urls.py
│   │   ├── sync/                      # Offline delta pull/push
│   │   │   ├── models.py              # SyncLog
│   │   │   ├── views.py               # SyncPullView, SyncPushView
│   │   │   └── urls.py
│   │   └── reports/                   # P&L, Sales, Purchases, Valuation, GST Summary
│   │       ├── services.py            # ProfitLossCalculator, GSTReportGenerator
│   │       ├── views.py
│   │       └── urls.py
├── mobile/                            # React Native + Expo SDK (TypeScript)
│   ├── App.tsx                        # Root app entry point
│   ├── app.json                       # Expo configuration
│   ├── tsconfig.json
│   ├── package.json
│   ├── src/
│   │   ├── api/                       # Axios client & TanStack Query hooks
│   │   │   ├── client.ts              # Bearer auth, refresh token queue, base URL
│   │   │   └── hooks/                 # useProducts, useStock, useBills, useAlerts
│   │   ├── components/                # Reusable UI component library (Design System)
│   │   │   ├── Button.tsx             # 48px+ touch targets, Orange primary
│   │   │   ├── Input.tsx              # Clean inputs with floating labels
│   │   │   ├── Card.tsx               # Rounded (14px), subtle shadow
│   │   │   ├── Chip.tsx               # Quick filter chips
│   │   │   ├── Badge.tsx              # Status & low-stock tags
│   │   │   ├── BottomSheet.tsx        # Gesture-based bottom sheet
│   │   │   ├── StatCard.tsx           # Dashboard metric card
│   │   │   └── EmptyState.tsx         # Modern illustration empty states
│   │   ├── theme/                     # Brand tokens
│   │   │   ├── colors.ts              # Primary #FF7A00, Dark Orange, Status colors
│   │   │   ├── typography.ts          # Poppins SemiBold, Inter Regular/Medium
│   │   │   └── spacing.ts             # 4, 8, 12, 16, 24, 32
│   │   ├── database/                  # Local SQLite sync engine
│   │   │   ├── schema.ts              # SQLite table definitions
│   │   │   ├── syncQueue.ts           # Outbound offline actions queue
│   │   │   └── syncManager.ts         # Periodic and network-triggered delta sync
│   │   ├── navigation/                # React Navigation
│   │   │   ├── RootNavigator.tsx      # Auth flow vs App flow
│   │   │   ├── TabNavigator.tsx       # Home, Stock, +Scan (Floating), Bills, More
│   │   │   └── types.ts
│   │   ├── screens/                   # User-facing screens
│   │   │   ├── auth/                  # PhoneLoginScreen, OTPVerifyScreen, BusinessSetupScreen
│   │   │   ├── dashboard/             # DashboardScreen (metrics, quick actions)
│   │   │   ├── stock/                 # ProductListScreen, ProductDetailScreen, StockInScreen, StockOutScreen
│   │   │   ├── scan/                  # ScanScreen (Camera/Barcode), AIReviewScreen (Orange highlights)
│   │   │   ├── billing/               # QuickPOSScreen, InvoicePreviewScreen, CustomerLedgerScreen
│   │   │   ├── suppliers/             # SupplierListScreen, SupplierDetailScreen, WhatsAppReorderScreen
│   │   │   ├── alerts/                # AlertsInboxScreen (Expiry & Low stock)
│   │   │   ├── reports/               # ReportsHubScreen (P&L, GST, Sales, Stock Valuation)
│   │   │   └── settings/              # SettingsScreen, BusinessProfile, Language (En, Hi, Mr)
│   │   ├── state/                     # Zustand stores
│   │   │   ├── authStore.ts           # Token, User, Business profile
│   │   │   ├── cartStore.ts           # Active POS billing cart
│   │   │   └── syncStore.ts           # Online/offline state, pending queue count
│   │   └── i18n/                      # Internationalization
│   │       ├── index.ts               # i18next configuration
│   │       └── locales/               # en.json, hi.json (Hindi), mr.json (Marathi)
├── infra/                             # Deployment & Infrastructure
│   ├── docker/
│   │   ├── docker-compose.yml         # MySQL 8, Redis 7, Django, Celery Worker, Celery Beat
│   │   ├── Dockerfile.backend
│   │   └── nginx.conf                 # Reverse proxy, SSL, gzip, static files
│   └── scripts/
│       ├── init-dev.sh
│       └── backup-db.sh               # MySQL dump + S3/local backup script
├── docs/                              # Project documentation
│   ├── ARCHITECTURE.md
│   └── REPO_STRUCTURE.md
├── .env.example                       # Documented environment variables template
├── Makefile                           # Developer convenience commands (up, migrate, test, lint)
└── README.md                          # Quickstart local setup in under 10 minutes
```
