# 🔒 Hướng Dẫn Triển Khai Refresh Token Architecture

## 📋 Tổng Quan

Hệ thống đã được nâng cấp với kiến trúc **Refresh Token an toàn** để bảo vệ khỏi các cuộc tấn công XSS và CSRF.

### Kiến trúc mới:
- ✅ **Access Token** (15 phút) - Lưu trong **memory** (không dùng localStorage)
- ✅ **Refresh Token** (7 ngày) - Lưu trong **httpOnly cookie**
- ✅ **Token Rotation** - Mỗi lần refresh tạo token mới và hủy token cũ
- ✅ **Auto Refresh** - Tự động refresh khi access token hết hạn (401)
- ✅ **Session Restore** - F5 không mất session

---

## 🚀 Cách Triển Khai

### Bước 1: Cấu hình Backend

#### 1.1. Thêm biến môi trường trong `.env`

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key-here
REFRESH_TOKEN_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

> **Lưu ý**: Trong production, đặt `NODE_ENV=production` để bật secure cookies (HTTPS only)

#### 1.2. Chạy migration để tạo bảng refresh_tokens

```bash
cd backend
npx sequelize-cli db:migrate
```

Migration sẽ tạo bảng:
```sql
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### Bước 2: Cài đặt dependencies (nếu cần)

Backend:
```bash
cd backend
npm install jsonwebtoken bcryptjs
```

Frontend:
```bash
cd frontend
npm install axios
```

---

### Bước 3: Test Flow

#### 3.1. Login
```javascript
POST http://localhost:3000/api/auth/login
Body: { "email": "admin@example.com", "password": "password123" }

Response:
{
  "accessToken": "eyJhbGc...",
  "user": { "id": 1, "email": "admin@example.com", "role": "admin" }
}

Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth
```

#### 3.2. Access Protected Route
```javascript
GET http://localhost:3000/api/some-protected-route
Headers: { "Authorization": "Bearer eyJhbGc..." }
```

#### 3.3. Auto Refresh (khi access token hết hạn)
```javascript
// Frontend tự động gọi khi nhận 401
POST http://localhost:3000/api/auth/refresh
(Cookie tự động gửi)

Response:
{
  "accessToken": "eyJhbGc..." (mới)
}

Cookie: refreshToken=eyJhbGc... (mới); HttpOnly; ...
```

#### 3.4. Logout
```javascript
POST http://localhost:3000/api/auth/logout
(Cookie tự động gửi)

Response: 204 No Content
Cookie: refreshToken đã bị xóa
```

---

## 🔐 Bảo Mật

### So sánh với hệ thống cũ:

| Đặc điểm | Hệ thống cũ (localStorage) | Hệ thống mới (httpOnly + memory) |
|----------|---------------------------|-----------------------------------|
| **XSS Protection** | ❌ Token có thể bị đánh cắp qua script | ✅ httpOnly cookie không thể đọc từ JS |
| **Token Lifetime** | 2 giờ (rủi ro nếu bị đánh cắp) | 15 phút (giới hạn thiệt hại) |
| **Token Rotation** | ❌ Không có | ✅ Token mới mỗi lần refresh |
| **Revocation** | ❌ Không thể thu hồi token | ✅ Có thể xóa khỏi DB |
| **CSRF Protection** | ❌ Dễ bị tấn công | ✅ SameSite=Strict |

### Các lớp bảo vệ:

1. **XSS** → httpOnly cookies không thể đọc từ JavaScript
2. **CSRF** → SameSite=Strict + Origin checking
3. **Replay Attack** → Token rotation (mỗi token chỉ dùng 1 lần)
4. **Token Theft** → Short-lived access token (15 phút)
5. **Database Breach** → Refresh tokens có thể revoke ngay lập tức

---

## 📊 Flow Diagram

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│         │   1. Login     │         │                │         │
│ Client  │───────────────>│ Backend │                │   DB    │
│         │                │         │                │         │
│         │<───────────────│         │                │         │
│         │   2. Response  │         │                │         │
│         │   - accessToken│         │                │         │
│         │   - cookie     │         │                │         │
│         │     (refresh)  │         │                │         │
└─────────┘                └─────────┘                └─────────┘
     │                                                       │
     │ 3. Save access token in MEMORY                       │
     │    (NOT localStorage)                                │
     │                                                       │
     │                          ┌─────────────────────────┐ │
     │                          │ Save refresh token      │ │
     │                          │ to refresh_tokens table │ │
     │                          └─────────────────────────┘ │
     │                                                       │
     │ 4. Request with access token                         │
     │────────────────────────────────────────────────>     │
     │                                                       │
     │ 5. Access token expired (401)                        │
     │<────────────────────────────────────────────────     │
     │                                                       │
     │ 6. Auto refresh (cookie sent)                        │
     │────────────────────────────────────────────────>     │
     │                          ┌─────────────────────────┐ │
     │                          │ Verify refresh token    │◄┤
     │                          │ Delete old token        │ │
     │                          │ Create new tokens       │►│
     │                          └─────────────────────────┘ │
     │ 7. New access token + new cookie                     │
     │<────────────────────────────────────────────────     │
     │                                                       │
     │ 8. Retry request với new access token                │
     │────────────────────────────────────────────────>     │
     │                                                       │
     │ 9. Success                                            │
     │<────────────────────────────────────────────────     │
     │                                                       │
```

---

## 🧪 Testing Checklist

- [ ] Login thành công và nhận được access token + cookie
- [ ] Cookie có flags: HttpOnly, Secure (production), SameSite=Strict
- [ ] Access protected route với access token
- [ ] Sau 15 phút, access token hết hạn → Auto refresh
- [ ] Mỗi lần refresh, token cũ bị xóa trong DB
- [ ] F5 trang web → Session được restore
- [ ] Logout → Cookie bị xóa và token bị revoke
- [ ] Không thể reuse refresh token đã bị revoke

---

## 🐛 Troubleshooting

### Vấn đề 1: Cookie không được gửi
**Nguyên nhân**: Frontend và Backend khác origin
**Giải pháp**: Đảm bảo `withCredentials: true` trong axios config

### Vấn đề 2: Token rotation không hoạt động
**Nguyên nhân**: Migration chưa chạy
**Giải pháp**: Chạy `npx sequelize-cli db:migrate`

### Vấn đề 3: 401 loop (refresh liên tục)
**Nguyên nhân**: Refresh token hết hạn hoặc không hợp lệ
**Giải pháp**: Xóa cookie và login lại

---

## 📚 Tài Liệu Tham Khảo

- [OWASP - JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)
- [httpOnly Cookie Security](https://owasp.org/www-community/HttpOnly)

---

## ✅ Hoàn Tất

Hệ thống refresh token đã được triển khai đầy đủ với các tính năng:
- ✅ Access token trong memory (anti-XSS)
- ✅ Refresh token trong httpOnly cookie (anti-XSS)
- ✅ Token rotation (anti-replay)
- ✅ Auto refresh on 401
- ✅ Session restore on F5
- ✅ Secure logout với token revocation

**Hệ thống giờ đây an toàn hơn đáng kể so với việc lưu JWT trong localStorage!** 🎉
