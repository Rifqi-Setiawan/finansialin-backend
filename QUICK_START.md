# 🚀 Quick Start Guide - Authentication API

## ✅ Fitur yang Sudah Selesai

Fitur authentication sudah **READY** untuk dicoba dengan best practices:

### ✨ Endpoints yang Tersedia:
1. **POST** `/api/auth/register` - Register user baru
2. **POST** `/api/auth/login` - Login user
3. **POST** `/api/auth/refresh` - Refresh access token  
4. **GET** `/api/auth/profile` 🔒 - Get user profile (protected)
5. **POST** `/api/auth/logout` 🔒 - Logout user (protected)

---

## 🏃‍♂️ Cara Menjalankan Server

### 1. Jalankan Development Server

```bash
# Buka terminal di VS Code
pnpm start:dev
```

Server akan berjalan di: **http://localhost:3000**

Tunggu sampai muncul: `🚀 Server running on http://localhost:3000`

---

## 🧪 Cara Testing API

### Opsi 1: Menggunakan Thunder Client (Recommended) ⚡

1. **Install Extension Thunder Client** di VS Code
2. Klik icon Thunder Client di sidebar
3. Klik "New Request"
4. Ikuti panduan testing di bawah

### Opsi 2: Menggunakan REST Client Extension

1. **Install Extension "REST Client"** di VS Code
2. Buka file `api.http`
3. Klik "Send Request" di atas setiap endpoint

### Opsi 3: Menggunakan Postman

Import endpoints dari file `API_TESTING.md`

---

## 📝 Manual Testing Step by Step

### Step 1: Register User Baru

**Thunder Client / Postman:**
```
Method: POST
URL: http://localhost:3000/api/auth/register
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**Expected Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T15:30:00.000Z"
  }
}
```

✅ **Copy `accessToken` dari response untuk digunakan di step selanjutnya!**

---

### Step 2: Login

**Thunder Client / Postman:**
```
Method: POST
URL: http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Expected Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T15:30:00.000Z"
  }
}
```

---

### Step 3: Get Profile (Protected) 🔒

**Thunder Client / Postman:**
```
Method: GET
URL: http://localhost:3000/api/auth/profile
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Cara set Authorization Header di Thunder Client:**
1. Tab "Headers"
2. Add new header:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (paste token dari step 1/2)

**Expected Response (200):**
```json
{
  "user": {
    "idUser": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-29T15:30:00.000Z"
  }
}
```

---

### Step 4: Refresh Token

**Thunder Client / Postman:**
```
Method: POST
URL: http://localhost:3000/api/auth/refresh
Headers:
  Content-Type: application/json

Body (JSON):
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**Expected Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

---

### Step 5: Logout (Protected) 🔒

**Thunder Client / Postman:**
```
Method: POST
URL: http://localhost:3000/api/auth/logout
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 🧪 Test Validation Errors

### Test 1: Email tidak valid
```json
{
  "email": "invalid-email",
  "password": "Password123!"
}
```
**Expected:** Error 400 - "Please provide a valid email address"

### Test 2: Password terlalu pendek
```json
{
  "email": "test@example.com",
  "password": "12345"
}
```
**Expected:** Error 400 - "Password must be at least 6 characters long"

### Test 3: Password tidak ada angka/special char
```json
{
  "email": "test@example.com",
  "password": "password"
}
```
**Expected:** Error 400 - "Password must contain at least 1 lowercase letter and 1 number or special character"

### Test 4: Email sudah terdaftar
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
**Expected:** Error 409 - "Email already exists"

### Test 5: Login dengan password salah
```json
{
  "email": "john@example.com",
  "password": "WrongPassword123!"
}
```
**Expected:** Error 401 - "Invalid credentials"

### Test 6: Akses protected route tanpa token
```
GET /api/auth/profile
(tanpa Authorization header)
```
**Expected:** Error 401 - "Unauthorized"

---

## 🎯 Tips Testing

### 1. Gunakan Environment Variables di Thunder Client

Buat environment dengan variables:
```
baseURL: http://localhost:3000/api
accessToken: (akan di-set otomatis)
refreshToken: (akan di-set otomatis)
```

Kemudian gunakan:
```
URL: {{baseURL}}/auth/login
Authorization: Bearer {{accessToken}}
```

### 2. Postman Collection

Buat collection dengan:
- Pre-request script untuk auto-set token
- Tests untuk validasi response
- Environment untuk dev/prod

### 3. Watch Terminal Logs

Perhatikan log di terminal untuk melihat:
- Request yang masuk
- Error yang terjadi
- Database queries (jika ada)

---

## 📊 Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request berhasil |
| 201 | Created | Register berhasil |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Token invalid/expired atau credentials salah |
| 409 | Conflict | Email sudah terdaftar |
| 500 | Server Error | Server error (cek logs) |

---

## 🔐 Security Features

### ✅ Yang Sudah Diimplementasi:

1. **Password Hashing** - bcrypt dengan salt rounds 10
2. **JWT Tokens** - Access token (15 min) & Refresh token (7 days)
3. **Input Validation** - class-validator untuk semua DTO
4. **Protected Routes** - Global JWT Guard dengan @Public() decorator
5. **Password Requirements** - Min 6 char, lowercase + number/special
6. **No Password Leak** - Password tidak pernah di-return ke client
7. **Token Expiration** - Auto-expire dengan refresh mechanism
8. **Error Messages** - Generic messages untuk security (no details leak)

---

## 🐛 Troubleshooting

### Server tidak bisa diakses
```bash
# Cek apakah server running
# Output harus: "🚀 Server running on http://localhost:3000"

# Cek port conflict
netstat -ano | findstr :3000

# Restart server
# Ctrl+C di terminal, lalu:
pnpm start:dev
```

### Error: Cannot connect to database
```bash
# Cek PostgreSQL running
# Cek DATABASE_URL di .env
# Test connection:
pnpm prisma studio
```

### Token expired
```
# Gunakan refresh token untuk get new access token
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### Error: Module not found
```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Rebuild
pnpm build
```

---

## 📚 File-File Penting

| File | Deskripsi |
|------|-----------|
| `api.http` | REST Client testing file |
| `API_TESTING.md` | Dokumentasi lengkap API |
| `README_AUTH.md` | Dokumentasi auth features |
| `QUICK_START.md` | Panduan ini |
| `.env` | Environment variables |
| `src/auth/` | Auth module & logic |

---

## ✅ Next Steps

Setelah berhasil testing authentication:

1. ✅ Test semua endpoints dengan berbagai scenario
2. ✅ Catat bugs/issues yang ditemukan
3. ✅ Mulai implement fitur berikutnya:
   - Budget management
   - Transaction tracking
   - Reports & analytics
   - Notifications

---

## 🎉 Summary

**Status:** ✅ **READY TO TEST!**

**Cara Tercepat Testing:**
1. Jalankan: `pnpm start:dev`
2. Buka Thunder Client di VS Code
3. POST ke `/api/auth/register` dengan email & password
4. Copy token dari response
5. GET ke `/api/auth/profile` dengan token di header

**Need Help?**
- Baca `API_TESTING.md` untuk detail lengkap
- Lihat `README_AUTH.md` untuk best practices
- Check terminal logs untuk debugging

---

**Happy Testing! 🚀**
