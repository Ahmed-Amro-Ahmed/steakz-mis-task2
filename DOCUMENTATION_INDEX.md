# Steakz MIS - Master Documentation Index

This file provides a centralized guide to all documentation and resources for the **Steakz Management Information System (MIS) Task 2** project.

## 1. Core Project Documentation

| File | Description | Relevance to Assignment | Lab Presentation Use Case |
|------|-------------|-------------------------|---------------------------|
| **[README_SPLIT_SUBMISSION.md](./README_SPLIT_SUBMISSION.md)** | Overview of the split submission (Frontend/Backend). | Explains the structural organization. | Reference if the professor asks about the repo structure. |
| **[ENDPOINTS.md](./ENDPOINTS.md)** | List of 26+ implemented API routes. | Demonstrates backend completeness. | Show when explaining available system capabilities. |
| **[POSTMAN_TEST_PLAN.md](./POSTMAN_TEST_PLAN.md)** | 38+ test scenarios covering all roles. | Proves the API is robust and secure. | Use to demo API testing and RBAC validation. |
| **[POSTMAN_VARIABLES.md](./POSTMAN_VARIABLES.md)** | Setup guide for Postman environments. | Ensures testing environment consistency. | Reference during the Postman demo portion. |
| **[ERD_DOCUMENTATION.md](./ERD_DOCUMENTATION.md)** | Database schema and Mermaid ER diagram. | Shows relational design and cardinality. | Show when explaining how data (Sales, Inventory) is stored. |
| **[FINAL_PRESENTATION_CHECKLIST.md](./FINAL_PRESENTATION_CHECKLIST.md)** | Master checklist for the live lab demo. | Combines setup, logins, and Q&A prep. | **Open this first** to prepare your demo environment. |

## 2. Project Source Folders

- **[Backend Source](./Steakz_Backend_ONLY/steakz-backend/)**: Contains the Node.js/Express API and Prisma ORM logic.
- **[Frontend Source](./Steakz_Frontend_ONLY/steakz-frontend/)**: Contains the React/TypeScript dashboard and UI components.

## 3. Quick Start Commands

### Backend (Port 3001)
```bash
cd Steakz_Backend_ONLY/steakz-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend (Port 5173)
```bash
cd Steakz_Frontend_ONLY/steakz-frontend
npm install
npm run dev
```

## 4. Local URLs
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

## 5. Demo Role Summary
*Use these primary roles during your presentation to show different perspectives:*
- **ADMIN**: Global control and system-wide Access Matrix.
- **HEADQUARTER_MANAGER**: Global reporting and financial overview.
- **BRANCH_MANAGER**: Managing staff and inventory for one specific branch.
- **CHEF**: Kitchen order preparation and manual stock updates.
- **WAITER / CASHIER**: POS entry and order completion.

## 6. Application Navigation Map

### Navigation Flow
- **Public Landing Page (/)**: View branches, menu, latest feedback, and portal login.
- **Login Page (/login)**: Centralized entry point for all role-based dashboards.
- **Admin Dashboard**: System-wide statistics, branch management, user account control, and Role Access Matrix.
- **HQ Manager Dashboard**: Multi-branch KPI overview and performance comparison reports.
- **Branch Manager Dashboard**: Single-branch financial reports, inventory management, and staff roster.
- **Chef Dashboard**: Live kitchen display for order preparation and read-only stock awareness.
- **Cashier/Waiter Dashboard**: POS terminal for sales recording, status updates for ready orders, and inventory visibility.
- **Customer Dashboard**: Personal profile actions, order history, and feedback submission.

### Role-to-Destination Table

| Role | Login (Demo) | Dashboard Purpose |
|------|--------------|-------------------|
| **Admin** | `admin@steakz.com` | Full system control and audit of all branches/users. |
| **HQ Manager** | `hq@steakz.com` | High-level business intelligence across the entire franchise. |
| **Branch Manager** | `manager@steakz.com` | Operational management of a specific branch's resources. |
| **Chef** | `chef@steakz.com` | Streamlining the kitchen workflow and stock monitoring. |
| **Waiter / Cashier** | `waiter@steakz.com` | Fast-paced POS entry and customer service flow. |
| **Customer** | `customer@gmail.com` | Personalized interaction, feedback, and history. |

## 7. Security Reminder
⚠️ **DO NOT PUSH YOUR `.env` FILE TO GITHUB.**
The `.env` file contains your private Database URL and JWT Secret. Use `.env.example` to share the required keys without revealing actual credentials.
