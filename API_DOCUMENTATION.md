# Dokumentasi API Finansialin Backend

**Base URL:** `http://localhost:3000/api`

---

## 📋 Daftar Isi
1. [Autentikasi](#autentikasi)
2. [Pengguna](#pengguna)
3. [Kategori](#kategori)
4. [Transaksi](#transaksi)
5. [Anggaran (Budget)](#anggaran-budget)
6. [Notifikasi](#notifikasi)

---

## 🔐 Autentikasi

### 1. Register (Daftar Akun Baru)

**Endpoint:** `POST /api/auth/register`

**Deskripsi:** Membuat akun pengguna baru dengan email dan password

**Autentikasi:** Tidak diperlukan

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Parameter Validasi:**
- `email` (string, required): Email valid unik
- `password` (string, required): Minimal 6 karakter, harus mengandung huruf kecil dan angka/simbol
- `name` (string, optional): Nama pengguna, 2-100 karakter

**Response Sukses (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

**Response Error:**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

### 2. Login (Masuk)

**Endpoint:** `POST /api/auth/login`

**Deskripsi:** Autentikasi pengguna dan mendapatkan access token

**Autentikasi:** Tidak diperlukan

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Parameter Validasi:**
- `email` (string, required): Email valid pengguna
- `password` (string, required): Password akun pengguna

**Response Sukses (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

**Response Error:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 3. Refresh Token (Perbarui Token)

**Endpoint:** `POST /api/auth/refresh`

**Deskripsi:** Mendapatkan access token baru menggunakan refresh token

**Autentikasi:** Tidak diperlukan

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Parameter Validasi:**
- `refreshToken` (string, required): Refresh token yang masih valid

**Response Sukses (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error:**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

---

### 4. Get Profile (Ambil Profil)

**Endpoint:** `GET /api/auth/profile`

**Deskripsi:** Mendapatkan data profil pengguna yang sedang login

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response Error:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

### 5. Logout (Keluar)

**Endpoint:** `POST /api/auth/logout`

**Deskripsi:** Keluar dari akun pengguna

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## 👤 Pengguna

### 1. Update Nama Pengguna

**Endpoint:** `PATCH /api/users/name`

**Deskripsi:** Mengubah nama profil pengguna

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe"
}
```

**Parameter Validasi:**
- `name` (string, required): Nama baru, 2-100 karakter

**Response Sukses (200 OK):**
```json
{
  "idUser": 1,
  "email": "user@example.com",
  "name": "Jane Doe",
  "createdAt": "2025-12-11T10:00:00Z"
}
```

**Response Error:**
```json
{
  "statusCode": 400,
  "message": "Name must be at least 2 characters long",
  "error": "Bad Request"
}
```

---

### 2. Reset Password (Ubah Password)

**Endpoint:** `PATCH /api/users/password`

**Deskripsi:** Mengubah password pengguna

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Parameter Validasi:**
- `oldPassword` (string, required): Password lama yang benar
- `newPassword` (string, required): Password baru, minimal 6 karakter, harus berbeda dari password lama

**Response Sukses (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Response Error (Old Password Invalid):**
```json
{
  "statusCode": 401,
  "message": "Old password is incorrect",
  "error": "Unauthorized"
}
```

**Response Error (Same Password):**
```json
{
  "statusCode": 400,
  "message": "New password must be different from old password",
  "error": "Bad Request"
}
```

---

## 📂 Kategori

### 1. Buat Kategori Baru

**Endpoint:** `POST /api/categories`

**Deskripsi:** Membuat kategori transaksi baru

**Autentikasi:** Tidak diperlukan (untuk saat ini, bisa disesuaikan)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Makanan",
  "type": "expense"
}
```

**Parameter Validasi:**
- `name` (string, required): Nama kategori
- `type` (string, required): Tipe kategori ("expense" atau "income")

**Response Sukses (201 Created):**
```json
{
  "idCategory": 1,
  "name": "Makanan",
  "type": "expense",
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 2. Ambil Semua Kategori

**Endpoint:** `GET /api/categories`

**Deskripsi:** Mendapatkan daftar semua kategori

**Autentikasi:** Tidak diperlukan

**Request Headers:**
```
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idCategory": 1,
    "name": "Makanan",
    "type": "expense",
    "createdAt": "2025-12-11T10:00:00Z"
  },
  {
    "idCategory": 2,
    "name": "Gaji",
    "type": "income",
    "createdAt": "2025-12-11T10:05:00Z"
  }
]
```

---

### 3. Ambil Kategori Berdasarkan ID

**Endpoint:** `GET /api/categories/:id`

**Deskripsi:** Mendapatkan detail kategori spesifik

**Autentikasi:** Tidak diperlukan

**Path Parameters:**
- `id` (number, required): ID kategori

**Request Headers:**
```
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "idCategory": 1,
  "name": "Makanan",
  "type": "expense",
  "createdAt": "2025-12-11T10:00:00Z"
}
```

**Response Error:**
```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

---

### 4. Update Kategori

**Endpoint:** `PUT /api/categories/:id`

**Deskripsi:** Mengubah data kategori

**Autentikasi:** Tidak diperlukan

**Path Parameters:**
- `id` (number, required): ID kategori

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Makan dan Minuman",
  "type": "expense"
}
```

**Response Sukses (200 OK):**
```json
{
  "idCategory": 1,
  "name": "Makan dan Minuman",
  "type": "expense",
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 5. Hapus Kategori

**Endpoint:** `DELETE /api/categories/:id`

**Deskripsi:** Menghapus kategori

**Autentikasi:** Tidak diperlukan

**Path Parameters:**
- `id` (number, required): ID kategori

**Request Headers:**
```
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Category deleted"
}
```

---

## 💳 Transaksi

### 1. Buat Transaksi Baru

**Endpoint:** `POST /api/transactions`

**Deskripsi:** Membuat transaksi pengeluaran atau pemasukan baru

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2025-12-11",
  "amount": 50000,
  "type": "expense",
  "description": "Makan siang di resto",
  "idCategory": 1
}
```

**Parameter Validasi:**
- `date` (string, required): Tanggal transaksi (ISO format: YYYY-MM-DD)
- `amount` (number, required): Jumlah transaksi (positif)
- `type` (string, required): Tipe ("expense" atau "income")
- `description` (string, optional): Deskripsi transaksi
- `idCategory` (number, required): ID kategori

**Response Sukses (201 Created):**
```json
{
  "idTransaction": 1,
  "idUser": 1,
  "date": "2025-12-11T00:00:00Z",
  "amount": 50000,
  "type": "expense",
  "description": "Makan siang di resto",
  "idCategory": 1,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 2. Ambil Semua Transaksi Pengguna

**Endpoint:** `GET /api/transactions`

**Deskripsi:** Mendapatkan daftar semua transaksi pengguna yang login

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idTransaction": 1,
    "idUser": 1,
    "date": "2025-12-11T00:00:00Z",
    "amount": 50000,
    "type": "expense",
    "description": "Makan siang di resto",
    "idCategory": 1,
    "createdAt": "2025-12-11T10:00:00Z"
  },
  {
    "idTransaction": 2,
    "idUser": 1,
    "date": "2025-12-10T00:00:00Z",
    "amount": 5000000,
    "type": "income",
    "description": "Gaji bulanan",
    "idCategory": 2,
    "createdAt": "2025-12-10T09:00:00Z"
  }
]
```

---

### 3. Ambil Transaksi Berdasarkan ID

**Endpoint:** `GET /api/transactions/:id`

**Deskripsi:** Mendapatkan detail transaksi spesifik

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID transaksi

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "idTransaction": 1,
  "idUser": 1,
  "date": "2025-12-11T00:00:00Z",
  "amount": 50000,
  "type": "expense",
  "description": "Makan siang di resto",
  "idCategory": 1,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 4. Ambil Transaksi Berdasarkan Bulan

**Endpoint:** `GET /api/transactions/month/:year/:month`

**Deskripsi:** Mendapatkan semua transaksi dalam bulan dan tahun tertentu

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `year` (number, required): Tahun (contoh: 2025)
- `month` (number, required): Bulan (1-12)

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idTransaction": 1,
    "idUser": 1,
    "date": "2025-12-11T00:00:00Z",
    "amount": 50000,
    "type": "expense",
    "description": "Makan siang di resto",
    "idCategory": 1,
    "createdAt": "2025-12-11T10:00:00Z"
  }
]
```

---

### 5. Update Transaksi

**Endpoint:** `PUT /api/transactions/:id`

**Deskripsi:** Mengubah data transaksi

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID transaksi

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2025-12-11",
  "amount": 55000,
  "type": "expense",
  "description": "Makan siang di resto terkenal",
  "idCategory": 1
}
```

**Response Sukses (200 OK):**
```json
{
  "idTransaction": 1,
  "idUser": 1,
  "date": "2025-12-11T00:00:00Z",
  "amount": 55000,
  "type": "expense",
  "description": "Makan siang di resto terkenal",
  "idCategory": 1,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 6. Hapus Transaksi

**Endpoint:** `DELETE /api/transactions/:id`

**Deskripsi:** Menghapus transaksi

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID transaksi

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Transaction deleted successfully"
}
```

---

## 💰 Anggaran (Budget)

### 1. Buat Anggaran Baru

**Endpoint:** `POST /api/budgets`

**Deskripsi:** Membuat anggaran pengeluaran untuk periode tertentu

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "idCategory": 1,
  "periodStart": "2025-12-01",
  "periodEnd": "2025-12-31",
  "amount": 1000000
}
```

**Parameter Validasi:**
- `idCategory` (number, optional): ID kategori untuk membatasi budget
- `periodStart` (string, required): Tanggal awal periode (ISO format)
- `periodEnd` (string, required): Tanggal akhir periode (ISO format)
- `amount` (number, required): Jumlah anggaran

**Response Sukses (201 Created):**
```json
{
  "idBudget": 1,
  "idUser": 1,
  "idCategory": 1,
  "periodStart": "2025-12-01T00:00:00Z",
  "periodEnd": "2025-12-31T23:59:59Z",
  "amount": 1000000,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 2. Ambil Semua Anggaran Pengguna

**Endpoint:** `GET /api/budgets`

**Deskripsi:** Mendapatkan daftar semua anggaran pengguna

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idBudget": 1,
    "idUser": 1,
    "idCategory": 1,
    "periodStart": "2025-12-01T00:00:00Z",
    "periodEnd": "2025-12-31T23:59:59Z",
    "amount": 1000000,
    "createdAt": "2025-12-11T10:00:00Z"
  }
]
```

---

### 3. Ambil Anggaran Berdasarkan ID

**Endpoint:** `GET /api/budgets/:id`

**Deskripsi:** Mendapatkan detail anggaran spesifik

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID anggaran

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "idBudget": 1,
  "idUser": 1,
  "idCategory": 1,
  "periodStart": "2025-12-01T00:00:00Z",
  "periodEnd": "2025-12-31T23:59:59Z",
  "amount": 1000000,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 4. Update Anggaran

**Endpoint:** `PUT /api/budgets/:id`

**Deskripsi:** Mengubah data anggaran

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID anggaran

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "idCategory": 1,
  "periodStart": "2025-12-01",
  "periodEnd": "2025-12-31",
  "amount": 1200000
}
```

**Response Sukses (200 OK):**
```json
{
  "idBudget": 1,
  "idUser": 1,
  "idCategory": 1,
  "periodStart": "2025-12-01T00:00:00Z",
  "periodEnd": "2025-12-31T23:59:59Z",
  "amount": 1200000,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 5. Hapus Anggaran

**Endpoint:** `DELETE /api/budgets/:id`

**Deskripsi:** Menghapus anggaran

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID anggaran

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Budget deleted"
}
```

---

### 6. Ambil Penggunaan Anggaran (Usage)

**Endpoint:** `GET /api/budgets/:id/usage`

**Deskripsi:** Mendapatkan total pengeluaran terhadap anggaran yang telah ditetapkan

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID anggaran

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "used": 500000,
  "total": 1000000,
  "percent": 50
}
```

Penjelasan:
- `used`: Total pengeluaran dalam periode anggaran
- `total`: Batas anggaran yang ditetapkan
- `percent`: Persentase penggunaan anggaran (0-100)

Catatan: Jika `used` melebihi `total` (percent > 100), sistem otomatis membuat notifikasi dengan tipe `BUDGET_EXCEEDED` untuk pengguna terkait.

---

### 7. Ambil Ringkasan Goal Anggaran

**Endpoint:** `GET /api/budgets/goals?period=monthly&date=2025-12-01&type=expense&idCategory=1`

**Deskripsi:** Mendapatkan ringkasan anggaran berdasarkan kategori dan periode

**Autentikasi:** **Required** - JWT Bearer Token

**Query Parameters:**
- `period` (string, required): Periode - nilai: `daily`, `weekly`, `monthly`, `year`
- `date` (string, required): Tanggal referensi dalam periode (ISO format: YYYY-MM-DD)
- `type` (string, optional): Tipe transaksi - nilai: `expense`, `income`, `both` (default: `expense`)
- `idCategory` (number, optional): Filter berdasarkan kategori spesifik

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "categoryId": 1,
    "categoryName": "Makanan",
    "budgetAmount": 1000000,
    "spentAmount": 500000,
    "remaining": 500000,
    "percentage": 50
  },
  {
    "categoryId": 2,
    "categoryName": "Transport",
    "budgetAmount": 500000,
    "spentAmount": 300000,
    "remaining": 200000,
    "percentage": 60
  }
]
```

---

## 🔔 Notifikasi

Notifikasi akan dibuat otomatis oleh backend. Salah satunya adalah kondisi **over budget**:
- Saat pemanggilan `GET /api/budgets/:id/usage` mendeteksi `used > total`, sistem membuat notifikasi baru dengan `type: "BUDGET_EXCEEDED"` dan pesan berisi ringkasan anggaran yang terlampaui.
- Notifikasi ini muncul di daftar `/api/notifications` dan dapat ditandai dibaca via endpoint PATCH yang sudah ada.

### 1. Ambil Semua Notifikasi Pengguna

**Endpoint:** `GET /api/notifications`

**Deskripsi:** Mendapatkan daftar semua notifikasi pengguna

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idNotification": 1,
    "idUser": 1,
    "type": "TRANSACTION_CREATED",
    "message": "Transaksi baru sebesar Rp50.000 telah dibuat",
    "read": false,
    "createdAt": "2025-12-11T10:00:00Z"
  },
  {
    "idNotification": 2,
    "idUser": 1,
    "type": "BUDGET_WARNING",
    "message": "Budget makanan sudah mencapai 80% dari batas yang ditetapkan",
    "read": false,
    "createdAt": "2025-12-11T09:00:00Z"
  }
]
```

---

### 2. Ambil Notifikasi yang Belum Dibaca

**Endpoint:** `GET /api/notifications/unread`

**Deskripsi:** Mendapatkan daftar notifikasi yang belum dibaca

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
[
  {
    "idNotification": 1,
    "idUser": 1,
    "type": "TRANSACTION_CREATED",
    "message": "Transaksi baru sebesar Rp50.000 telah dibuat",
    "read": false,
    "createdAt": "2025-12-11T10:00:00Z"
  }
]
```

---

### 3. Hitung Notifikasi Belum Dibaca

**Endpoint:** `GET /api/notifications/unread/count`

**Deskripsi:** Mendapatkan jumlah notifikasi yang belum dibaca

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "count": 5
}
```

---

### 4. Tandai Notifikasi sebagai Dibaca

**Endpoint:** `PATCH /api/notifications/:id/read`

**Deskripsi:** Menandai notifikasi tertentu sebagai sudah dibaca

**Autentikasi:** **Required** - JWT Bearer Token

**Path Parameters:**
- `id` (number, required): ID notifikasi

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Notifikasi telah ditandai sebagai dibaca"
}
```

---

### 5. Tandai Semua Notifikasi sebagai Dibaca

**Endpoint:** `PATCH /api/notifications/read-all`

**Deskripsi:** Menandai semua notifikasi pengguna sebagai sudah dibaca

**Autentikasi:** **Required** - JWT Bearer Token

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Response Sukses (200 OK):**
```json
{
  "message": "Semua notifikasi telah ditandai sebagai dibaca"
}
```

---

## 📝 Tipe Notifikasi

Sistem notifikasi mendukung tipe-tipe berikut:

| Tipe | Deskripsi |
|------|-----------|
| `TRANSACTION_CREATED` | Transaksi baru telah dibuat |
| `TRANSACTION_DELETED` | Transaksi telah dihapus |
| `BUDGET_CREATED` | Anggaran baru telah dibuat |
| `BUDGET_DELETED` | Anggaran telah dihapus |
| `BUDGET_EXCEEDED` | Pengeluaran melebihi batas anggaran |
| `BUDGET_WARNING` | Pengeluaran sudah mencapai 80% dari batas anggaran |
| `PASSWORD_RESET` | Password telah berhasil diubah |

---

## 🔐 Autentikasi JWT

### Bearer Token Format

Semua endpoint yang memerlukan autentikasi menggunakan **JWT Bearer Token**.

Format header:
```
Authorization: Bearer <accessToken>
```

Contoh:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiamRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzU0NzIwMCwiZXhwIjoxNzA3NjMzNjAwfQ.abc123...
```

### Token Lifespan

- **Access Token**: 24 jam
- **Refresh Token**: 7 hari

---

## ⚠️ Error Handling

Semua error response mengikuti format berikut:

```json
{
  "statusCode": 400,
  "message": "Deskripsi error",
  "error": "Bad Request"
}
```

### Status Code Umum

| Code | Arti |
|------|------|
| `200` | OK - Permintaan berhasil |
| `201` | Created - Resource berhasil dibuat |
| `400` | Bad Request - Data tidak valid |
| `401` | Unauthorized - Token tidak valid atau expired |
| `403` | Forbidden - Akses ditolak |
| `404` | Not Found - Resource tidak ditemukan |
| `409` | Conflict - Data sudah ada (contoh: email duplikat) |
| `500` | Internal Server Error - Kesalahan server |

---

## 📚 Contoh Penggunaan dengan cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Buat Transaksi
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-11",
    "amount": 50000,
    "type": "expense",
    "description": "Makan siang",
    "idCategory": 1
  }'
```

### Ambil Profil
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔄 Rate Limiting

Saat ini, sistem tidak memiliki rate limiting. Implementasi rate limiting akan ditambahkan pada versi mendatang.

---

## 📞 Support

Untuk pertanyaan atau laporan bug, silakan hubungi tim development.

**Terakhir diperbarui:** 11 Desember 2025
