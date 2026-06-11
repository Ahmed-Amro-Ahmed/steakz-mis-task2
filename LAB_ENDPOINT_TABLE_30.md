# API Endpoint & Postman Test Evidence (30 Requests)

This table summarizes the 30 Postman requests executed against the Steakz MIS API. All tests passed with 65 total assertions and 0 failures.

| No. | Method | Endpoint/Test | Purpose | Access Control | Postman Result |
|-----|--------|---------------|---------|----------------|----------------|
| 1 | POST | `/api/auth/login` (Admin) | Authenticate Administrator | Public | Passed |
| 2 | POST | `/api/auth/login` (HQ) | Authenticate HQ Manager | Public | Passed |
| 3 | POST | `/api/auth/login` (Manager) | Authenticate Branch Manager | Public | Passed |
| 4 | POST | `/api/auth/login` (Chef) | Authenticate Chef | Public | Passed |
| 5 | POST | `/api/auth/login` (Waiter) | Authenticate Waiter | Public | Passed |
| 6 | POST | `/api/auth/login` (Cashier) | Authenticate Cashier | Public | Passed |
| 7 | POST | `/api/auth/login` (Customer)| Authenticate Customer | Public | Passed |
| 8 | GET | `/api/auth/me` | Verify token/profile | All Auth Users | Passed |
| 9 | POST | `/api/admin/branches` | Create new branch & manager | ADMIN | Passed |
| 10 | GET | `/api/admin/branches` | List all branches/stats | ADMIN, HQ | Passed |
| 11 | GET | `/api/admin/users` | List all system users | ADMIN, HQ | Passed |
| 12 | PATCH | `/api/admin/users/:id/terminate` | Deactivate user account | ADMIN, HQ | Passed |
| 13 | GET | `/api/admin/overview` | Global KPI Summary | ADMIN, HQ | Passed |
| 14 | GET | `/api/manager/dashboard` | Branch performance stats | BRANCH_MANAGER | Passed |
| 15 | POST | `/api/manager/staff` | Register new branch staff | BRANCH_MANAGER | Passed |
| 16 | GET | `/api/manager/staff` | List branch-specific staff | BRANCH_MANAGER | Passed |
| 17 | GET | `/api/manager/suppliers` | List food suppliers | BRANCH_MANAGER | Passed |
| 18 | POST | `/api/manager/suppliers` | Add new food supplier | BRANCH_MANAGER | Passed |
| 19 | GET | `/api/inventory` | View branch inventory | All Staff Roles | Passed |
| 20 | POST | `/api/inventory` | Add item to inventory | ADMIN, MANAGER | Passed |
| 21 | PATCH | `/api/inventory/:id/quantity` | Manual stock adjustment | ADMIN, MGR, CHEF | Passed |
| 22 | POST | `/api/sales` (Customer) | Place online order | CUSTOMER | Passed |
| 23 | POST | `/api/sales` (Staff) | Record POS sale | WAITER, CASHIER | Passed |
| 24 | GET | `/api/sales/mine` | View role-filtered history | ALL ROLES | Passed |
| 25 | PATCH | `/api/sales/:id/status` (READY) | Mark order as ready | CHEF | Passed |
| 26 | PATCH | `/api/sales/:id/status` (COMPLETED) | Mark order as completed | WAITER, CASHIER | Passed |
| 27 | GET | `/api/reports/summary` | Financial summary report | ADMIN, HQ, MGR | Passed |
| 28 | GET | `/api/reports/sales` | Detailed sales breakdown | ADMIN, HQ, MGR | Passed |
| 29 | POST | `/api/feedback` | Submit customer feedback | Public | Passed |
| 30 | GET | `/api/feedback/public` | Get landing page reviews | Public | Passed |

**Test Summary**: 30 Requests, 65 Assertions, 0 Failures.
