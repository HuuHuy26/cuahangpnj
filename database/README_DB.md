# 💎 HƯỚNG DẪN SỬ DỤNG BỘ CƠ SỞ DỮ LIỆU CỬA HÀNG TRANG SỨC 3AE JEWELRY

Bộ dữ liệu cơ sở dữ liệu (Database) hoàn chỉnh của thương hiệu **3AE Diamond & Fine Jewelry (Lumière Jewelry)** được chuẩn hóa phục vụ cả lưu trữ **NoSQL (MongoDB / JSON)** và **Relational SQL (MySQL / MariaDB / SQLite / phpMyAdmin)**.

---

## 📁 Danh Sách Các File Trong Thư Mục `database/`

| Tên file | Kích thước | Định dạng | Mô tả chi tiết nội dung |
| :--- | :--- | :--- | :--- |
| **`db.json`** | ~46 KB | JSON | **File CSDL tổng hợp hợp nhất** chứa toàn bộ dữ liệu cửa hàng: thông tin thương hiệu, showroom, danh mục, 20 sản phẩm kim cương 4C, người dùng, đơn hàng, voucher, review, banner. |
| **`stores.json`** | ~3 KB | JSON | Danh sách hệ thống Showroom cửa hàng (Flagship Hà Đông, Keangnam Landmark 72, Vinhomes Golden River TP.HCM). |
| **`products.json`** | ~28 KB | JSON | 20 sản phẩm trang sức kim cương tự nhiên cao cấp với đầy đủ thông số 4C: Carat, Color, Clarity, Cut, kiểm định GIA/IGI, vàng 18K/Platinum. |
| **`categories.json`** | ~2.4 KB | JSON | 6 danh mục trang sức (Kim cương viên, Nhẫn nữ, Trang sức cưới, Dây chuyền, Bông tai, Vòng tay). |
| **`users.json`** | ~1.2 KB | JSON | Danh sách tài khoản người dùng (1 Quản trị viên Admin và 2 Khách hàng VIP). |
| **`orders.json`** | ~3.7 KB | JSON | Đơn hàng mẫu với thông tin chi tiết: người nhận, thuế VAT 10%, mã giảm giá, phương thức thanh toán và timeline vận chuyển. |
| **`coupons.json`** | ~0.8 KB | JSON | Các mã khuyến mãi voucher (3AE2026, DIAMOND5M, WEDDINGVIP). |
| **`reviews.json`** | ~1.5 KB | JSON | Các đánh giá của khách hàng đã mua sản phẩm và kiểm định. |
| **`banners.json`** | ~1.3 KB | JSON | Các banner hình ảnh chất lượng cao trên trang chủ. |
| **`lumiere_jewelry.sql`** | ~48 KB | SQL Script | File SQL chuẩn gồm lệnh `CREATE TABLE` (8 bảng chính) và lệnh `INSERT INTO` chứa đầy đủ dữ liệu mẫu. |

---

## 🚀 3 Cách Sử Dụng Bộ File Database

### Cách 1: Nạp Tự Động Vào MongoDB Bằng Lệnh `npm run seed` (Khuyên dùng)
Nếu máy bạn đang chạy dịch vụ **MongoDB** hoặc **MongoDB Compass**:
```bash
npm run seed
```
Lệnh sẽ tự động kết nối tới `mongodb://127.0.0.1:27017/lumiere_jewelry` và nạp toàn bộ các collection vào database `lumiere_jewelry`.

---

### Cách 2: Import Bằng Tay Vào MongoDB Compass
1. Mở phần mềm **MongoDB Compass**, nhấn **Connect** vào `mongodb://127.0.0.1:27017`.
2. Tạo mới hoặc chọn Database tên: `lumiere_jewelry`.
3. Tạo các Collection tương ứng:
   - `stores`
   - `products`
   - `categories`
   - `users`
   - `orders`
   - `coupons`
   - `reviews`
   - `banners`
4. Trong mỗi Collection, nhấn nút **Add Data** -> Chọn **Import JSON or CSV file** -> Chọn file `.json` tương ứng trong thư mục `database/` này -> Nhấn **Import**.

---

### Cách 3: Import Vào MySQL / MariaDB / phpMyAdmin / SQLite
1. Mở **phpMyAdmin** (XAMPP/WAMP) hoặc **MySQL Workbench**, **DBeaver**.
2. Chọn tab **Import** (Nhập).
3. Chọn file `database/lumiere_jewelry.sql`.
4. Nhấn **Go** / **Thực hiện**. Toàn bộ cơ sở dữ liệu `lumiere_jewelry` và các bảng dữ liệu liên kết sẽ được khởi tạo tự động.

---

## 🔐 Thông Tin Tài Khoản Mặc Định Trong DB

| Vai trò | Email đăng nhập | Số điện thoại | Mật khẩu mặc định |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@3ae.vn` | 0901234567 | `Admin@123` |
| **Khách hàng VIP 1** | `linh.nguyen@gmail.com` | 0988776655 | `Customer@123` |
| **Khách hàng VIP 2** | `khachhang@gmail.com` | 0912345678 | `Customer@123` |

---

## 🏬 Thông Tin Hệ Thống Showroom Cửa Hàng

- **Showroom Flagship Hà Đông**: Tòa nhà Diamond Tower, 47 - 48 TT16, Khu đô thị Văn Phú, Hà Đông, Hà Nội (Hotline: 0868 895 658)
- **Showroom Landmark 72**: Tầng 1, Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội (Hotline: 0868 895 658)
- **Showroom TP. Hồ Chí Minh**: Tòa Aqua 1, Vinhomes Golden River, Quận 1, TP. HCM (Hotline: 1800 5454 57)
