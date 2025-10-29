# Authentication API - Backend Keuangan

## ✅ Fitur yang Sudah Dibuat

### 1. **Register** (`POST /api/auth/register`)
- Validasi email format
- Validasi password (min 6 karakter, harus ada huruf kecil + angka/special char)
- Hash password dengan bcrypt
- Generate access token & refresh token
- Return user data (tanpa password)

### 2. **Login** (`POST /api/auth/login`)
- Validasi credentials
- Compare password dengan bcrypt
- Generate access token & refresh token
- Return user data

### 3. **Refresh Token** (`POST /api/auth/refresh`)
- Validasi refresh token
- Generate access token & refresh token baru
- Expired handling

### 4. **Get Profile** (`GET /api/auth/profile`) 🔒
- Protected route (butuh access token)
- Return current user data

### 5. **Logout** (`POST /api/auth/logout`) 🔒
- Protected route
- Client-side token removal

---

## 📁 Struktur Project

```
src/
├── app.module.ts                    # Root module
├── main.ts                          # Bootstrap aplikasi
│
├── prisma/
│   ├── prisma.module.ts            # Prisma module (Global)
│   └── prisma.service.ts           # Prisma service (DB connection)
│
├── users/
│   ├── users.module.ts             # Users module
│   ├── users.service.ts            # Users business logic
│   └── users.controller.ts         # Users endpoints
│
└── auth/
    ├── auth.module.ts              # Auth module dengan JWT config
    ├── auth.service.ts             # Auth business logic
    ├── auth.controller.ts          # Auth endpoints
    ├── jwt.strategy.ts             # JWT validation strategy
    │
    ├── dto/
    │   └── auth.dto.ts             # Register, Login, RefreshToken DTOs
    │
    ├── guards/
    │   └── jwt-auth.guard.ts       # JWT Guard (global)
    │
    └── decorators/
        ├── public.decorator.ts     # @Public() untuk bypass JWT
        └── current-user.decorator.ts  # @CurrentUser() untuk get user
```

---

## 🔐 Security Features

### Password Security
- ✅ Bcrypt hashing (salt rounds: 10)
- ✅ Password validation (min length, complexity)
- ✅ Password tidak pernah di-return ke client

### Token Security
- ✅ Access Token (15 menit) - untuk API calls
- ✅ Refresh Token (7 hari) - untuk renew access token
- ✅ JWT dengan secret key dari environment variable
- ✅ Token expiration handling

### Route Protection
- ✅ Global JWT Guard - semua routes protected by default
- ✅ @Public() decorator - untuk routes yang tidak butuh auth
- ✅ User validation pada setiap request

---

## 🔧 Best Practices yang Diterapkan

### 1. **Separation of Concerns**
```
Controller → Service → Repository (Prisma)
```

### 2. **DTO Validation**
- Input validation dengan `class-validator`
- Transform data dengan `class-transformer`
- Custom validation messages

### 3. **Error Handling**
- Proper HTTP status codes
- Descriptive error messages
- No sensitive data in errors

### 4. **Security**
- Environment variables untuk secrets
- Password hashing
- JWT dengan expiration
- Protected routes by default

### 5. **Code Organization**
- Module-based architecture
- Global modules (@Global decorator)
- Reusable decorators & guards

---

## 🌐 Environment Variables

```env
# App
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
```

**⚠️ PENTING:** Ganti `JWT_SECRET` dan `JWT_REFRESH_SECRET` di production!

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

### 3. Setup Environment Variables
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan sesuaikan konfigurasi
```

### 4. Run Development Server
```bash
pnpm start:dev
```

Server berjalan di: **http://localhost:3000**

---

## 🧪 Testing API

### Cara 1: Menggunakan file `api.http`
1. Install extension "REST Client" di VS Code
2. Buka file `api.http`
3. Klik "Send Request" di atas setiap endpoint

### Cara 2: Menggunakan cURL
Lihat file `API_TESTING.md` untuk contoh cURL commands

### Cara 3: Menggunakan Postman/Thunder Client
Import endpoints dari `API_TESTING.md`

---

## 📊 Database Schema

### User Table
```prisma
model User {
  idUser        Int             @id @default(autoincrement())
  email         String          @unique
  password      String          # bcrypt hash
  name          String?
  createdAt     DateTime        @default(now())
  
  # Relations
  Budget        Budget[]
  Notification  Notification[]
  ReportService ReportService[]
  Transaction   Transaction[]
}
```

---

## 📝 API Endpoints

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/auth/register` | ❌ | Register user baru |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| GET | `/api/auth/profile` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout user |

---

## 🔄 Token Flow

```
1. Register/Login
   └─> Server returns: { accessToken, refreshToken, user }

2. API Calls
   └─> Client sends: Authorization: Bearer <accessToken>
   └─> Server validates & returns data

3. Access Token Expired (15 min)
   └─> Client sends refreshToken to /auth/refresh
   └─> Server returns: new { accessToken, refreshToken }

4. Refresh Token Expired (7 days)
   └─> Client redirects to login
```

---

## 🎯 Next Steps

### Fitur yang Bisa Ditambahkan:
1. ✅ **Email Verification** - kirim email verifikasi saat register
2. ✅ **Forgot Password** - reset password via email
3. ✅ **Change Password** - user bisa ganti password
4. ✅ **Token Blacklist** - implementasi Redis untuk blacklist token
5. ✅ **Rate Limiting** - limit request untuk prevent brute force
6. ✅ **2FA (Two-Factor Auth)** - keamanan tambahan
7. ✅ **OAuth** - login dengan Google/Facebook
8. ✅ **User Roles** - admin, user, dll
9. ✅ **Audit Log** - track user activities

---

## 📚 Dependencies

### Production
- `@nestjs/common` - NestJS core
- `@nestjs/core` - NestJS core
- `@nestjs/jwt` - JWT handling
- `@nestjs/passport` - Authentication
- `@nestjs/config` - Environment config
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing
- `passport-jwt` - JWT strategy
- `class-validator` - Input validation
- `class-transformer` - DTO transformation

### Development
- `@types/bcrypt` - TypeScript types
- `@types/passport-jwt` - TypeScript types
- `prisma` - Prisma CLI

---

## 💡 Tips

### 1. Testing dengan Thunder Client
```
1. Install Thunder Client extension
2. Create new request
3. Set method & URL
4. Add headers: Authorization: Bearer <token>
5. Send request
```

### 2. Debug Tips
```typescript
// Log user di controller
@Get('profile')
getProfile(@Request() req: any) {
  console.log('Current user:', req.user);
  return { user: req.user };
}
```

### 3. Custom Decorators Usage
```typescript
// Gunakan @CurrentUser() untuk get user
@Get('me')
getMe(@CurrentUser() user: any) {
  return user;
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
pnpm prisma generate
```

### Error: "Unauthorized" di protected routes
- Pastikan token ada di header: `Authorization: Bearer <token>`
- Pastikan token belum expired
- Pastikan JWT_SECRET sama dengan saat generate token

### Error: Database connection
- Pastikan PostgreSQL running
- Cek DATABASE_URL di .env
- Test connection: `pnpm prisma studio`

---

## ✅ Checklist Deployment

- [ ] Ganti `JWT_SECRET` di production
- [ ] Ganti `JWT_REFRESH_SECRET` di production  
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Enable CORS dengan specific origins
- [ ] Setup logging (production-ready logger)
- [ ] Database backup strategy
- [ ] Health check endpoint
- [ ] Error monitoring (Sentry, etc)

---

**Status:** ✅ Ready for testing!
**Server:** http://localhost:3000
**API Prefix:** `/api`
