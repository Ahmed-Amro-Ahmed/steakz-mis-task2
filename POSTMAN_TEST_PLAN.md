# Postman Test Plan - Steakz MIS

This test plan covers the actual implemented endpoints in the Steakz MIS project.

| # | Method | Endpoint | Token/Role | Request Body | Status | Result | Why this test matters |
|---|--------|----------|------------|--------------|--------|--------|-----------------------|
| 1 | POST | `/api/auth/login` | None | `{ "email": "admin@steakz.com", "password": "Admin@123" }` | 200 | Success | Verifies Admin login and token generation. |
| 2 | POST | `/api/auth/login` | None | `{ "email": "hq@steakz.com", "password": "Hq@123" }` | 200 | Success | Verifies HQ Manager login. |
| 3 | POST | `/api/auth/login` | None | `{ "email": "manager@steakz.com", "password": "Manager@123" }` | 200 | Success | Verifies Branch Manager login. |
| 4 | POST | `/api/auth/login` | None | `{ "email": "chef@steakz.com", "password": "Chef@123" }` | 200 | Success | Verifies Chef login. |
| 5 | POST | `/api/auth/login` | None | `{ "email": "waiter@steakz.com", "password": "Waiter@123" }` | 200 | Success | Verifies Waiter login. |
| 6 | POST | `/api/auth/login` | None | `{ "email": "cashier@steakz.com", "password": "Cashier@123" }` | 200 | Success | Verifies Cashier login. |
| 7 | POST | `/api/auth/login` | None | `{ "email": "customer@gmail.com", "password": "Customer@123" }` | 200 | Success | Verifies Customer login. |
| 8 | GET | `/api/auth/me` | `adminToken` | None | 200 | Profile | Verifies token-based session works for Admin. |
| 9 | GET | `/api/auth/me` | None | None | 401 | Unauthorized | Verifies protected routes require a token. |
| 10 | POST | `/api/admin/branches` | `adminToken` | `{ "branchName": "London", "location": "UK", ... }` | 201 | Created | Verifies Admin can create branches and managers. |
| 11 | POST | `/api/admin/branches` | `managerToken` | `{ "branchName": "Illegal" }` | 403 | Forbidden | Verifies Role-Based Access Control (RBAC). |
| 12 | GET | `/api/admin/branches` | `hqToken` | None | 200 | List | Verifies HQ Manager can see all branches. |
| 13 | GET | `/api/admin/users` | `adminToken` | None | 200 | List | Verifies user management visibility for Admins. |
| 14 | PATCH | `/api/admin/users/1/terminate` | `adminToken` | None | 200 | Success | Verifies Admin can deactivate users. |
| 15 | GET | `/api/admin/overview` | `hqToken` | None | 200 | Stats | Verifies system-wide KPIs are accessible to HQ. |
| 16 | GET | `/api/manager/dashboard` | `managerToken` | None | 200 | Stats | Verifies Branch Manager dashboard logic. |
| 17 | POST | `/api/manager/staff` | `managerToken` | `{ "name": "New Chef", "role": "CHEF", ... }` | 201 | Created | Verifies Branch Manager can hire staff. |
| 18 | GET | `/api/manager/staff` | `managerToken` | None | 200 | List | Verifies branch-specific staff listing. |
| 19 | GET | `/api/manager/suppliers` | `managerToken` | None | 200 | List | Verifies supplier management accessibility. |
| 20 | POST | `/api/manager/suppliers` | `managerToken` | `{ "name": "Veggie Co" }` | 201 | Created | Verifies adding new suppliers. |
| 21 | GET | `/api/inventory` | `chefToken` | None | 200 | List | Verifies Chefs can view inventory. |
| 22 | POST | `/api/inventory` | `managerToken` | `{ "name": "Ribeye", "quantity": 50, ... }` | 201 | Created | Verifies adding items to branch inventory. |
| 23 | PATCH | `/api/inventory/1/quantity` | `chefToken` | `{ "quantity": 45 }` | 200 | Updated | Verifies Chefs can update stock levels manually. |
| 24 | PATCH | `/api/inventory/1/quantity` | `waiterToken` | `{ "quantity": 0 }` | 403 | Forbidden | Verifies Waiters cannot change inventory levels. |
| 25 | POST | `/api/sales` | `waiterToken` | `{ "items": [{ "menuItem": "Steak", ... }] }` | 201 | Created | Verifies Waiters can record new sales. |
| 26 | POST | `/api/sales` | `cashierToken` | `{ "items": [{ "menuItem": "Beer", ... }] }` | 201 | Created | Verifies Cashiers can record new sales. |
| 27 | GET | `/api/sales/mine` | `chefToken` | None | 200 | List | Verifies Chefs can see branch orders to prepare. |
| 28 | PATCH | `/api/sales/1/status` | `chefToken` | `{ "status": "READY" }` | 200 | Updated | Verifies Chef can mark order as READY. |
| 29 | PATCH | `/api/sales/1/status` | `waiterToken` | `{ "status": "COMPLETED" }` | 200 | Updated | Verifies Waiter can complete a READY order. |
| 30 | PATCH | `/api/sales/1/status` | `chefToken` | `{ "status": "COMPLETED" }` | 403 | Forbidden | Verifies business logic (Chefs can't complete orders). |
| 31 | GET | `/api/reports/summary` | `hqToken` | None | 200 | Summary | Verifies HQ can see global financial summary. |
| 32 | GET | `/api/reports/summary` | `managerToken` | None | 200 | Summary | Verifies Manager can see branch-only summary. |
| 33 | GET | `/api/reports/sales` | `hqToken` | `?start=2026-01-01` | 200 | Report | Verifies date-filtered sales reports. |
| 34 | POST | `/api/feedback` | None | `{ "rating": 5, "comment": "Great!", ... }` | 201 | Created | Verifies public customer feedback submission. |
| 35 | GET | `/api/feedback/public` | None | None | 200 | Top 10 | Verifies public landing page feedback retrieval. |
| 36 | GET | `/api/feedback` | `managerToken` | None | 200 | List | Verifies Managers can see feedback for their branch. |
| 37 | GET | `/api/feedback` | `chefToken` | None | 403 | Forbidden | Verifies Chefs cannot view feedback management. |
| 38 | GET | `/api/admin/branches` | `waiterToken` | None | 403 | Forbidden | Verifies staff cannot access admin-only routes. |
