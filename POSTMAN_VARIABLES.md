# Postman Variables - Steakz MIS

Use these variables in your Postman Environment to facilitate testing across different roles and branches.

| Variable Name | Description | Example / Recommended Value |
|---------------|-------------|-----------------------------|
| `baseUrl` | Backend API Base URL | `http://localhost:3001` |
| `adminToken` | JWT Token for ADMIN | *Paste token from /api/auth/login* |
| `hqToken` | JWT Token for HEADQUARTER_MANAGER | *Paste token from /api/auth/login* |
| `managerToken`| JWT Token for BRANCH_MANAGER | *Paste token from /api/auth/login* |
| `chefToken` | JWT Token for CHEF | *Paste token from /api/auth/login* |
| `cashierToken`| JWT Token for CASHIER | *Paste token from /api/auth/login* |
| `waiterToken` | JWT Token for WAITER | *Paste token from /api/auth/login* |
| `customerToken`| JWT Token for CUSTOMER (if applicable) | *Not required for public feedback* |
| `branchId` | ID of a specific branch | `1` |
| `saleId` | ID of a specific sale record | `1` |
| `orderId` | ID of a specific order | `1` |
| `inventoryItemId`| ID of a specific inventory item | `1` |
| `feedbackId` | ID of a specific feedback record | `1` |

## Setup Instructions

1.  Create a new Environment in Postman (e.g., "Steakz-Local").
2.  Add the `baseUrl` variable.
3.  Perform a login for each role and copy the `token` from the response.
4.  Paste the tokens into the respective `Token` variables in your environment.
5.  Use `{{baseUrl}}` and `{{adminToken}}` etc., in your requests.
