# 📱 Shopping App - Ứng dụng Quản lý Bán hàng

Xây dựng ứng dụng **Android (React Native / Expo)** quản lý bán hàng cho phép người dùng đăng nhập, xem sản phẩm, xem danh mục, xem chi tiết sản phẩm, và tạo hóa đơn.

> **Lưu ý:** Dữ liệu lưu bằng **Room Database** (tương đương SQLite/local DB), trạng thái đăng nhập lưu bằng **SharedPreferences** (tương đương AsyncStorage trong React Native).

---

## 🔧 Tech Stack

| Layer | Công nghệ |
|-------|----------|
| Mobile | React Native (Expo 52), TypeScript |
| State Management | Zustand 5 |
| Navigation | React Navigation 7 (Native Stack + Bottom Tabs) |
| Local Storage | AsyncStorage (thay SharedPreferences) |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL 16 (Docker) |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| API Client | Axios |

---

## 🚀 Hướng dẫn chạy dự án

### Yêu cầu

- Node.js >= 18
- Docker & Docker Compose
- Expo CLI (`npx expo`)

### 1. Khởi động Database

```bash
docker-compose up -d
```

### 2. Chạy Backend

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Backend sẽ chạy tại `http://localhost:3000`

### 3. Chạy Mobile App

```bash
cd mobile
npm install
npx expo start
```

---

## 📊 Database Schema (5 bảng)

### Bảng Users

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | PK, auto increment |
| username | VARCHAR | Unique |
| password | VARCHAR | Hashed |
| fullName | VARCHAR | |
| email | VARCHAR | |

### Bảng Categories

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | PK, auto increment |
| name | VARCHAR | |
| description | TEXT | |
| image | VARCHAR | URL ảnh |

### Bảng Products

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | PK, auto increment |
| name | VARCHAR | |
| description | TEXT | |
| price | FLOAT | |
| image | VARCHAR | URL ảnh |
| categoryId | INT | FK → Categories |
| stock | INT | Số lượng tồn kho |

### Bảng Orders

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | PK, auto increment |
| userId | INT | FK → Users |
| createdAt | DATETIME | |
| status | VARCHAR | `Pending` hoặc `Paid` |
| totalAmount | FLOAT | |

### Bảng OrderDetails

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | PK, auto increment |
| orderId | INT | FK → Orders |
| productId | INT | FK → Products |
| quantity | INT | |
| unitPrice | FLOAT | Giá tại thời điểm mua |
| subtotal | FLOAT | quantity × unitPrice |

### Quan hệ giữa các bảng

```
Users ──1:N──> Orders ──1:N──> OrderDetails <──N:1── Products <──N:1── Categories
```

---

## 🔄 Luồng hoạt động của ứng dụng

```
Start App
   │
   ▼
Home Screen
   │
   ├── Login
   ├── Xem danh sách Products
   ├── Xem Categories
   └── Xem chi tiết Product
            │
            ▼
        Chọn sản phẩm (Nhặt hàng)
            │
            ▼
    Kiểm tra đăng nhập?
        │
   ┌────┴────┐
   │         │
  No        Yes
   │         │
   ▼         ▼
Login     Tạo Order (nếu chưa có)
   │         │
   ▼         ▼
Login thành công
   │
   ▼
Tạo Order (nếu chưa có)
   │
   ▼
Tạo OrderDetails (thêm sản phẩm đã chọn)
   │
   ▼
Có tiếp tục chọn sản phẩm?
   │
   ├── Yes → quay lại danh sách Products
   │
   └── No
          │
          ▼
      Thanh toán (Checkout)
          │
          ▼
   Cập nhật trạng thái Order (Paid)
          │
          ▼
   Hiển thị hóa đơn
```

---

## 📦 Các Module

### Module 1: 🔐 Authentication (Đăng nhập)
- **Backend**: API login (`POST /api/auth/login`), register, JWT token
- **Mobile**: Login Screen, Logout, lưu token bằng AsyncStorage
- **Zustand store**: auth state (user, token, isLoggedIn)
- **Middleware**: auth guard cho các route cần đăng nhập

### Module 2: 📂 Categories (Danh mục sản phẩm)
- **Backend**: CRUD Categories (`GET /api/categories`, `POST`, `PUT`, `DELETE`)
- **Mobile**: Categories List Screen, Category Detail Screen
- **Zustand store**: categories state
- **Seed data**: Thêm dữ liệu mẫu (Điện thoại, Laptop, Tablet, Phụ kiện...)

### Module 3: 🛍️ Products (Sản phẩm)
- **Backend**: CRUD Products (`GET /api/products`, query by category, search, detail)
- **Mobile**: Product List Screen, Product Detail Screen, filter theo category
- **Zustand store**: products state
- **Seed data**: Thêm dữ liệu mẫu sản phẩm

### Module 4: 🛒 Orders & Checkout (Đơn hàng & Thanh toán)
- **Backend**: Create Order, Add OrderDetails, Checkout, Order History
- **Mobile**: Cart Screen, Checkout Screen, Order History Screen, Invoice Screen
- **Zustand store**: cart/order state
- **Logic**: Kiểm tra đăng nhập trước khi tạo đơn hàng

---

## 👥 Phân công nhóm (4 người)

### 🧑‍💻 Người 1 — Authentication & User Management

| Task | Chi tiết | Ưu tiên |
|------|---------|---------|
| Backend: Auth API | `POST /api/auth/login`, `POST /api/auth/register`, JWT middleware | 🔴 High |
| Backend: User model | Cập nhật User model thêm fields (password hash, email) | 🔴 High |
| Mobile: Login Screen | UI login, xử lý form validation, gọi API | 🔴 High |
| Mobile: Register Screen | UI đăng ký tài khoản | 🟡 Medium |
| Mobile: Auth Store (Zustand) | `useAuthStore` — lưu user, token, isLoggedIn | 🔴 High |
| Mobile: AsyncStorage | Lưu/đọc token đăng nhập, auto-login khi mở app | 🔴 High |
| Mobile: Auth Guard | HOC/hook kiểm tra đăng nhập, redirect tới Login | 🟡 Medium |
| Backend: Auth middleware | Verify JWT token cho protected routes | 🔴 High |

**Deliverables:**
- ✅ User có thể đăng ký, đăng nhập, đăng xuất
- ✅ Token được lưu và tự động login
- ✅ Protected routes hoạt động

---

### 🧑‍💻 Người 2 — Categories & Navigation

| Task | Chi tiết | Ưu tiên |
|------|---------|---------|
| Backend: Category model | Tạo model, migration cho bảng Categories | 🔴 High |
| Backend: Category API | `GET /api/categories`, `GET /api/categories/:id`, `POST`, `PUT`, `DELETE` | 🔴 High |
| Backend: Seed data Categories | Insert dữ liệu mẫu categories | 🟡 Medium |
| Mobile: Categories List Screen | UI hiển thị danh sách danh mục (grid/list) | 🔴 High |
| Mobile: Category Store (Zustand) | `useCategoryStore` — fetch, cache categories | 🔴 High |
| Mobile: Navigation Setup | Cấu hình React Navigation: Tab Navigator + Stack Navigator | 🔴 High |
| Mobile: Home Screen | Redesign Home Screen — hiện categories + featured products | 🟡 Medium |
| Mobile: Bottom Tab Bar | Tab navigation: Home, Categories, Cart, Profile | 🟡 Medium |

**Deliverables:**
- ✅ CRUD Categories hoạt động
- ✅ Navigation hoàn chỉnh với Tab + Stack
- ✅ Home Screen hiển thị categories

---

### 🧑‍💻 Người 3 — Products

| Task | Chi tiết | Ưu tiên |
|------|---------|---------|
| Backend: Product model | Tạo model, migration cho bảng Products (FK → Categories) | 🔴 High |
| Backend: Product API | `GET /api/products`, `GET /api/products/:id`, filter by categoryId, search | 🔴 High |
| Backend: Seed data Products | Insert dữ liệu mẫu 15-20 sản phẩm | 🟡 Medium |
| Mobile: Product List Screen | UI hiển thị danh sách sản phẩm (card layout), filter, search | 🔴 High |
| Mobile: Product Detail Screen | Hiển thị chi tiết: ảnh, tên, giá, mô tả, nút "Thêm vào giỏ" | 🔴 High |
| Mobile: Product Store (Zustand) | `useProductStore` — fetch, filter, search | 🔴 High |
| Mobile: Products by Category | Nhấn vào 1 category → hiện danh sách products thuộc category đó | 🟡 Medium |
| Mobile: Search functionality | Thanh tìm kiếm sản phẩm theo tên | 🟡 Medium |

**Deliverables:**
- ✅ CRUD Products hoạt động
- ✅ Xem danh sách, chi tiết, filter theo category
- ✅ Tìm kiếm sản phẩm

---

### 🧑‍💻 Người 4 — Orders, Cart & Checkout

| Task | Chi tiết | Ưu tiên |
|------|---------|---------|
| Backend: Order model | Tạo model, migration cho bảng Orders (FK → Users) | 🔴 High |
| Backend: OrderDetail model | Tạo model, migration cho bảng OrderDetails (FK → Orders, Products) | 🔴 High |
| Backend: Order API | `POST /api/orders` (create), `GET /api/orders` (user's orders), `PUT /api/orders/:id/checkout` | 🔴 High |
| Backend: OrderDetail API | `POST /api/orders/:id/items` (add item), `DELETE`, `GET` | 🔴 High |
| Mobile: Cart Screen | Hiển thị giỏ hàng, thay đổi số lượng, xóa sản phẩm | 🔴 High |
| Mobile: Checkout Screen | Xác nhận đơn hàng, thanh toán | 🔴 High |
| Mobile: Invoice/Receipt Screen | Hiển thị hóa đơn sau thanh toán | 🟡 Medium |
| Mobile: Order History Screen | Xem lịch sử đơn hàng đã thanh toán | 🟡 Medium |
| Mobile: Cart Store (Zustand) | `useCartStore` — add, remove, update quantity, checkout | 🔴 High |
| Mobile: Auth check trước order | Kiểm tra đăng nhập trước khi cho thêm vào giỏ/checkout | 🔴 High |

**Deliverables:**
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Thanh toán và tạo hóa đơn
- ✅ Xem lịch sử đơn hàng

---

## ⚠️ Dependency giữa các Module

```
Module 1 (Auth) ────────────────────────> Module 4 (Orders)
                                              ▲
Module 2 (Categories) ──> Module 3 (Products) ┘

Module 1 (Auth) ···Auth Guard···> Module 3 (Products)
```

> **Lưu ý:** **Người 4 (Orders)** phụ thuộc vào **Người 1 (Auth)** và **Người 3 (Products)**. Nên bắt đầu với backend models/API trước, dùng mock data cho mobile trong khi chờ.

---

## 📅 Timeline gợi ý

| Giai đoạn | Thời gian | Nội dung |
|-----------|-----------|----------|
| **Sprint 1** | Ngày 1-3 | Backend: Tạo models, migrations, seed data cho tất cả bảng |
| **Sprint 2** | Ngày 3-5 | Backend: Hoàn thành tất cả API endpoints |
| **Sprint 3** | Ngày 4-7 | Mobile: Xây dựng UI screens, stores, navigation |
| **Sprint 4** | Ngày 7-9 | Mobile: Kết nối API, xử lý luồng nghiệp vụ |
| **Sprint 5** | Ngày 9-11 | Testing, fix bugs, polish UI |

---

## 📁 Cấu trúc thư mục

```
MiniProj/
├── backend/
│   └── src/
│       ├── config/         # DB config, migrate
│       ├── controllers/    # auth, category, product, order controllers
│       ├── middleware/      # errorHandler, validation, auth (JWT)
│       ├── models/         # user, category, product, order, orderDetail models
│       ├── routes/         # auth, category, product, order routes
│       ├── seeds/          # seed data
│       ├── types/          # TypeScript types
│       └── index.ts        # Entry point
├── mobile/
│   └── src/
│       ├── components/     # Shared components (ProductCard, CategoryCard, etc.)
│       ├── hooks/          # Custom hooks
│       ├── navigation/     # RootNavigator, TabNavigator, stacks
│       ├── screens/        # Login, Home, Categories, Products, Cart, Checkout...
│       ├── services/       # API service layer
│       ├── stores/         # Zustand stores (auth, category, product, cart)
│       ├── types/          # TypeScript types/interfaces
│       └── utils/          # Helpers, constants
└── docker-compose.yml
```

---

## 🌿 Git Workflow

Mỗi người tạo **branch riêng**:

```bash
git checkout -b feature/auth          # Người 1
git checkout -b feature/categories    # Người 2
git checkout -b feature/products      # Người 3
git checkout -b feature/orders        # Người 4
```

Merge vào `develop` khi hoàn thành. Tạo PR để review trước khi merge.

---

## ✅ Definition of Done

1. ✅ Backend API hoạt động, test bằng Postman/Thunder Client
2. ✅ Mobile screens hiển thị đúng dữ liệu từ API
3. ✅ Zustand stores quản lý state chính xác
4. ✅ Luồng: Login → Xem sản phẩm → Thêm giỏ hàng → Checkout → Hóa đơn hoạt động
5. ✅ Seed data có sẵn để demo
6. ✅ Code clean, có TypeScript types

---

## 📝 API Endpoints tổng hợp

### Auth
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |

### Categories
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/categories` | Lấy tất cả danh mục | ❌ |
| GET | `/api/categories/:id` | Lấy chi tiết danh mục | ❌ |
| POST | `/api/categories` | Tạo danh mục mới | ✅ |
| PUT | `/api/categories/:id` | Cập nhật danh mục | ✅ |
| DELETE | `/api/categories/:id` | Xóa danh mục | ✅ |

### Products
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/products` | Lấy tất cả sản phẩm (hỗ trợ `?categoryId=`, `?search=`) | ❌ |
| GET | `/api/products/:id` | Lấy chi tiết sản phẩm | ❌ |
| POST | `/api/products` | Tạo sản phẩm mới | ✅ |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | ✅ |
| DELETE | `/api/products/:id` | Xóa sản phẩm | ✅ |

### Orders
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/orders` | Tạo đơn hàng mới | ✅ |
| GET | `/api/orders` | Lấy đơn hàng của user hiện tại | ✅ |
| GET | `/api/orders/:id` | Lấy chi tiết đơn hàng | ✅ |
| PUT | `/api/orders/:id/checkout` | Thanh toán đơn hàng | ✅ |
| POST | `/api/orders/:id/items` | Thêm sản phẩm vào đơn hàng | ✅ |
| DELETE | `/api/orders/:id/items/:itemId` | Xóa sản phẩm khỏi đơn hàng | ✅ |
