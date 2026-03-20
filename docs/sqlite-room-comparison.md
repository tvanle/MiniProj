# So sanh SQLite, Room Database va SharedPreferences

## 1. So sanh SQLite va Room Database

| Tieu chi | SQLite | Room Database |
|----------|--------|---------------|
| **Loai** | Thu vien SQL goc | ORM wrapper tren SQLite |
| **Cach viet** | SQL thu cong (rawQuery, execSQL) | Annotation + DAO interface |
| **Compile-time check** | Khong | Co (kiem tra loi SQL luc compile) |
| **Type safety** | Khong (tra ve Cursor) | Co (tra ve Object truc tiep) |
| **Boilerplate code** | Nhieu (ContentValues, Cursor) | It (Room tu generate) |
| **Migration** | Thu cong hoan toan | Ho tro migration tich hop |
| **LiveData/Flow** | Khong ho tro | Ho tro reactive queries |
| **Hoc** | De hieu, can biet SQL | Can hieu annotation |
| **Performance** | Nhanh (truc tiep) | Tuong duong (wrapper mong) |

### Khi nao dung SQLite?
- Project nho, don gian
- Can kiem soat SQL truc tiep
- Khong can reactive data

### Khi nao dung Room?
- Project lon, phuc tap
- Can type safety va compile-time check
- Can LiveData/Flow de cap nhat UI tu dong
- Muon giam boilerplate code

---

## 2. So sanh Room Database va SharedPreferences

| Tieu chi | Room Database | SharedPreferences |
|----------|---------------|-------------------|
| **Muc dich** | Luu tru du lieu co cau truc (bang, quan he) | Luu tru key-value don gian |
| **Du lieu** | Complex objects, lists, relations | Primitive types (String, int, boolean) |
| **Truy van** | SQL queries, JOIN, WHERE | Chi get/put theo key |
| **Dung luong** | Khong gioi han thuc te | Nho (vai KB - vai MB) |
| **CRUD** | Day du (Create, Read, Update, Delete) | Day du nhung don gian |
| **Quan he** | Ho tro Foreign Key, JOIN | Khong |
| **Use case** | Database chinh cua app | Luu settings, login state, preferences |

### Khi nao dung SharedPreferences?
- Luu trang thai login (isLogin, username)
- Luu cai dat nguoi dung (theme, language)
- Luu du lieu tam (token, last sync time)
- Du lieu nho, khong quan he

### Khi nao dung Room/SQLite?
- Luu danh sach (students, scores, products)
- Du lieu co quan he (Student -> Scores)
- Can truy van phuc tap (JOIN, WHERE, ORDER BY)
- Du lieu lon, can index

---

## 3. Ket hop trong thuc te

```
App
├── Room/SQLite: Luu du lieu chinh (Accounts, Students, Scores)
└── SharedPreferences: Luu trang thai (isLogin, username dang nhap)
```

**Flow Login:**
1. User nhap username/password
2. Kiem tra trong SQLite/Room (Accounts table)
3. Neu dung -> Luu vao SharedPreferences: `isLogin=true, username=xxx`
4. Cac man hinh khac doc SharedPreferences de biet user da login chua
