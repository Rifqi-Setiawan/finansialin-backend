# API Testing - Authentication

## Base URL
```
http://localhost:3000/api
```

---

## 1. Register (POST /auth/register)

### Request
```json
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

### Success Response (201)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T10:00:00.000Z"
  }
}
```

### Error Response (409 - Conflict)
```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Password must be at least 6 characters long",
    "Password must contain at least 1 lowercase letter and 1 number or special character"
  ],
  "error": "Bad Request"
}
```

---

## 2. Login (POST /auth/login)

### Request
```json
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Success Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T10:00:00.000Z"
  }
}
```

### Error Response (401 - Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## 3. Refresh Token (POST /auth/refresh)

### Request
```json
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Success Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

### Error Response (401)
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```

---

## 4. Get Profile (GET /auth/profile) 🔒 Protected

### Request
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
  "user": {
    "idUser": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T10:00:00.000Z"
  }
}
```

### Error Response (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 5. Logout (POST /auth/logout) 🔒 Protected

### Request
```http
POST http://localhost:3000/api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200)
```json
{
  "message": "Logout successful"
}
```

**Note:** Client harus menghapus token dari storage (localStorage/cookie) setelah logout.

---

## Testing dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"name\":\"Test User\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
```

### Get Profile (replace TOKEN)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Testing dengan Thunder Client / Postman

1. **Register/Login**: Salin `accessToken` dari response
2. **Protected Routes**: 
   - Tab "Headers"
   - Add: `Authorization: Bearer <paste_token_here>`

---

## Password Requirements

- Minimum 6 characters
- Maximum 50 characters
- Must contain at least 1 lowercase letter
- Must contain at least 1 number OR special character

Examples:
- ✅ `password123`
- ✅ `Pass123!`
- ✅ `mypass1`
- ❌ `password` (no number)
- ❌ `12345` (no letter)
- ❌ `short` (too short)

---

## Transactions (CRUD)

All transaction endpoints are protected — include `Authorization: Bearer <accessToken>` header.

Base path: `/api/transactions`

### 1. Create Transaction (POST /transactions)

Request
```json
POST http://localhost:3000/api/transactions
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{
  "type": "expense",
  "amount": 150.5,
  "description": "Grocery shopping",
  "date": "2025-11-25T10:00:00.000Z",
  "source": "Cash",
  "idCategory": 1
}
```

Success Response (201)
```json
{
  "idTransaction": 1,
  "idUser": 1,
  "idCategory": 1,
  "type": "expense",
  "amount": 150.5,
  "description": "Grocery shopping",
  "date": "2025-11-25T10:00:00.000Z",
  "source": "Cash"
}
```

Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "Amount must be a positive number",
    "Date must be an ISO8601 date"
  ],
  "error": "Bad Request"
}
```

### 2. List Transactions (GET /transactions)

Get current user's transactions with optional query params (page, limit, from, to, category).

Request
```http
GET http://localhost:3000/api/transactions?page=1&limit=20&from=2025-11-01&to=2025-11-30
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "data": [
    {
      "idTransaction": 1,
      "type": "expense",
      "amount": 150.5,
      "description": "Grocery shopping",
      "date": "2025-11-25T10:00:00.000Z",
      "source": "Cash",
      "category": {
        "idCategory": 1,
        "name": "Food"
      }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1 }
}
```

### 3. Get Transaction by ID (GET /transactions/:id)

Request
```http
GET http://localhost:3000/api/transactions/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "idTransaction": 1,
  "idUser": 1,
  "idCategory": 1,
  "type": "expense",
  "amount": 150.5,
  "description": "Grocery shopping",
  "date": "2025-11-25T10:00:00.000Z",
  "source": "Cash"
}
```

### 4. Update Transaction (PUT /transactions/:id)

Request
```json
PUT http://localhost:3000/api/transactions/1
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{
  "amount": 160.0,
  "description": "Grocery + snacks"
}
```

Success Response (200)
```json
{
  "idTransaction": 1,
  "type": "expense",
  "amount": 160.0,
  "description": "Grocery + snacks",
  "date": "2025-11-25T10:00:00.000Z",
  "source": "Cash",
  "idCategory": 1
}
```

### 5. Delete Transaction (DELETE /transactions/:id)

Request
```http
DELETE http://localhost:3000/api/transactions/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "message": "Transaction deleted"
}
```

---

### DTO examples (validation rules)

CreateTransactionDto
```ts
export class CreateTransactionDto {
  @IsString()
  @IsIn(['income','expense'])
  type!: 'income' | 'expense';
  @IsNumber()
## Budget Goals (Analysis)

This endpoint analyzes budgets per category for a selected period and returns how much of the budget is used, whether the category is over budget, and helpful summary values that the frontend can use to render progress bars and alerts.

Base path: `/api/budgets/goals`

Query parameters
- `period` (required): `daily` | `weekly` | `monthly` | `year` — the period type to analyze
- `date` (optional): ISO date string representing any day within the requested period. Example: `2025-11-25`. If omitted, current date is used.
- `type` (optional): `expense` | `income` | `both` — which transaction types to include in the usage calculation. Default: `expense`.
- `idCategory` (optional): integer — limit analysis to a single category.

Request example
```http
GET http://localhost:3000/api/budgets/goals?period=monthly&date=2025-11-01&type=expense
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "period": {
    "start": "2025-11-01T00:00:00.000Z",
    "end": "2025-12-01T00:00:00.000Z",
    "period": "monthly"
  },
  "totals": {
    "totalBudget": 500.00,
    "totalSpent": 275.00,
    "percent": 55
  },
  "data": [
    {
      "idCategory": 1,
      "name": "Food",
      "budgetAmount": 200.00,
      "spent": 55.00,
      "percent": 27.5,
      "overBudget": false,
      "remaining": 145.00
    },
    {
      "idCategory": 2,
      "name": "Transport",
      "budgetAmount": 300.00,
      "spent": 220.00,
      "percent": 73.33,
      "overBudget": false,
      "remaining": 80.00
    }
  ]
}
```

Field descriptions
- `period.start` / `period.end`: ISO timestamps delimiting the analyzed date range.
- `totals.totalBudget`: sum of all budget amounts that overlap the requested period.
- `totals.totalSpent`: sum of all transactions (according to `type` filter) in the requested period.
- `totals.percent`: percent of totalSpent / totalBudget (0 if totalBudget is 0).
- `data[]`: per-category breakdown:
  - `idCategory`, `name` — category identity (null for uncategorized)
  - `budgetAmount` — total budget assigned to that category for the period (0 if none)
  - `spent` — sum of transaction amounts in the period for this category
  - `percent` — percent used (rounded to 2 decimals)
  - `overBudget` — boolean, true if `spent > budgetAmount` (false if budgetAmount === 0)
  - `remaining` — `budgetAmount - spent` (can be negative)

Error responses
- `400 Bad Request` — invalid `period` or `date` parameter. Example:
```json
{ "statusCode": 400, "message": "Invalid period" }
```

Notes and suggestions for frontend
- Use `percent` to render the progress bar width.
- Use `overBudget` to show prominent warnings (red bar / alert). The frontend screenshot provided shows UI cues (percent used, amount over budget) — the API provides `remaining` (negative means over budget) so the UI can show "Over budget by $-remaining".
- If you want per-day series for charts, we can add a time-series variant that returns daily aggregates inside the requested period.

  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsInt()
  idCategory?: number;
}
```

UpdateTransactionDto
```ts
export class UpdateTransactionDto {
  @IsOptional() @IsString() @IsIn(['income','expense']) type?: 'income' | 'expense';
  @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsInt() idCategory?: number;
}
```

---

### 6. Get Transactions By Month (GET /transactions/month/:year/:month)

Get all transactions for the current user in a specific year/month. `month` is 1..12.

Request
```http
GET http://localhost:3000/api/transactions/month/2025/11
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "data": [
    {
      "idTransaction": 1,
      "type": "expense",
      "amount": 150.5,
      "description": "Grocery shopping",
      "date": "2025-11-25T10:00:00.000Z",
      "source": "Cash",
      "category": { "idCategory": 1, "name": "Food" }
    }
  ]
}
```

Error Responses

- `400 Bad Request` — invalid year or month parameters
```json
{ "statusCode": 400, "message": "Invalid month" }
```


---

### Quick cURL examples

Create
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"amount":50,"description":"Taxi","date":"2025-11-25T08:00:00.000Z"}'
```

List
```bash
curl -X GET "http://localhost:3000/api/transactions?page=1&limit=20" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Get by id
```bash
curl -X GET http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Update
```bash
curl -X PUT http://localhost:3000/api/transactions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"amount":60}'
```

Delete
```bash
curl -X DELETE http://localhost:3000/api/transactions/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

Add similar CRUD docs for `Budget` once implemented (create, list/get, update, delete).

---

## Categories (CRUD)

All category endpoints are protected — include `Authorization: Bearer <accessToken>` header.

Base path: `/api/categories`

### 1. Create Category (POST /categories)

Request
```json
POST http://localhost:3000/api/categories
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{
  "name": "Food"
}
```

Success Response (201)
```json
{
  "idCategory": 1,
  "name": "Food",
  "idUser": 1,
  "createdAt": "2025-11-25T10:00:00.000Z"
}
```

### 2. List Categories (GET /categories)

Request
```http
GET http://localhost:3000/api/categories
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
[
  { "idCategory": 1, "name": "Food", "idUser": 1 }
]
```

### 3. Get Category by ID (GET /categories/:id)

Request
```http
GET http://localhost:3000/api/categories/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{ "idCategory": 1, "name": "Food", "idUser": 1 }
```

### 4. Update Category (PUT /categories/:id)

Request
```json
PUT http://localhost:3000/api/categories/1
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{ "name": "Groceries" }
```

Success Response (200)
```json
{ "idCategory": 1, "name": "Groceries", "idUser": 1 }
```

### 5. Delete Category (DELETE /categories/:id)

Request
```http
DELETE http://localhost:3000/api/categories/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{ "message": "Category deleted" }
```

### DTO examples (Category)
```ts
export class CreateCategoryDto {
  @IsString()
  name!: string;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() name?: string;
}
```

---

## Budgets (CRUD)

All budget endpoints are protected — include `Authorization: Bearer <accessToken>` header.

Base path: `/api/budgets`

### 1. Create Budget (POST /budgets)

Request
```json
POST http://localhost:3000/api/budgets
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{
  "idCategory": 1,
  "periodStart": "2025-11-01T00:00:00.000Z",
  "periodEnd": "2025-11-30T23:59:59.000Z",
  "amount": 500.00
}
```

Success Response (201)
```json
{
  "idBudget": 1,
  "idUser": 1,
  "idCategory": 1,
  "periodStart": "2025-11-01T00:00:00.000Z",
  "periodEnd": "2025-11-30T23:59:59.000Z",
  "amount": 500.00
}
```

### 2. List Budgets (GET /budgets)

Request
```http
GET http://localhost:3000/api/budgets
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
[
  {
    "idBudget": 1,
    "idUser": 1,
    "idCategory": 1,
    "periodStart": "2025-11-01T00:00:00.000Z",
    "periodEnd": "2025-11-30T23:59:59.000Z",
    "amount": 500.00
  }
]
```

### 3. Get Budget by ID (GET /budgets/:id)

Request
```http
GET http://localhost:3000/api/budgets/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{
  "idBudget": 1,
  "idUser": 1,
  "idCategory": 1,
  "periodStart": "2025-11-01T00:00:00.000Z",
  "periodEnd": "2025-11-30T23:59:59.000Z",
  "amount": 500.00
}
```

### 4. Update Budget (PUT /budgets/:id)

Request
```json
PUT http://localhost:3000/api/budgets/1
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>

{
  "amount": 600.00
}
```

Success Response (200)
```json
{
  "idBudget": 1,
  "amount": 600.00
}
```

### 5. Delete Budget (DELETE /budgets/:id)

Request
```http
DELETE http://localhost:3000/api/budgets/1
Authorization: Bearer <ACCESS_TOKEN>
```

Success Response (200)
```json
{ "message": "Budget deleted" }
```

### DTO examples (Budget)
```ts
export class CreateBudgetDto {
  @IsOptional() @IsInt() idCategory?: number;
  @IsDateString() periodStart!: string;
  @IsDateString() periodEnd!: string;
  @IsNumber() @IsPositive() amount!: number;
}

export class UpdateBudgetDto {
  @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @IsOptional() @IsDateString() periodStart?: string;
  @IsOptional() @IsDateString() periodEnd?: string;
}
```

---

Quick cURL examples (category & budget)

Create category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"name":"Food"}'
```

Create budget
```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"idCategory":1,"periodStart":"2025-11-01T00:00:00.000Z","periodEnd":"2025-11-30T23:59:59.000Z","amount":500}'
```
