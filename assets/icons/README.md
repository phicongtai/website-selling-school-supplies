# 🎨 Thư Viện Biểu Tượng Vector SVG - Học Đường Store
> **Vị trí thư mục:** `assets/icons/`  
> **Tổng số:** 75 biểu tượng chuẩn hóa SVG (Storefront + Admin) theo đúng bản thiết kế Figma (`8LNtK4HQvU4OJwCVb7FYd9`).

---

## 📌 Cách Sử Dụng Trong Mã Nguồn

### 1. Sử dụng qua thẻ `<img>` (Đơn giản & Khuyên dùng)
```html
<!-- Dành cho các trang trong thư mục con như page/homepage/ hoặc admin_page/... -->
<img src="../../assets/icons/search.svg" alt="Tìm kiếm" width="20" height="20">
<img src="../../assets/icons/cart.svg" alt="Giỏ hàng" width="20" height="20">
<img src="../../assets/icons/lock.svg" alt="Mật khẩu" width="18" height="18">
```

### 2. Sử dụng qua CSS `background-image`
```css
.search-icon-input {
  background-image: url('../../assets/icons/search.svg');
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 18px 18px;
  padding-left: 40px;
}
```

### 3. Nhúng trực tiếp Inline SVG (Hỗ trợ đổi màu qua `currentColor`)
```html
<button type="button" class="btn-action">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <!-- Paste đường dẫn path từ tệp svg tương ứng -->
  </svg>
  <span>Thêm vào giỏ</span>
</button>
```

---

## 📂 Danh Mục 75 Biểu Tượng Theo Nhóm Chức Năng

### 1. Nhận Diện Thương Hiệu (Brand)
| Tên Tệp SVG | Mô Tả | Dùng Tại |
| :--- | :--- | :--- |
| `logo-mark.svg` | Logo HĐ nền xanh rừng `#1B4332` | Header Admin, Sidebar Admin |
| `logo-mark-orange.svg` | Logo HĐ nền cam `#FF6900` | Header Storefront, Favicon |

### 2. Điều Hướng & Tìm Kiếm (Navigation & Search)
| Tên Tệp SVG | Mô Tả | Thay Thế Cho |
| :--- | :--- | :--- |
| `search.svg` | Kính lúp tìm kiếm sản phẩm | Emoji `🔍` và `⌕` |
| `menu.svg` | Menu Hamburger Mobile | Ký tự text `☰` |
| `close.svg` | Nút đóng modal, popup | Ký tự text `×` |
| `arrow-left.svg` | Mũi tên quay lại | Ký tự `←` hoặc `↶` |
| `arrow-right.svg` | Mũi tên tiếp tục, đăng nhập | Ký tự `→` |
| `chevron-down.svg` | Mũi tên trỏ xuống dropdown | Ký tự `v` |
| `chevron-up.svg` | Mũi tên thu gọn | Ký tự `^` |
| `chevron-left.svg` | Trang trước phân trang | Ký tự `<` |
| `chevron-right.svg` | Trang sau phân trang | Ký tự `>` |

### 3. Giỏ Hàng & Mua Sắm (Shopping & Checkout)
| Tên Tệp SVG | Mô Tả | Dùng Tại |
| :--- | :--- | :--- |
| `cart.svg` | Giỏ hàng có khung chứa đồ | Header Storefront, Nút mua |
| `cart-empty.svg` | Giỏ hàng rỗng | Màn hình S09 |
| `bag.svg` | Túi mua sắm thời trang | Header, Mini Cart |
| `plus.svg` | Tăng số lượng hàng (+) | Giỏ hàng, Chi tiết SP |
| `minus.svg` | Giảm số lượng hàng (-) | Giỏ hàng, Chi tiết SP |
| `trash.svg` | Xóa sản phẩm khỏi giỏ | Giỏ hàng S08 |
| `credit-card.svg` | Thanh toán thẻ ngân hàng | Trang Đặt hàng S10 |
| `wallet.svg` | Ví điện tử MoMo/ZaloPay | Trang Đặt hàng S10 |
| `map-pin.svg` | Địa chỉ giao nhận hàng | Trang Đặt hàng S10 |
| `package.svg` | Kiện hàng đóng gói | Tiến độ đơn hàng S11 |
| `history.svg` | Lịch sử mua hàng | Màn hình S12 |

### 4. Đánh Giá & Ưu Đãi (Ratings & Promotions)
| Tên Tệp SVG | Mô Tả | Dùng Tại |
| :--- | :--- | :--- |
| `star-filled.svg` | Sao vàng đầy (5 sao) | Thẻ sản phẩm, Review S03 |
| `star-half.svg` | Nửa sao đánh giá | Review S03 |
| `star.svg` | Sao rỗng chưa chọn | Đánh giá sao |
| `fire.svg` | Ngọn lửa Hot Deal / Bán chạy | Tag sản phẩm nổi bật |
| `sparkles.svg` | Ngôi sao lấp lánh New | Sản phẩm mới về |
| `discount.svg` | Thẻ giảm giá Voucher | Khuyến mãi tựu trường |

### 5. Cam Kết Học Đường (Service Benefits)
| Tên Tệp SVG | Mô Tả | Thay Thế Cho |
| :--- | :--- | :--- |
| `truck.svg` | Giao hàng siêu tốc 2h | Ký tự `♧` |
| `shield-check.svg` | Hàng chính hãng 100% | Ký tự `♧` |
| `refresh-cw.svg` | Đổi trả 30 ngày linh hoạt | Ký tự `♧` |
| `award.svg` | Tích điểm Học Đường | Ký tự `♧` |
| `bolt.svg` | Giao hỏa tốc trước giờ thi | Ký tự `ϟ` |
| `clock.svg` | Phục vụ 24/7 | Ký tự `◷` |

### 6. Danh Mục Ngành Hàng (Categories)
| Tên Tệp SVG | Ngành Hàng | Màn Hình Figma |
| :--- | :--- | :--- |
| `cat-pen.svg` | Bút viết cao cấp | Màn hình S02 |
| `cat-book.svg` | Vở ghi chép & Giấy thi | Danh mục Storefront |
| `cat-backpack.svg` | Cặp & Balo chống gù | Danh mục Storefront |
| `cat-ruler.svg` | Dụng cụ học tập (thước, compa) | Danh mục Storefront |
| `cat-palette.svg` | Dụng cụ vẽ & Mỹ thuật | Danh mục Storefront |
| `cat-calculator.svg` | Máy tính Casio & Thiết bị số | Danh mục Storefront |

### 7. Xác Thực Tài Khoản (Authentication Forms - S06, S07, A01)
| Tên Tệp SVG | Trường Nhập Liệu | Thay Thế Cho Ký Tự |
| :--- | :--- | :--- |
| `id-card.svg` | Tên đăng nhập / Mã học sinh | Ký tự thô `♙` |
| `mail.svg` | Email cá nhân | Ký tự thô `✉` |
| `phone.svg` | Số điện thoại | Ký tự thô `☎` |
| `lock.svg` | Mật khẩu bảo mật | Ký tự thô `♙` |
| `lock-ssl.svg` | Bảo mật SSL 256-bit | Ký tự thô `♧` |
| `eye.svg` | Hiện mật khẩu | Ký tự thô `◎` |
| `eye-off.svg` | Ẩn mật khẩu (gạch chéo) | Trạng thái mật khẩu ẩn |
| `google.svg` | Đăng nhập bằng Google | Icon Google đa sắc |
| `facebook.svg` | Đăng nhập bằng Facebook | Icon Facebook xanh |

### 8. Thanh Điều Hướng Quản Trị (Admin Navigation)
| Tên Tệp SVG | Mục Menu | Thay Thế Cho |
| :--- | :--- | :--- |
| `dashboard.svg` | Bảng điều khiển | Ký tự `▤` |
| `nav-users.svg` | Quản lý người dùng | Ký tự `▤` |
| `nav-products.svg` | Quản lý sản phẩm | Ký tự `▣` |
| `nav-orders.svg` | Quản lý đơn hàng | Ký tự `▧` |
| `nav-stats.svg` | Báo cáo thống kê | Ký tự `▥` |
| `logout.svg` | Đăng xuất hệ thống | Ký tự `↪` |
| `storefront.svg` | Xem trang khách hàng | Ký tự `▱` |
| `calendar.svg` | Lịch ngày tháng hệ thống | Ký tự `▣` |
| `bell.svg` | Thông báo quản trị | Ký tự `♧` |

### 9. Thao Tác Bảng & Thống Kê Admin (Actions & Stats)
| Tên Tệp SVG | Mô Tả | Dùng Tại |
| :--- | :--- | :--- |
| `user-plus.svg` | Thêm người dùng mới | Nút chức năng A02, A03 |
| `edit.svg` | Sửa thông tin hàng | Cột thao tác bảng A02, A07 |
| `upload.svg` | Tải ảnh sản phẩm lên | Form A06, A07 |
| `printer.svg` | In phiếu giao hàng | Chi tiết đơn hàng A11 |
| `filter.svg` | Bộ lọc danh sách | Thanh công cụ bảng |
| `stat-total.svg` | KPI Tổng người dùng | Card thống kê A02 |
| `stat-active.svg` | KPI Đang hoạt động | Card thống kê A02 |
| `stat-locked.svg` | KPI Tài khoản đã khóa | Card thống kê A02 |
| `stat-rate.svg` | KPI Tỷ lệ tương tác | Card thống kê A02 |

