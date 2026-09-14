-- ==========================================================
-- CƠ SỞ DỮ LIỆU CỬA HÀNG TRANG SỨC & KIM CƯƠNG 3AE JEWELRY
-- Hệ thống: 3AE Diamond & Fine Jewelry (Lumière Jewelry)
-- Ngày tạo: 2026-09-14T05:07:09.003Z
-- Chuẩn tương thích: MySQL / MariaDB / PostgreSQL / SQLite
-- ==========================================================

-- Tạo cơ sở dữ liệu nếu dùng MySQL
CREATE DATABASE IF NOT EXISTS `lumiere_jewelry` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lumiere_jewelry`;

-- Tắt kiểm tra khóa ngoại khi import
SET FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG CHI NHÁNH CỬA HÀNG / SHOWROOMS
DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores` (
  `id` VARCHAR(50) PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) DEFAULT 'Showroom',
  `address` VARCHAR(500) NOT NULL,
  `ward` VARCHAR(100),
  `district` VARCHAR(100),
  `city` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100),
  `opening_hours` VARCHAR(100) DEFAULT '08:30 - 21:30',
  `is_flagship` TINYINT(1) DEFAULT 0,
  `latitude` DECIMAL(10, 6),
  `longitude` DECIMAL(10, 6),
  `services` TEXT,
  `image` VARCHAR(500),
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. BẢNG DANH MỤC TRANG SỨC
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `image` VARCHAR(500),
  `item_count` INT DEFAULT 0,
  `featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BẢNG SẢN PHẨM TRANG SỨC & KIM CƯƠNG
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(50) PRIMARY KEY,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL UNIQUE,
  `category_id` VARCHAR(50) NOT NULL,
  `category_name` VARCHAR(255),
  `description` TEXT,
  `short_description` TEXT,
  `price` BIGINT NOT NULL,
  `sale_price` BIGINT,
  `material` VARCHAR(100),
  `size` VARCHAR(50),
  `diamond_shape` VARCHAR(50),
  `carat` DECIMAL(4, 2),
  `color` VARCHAR(10),
  `clarity` VARCHAR(20),
  `cut` VARCHAR(50),
  `certificate` VARCHAR(50) DEFAULT 'GIA',
  `certificate_number` VARCHAR(100),
  `stock` INT DEFAULT 5,
  `sold` INT DEFAULT 0,
  `featured` TINYINT(1) DEFAULT 0,
  `is_best_seller` TINYINT(1) DEFAULT 0,
  `is_new_arrival` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `rating` DECIMAL(2, 1) DEFAULT 5.0,
  `review_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- BẢNG HÌNH ẢNH SẢN PHẨM
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. BẢNG NGƯỜI DÙNG & TÀI KHOẢN
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50),
  `password` VARCHAR(255) DEFAULT 'Customer@123',
  `role` VARCHAR(20) DEFAULT 'customer',
  `address` VARCHAR(500),
  `avatar` VARCHAR(500),
  `is_phone_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. BẢNG MÃ GIẢM GIÁ / VOUCHER
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` VARCHAR(50) PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` VARCHAR(20) NOT NULL,
  `discount_value` BIGINT NOT NULL,
  `min_order_value` BIGINT DEFAULT 0,
  `max_discount` BIGINT,
  `expiry_date` DATE,
  `usage_limit` INT DEFAULT 100,
  `used_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. BẢNG ĐƠN HÀNG
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `order_code` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` VARCHAR(50),
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_email` VARCHAR(255),
  `province` VARCHAR(100),
  `district` VARCHAR(100),
  `ward` VARCHAR(100),
  `street_address` VARCHAR(500),
  `subtotal` BIGINT NOT NULL,
  `vat_rate` INT DEFAULT 10,
  `vat_amount` BIGINT DEFAULT 0,
  `discount` BIGINT DEFAULT 0,
  `coupon_code` VARCHAR(50),
  `shipping_fee` BIGINT DEFAULT 0,
  `total` BIGINT NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'BANK_TRANSFER',
  `payment_status` VARCHAR(50) DEFAULT 'Chưa thanh toán',
  `order_status` VARCHAR(50) DEFAULT 'Chờ xác nhận',
  `note` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(500) NOT NULL,
  `product_sku` VARCHAR(100),
  `product_image` VARCHAR(500),
  `price` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `size` VARCHAR(50),
  `material` VARCHAR(100),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. BẢNG ĐÁNH GIÁ CỦA KHÁCH HÀNG
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` VARCHAR(50) PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50),
  `user_name` VARCHAR(255) NOT NULL,
  `user_avatar` VARCHAR(500),
  `rating` INT DEFAULT 5,
  `comment` TEXT,
  `is_verified_purchase` TINYINT(1) DEFAULT 1,
  `status` VARCHAR(20) DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. BẢNG BANNER QUẢNG CÁO
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(500),
  `image` VARCHAR(500) NOT NULL,
  `link` VARCHAR(255),
  `button_text` VARCHAR(100),
  `position` VARCHAR(50) DEFAULT 'hero',
  `status` VARCHAR(20) DEFAULT 'active',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ==========================================================

-- Chèn Showrooms
INSERT INTO `stores` (`id`, `code`, `name`, `type`, `address`, `ward`, `district`, `city`, `phone`, `email`, `opening_hours`, `is_flagship`, `latitude`, `longitude`, `services`, `image`, `status`) VALUES ('store-1', 'STORE-HN-01', '3AE Diamond Flagship Hà Đông', 'Flagship Showroom', 'Tòa nhà Diamond Tower, 47 - 48 TT16, Khu đô thị Văn Phú', 'Phường Phú La', 'Quận Hà Đông', 'Hà Nội', '0868 895 658', 'vietkhoi@diamond-jewelry.vn', '08:30 - 21:30 (Thứ 2 - Chủ Nhật)', 1, 20.9575, 105.7682, 'Tư vấn kim cương 1-1 phòng VIP; Kiểm định mã số cạnh kim cương GIA tại chỗ bằng kính hiển vi 40X; Thiết kế trang sức độc bản 3D Custom Made; Làm sạch & xi mạ đánh bóng trọn đời miễn phí; Thu đổi kim cương và trang sức với chính sách bảo chứng tốt nhất', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', 'active');
INSERT INTO `stores` (`id`, `code`, `name`, `type`, `address`, `ward`, `district`, `city`, `phone`, `email`, `opening_hours`, `is_flagship`, `latitude`, `longitude`, `services`, `image`, `status`) VALUES ('store-2', 'STORE-HN-02', '3AE Diamond Boutique Keangnam Landmark 72', 'Luxury Boutique', 'Tầng 1 sảnh chính, Tòa tháp Keangnam Landmark 72, Đường Phạm Hùng', 'Phường Mễ Trì', 'Quận Nam Từ Liêm', 'Hà Nội', '0868 895 658', 'contact@diamond-jewelry.vn', '09:00 - 22:00 (Thứ 2 - Chủ Nhật)', 0, 21.0173, 105.7838, 'Trải nghiệm kim cương viên Fancy Cut (Oval, Cushion, Emerald, Pear); Khắc laser tên riêng và lời ước hẹn trên đai nhẫn; Đặt lịch hẹn riêng tư cùng Master Jeweler; Giao nhận trang sức bọc thép bảo mật tận nơi', 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80', 'active');
INSERT INTO `stores` (`id`, `code`, `name`, `type`, `address`, `ward`, `district`, `city`, `phone`, `email`, `opening_hours`, `is_flagship`, `latitude`, `longitude`, `services`, `image`, `status`) VALUES ('store-3', 'STORE-HCM-01', '3AE Diamond Showroom Vinhomes Golden River TP.HCM', 'VIP Lounge & Boutique', 'Tòa Aqua 1, Khu đô thị Vinhomes Golden River, Số 2 Tôn Đức Thắng', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', '1800 5454 57', 'hcm@diamond-jewelry.vn', '09:00 - 21:30 (Thứ 2 - Chủ Nhật)', 0, 10.7852, 106.7088, 'Phòng thử trang sức riêng biệt chuẩn 5 sao; Bộ sưu tập nhẫn cưới & nhẫn cầu hôn Eternity mới nhất; Hỗ trợ trả góp 0% lãi suất thẻ tín dụng; Bảo hành & thu đổi toàn quốc', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80', 'active');

-- Chèn Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-1', 'Kim Cương Viên (Loose Diamonds)', 'kim-cuong-vien', 'Kim cương thiên nhiên kiểm định quốc tế GIA, IGI với độ tinh khiết hoàn mỹ và giác cắt xuất sắc.', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80', 8, 1);
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-2', 'Nhẫn Kim Cương Nữ', 'nhan-kim-cuong-nu', 'Tuyệt tác nhẫn cầu hôn, nhẫn thời trang đính kim cương tự nhiên tôn vinh nét kiêu sa của quý cô.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 12, 1);
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-3', 'Trang Sức Cưới & Nhẫn Cặp', 'trang-suc-cuoi', 'Lời nguyện ước vĩnh cửu đan dệt trong từng đường nét tinh xảo của cặp nhẫn cưới và trang sức vu quy.', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80', 6, 1);
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-4', 'Dây Chuyền & Mặt Dây Kim Cương', 'day-chuyen-kim-cuong', 'Điểm nhấn lấp lánh nơi xương quai xanh với thiết kế mặt dây thanh lịch từ vàng 18K và kim cương.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 8, 1);
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-5', 'Bông Tai Kim Cương', 'bong-tai-kim-cuong', 'Hoa tai kim cương mang vẻ đẹp rạng ngời, tô điểm gương mặt thêm bừng sáng và quý phái.', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80', 6, 1);
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`, `featured`) VALUES ('cat-6', 'Vòng & Lắc Tay Kim Cương', 'vong-lac-tay-kim-cuong', 'Vòng tay Tennis Bracelet và lắc tay đính kim cương sang trọng chuẩn mực hoàng gia.', 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80', 5, 0);

-- Chèn Users
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `address`, `avatar`, `is_phone_verified`) VALUES ('usr-admin', 'Quản Trị Viên 3AE', 'admin@3ae.vn', '0901234567', 'Admin@123', 'admin', 'Toà nhà 3AE Tower, 128 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1);
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `address`, `avatar`, `is_phone_verified`) VALUES ('usr-customer-1', 'Nguyễn Thuỳ Linh', 'linh.nguyen@gmail.com', '0988776655', 'Customer@123', 'customer', 'Căn hộ 1804, Vinhomes Golden River, Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 1);
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `address`, `avatar`, `is_phone_verified`) VALUES ('usr-customer-2', 'Trần Hoàng Nam', 'khachhang@gmail.com', '0912345678', 'Customer@123', 'customer', 'Biệt thự B2-12, KĐT Ciputra, Tây Hồ, Hà Nội', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1);

-- Chèn Coupons
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `expiry_date`, `usage_limit`, `used_count`, `status`) VALUES ('coup-1', '3AE2026', 'percentage', 5, 20000000, 5000000, '2026-12-31', 100, 18, 'active');
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `expiry_date`, `usage_limit`, `used_count`, `status`) VALUES ('coup-2', 'DIAMOND5M', 'fixed', 5000000, 100000000, NULL, '2026-12-31', 50, 12, 'active');
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `expiry_date`, `usage_limit`, `used_count`, `status`) VALUES ('coup-3', 'WEDDINGVIP', 'percentage', 8, 40000000, 8000000, '2026-09-30', 30, 9, 'active');

-- Chèn Products & Product Images
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-1', 'DIA-GIA-120-DVVS1', 'Kim Cương Viên GIA 1.20 Carat Nước D Độ Sạch VVS1', 'kim-cuong-vien-gia-1-20-carat-d-vvs1', 'cat-1', 'Kim Cương Viên (Loose Diamonds)', 'Kim cương viên tự nhiên 1.20 Carat đạt chuẩn cao nhất về màu sắc (Nước D - Không màu tuyệt đối) và độ sạch VVS1 gần như hoàn hảo dưới kính hiển vi 10x. Giác cắt 3X (Triple Excellent: Cut, Polish, Symmetry) tạo nên độ khúc xạ ánh sáng lửa và tán sắc tuyệt đỉnh.', 'Kim cương tự nhiên GIA 1.20ct Nước D, VVS1, Giác cắt 3X Excellent, Huỳnh quang None.', 315000000, 298000000, 'Bạch Kim Platinum 950', '', 'Round', 1.2, 'D', 'VVS1', 'Excellent', 'GIA', 'GIA-2487192031', 2, 14, 1, 1, 0, 'active', 5, 9);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-1', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-1', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-2', 'RNG-SOL-18KW-085', 'Nhẫn Kim Cương Solitaire Hoàng Gia Vàng Trắng 18K', 'nhan-kim-cuong-solitaire-hoang-gia-vang-trang-18k', 'cat-2', 'Nhẫn Kim Cương Nữ', 'Thiết kế nhẫn Solitaire kinh điển với 6 chấu giữ vững chãi ôm trọn viên kim cương chủ 0.85 Carat lộng lẫy. Đai nhẫn chế tác từ vàng trắng 18K cao cấp được nạm viền kim cương tấm pavé tinh xảo hai bên hông.', 'Nhẫn cầu hôn Solitaire 6 chấu vàng trắng 18K, kim cương chủ 0.85ct F/VVS2.', 98500000, 92000000, 'Vàng Trắng 18K', '11', 'Round', 0.85, 'F', 'VVS2', 'Ideal', 'GIA', 'GIA-6391048291', 5, 38, 1, 1, 0, 'active', 4.9, 24);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-2', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-2', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-2', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=80', 2);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-3', 'DIA-IGI-205-ECUSH', 'Kim Cương Viên IGI Cushion Cut 2.05 Carat Nước E VVS2', 'kim-cuong-vien-igi-cushion-2-05-carat-e-vvs2', 'cat-1', 'Kim Cương Viên (Loose Diamonds)', 'Giác cắt Cushion mang hơi thở cổ điển quý tộc kết hợp viên kim cương cỡ lớn 2.05 Carat. Nước E trong trẻo tinh khôi và độ sạch VVS2 mang đến đẳng cấp độc tôn cho các bộ trang sức thiết kế độc bản.', 'Kim cương viên Cushion Cut 2.05ct Nước E, Độ sạch VVS2, Giác cắt Excellent, Kiểm định IGI quốc tế.', 680000000, 650000000, 'Bạch Kim Platinum 950', '', 'Cushion', 2.05, 'E', 'VVS2', 'Excellent', 'IGI', 'IGI-519283741', 1, 3, 1, 0, 1, 'active', 5, 4);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-3', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-3', 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-4', 'RNG-HALO-OVAL-18KR', 'Nhẫn Nữ Halo Kim Cương Giác Cắt Oval Vàng Hồng 18K', 'nhan-nu-halo-kim-cuong-oval-vang-hong-18k', 'cat-2', 'Nhẫn Kim Cương Nữ', 'Viên kim cương chủ hình Oval 1.0 Carat được ôm ấp bởi vòng hào quang Halo kim cương tấm lấp lánh, làm nổi bật ngón tay thon dài. Sắc vàng hồng 18K ấm áp tạo vẻ đẹp ngọt ngào quyến rũ.', 'Nhẫn đính hôn Oval Halo vàng hồng 18K, kim cương chủ 1.00ct G/VS1.', 135000000, 128000000, 'Vàng Hồng 18K', '10', 'Oval', 1, 'G', 'VS1', 'Excellent', 'GIA', 'GIA-192837461', 4, 21, 1, 0, 0, 'active', 4.8, 16);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-4', 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-4', 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-5', 'WED-ETERN-PAIR-18KY', 'Cặp Nhẫn Cưới Tình Yêu Vĩnh Cửu Eternity Vàng Vàng 18K', 'cap-nhan-cuoi-eternity-vang-vang-18k', 'cat-3', 'Trang Sức Cưới & Nhẫn Cặp', 'Cặp nhẫn cưới biểu tượng cho lời hẹn ước bền lâu. Nhẫn nam mang vẻ nam tính với đường vân Satin chải xước sang trọng, nhẫn nữ nạm dải kim cương Eternity 0.45 Carat tỏa sáng dịu dàng.', 'Cặp nhẫn cưới vàng vàng 18K khắc laser tên riêng miễn phí, đính kim cương tự nhiên.', 48500000, 45000000, 'Vàng Vàng 18K', '12 & 17', 'Round', 0.45, 'F', 'VS1', 'Excellent', 'PNJ Lab', '', 8, 52, 1, 1, 0, 'active', 4.9, 45);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-5', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-5', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-6', 'NCK-PEAR-070-18KW', 'Dây Chuyền Mặt Kim Cương Giọt Nước Pear Diamond Vàng Trắng 18K', 'day-chuyen-mat-kim-cuong-pear-vang-trang-18k', 'cat-4', 'Dây Chuyền & Mặt Dây Kim Cương', 'Mặt dây chuyền hình giọt nước duyên dáng với viên chủ Pear Brilliant 0.70 Carat Nước E độ sạch VVS1. Dây chuyền vàng trắng 18K thanh mảnh kết hợp hài hòa tạo nên vẻ đẹp thuần khiết.', 'Mặt dây chuyền giọt nước Pear Cut 0.70ct E/VVS1 kèm dây vàng trắng 18K cao cấp.', 76000000, 69900000, 'Vàng Trắng 18K', '', 'Pear', 0.7, 'E', 'VVS1', 'Excellent', 'GIA', 'GIA-8374920192', 6, 19, 1, 0, 0, 'active', 5, 12);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-6', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-6', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-7', 'EAR-STUD-2X050-18KW', 'Bông Tai Kim Cương Nụ Cổ Điển Solitaire Studs Vàng Trắng 18K', 'bong-tai-kim-cuong-solitaire-studs-vang-trang-18k', 'cat-5', 'Bông Tai Kim Cương', 'Cặp bông tai nụ Solitaire kinh điển với 2 viên kim cương 0.50 Carat mỗi bên (Tổng 1.00 Carat) chuẩn giác cắt Hearts & Arrows. Chốt vặn an toàn giúp quý cô tự tin tỏa sáng suốt cả ngày dài.', 'Bông tai nụ 4 chấu vàng trắng 18K, 2 viên kim cương GIA tổng 1.00ct F/VVS2.', 89000000, 83500000, 'Vàng Trắng 18K', '', 'Round', 1, 'F', 'VVS2', 'Ideal', 'GIA', 'GIA-PAIR-92018', 7, 28, 1, 1, 0, 'active', 4.9, 31);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-7', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-7', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-8', 'BRC-TEN-350-18KW', 'Lắc Tay Kim Cương Tennis Bracelet 3.50 Carat Vàng Trắng 18K', 'lac-tay-kim-cuong-tennis-bracelet-3-50-carat-vang-trang-18k', 'cat-6', 'Vòng & Lắc Tay Kim Cương', 'Chiếc lắc tay Tennis huyền thoại tập hợp 55 viên kim cương thiên nhiên đồng đều về màu sắc và độ trong suốt, tổng trọng lượng 3.50 Carat. Khóa đôi bảo hộ an toàn bậc nhất.', 'Lắc tay Tennis Bracelet 55 viên kim cương tự nhiên tổng 3.50ct F-G/VS1 vàng trắng 18K.', 185000000, 175000000, 'Vàng Trắng 18K', '16.5cm', 'Round', 3.5, 'F', 'VS1', 'Excellent', 'GIA', '', 3, 9, 1, 0, 0, 'active', 5, 7);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-8', 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-8', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-9', 'DIA-GIA-150-DEMR', 'Kim Cương Viên Emerald Cut GIA 1.50 Carat Nước D VVS1', 'kim-cuong-vien-emerald-cut-gia-1-50-carat-d-vvs1', 'cat-1', 'Kim Cương Viên (Loose Diamonds)', 'Giác cắt chữ nhật xếp tầng Emerald Cut trong suốt như gương soi (Hall of Mirrors effect). Viên kim cương 1.50 Carat Nước D và độ sạch VVS1 dành riêng cho những nhà sưu tầm sành điệu.', 'Kim cương Emerald Cut 1.50ct Nước D, VVS1, Giác cắt Excellent, Kiểm định GIA quốc tế.', 495000000, 470000000, 'Bạch Kim Platinum 950', '', 'Emerald', 1.5, 'D', 'VVS1', 'Excellent', 'GIA', 'GIA-728193021', 2, 5, 0, 0, 0, 'active', 5, 3);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-9', 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-9', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-10', 'RNG-MEN-SQ-18KY-090', 'Nhẫn Nam Kim Cương Mặt Vuông Đẳng Cấp Doanh Nhân Vàng 18K', 'nhan-nam-kim-cuong-mat-vuong-vang-18k', 'cat-2', 'Nhẫn Kim Cương Nữ', 'Kiệt tác nhẫn nam với mặt vuông nạm kim cương Princess và viên chủ 0.90 Carat thể hiện bản lĩnh lãnh đạo, uy quyền và phong thái thành đạt của quý ông thượng lưu.', 'Nhẫn nam kim cương vàng vàng 18K kết hợp vàng trắng, viên chủ 0.90ct E/VS1.', 142000000, 136000000, 'Vàng Vàng 18K', '18', 'Princess', 0.9, 'E', 'VS1', 'Excellent', 'GIA', 'GIA-940281726', 4, 12, 1, 0, 1, 'active', 4.9, 8);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-10', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-10', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-11', 'NCK-HEART-060-18KR', 'Mặt Dây Chuyền Kim Cương Trái Tim Heart Brilliant Vàng Hồng 18K', 'mat-day-chuyen-kim-cuong-trai-tim-vang-hong-18k', 'cat-4', 'Dây Chuyền & Mặt Dây Kim Cương', 'Biểu tượng của tình yêu nồng thắm với giác cắt hình trái tim Heart Shape 0.60 Carat Nước E. Ổ chấu vàng hồng 18K nạm thêm viền kim cương tấm mềm mại.', 'Mặt dây chuyền trái tim Heart Cut 0.60ct E/VVS2 vàng hồng 18K lãng mạn.', 62000000, 58000000, 'Vàng Hồng 18K', '', 'Heart', 0.6, 'E', 'VVS2', 'Excellent', 'GIA', 'GIA-394810294', 5, 23, 0, 0, 0, 'active', 4.9, 15);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-11', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-11', 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-12', 'EAR-DROP-180-18KW', 'Bông Tai Kim Cương Dáng Dài Hoàng Gia Dangle Drop Vàng Trắng 18K', 'bong-tai-kim-cuong-dang-dai-hoang-gia-vang-trang-18k', 'cat-5', 'Bông Tai Kim Cương', 'Đôi hoa tai dáng dài đung đưa theo từng chuyển động, đính 48 viên kim cương với 2 viên chủ Marquise 0.50 Carat mỗi bên, tôn lên nét đài các trong những dạ tiệc sang trọng.', 'Bông tai dáng dài dạ hội vàng trắng 18K, kim cương Marquise và Round tổng 1.80ct.', 125000000, 118000000, 'Vàng Trắng 18K', '', 'Marquise', 1.8, 'F', 'VS1', 'Excellent', 'IGI', '', 3, 11, 1, 0, 1, 'active', 5, 9);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-12', 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-12', 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-13', 'DIA-GIA-070-FVS1', 'Kim Cương Viên Round Brilliant GIA 0.70 Carat Nước F VS1', 'kim-cuong-vien-round-gia-0-70-carat-f-vs1', 'cat-1', 'Kim Cương Viên (Loose Diamonds)', 'Viên kim cương tự nhiên 0.70 Carat có giác cắt 3X chuẩn quốc tế, phù hợp hoàn hảo làm viên chủ cho nhẫn đính hôn hoặc mặt dây chuyền thanh lịch với mức giá tối ưu.', 'Kim cương Round GIA 0.70ct Nước F, Độ sạch VS1, Giác cắt 3X Excellent.', 78000000, 72000000, 'Bạch Kim Platinum 950', '', 'Round', 0.7, 'F', 'VS1', 'Excellent', 'GIA', 'GIA-592810394', 8, 45, 0, 1, 0, 'active', 4.8, 22);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-13', 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-13', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-14', 'RNG-3STN-120-18KW', 'Nhẫn Kim Cương Ba Viên Three-Stone Tượng Trưng Quá Khứ - Hiện Tại - Tương Lai', 'nhan-kim-cuong-three-stone-vang-trang-18k', 'cat-2', 'Nhẫn Kim Cương Nữ', 'Thiết kế Three-Stone mang ý nghĩa tình yêu vĩnh hằng xuyên suốt thời gian. Viên chủ 0.80 Carat cùng 2 viên phụ 0.20 Carat hai bên tạo nên vầng sáng hài hòa tuyệt mỹ.', 'Nhẫn Three-Stone vàng trắng 18K, 3 viên kim cương tự nhiên tổng 1.20ct.', 118000000, 110000000, 'Vàng Trắng 18K', '11', 'Round', 1.2, 'E', 'VVS2', 'Ideal', 'GIA', 'GIA-847291039', 3, 17, 0, 0, 0, 'active', 4.9, 13);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-14', 'https://images.unsplash.com/photo-1613945408026-6732d875e701?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-14', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-15', 'BRC-BAN-WAVE-18KY', 'Vòng Tay Bangle Kim Cương Họa Tiết Lượn Sóng Vàng Vàng 18K', 'vong-tay-bangle-kim-cuong-vang-vang-18k', 'cat-6', 'Vòng & Lắc Tay Kim Cương', 'Vòng tay bản cứng Bangle dạng oval ôm vừa vặn cổ tay phụ nữ Á Đông, đính dải kim cương uốn lượn nhịp nhàng từ chất liệu vàng vàng 18K sắc sảo.', 'Vòng tay Bangle vàng vàng 18K đính 32 viên kim cương tấm tự nhiên 0.85ct.', 95000000, 89000000, 'Vàng Vàng 18K', '54mm', 'Round', 0.85, 'G', 'VS2', 'Excellent', 'PNJ Lab', '', 5, 14, 0, 0, 0, 'active', 4.7, 11);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-15', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-15', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-16', 'WED-PLAT-ROMAN-PAIR', 'Cặp Nhẫn Cưới Platin Bạch Kim Khắc Vân La Mã', 'cap-nhan-cuoi-platin-bach-kim-khac-van-la-ma', 'cat-3', 'Trang Sức Cưới & Nhẫn Cặp', 'Chế tác từ chất liệu Bạch Kim Platinum 950 nguyên chất vĩnh cửu không phai màu, chạm khắc số La Mã biểu trưng cho ngày kỷ niệm thiêng liêng đính kim cương tự nhiên.', 'Cặp nhẫn cưới Platinum 950 vĩnh cửu đính kim cương GIA 0.30ct.', 58000000, 54000000, 'Bạch Kim Platinum 950', 'Cặp 11-17', 'Round', 0.3, 'D', 'VVS1', 'Ideal', 'GIA', '', 6, 29, 0, 1, 0, 'active', 5, 26);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-16', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-16', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-17', 'DIA-GIA-101-EPRIN', 'Kim Cương Viên Princess Cut GIA 1.01 Carat Nước E VVS2', 'kim-cuong-vien-princess-cut-gia-1-01-carat-e-vvs2', 'cat-1', 'Kim Cương Viên (Loose Diamonds)', 'Giác cắt vuông Princess sắc nét mang vẻ đẹp hiện đại và góc cạnh lôi cuốn. Viên kim cương 1.01 Carat Nước E độ sạch VVS2 kèm mã số khắc laser trên cạnh gờ.', 'Kim cương Princess Cut 1.01ct Nước E, VVS2, Giác cắt Excellent, Kiểm định GIA.', 245000000, 232000000, 'Bạch Kim Platinum 950', '', 'Princess', 1.01, 'E', 'VVS2', 'Excellent', 'GIA', 'GIA-6291048201', 2, 8, 0, 0, 0, 'active', 4.9, 6);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-17', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-17', 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-18', 'NCK-CIR-HALO-18KW', 'Dây Chuyền Kim Cương Mặt Vòng Tròn Hào Quang Vàng Trắng 18K', 'day-chuyen-kim-cuong-mat-vong-tron-hao-quang-18kw', 'cat-4', 'Dây Chuyền & Mặt Dây Kim Cương', 'Thiết kế mặt dây hình tròn tượng trưng cho sự trọn vẹn và viên mãn, đính viên chủ 0.50 Carat cùng 2 vòng hào quang kim cương tấm lấp lánh.', 'Mặt dây chuyền tròn hào quang vàng trắng 18K, kim cương tự nhiên 0.75ct F/VS1.', 54000000, 49500000, 'Vàng Trắng 18K', '', 'Round', 0.75, 'F', 'VS1', 'Excellent', 'GIA', 'GIA-102948271', 7, 34, 0, 0, 0, 'active', 4.8, 19);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-18', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-18', 'https://images.unsplash.com/photo-1541112324160-e8a425b58dac?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-19', 'RNG-PEAR-SOL-18KW-090', 'Nhẫn Kim Cương Cầu Hôn Giác Cắt Giọt Nước Pear Vàng Trắng 18K', 'nhan-kim-cuong-cau-hon-pear-cut-vang-trang-18k', 'cat-2', 'Nhẫn Kim Cương Nữ', 'Viên kim cương hình quả lê 0.90 Carat mang nét đẹp thanh tao bất đối xứng nghệ thuật, gắn trên đai nhẫn nạm kim cương chìm sang trọng.', 'Nhẫn đính hôn Pear Brilliant 0.90ct E/VVS1 vàng trắng 18K kiểm định GIA.', 115000000, 108000000, 'Vàng Trắng 18K', '11', 'Pear', 0.9, 'E', 'VVS1', 'Excellent', 'GIA', 'GIA-910284719', 4, 16, 0, 0, 1, 'active', 4.9, 14);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-19', 'https://images.unsplash.com/photo-1530901729437-5372782e53f2?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-19', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80', 1);
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `category_name`, `description`, `short_description`, `price`, `sale_price`, `material`, `size`, `diamond_shape`, `carat`, `color`, `clarity`, `cut`, `certificate`, `certificate_number`, `stock`, `sold`, `featured`, `is_best_seller`, `is_new_arrival`, `status`, `rating`, `review_count`) VALUES ('prod-20', 'EAR-HOOP-HUG-18KY', 'Bông Tai Kim Cương Khuyên Tròn Huggie Hoop Vàng Vàng 18K', 'bong-tai-kim-cuong-huggie-hoop-vang-vang-18k', 'cat-5', 'Bông Tai Kim Cương', 'Đôi khuyên tròn Huggie nhỏ xinh nạm hai hàng kim cương tấm lấp lánh ôm sát vành tai, hoàn hảo cho phong cách thường nhật thanh lịch và năng động.', 'Bông tai khuyên tròn Huggie vàng 18K đính kim cương tự nhiên 0.40ct.', 36000000, 33500000, 'Vàng Vàng 18K', '', 'Round', 0.4, 'G', 'VS1', 'Excellent', 'PNJ Lab', '', 9, 42, 0, 0, 0, 'active', 4.8, 27);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-20', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=80', 0);
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES ('prod-20', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=80', 1);

-- Chèn Orders & Order Items
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `province`, `district`, `ward`, `street_address`, `subtotal`, `vat_rate`, `vat_amount`, `discount`, `coupon_code`, `shipping_fee`, `total`, `payment_method`, `payment_status`, `order_status`, `note`) VALUES ('ord-1001', 'LUM-2026-8910', 'usr-customer-1', 'Nguyễn Thuỳ Linh', '0988776655', 'linh.nguyen@gmail.com', 'TP. Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 'Căn hộ 1804, Vinhomes Golden River', 92000000, 10, 8740000, 4600000, '3AE2026', 0, 87400000, 'BANK_TRANSFER', 'Đã thanh toán', 'Đang giao hàng', 'Giao hàng bằng hộp quà cao cấp và thẻ bảo hành GIA.');
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `product_sku`, `product_image`, `price`, `quantity`, `size`, `material`) VALUES ('ord-1001', 'prod-2', 'Nhẫn Kim Cương Solitaire Hoàng Gia Vàng Trắng 18K', 'RNG-SOL-18KW-085', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', 92000000, 1, '11', 'Vàng Trắng 18K');
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `province`, `district`, `ward`, `street_address`, `subtotal`, `vat_rate`, `vat_amount`, `discount`, `coupon_code`, `shipping_fee`, `total`, `payment_method`, `payment_status`, `order_status`, `note`) VALUES ('ord-1002', 'LUM-2026-9204', 'usr-customer-2', 'Trần Hoàng Nam', '0912345678', 'khachhang@gmail.com', 'Hà Nội', 'Tây Hồ', 'Phường Xuân La', 'Biệt thự B2-12, KĐT Ciputra', 45000000, 10, 4500000, 0, '', 0, 45000000, 'COD', 'Chưa thanh toán', 'Chờ xác nhận', 'Khắc laser tên Nam & Lan 26.10');
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `product_sku`, `product_image`, `price`, `quantity`, `size`, `material`) VALUES ('ord-1002', 'prod-5', 'Cặp Nhẫn Cưới Tình Yêu Vĩnh Cửu Eternity Vàng Vàng 18K', 'WED-ETERN-PAIR-18KY', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80', 45000000, 1, 'Cặp tiêu chuẩn 11-17', 'Vàng Vàng 18K');

-- Chèn Reviews
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `user_name`, `user_avatar`, `rating`, `comment`, `is_verified_purchase`, `status`) VALUES ('rev-1', 'prod-1', 'usr-customer-1', 'Nguyễn Thuỳ Linh', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 5, 'Viên kim cương cực kỳ sáng lửa, quét mã QR ra chứng nhận GIA chuẩn xác từng thông số. Đóng gói hộp nhung sang trọng đẳng cấp đúng chất thương hiệu lớn!', 1, 'approved');
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `user_name`, `user_avatar`, `rating`, `comment`, `is_verified_purchase`, `status`) VALUES ('rev-2', 'prod-2', 'usr-customer-2', 'Trần Hoàng Nam', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 5, 'Tôi mua chiếc nhẫn Solitaire này để cầu hôn và bạn gái tôi vỡ òa vì xúc động. Thiết kế 6 chấu ôm trọn viên kim cương trông rất lớn và sáng rực rỡ.', 1, 'approved');
INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `user_name`, `user_avatar`, `rating`, `comment`, `is_verified_purchase`, `status`) VALUES ('rev-3', 'prod-5', 'usr-customer-1', 'Lê Minh Khang', '', 5, 'Cặp nhẫn cưới hoàn thiện rất mượt mà, vàng 18K sắc sảo và được hỗ trợ khắc tên miễn phí rất ý nghĩa.', 1, 'approved');

-- Chèn Banners
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image`, `link`, `button_text`, `position`, `status`, `sort_order`) VALUES ('ban-1', 'Tuyệt Tác Kim Cương Độc Bản', 'Chuẩn Mực Giác Cắt Triple Excellent & Chứng Nhận GIA Quốc Tế', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85', '/products?category=kim-cuong-vien', 'Khám Phá Kim Cương Viên', 'hero', 'active', 1);
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image`, `link`, `button_text`, `position`, `status`, `sort_order`) VALUES ('ban-2', 'Khoảnh Khắc Cầu Hôn Vĩnh Cửu', 'Bộ sưu tập nhẫn đính hôn Solitaire & Halo vàng 18K sang trọng', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85', '/products?category=nhan-kim-cuong-nu', 'Xem Bộ Sưu Tập Nhẫn', 'hero', 'active', 2);
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image`, `link`, `button_text`, `position`, `status`, `sort_order`) VALUES ('ban-3', 'Mùa Cưới Hạnh Phúc & Vu Quy', 'Ưu đãi tặng đến 5.000.000 VNĐ cho các cặp nhẫn cưới kỷ vật', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85', '/products?category=trang-suc-cuoi', 'Xem Nhẫn Cưới', 'hero', 'active', 3);

SET FOREIGN_KEY_CHECKS = 1;
-- Kết thúc script import
