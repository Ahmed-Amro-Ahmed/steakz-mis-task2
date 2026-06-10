# Steakz MIS — Restaurant Management Information System

Steakz MIS is a comprehensive, multi-branch Management Information System designed to streamline restaurant operations, inventory management, and financial reporting across a franchise of steakhouses.

## 🚀 Project Overview

This project was built for **MIS Task 2**, focusing on **Role-Based Access Control (RBAC)**, **Multi-Branch Isolation**, and **Real-Time Inventory Awareness**.

### Key Folders
- **Backend**: `Steakz_Backend_ONLY/steakz-backend`
- **Frontend**: `Steakz_Frontend_ONLY/steakz-frontend`

### Tech Stack
- **Language**: TypeScript
- **Frontend**: React (with Vite)
- **Backend**: Node.js & Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful

---

## 🛠️ Main Features

- **Public Landing Page**: Explore branches, browse the menu, and view latest customer feedback.
- **Customer Portal**: Sign-in dashboard to view order history and submit new feedback.
- **Admin Dashboard**: System-wide control of branches, user accounts, and a granular **Role Access Matrix**.
- **HQ Manager Dashboard**: High-level business intelligence with statistics aggregated across all 5 branches.
- **Branch Manager Dashboard**: Localized management for a specific branch (Staff, Inventory, and Sales Reports).
- **Chef Dashboard**: Optimized kitchen workflow for order preparation with integrated stock awareness.
- **Service Staff (Cashier/Waiter)**: POS terminal for recording sales and completing "Ready" orders.
- **Security**: Robust RBAC ensures users can only see data belonging to their assigned branch.

---

## 📊 Documentation Index

For detailed technical guidance, please refer to the following files:

1. **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)**: The master directory for all project assets.
2. **[ENDPOINTS.md](./ENDPOINTS.md)**: Full list of 26+ implemented REST API routes.
3. **[POSTMAN_TEST_PLAN.md](./POSTMAN_TEST_PLAN.md)**: 38+ test scenarios covering all system roles.
4. **[POSTMAN_VARIABLES.md](./POSTMAN_VARIABLES.md)**: Guide for setting up Postman environments.
5. **[ERD_DOCUMENTATION.md](./ERD_DOCUMENTATION.md)**: Database schema and Mermaid relationship diagram.
6. **[FINAL_PRESENTATION_CHECKLIST.md](./FINAL_PRESENTATION_CHECKLIST.md)**: Setup, Demo Credentials, and Q&A preparation.

---

## 🏗️ Quick Start Setup

### 1. Backend (Port 3001)
```bash
cd Steakz_Backend_ONLY/steakz-backend
npm install
npx prisma generate
npm run dev
```

### 2. Frontend (Port 5173)
```bash
cd Steakz_Frontend_ONLY/steakz-frontend
npm install
npm run dev
```

### 3. Database Reset & Seeding
If you need to reset the system to its initial demo state (5 branches, full staff, global inventory, and demo sales):
```bash
cd Steakz_Backend_ONLY/steakz-backend
npx prisma migrate reset --force
```

---

## 🔐 Demo Credentials
A complete list of login credentials for all roles (Admin, HQ, Branch Managers, Chefs, Waiters) is securely listed in **[FINAL_PRESENTATION_CHECKLIST.md](./FINAL_PRESENTATION_CHECKLIST.md)**.

---

## ⚠️ Important Security Note
**`.env` files must NEVER be pushed to GitHub.**
Ensure your local environment variables (`DATABASE_URL`, `JWT_SECRET`) are kept private. A `.env.example` template is provided in the backend folder.

---

## 🔗 Deployment & Links
- **Frontend (Vercel)**: [add after deployment]
- **Backend (Render)**: [add after deployment]
- **Database (Neon PostgreSQL)**: Configured via `DATABASE_URL`
- **Local App**: [http://localhost:5173](http://localhost:5173)
- **Local API**: [http://localhost:3001](http://localhost:3001)
- **GitHub Link**: [add before submission]
