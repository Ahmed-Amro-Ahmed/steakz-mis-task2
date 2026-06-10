# Steakz MIS Lab Presentation Checklist

This checklist is designed to help you prepare for the Task 2 Lab Presentation.

## 0. Pre-Lab Run Checklist (Ahmed's Setup)
- [ ] **Start Backend**: Open terminal in `C:\Users\ahmed\Downloads\Steakz_Task2_Final\Steakz_Backend_ONLY\steakz-backend` and run `npm run dev`.
- [ ] **Start Frontend**: Open terminal in `C:\Users\ahmed\Downloads\Steakz_Task2_Final\Steakz_Frontend_ONLY\steakz-frontend` and run `npm run dev`.
- [ ] **Verify Backend**: Check that the server is listening on `http://localhost:3001`.
- [ ] **Verify Frontend**: Open `http://localhost:5173` and ensure the Landing Page loads correctly.
- [ ] **Test Login**: Log in with `admin@steakz.com` / `Admin@123` to confirm the database and API are working.
- [ ] **Postman Configuration**: Ensure your Postman environment `baseUrl` is set to `http://localhost:3001`.
- [ ] **Security Check**: Confirm your `.env` file is present locally but **NOT** staged for Git (Check `.gitignore`).
- [ ] **Console Check**: Verify there are no critical red errors in the Browser Console (harmless React Router warnings are okay).

## 1. Required Website Screenshots
*Ensure you have clear screenshots of the following pages:*
- [ ] **Landing Page**: Showing the public feedback section.
- [ ] **Login Page**: Before entering credentials.
- [ ] **Admin Dashboard**: Overview of all branches, users, and global KPIs.
- [ ] **HQ Manager Dashboard**: High-level reporting and system stats.
- [ ] **Branch Manager Dashboard**: Branch-specific stats (Staff count, Low stock, Revenue).
- [ ] **Staff Dashboards**: Unique views for Chef, Waiter, and Cashier.
- [ ] **Inventory Page**: List of items, highlighting low-stock items in red/yellow.
- [ ] **Sales/POS Page**: Interface for recording a new order.
- [ ] **Reports Page**: Sales breakdown chart or daily revenue breakdown.
- [ ] **Feedback Management**: Internal view of customer ratings.

## 2. Required Postman Screenshots
- [ ] **POST Login**: Success response with JWT token and user profile.
- [ ] **GET Protected Route (Success)**: `/api/auth/me` with a valid token.
- [ ] **GET Protected Route (Failure)**: `/api/auth/me` without a token (401 Unauthorized).
- [ ] **RBAC Failure (403)**: Waiter trying to access Admin Branch Management.
- [ ] **Sales Status Flow**: PATCH request showing status change from `PENDING` to `READY`.

## 3. Required Project Files Checklist
- [ ] `ENDPOINTS.md`: List of 20+ implemented endpoints.
- [ ] `POSTMAN_TEST_PLAN.md`: List of 38+ test scenarios.
- [ ] `POSTMAN_VARIABLES.md`: Guide for Postman environment variables.
- [ ] `ERD_DOCUMENTATION.md`: Database schema and Mermaid diagram.
- [ ] `package.json`: In both Frontend and Backend folders.
- [ ] `schema.prisma`: The database model source of truth.
- [ ] `.env.example`: Template for environment variables.

## 4. Demo Login Credentials
*Use these seeded accounts for the live demo:*

| Role | Email | Password | Scope |
|------|-------|----------|-------|
| **Admin** | `admin@steakz.com` | `Admin@123` | Global (Full Access) |
| **HQ Manager** | `hq@steakz.com` | `Hq@123` | Global (Reporting) |
| **Branch Manager (LDN)** | `manager@steakz.com` | `Manager@123` | London Central |
| **Branch Manager (MAN)** | `manchester.manager@steakz.com` | `Manager@123` | Manchester North |
| **Branch Manager (BHX)** | `birmingham.manager@steakz.com` | `Manager@123` | Birmingham Bullring |
| **Branch Manager (EDI)** | `edinburgh.manager@steakz.com` | `Manager@123` | Edinburgh Royal Mile |
| **Branch Manager (CWL)** | `cardiff.manager@steakz.com` | `Manager@123` | Cardiff Bay |
| **Branch Chef (MAN)** | `manchester.chef@steakz.com` | `Chef@123` | Manchester North |
| **Branch Cashier (MAN)**| `manchester.cashier@steakz.com`| `Cashier@123` | Manchester North |
| **Branch Waiter (MAN)** | `manchester.waiter@steakz.com` | `Waiter@123` | Manchester North |
| **Branch Chef (BHX)** | `birmingham.chef@steakz.com` | `Chef@123` | Birmingham Bullring |
| **Branch Cashier (BHX)**| `birmingham.cashier@steakz.com`| `Cashier@123` | Birmingham Bullring |
| **Branch Waiter (BHX)** | `birmingham.waiter@steakz.com` | `Waiter@123` | Birmingham Bullring |
| **Branch Chef (EDI)** | `edinburgh.chef@steakz.com` | `Chef@123` | Edinburgh Royal Mile |
| **Branch Cashier (EDI)**| `edinburgh.cashier@steakz.com`| `Cashier@123` | Edinburgh Royal Mile |
| **Branch Waiter (EDI)** | `edinburgh.waiter@steakz.com` | `Waiter@123` | Edinburgh Royal Mile |
| **Branch Chef (CWL)** | `cardiff.chef@steakz.com` | `Chef@123` | Cardiff Bay |
| **Branch Cashier (CWL)**| `cardiff.cashier@steakz.com`| `Cashier@123` | Cardiff Bay |
| **Branch Waiter (CWL)** | `cardiff.waiter@steakz.com` | `Waiter@123` | Cardiff Bay |
| **Chef** | `chef@steakz.com` | `Chef@123` | London Central |
| **Cashier** | `cashier@steakz.com` | `Cashier@123` | London Central |
| **Waiter** | `waiter@steakz.com` | `Waiter@123` | London Central |
| **Customer** | `customer@gmail.com` | `Customer@123` | Public Feedback |

## 5. Lab Presentation Talking Points
1. **The Problem**: Manual tracking of inventory across multiple steakhouse branches is inefficient and prone to error.
2. **The Solution**: A centralized Management Information System (MIS) with real-time inventory alerts, POS integration, and role-based dashboards.
3. **Key Feature - Inventory Tracking**: Automatic low-stock detection based on `reorderLevel`.
4. **Key Feature - Order Workflow**: Seamless transition of orders from Waiter (Create) -> Chef (Prepare/Ready) -> Waiter/Cashier (Complete).
5. **Key Feature - Multi-Branch HQ**: HQ Managers can compare performance across all branches without visiting them physically.

## 6. Professor Q&A Preparation
- **Q: Where is authentication handled?**
  - **A**: It's handled in `src/routes/authRoutes.ts` using JWT (JSON Web Tokens). The `verifyToken` middleware in `src/middleware/auth.ts` decodes the token on every protected request.
- **Q: How is RBAC (Authorization) implemented?**
  - **A**: We use a `requireRole` middleware that checks the `role` field stored in the JWT payload against the allowed roles for a specific route.
- **Q: How are Branch Managers restricted to their own branch?**
  - **A**: Every user (except Admin/HQ) has a `branchId`. In the backend routes, we filter all database queries (Sales, Inventory, Staff) using `where: { branchId: req.user.branchId }`.
- **Q: Why is the .env file important and why isn't it on GitHub?**
  - **A**: It contains the `DATABASE_URL` (database credentials) and `JWT_SECRET`. If leaked, anyone could access our database or forge user tokens. We use `.env.example` as a safe template for others.
- **Q: Describe the Chef's specific workflow.**
  - **A**: Chefs can view orders and update them to `READY`. However, they are restricted from marking an order as `COMPLETED` (that requires service staff) and from seeing global financial reports.

## 8. Deployment Status (Post-Submission)
- [ ] **Frontend (Vercel)**: [add after deployment]
- [ ] **Backend (Render)**: [add after deployment]
- [ ] **Database (Neon PostgreSQL)**: Configured via `DATABASE_URL` in Render environment.

## 7. Final Run Commands

### Backend Setup
```bash
cd Steakz_Backend_ONLY/steakz-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd Steakz_Frontend_ONLY/steakz-frontend
npm install
npm run dev
```
