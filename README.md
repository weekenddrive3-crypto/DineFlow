# 🍽️ Restaurant POS System

A production-grade restaurant management and Point of Sale system built with Electron, React, NestJS, and PostgreSQL.

---

## 📁 Project Structure

```
petpooja-pos/
├── apps/
│   ├── backend/              # NestJS API server
│   │   └── src/
│   │       ├── database/     # Prisma service
│   │       ├── events/       # WebSocket gateway
│   │       └── modules/      # Feature modules
│   │           ├── auth/     # Login, JWT, roles
│   │           ├── menu/     # Categories & items
│   │           ├── orders/   # Order CRUD & lifecycle
│   │           ├── tables/   # Table & area management
│   │           ├── kots/     # Kitchen order tickets
│   │           ├── payments/ # Payment processing
│   │           ├── reports/  # Sales, category, order reports
│   │           ├── customers/# CRM
│   │           ├── inventory/# Stock management
│   │           └── settings/ # Outlet configuration
│   │
│   ├── frontend/             # React + Vite UI
│   │   └── src/
│   │       ├── layouts/      # MainLayout with sidebar
│   │       ├── pages/        # Billing, Tables, Orders, Reports...
│   │       ├── store/        # Zustand state management
│   │       └── utils/        # API client, socket client
│   │
│   └── desktop/              # Electron shell
│       └── src/
│           ├── main.js       # Electron main process
│           └── preload.js    # IPC bridge (printer, hardware)
│
├── packages/
│   ├── shared/               # Types, constants, utilities
│   ├── database/             # Prisma schema & migrations
│   └── printer/              # ESC/POS thermal printing
│
├── docker-compose.yml        # PostgreSQL + Redis + pgAdmin
├── pnpm-workspace.yaml       # Monorepo config
└── package.json              # Root scripts
```

---

## 🛠️ Prerequisites

Install these on your machine before starting:

### 1. Node.js (v20 or higher)
```bash
# Download from https://nodejs.org/ (LTS version)
# Verify:
node --version    # Should show v20.x.x or higher
```

### 2. pnpm (Package Manager)
```bash
npm install -g pnpm
pnpm --version    # Should show 9.x.x
```

### 3. Docker Desktop
```bash
# Download from https://www.docker.com/products/docker-desktop/
# This runs PostgreSQL and Redis without installing them directly
# Verify:
docker --version
docker-compose --version
```

### 4. Git
```bash
# Download from https://git-scm.com/
git --version
```

### 5. VS Code (Recommended Editor)
Download from https://code.visualstudio.com/

**Recommended VS Code extensions:**
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- TypeScript Importer
- Thunder Client (API testing)

---

## 🚀 Setup Instructions (Step by Step)

### Step 1: Clone or copy the project
```bash
# If using git:
git init petpooja-pos
cd petpooja-pos

# Or if you downloaded the files, navigate to the folder:
cd petpooja-pos
```

### Step 2: Install all dependencies
```bash
pnpm install
```
This installs dependencies for ALL packages (frontend, backend, desktop, shared, database, printer) in one command.

### Step 3: Start the database
```bash
docker-compose up -d
```
This starts:
- **PostgreSQL** on port `5432` (your main database)
- **Redis** on port `6379` (caching)
- **pgAdmin** on port `5050` (database GUI - optional)

**Verify it's running:**
```bash
docker ps
# Should show pos-postgres, pos-redis, pos-pgadmin
```

### Step 4: Configure environment variables
```bash
# Copy the example env file
cp apps/backend/.env.example apps/backend/.env

# The defaults work with Docker, but edit if needed:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/petpooja_pos?schema=public"
```

### Step 5: Setup the database schema
```bash
# Generate Prisma client
cd packages/database
pnpm generate

# Run database migrations (creates all tables)
pnpm migrate

# Seed sample data (outlet, users, menu items, tables)
pnpm seed
```

After seeding, you'll have:
- **Outlet:** LAVISH TOWN (matching your screenshots)
- **Admin login:** admin@lavishtown.com / admin123
- **Biller login:** biller@lavishtown.com / biller123
- **Menu:** All coffee items, sandwiches, pasta, pizza (from your screenshots)
- **Tables:** 6 Nightindoor + 5 Outdoor tables
- **Tax:** GST 5% (SGST 2.5% + CGST 2.5%)

### Step 6: Start the backend
```bash
cd apps/backend
pnpm dev
```
The API will be running at **http://localhost:3001**
API docs at **http://localhost:3001/api/docs** (Swagger)

### Step 7: Start the frontend
```bash
# Open a new terminal
cd apps/frontend
pnpm dev
```
The UI will be running at **http://localhost:5173**

### Step 8: Open in browser
Go to **http://localhost:5173** and login with:
- Email: `biller@lavishtown.com`
- Password: `biller123`

### Step 9 (Optional): Run as Desktop app
```bash
# Only after frontend + backend are running
cd apps/desktop
pnpm dev
```

---

## 📋 Development Commands

### From the root directory:
```bash
# Start everything (frontend + backend in parallel)
pnpm dev

# Start individually
pnpm dev:frontend     # React UI on port 5173
pnpm dev:backend      # NestJS API on port 3001
pnpm dev:desktop      # Electron desktop app

# Database
pnpm db:migrate       # Run new migrations
pnpm db:generate      # Regenerate Prisma client
pnpm db:seed          # Seed sample data
pnpm db:studio        # Open Prisma Studio (database GUI)

# Quality
pnpm lint             # Lint all packages
pnpm test             # Run all tests
pnpm build            # Build everything for production
```

---

## 🗄️ Database Access

### Option A: Prisma Studio (Easiest)
```bash
pnpm db:studio
# Opens at http://localhost:5555
```

### Option B: pgAdmin
Open http://localhost:5050
- Email: `admin@pos.com`
- Password: `admin`
- Add server: host=`postgres`, port=`5432`, user=`postgres`, password=`postgres`

---

## 🏗️ Build Order (What to implement next)

The project has the structure and core pages ready. Here's the order to build out each module:

### Phase 1: Complete the Billing Flow ⭐ START HERE
1. **Menu Service** → CRUD for categories and items, connect to BillingPage
2. **Orders Service** → Create order, add items, calculate tax
3. **KOT Service** → Generate KOTs, send to kitchen
4. **Payment Service** → Process Cash/Card/UPI, settle order

### Phase 2: Table Management
5. **Tables Service** → CRUD tables/areas, status updates
6. **Real-time updates** → Socket.IO for table status changes
7. Connect TableViewPage to live data

### Phase 3: Order Tracking
8. **Order View page** → Live order cards with filters (Dine In/Delivery/etc.)
9. **KOT View** → Kitchen display with accept/ready/deliver flow

### Phase 4: Reports
10. **Order Summary Report** → Status breakdown + payment types
11. **Sales Report** → Detailed per-order with all columns
12. **Category Report** → Sales by category with percentages

### Phase 5: Operations & Settings
13. **Operations dashboard** → Grid of all management features
14. **Settings panels** → Display, calculations, print config
15. **Customer CRM** → Customer database with order history
16. **Inventory** → Stock tracking with low-stock alerts

### Phase 6: Production Polish
17. **Printing** → Thermal receipt and KOT printing
18. **Offline mode** → Local data persistence
19. **Electron packaging** → Build Windows .exe installer
20. **Auto-updates** → Push updates to installed POS

---

## 🔑 Key Architecture Decisions

**Why pnpm workspaces?**
Shared code (types, utils, constants) is written once in `packages/shared` and used by both frontend and backend. No duplication.

**Why NestJS over Express?**
At 30+ API endpoints across 10 modules, plain Express becomes unmanageable. NestJS gives you modules, dependency injection, guards, and validation out of the box.

**Why Zustand over Redux?**
Zustand is simpler with less boilerplate. For a POS app, you need fast state updates (cart, table status) without Redux's ceremony.

**Why PostgreSQL over SQLite for primary?**
Your reports (Sales Report, Category Report) need complex JOINs and aggregations. PostgreSQL handles these efficiently. SQLite can be added later for offline fallback.

**Why Socket.IO?**
When table 3 gets an order, the table view on another screen must update instantly. Socket.IO handles this real-time sync between POS terminals, kitchen displays, and captain apps.

---

## 🆘 Troubleshooting

**`pnpm install` fails?**
→ Make sure you have Node.js v20+ and pnpm v9+

**Database connection refused?**
→ Make sure Docker is running: `docker-compose up -d`

**Port 5432 already in use?**
→ Another PostgreSQL is running. Stop it or change the port in docker-compose.yml

**Prisma generate fails?**
→ Run from the database package: `cd packages/database && pnpm generate`

**Frontend can't reach API?**
→ The Vite proxy forwards `/api` to port 3001. Make sure backend is running.

**"Cannot find module @petpooja/shared"?**
→ Run `pnpm install` from the root directory to link workspace packages.
