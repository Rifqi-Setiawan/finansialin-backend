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
