# Assignment C: Stock Transfer Management (MERN + TypeScript)

A full-stack stock transfer management application to manage warehouses, create transfer requests, track transfer status, and automatically update stock levels when transfers are approved.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose

## Features Implemented

1. Create warehouses and maintain stock levels
2. Create stock transfer requests between warehouses
3. Manage transfer status lifecycle (`pending -> approved`)
4. Automatically update warehouse stock on transfer approval
5. Display transfer list/history with current status

## Project Structure

```txt
Stock Transfer Management/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config.ts
│   │   ├── db.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## Setup Instructions

### 1) Install dependencies

From project root:

```bash
npm run install:all
```

### 2) Configure environment

Create environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

- Frontend `frontend/.env`
  - `VITE_API_BASE_URL=http://localhost:5000/api`
- Backend `backend/.env`
  - `PORT=5000`
  - `MONGODB_URI=mongodb://127.0.0.1:27017/stock_transfer_management`
  - `FRONTEND_ORIGIN=http://localhost:5173`

### 3) Run backend (Terminal 1)

```bash
npm run dev:backend
```

### 4) Run frontend (Terminal 2)

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`



## API Endpoints

### Warehouses

- `GET /api/warehouses` - list warehouses
- `POST /api/warehouses` - create warehouse
- `PATCH /api/warehouses/:id/stock` - update warehouse stock

### Transfers

- `GET /api/transfers` - list transfer history
- `POST /api/transfers` - create transfer request
- `PATCH /api/transfers/:id/status` - update transfer status

## Sample Usage / Test Flow

1. Create warehouse `A` with stock `100`.
2. Create warehouse `B` with stock `30`.
3. Create transfer request from `A` to `B` quantity `20`.
4. Update transfer status from `pending` to `approved`.
5. Verify stock updates immediately after approval:
   - Warehouse `A`: `100 -> 80`
   - Warehouse `B`: `30 -> 50`
6. Verify transfer appears in transfer history with `approved` status.

## Quality and Validation

- TypeScript used in both frontend and backend.
- Input validations for warehouse and transfer creation.
- Controlled transfer status transitions (`pending -> approved`).
- Prevent transfer approval when source stock is insufficient.
- CORS, centralized error handler, and health endpoint included.

## Deliverables

- Live Application URL: Will add later
- GitHub Repository Link: https://github.com/jaiswalaman2020/Stock-Transfer-Management-ZETWERK-ASSIGNMENT
## Useful Scripts

Root:

```bash
npm run install:all
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
npm run typecheck
```

Frontend:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run lint
```

Backend:

```bash
npm --prefix backend run dev
npm --prefix backend run start
npm --prefix backend run typecheck
```
