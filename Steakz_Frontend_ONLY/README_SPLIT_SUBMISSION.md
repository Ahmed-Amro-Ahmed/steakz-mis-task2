# Steakz MIS Web Portal — Task 2

This project is built in the same style as the Week 8 JobPlatform tutorial: a separated Express REST API backend and React SPA frontend with JWT authentication, Prisma, PostgreSQL, and role-based access control.

## Roles

- **ADMIN**: creates branches and accounts, activates/deactivates users, monitors all branches.
- **MANAGER**: manages inventory, suppliers, sales reporting, and stock movement for their branch.
- **STAFF**: records daily sales/orders and stock usage for their branch.

## Folder structure

```text
steakz-mis/
├── backend/    Express 5 + TypeScript + Prisma + PostgreSQL + JWT
└── frontend/   React + Vite + TypeScript + Axios + ProtectedRoute
```

## Backend setup

```bash
cd backend
npm install
copy .env.example .env       # Windows
# or: cp .env.example .env   # macOS/Linux
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE steakz_mis;
```

Run Prisma:

```bash
npx prisma migrate dev --name init
npm run dev
```

Backend runs on: `http://localhost:3001`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Default demo login

The admin is created automatically from `.env` on first run.

- Email: `admin@steakz.com`
- Password: `admin123`

Use Admin to create a branch + first manager. Managers can create staff accounts.
