# Steakz MIS API Endpoints

This document lists the actual implemented endpoints for the Steakz Management Information System (MIS).

| Method | Endpoint | Protected | Allowed Role(s) | Purpose |
|--------|----------|-----------|-----------------|---------|
| **Authentication** | | | | |
| POST | `/api/auth/login` | No | Public | Authenticate user and get JWT token |
| GET | `/api/auth/me` | Yes | ALL | Get current logged-in user profile |
| **Admin & HQ Management** | | | | |
| POST | `/api/admin/branches` | Yes | ADMIN | Create a new branch and its manager |
| GET | `/api/admin/branches` | Yes | ADMIN, HEADQUARTER_MANAGER | List all branches and stats |
| GET | `/api/admin/users` | Yes | ADMIN, HEADQUARTER_MANAGER | List all system users |
| PATCH | `/api/admin/users/:id/terminate` | Yes | ADMIN, HEADQUARTER_MANAGER | Deactivate a user account |
| PATCH | `/api/admin/users/:id/activate` | Yes | ADMIN, HEADQUARTER_MANAGER | Reactivate a user account |
| GET | `/api/admin/overview` | Yes | ADMIN, HEADQUARTER_MANAGER | Get system-wide KPI overview |
| **Branch Management** | | | | |
| GET | `/api/manager/dashboard` | Yes | BRANCH_MANAGER | Get branch-specific dashboard stats |
| POST | `/api/manager/staff` | Yes | BRANCH_MANAGER | Create new staff (Chef, Waiter, Cashier) |
| GET | `/api/manager/staff` | Yes | BRANCH_MANAGER | List staff in current branch |
| GET | `/api/manager/sales` | Yes | BRANCH_MANAGER | List all sales in current branch |
| PATCH | `/api/manager/staff/:id/terminate` | Yes | BRANCH_MANAGER | Deactivate branch staff account |
| PATCH | `/api/manager/staff/:id/activate` | Yes | BRANCH_MANAGER | Reactivate branch staff account |
| GET | `/api/manager/suppliers` | Yes | BRANCH_MANAGER | List all food suppliers |
| POST | `/api/manager/suppliers` | Yes | BRANCH_MANAGER | Add a new food supplier |
| **Inventory** | | | | |
| GET | `/api/inventory` | Yes | ADMIN, HQ, BRANCH_MANAGER, CHEF, CASHIER, WAITER | View inventory items |
| POST | `/api/inventory` | Yes | ADMIN, BRANCH_MANAGER | Add a new item to inventory |
| PATCH | `/api/inventory/:id/quantity` | Yes | ADMIN, BRANCH_MANAGER, CHEF | Manually update stock levels |
| **Sales & Orders** | | | | |
| POST | `/api/sales` | Yes | CASHIER, WAITER, BRANCH_MANAGER, CUSTOMER | Create a new sale or customer order |
| GET | `/api/sales/mine` | Yes | ALL ROLES | View recent sales/orders filtered by role/customer |
| PATCH | `/api/sales/:id/status` | Yes | CHEF, CASHIER, WAITER, BRANCH_MANAGER, ADMIN, HQ_MANAGER | Update order status (PREPARING, READY, COMPLETED, etc.) |
| **Reports** | | | | |
| GET | `/api/reports/summary` | Yes | ADMIN, HQ, BRANCH_MANAGER | Get financial and inventory summary report |
| GET | `/api/reports/sales` | Yes | ADMIN, HQ, BRANCH_MANAGER | Get detailed sales breakdown report |
| **Feedback** | | | | |
| POST | `/api/feedback` | No | Public | Submit customer feedback |
| GET | `/api/feedback/public` | No | Public | Get top 10 latest feedbacks for Landing Page |
| GET | `/api/feedback` | Yes | ADMIN, HQ, BRANCH_MANAGER | View customer feedback |
| **Public Information** | | | | |
| GET | `/api/branches` | No | Public | Get basic branch info (Name, Location, Phone) for Landing Page |
