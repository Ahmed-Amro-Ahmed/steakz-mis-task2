# Draw.io Recreation Guide - Steakz MIS Diagrams

This guide provides instructions for redrawing the project's core diagrams in Draw.io to ensure they match the current system architecture and schema.

---

## 1. Business Process Diagram (BPD)

**Goal**: Show the operational flow from Order to Fulfillment.

**Step-by-Step Layout**:
1.  **Swimlanes (Optional but recommended)**: Create 3 lanes: *Customer*, *Front of House (Staff)*, *Back of House (Chef)*.
2.  **Start Node**: "Customer arrives or opens portal".
3.  **Process Boxes**:
    *   "Customer places online order" OR "Staff records POS sale".
    *   "Order Status set to PENDING" (Central Database).
    *   "Chef views Kitchen Display and starts preparation" (Status: PREPARING).
    *   "Chef marks order as READY".
    *   "Waiter/Cashier delivers order and completes transaction" (Status: COMPLETED).
4.  **Automatic Side-Effect**: Add a box "Inventory automatically deducted" connected to the completion step.
5.  **Closing Node**: "Customer submits feedback".

---

## 2. Entity-Relationship Diagram (ERD)

**Goal**: Visualize the PostgreSQL schema managed via Prisma.

**Table Placement (Center-Out Approach)**:
1.  **Center**: `Branch` (id, name, location).
2.  **Left of Branch**: `User` (id, name, email, role, branchId).
3.  **Right of Branch**: `Sale` (id, orderNumber, status, branchId).
4.  **Below Branch**: `InventoryItem` (id, name, quantity, branchId).
5.  **Supporting Tables**:
    *   `Supplier` (connects to InventoryItem).
    *   `StockMovement` (connects to InventoryItem and User).
    *   `SaleItem` (connects to Sale and InventoryItem).
    *   `CustomerFeedback` (connects to Branch).

**Notation**: Use **Crow's Foot** connectors. 
*   Ensure a `1` (single line) at the "Parent" side (e.g., Branch) and a `Many` (crow's foot) at the "Child" side (e.g., Sale).

---

## 3. Use-Case Diagram

**Goal**: Illustrate role-based interactions with the system.

**Layout**:
1.  **Actors (Stick Figures)**:
    *   Place **Admin** and **HQ Manager** on the far left.
    *   Place **Branch Manager** and **Staff (Chef/Waiter)** in the middle-left.
    *   Place **Customer** on the far right.
2.  **System Boundary (Large Box)**: Label it "Steakz MIS".
3.  **Use Case Ovals (Inside Box)**:
    *   "Manage Branches & Users" (Admin/HQ only).
    *   "Manage Inventory & Suppliers" (Manager/Chef).
    *   "Process Sales & Orders" (Staff/Customer).
    *   "View Business Reports" (Admin/HQ/Manager).
    *   "Submit Feedback" (Customer).
4.  **Connections**: Draw straight lines from Actors to the Use Cases they are authorized to perform.
