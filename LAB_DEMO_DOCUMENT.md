# Steakz MIS Task 2 - Lab Demo Document

## 1. Business Process Diagram
```mermaid
graph TD
    Start((Start)) --> Public[Public: View Branches & Menu]
    Public --> Login[Staff: Secure Login]
    Login --> Auth{Authenticated?}
    Auth -- No --> Denied[Access Denied Page]
    Auth -- Yes --> RoleSwitch{Role Dashboard}

    RoleSwitch -- Admin/HQ --> Global[Global Overview & Branch Creation]
    RoleSwitch -- Manager --> BranchMgmt[Branch Staff & Reports]
    RoleSwitch -- Chef/Staff --> Ops[Kitchen Orders & POS Sales]

    Ops --> Sale[Record Sale / POS]
    Sale --> Order[Order Created: PENDING]
    Order --> Prepare[Chef: PREPARING]
    Prepare --> Ready[Chef: READY]
    Ready --> Complete[Payment: COMPLETED]
    Complete --> Inventory[Auto-deduct Stock]
    Inventory --> End((End))
```

## 2. Use-Case Diagram
```mermaid
graph LR
    Admin((Admin/HQ))
    Manager((Branch Manager))
    Staff((Kitchen/Service Staff))

    subgraph "Steakz MIS System"
        UC1(Manage Branches & HQ Users)
        UC2(Global Financial Reports)
        UC3(Manage Branch Staff)
        UC4(View Inventory Alerts)
        UC5(Update Stock Levels)
        UC6(Process Sales / POS)
        UC7(Update Order Lifecycle)
    end

    Admin --- UC1
    Admin --- UC2
    Manager --- UC3
    Manager --- UC4
    Manager --- UC5
    Staff --- UC6
    Staff --- UC7
    Staff --- UC4
```

## 3. ER Diagram (Prisma Schema)
```mermaid
erDiagram
    BRANCH ||--o{ USER : employs
    BRANCH ||--o{ INVENTORY_ITEM : stocks
    BRANCH ||--o{ SALE : processes
    BRANCH ||--o{ CUSTOMER_FEEDBACK : receives
    SUPPLIER ||--o{ INVENTORY_ITEM : supplies
    USER ||--o{ SALE : creates
    USER ||--o{ STOCK_MOVEMENT : records
    SALE ||--|{ SALE_ITEM : contains
    INVENTORY_ITEM ||--o{ SALE_ITEM : part_of
    INVENTORY_ITEM ||--o{ STOCK_MOVEMENT : tracks

    USER {
        int id
        string name
        string email
        string password
        Role role
        boolean isActive
    }
    BRANCH {
        int id
        string name
        string location
        string phone
    }
    INVENTORY_ITEM {
        int id
        string name
        string unit
        float quantity
        float reorderLevel
    }
    SALE {
        int id
        string orderNumber
        SaleStatus status
        float totalAmount
    }
    SALE_ITEM {
        int id
        string menuItem
        int quantity
        float unitPrice
        float lineTotal
    }
    CUSTOMER_FEEDBACK {
        int id
        string customerName
        int rating
        string comment
    }
```

## 4. API Endpoint Table
| Endpoint URL | Method | Purpose | Access Role |
|:---|:---|:---|:---|
| `/api/auth/login` | POST | Authenticate user and get JWT | PUBLIC |
| `/api/auth/me` | GET | Get current logged-in user profile | ALL |
| `/api/admin/branches` | POST | Create a new branch and its manager | ADMIN |
| `/api/admin/branches` | GET | List all branches and stats | ADMIN, HQ_MANAGER |
| `/api/admin/users` | GET | List all system users | ADMIN, HQ_MANAGER |
| `/api/admin/overview` | GET | System-wide KPI overview | ADMIN, HQ_MANAGER |
| `/api/manager/dashboard` | GET | Branch-specific dashboard stats | BRANCH_MANAGER |
| `/api/manager/staff` | POST | Create new staff (Chef/Waiter/Cashier) | BRANCH_MANAGER |
| `/api/manager/staff` | GET | List staff in current branch | BRANCH_MANAGER |
| `/api/inventory` | GET | View inventory items | ALL STAFF |
| `/api/inventory/:id/quantity`| PATCH | Manually update stock levels | CHEF, MANAGER, ADMIN |
| `/api/sales` | POST | Record a new customer sale (POS) | CASHIER, WAITER |
| `/api/sales/:id/status` | PATCH | Update order status (Pending -> Completed) | CHEF, MANAGER |
| `/api/reports/summary` | GET | Financial/Inventory summary report | MANAGER, HQ, ADMIN |
| `/api/feedback` | POST | Submit customer feedback | PUBLIC |

## 5. Deployment & Source Control
*   **Backend GitHub:** [PLACEHOLDER]
*   **Frontend GitHub:** [PLACEHOLDER]
*   **Live Application:** [PLACEHOLDER]

## 6. Admin Credentials
*   **Email:** `admin@steakz.com`
*   **Password:** `Admin@123`

## 7. Lab Demo Checklist
- [ ] **Landing Page:** Show public branch list and menu.
- [ ] **Authentication:** Login as Admin, HQ, Manager, and Chef.
- [ ] **Admin Dashboard:** Show multi-branch oversight.
- [ ] **POS Workflow:** Create a sale as a Waiter and show inventory deduction.
- [ ] **Kitchen Pipeline:** Advance an order through preparation stages as a Chef.
- [ ] **RBAC:** Attempt to access Admin panel as a Chef to show "Access Denied".
- [ ] **Feedback:** Submit a public review and view it as a Manager.
