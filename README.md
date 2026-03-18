# Stock Transfer Management (MERN + TypeScript)

Production-oriented full-stack app to manage warehouse stock transfers with validation, status control, and secure API practices.

## 1) What this project does

- Create warehouses and manage stock levels.
- Create transfer requests between warehouses.
- Allow transfer lifecycle from `pending` to `approved`.
- Update source/destination stock automatically on approval.
- Show transfer history and current status in UI.

## 2) Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript + Mongoose
- Database: MongoDB

## 3) Project Structure

```txt
Stock Transfer Management/
├── frontend/
│   ├── src/
│   │   ├── api/                 # API client
│   │   ├── components/          # Forms, tables, UI pieces
│   │   ├── types/               # Shared frontend types
│   │   ├── App.tsx              # Container/state + orchestration
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Security, validation, error handling
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # HTTP routing
│   │   ├── validation/          # Zod request schemas
│   │   ├── app.ts               # Express app wiring
│   │   └── server.ts            # DB connect + server bootstrap
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
└── package.json                 # Root scripts for both apps
```

## 4) Code and Logic Explanation

### Backend flow

1. `server.ts` starts app and connects MongoDB.
2. `app.ts` configures middleware stack:
   - security headers (`helmet`)
   - CORS allowlist
   - JSON body limit
   - API rate limiter
   - request sanitization
   - routes
   - centralized error handling
3. Route files map endpoints to controllers and apply `zod` validation middleware.
4. Controllers execute business logic and database operations.

### Core transfer business logic

- Transfer can move only `pending -> approved`.
- On approval:
  - deduct stock from source warehouse (only if sufficient stock)
  - add stock to destination warehouse
  - update transfer status to `approved`
- If status save fails after stock movement, rollback logic restores stock balance.

### Data models

- `Warehouse`: `name`, `location`, `stockLevel`.
- `TransferRequest`: `sourceWarehouse`, `destinationWarehouse`, `quantity`, `status`, `note`.

### Validation and security

- `zod` schemas validate body/params for POST/PATCH APIs.
- Request sanitizer removes dangerous `$` and dotted keys in body.
- Rate limiter protects API from excessive requests.
- CORS allowlist permits only configured frontend origins.

### Frontend flow

- `App.tsx` acts as container (state + handlers + data loading).
- Feature components handle rendering:
  - create warehouse form
  - create transfer form
  - warehouse stock table
  - transfer history table
- API calls are centralized in `src/api/client.ts`.
- Loading spinners appear for:
  - initial data fetch
  - form submits
  - row-level status/stock updates

## 5) API Endpoints

### Warehouses

- `GET /api/warehouses` → list warehouses
- `POST /api/warehouses` → create warehouse
- `PATCH /api/warehouses/:id/stock` → update stock level

### Transfers

- `GET /api/transfers` → list transfers
- `POST /api/transfers` → create transfer request
- `PATCH /api/transfers/:id/status` → update transfer status

### Health

- `GET /api/health` → service health check

## 6) Local Setup

### Install

From root:

```bash
npm run install:all
```

### Configure env

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

#### frontend/.env

- `VITE_API_BASE_URL=http://localhost:5000/api`

#### backend/.env

- `PORT=5000`
- `MONGODB_URI=your_mongodb_uri`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `JSON_BODY_LIMIT=100kb`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX_REQUESTS=200`

### Run dev

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## 7) Build and Production Run

### Build both

```bash
npm run build:all
```

### Backend production run

```bash
npm --prefix backend run start:prod
```

### Frontend production run

```bash
npm --prefix frontend run start:prod
```

## 8) Docker

### Backend

```bash
docker build -t stock-transfer-backend ./backend
docker run --rm -p 8080:5000 --env-file ./backend/.env stock-transfer-backend
```

### Frontend

```bash
docker build -t stock-transfer-frontend ./frontend
docker run --rm -p 8080:8080 stock-transfer-frontend
```

## 9) Sample Test Flow

1. Create warehouse A with stock `100`.
2. Create warehouse B with stock `30`.
3. Create transfer `A -> B` quantity `20`.
4. Approve transfer.
5. Verify stock:
   - A becomes `80`
   - B becomes `50`
6. Verify transfer shows status `approved` in history.

## 10) Useful Scripts

### Root

```bash
npm run install:all
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run build:backend
npm run build:all
npm run lint
npm run typecheck
```

### Frontend

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run start:prod
```

### Backend

```bash
npm --prefix backend run dev
npm --prefix backend run build
npm --prefix backend run start:prod
npm --prefix backend run typecheck
```
