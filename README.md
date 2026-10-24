# Web bán đồ dùng học tập

Giao diện website bán đồ dùng học tập **Học Đường Store** — phong cách tối giản, màu chủ đạo cam `#FF6900`, font Be Vietnam Pro, giao diện tiếng Việt.

## Cấu trúc

```
website-selling-school-supplies/
├── assets/                 # CSS, JS, hình ảnh dùng chung
├── page/
│   ├── homepage/           # Trang chủ (main.html)
│   ├── products/           # Danh sách & chi tiết sản phẩm, dữ liệu catalog
│   ├── auth/               # Đăng nhập / đăng ký
│   └── customer/           # Khu vực khách hàng (mới)
│       ├── cart.html       # Giỏ hàng & đơn hàng
│       ├── checkout.html   # Thanh toán
│       ├── order-success.html
│       ├── profile.html    # Tài khoản & sổ địa chỉ
│       ├── customer.css
│       └── customer.js
└── admin_page/             # Trang quản trị
```

## Khu vực khách hàng

Bốn màn hình trong `page/customer/` dùng chung header/footer với trang chủ và được liên kết từ trang chủ:

- **Giỏ hàng & đơn hàng** (`cart.html`): tab tất cả / đang xử lý / hoàn thành, tìm kiếm đơn, chỉnh số lượng, xóa sản phẩm và đặt hàng, theo dõi đơn, mua lại. Icon giỏ hàng ở mọi trang đều mở drawer nhanh, cho phép tăng/giảm số lượng và xóa sản phẩm ngay tại chỗ.
- **Thanh toán** (`checkout.html`): thông tin người mua, chọn/thêm địa chỉ, phương thức thanh toán, mã giảm giá `WELCOME2026` (giảm 20%), tóm tắt đơn.
- **Đặt hàng thành công** (`order-success.html`): xác nhận đơn, thông tin giao hàng, chi tiết sản phẩm và tổng tiền.
- **Tài khoản** (`profile.html`): chỉnh sửa hồ sơ, thêm/sửa/xóa/đặt mặc định địa chỉ.

Dữ liệu demo được lưu trong `localStorage`:

| Khóa | Nội dung |
| --- | --- |
| `hds_profile_v1` | Hồ sơ khách hàng |
| `hds_addresses_v1` | Sổ địa chỉ |
| `hds_last_order_v1` | Đơn hàng vừa đặt |

Giỏ hàng dùng `window.StoreCart` (trong `assets/js/cart.js`), sản phẩm lấy từ `page/products/product-data.js`.

## Chạy thử

Khuyến nghị chạy qua static server để `localStorage` và đường dẫn tương đối hoạt động ổn định:

```bash
npx serve website-selling-school-supplies
```

Sau đó mở `page/homepage/main.html`. Có thể mở trực tiếp file HTML nếu không cần luồng dữ liệu qua lại giữa các trang.
