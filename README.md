# Học Đường Store

**Website bán đồ dùng học tập và văn phòng phẩm** — gồm giao diện cửa hàng (storefront) dành cho khách hàng và hệ thống quản trị nội bộ (admin), xây dựng hoàn toàn bằng HTML, CSS và JavaScript thuần.

> **Trạng thái dự án:** Frontend demo, chưa có backend, chưa kết nối cơ sở dữ liệu và chưa tích hợp thanh toán thật.
> **Cập nhật README:** 26/10/2026 · **Nhánh chính:** `main`

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Thông tin nhanh](#2-thông-tin-nhanh)
3. [Tính năng](#3-tính-năng)
4. [Cấu trúc thư mục](#4-cấu-trúc-thư-mục)
5. [Sitemap và đường dẫn](#5-sitemap-và-đường-dẫn)
6. [Luồng nghiệp vụ](#6-luồng-nghiệp-vụ)
7. [Dữ liệu và lưu trữ](#7-dữ-liệu-và-lưu-trữ)
8. [Thiết kế và giao diện](#8-thiết-kế-và-giao-diện)
9. [Cài đặt và chạy dự án](#9-cài-đặt-và-chạy-dự-án)
10. [Script hỗ trợ](#10-script-hỗ-trợ)
11. [Quy ước phát triển](#11-quy-ước-phát-triển)
12. [Hạn chế đã biết](#12-hạn-chế-đã-biết)
13. [Hướng phát triển](#13-hướng-phát-triển)
14. [Đóng góp và bản quyền](#14-đóng-góp-và-bản-quyền)

---

## 1. Giới thiệu

**Học Đường Store** là đồ án website thương mại điện tử chuyên về đồ dùng học tập, hướng tới học sinh, sinh viên và phụ huynh. Dự án mô phỏng đầy đủ hành trình từ xem sản phẩm, tìm kiếm, lọc, thêm vào giỏ, đặt hàng, theo dõi đơn đến quản trị người dùng, sản phẩm, đơn hàng và thống kê khách hàng.

### Điểm nổi bật

- **54 sản phẩm** thuộc **7 danh mục**, có giá bán, giá cũ, tồn kho, đóng gói, mô tả, nhãn nổi bật và trạng thái giảm giá.
- **Storefront SPA** ngay trong trang chủ với 4 màn hình: trang chủ, danh mục, chi tiết sản phẩm và tìm kiếm nâng cao.
- **Giỏ hàng dùng chung** giữa các trang nhờ `localStorage` và `window.StoreCart`.
- **Luồng khách hàng hoàn chỉnh:** giỏ hàng → thanh toán → đặt hàng thành công → quản lý hồ sơ và sổ địa chỉ.
- **12 màn hình quản trị** từ `A01` đến `A12`, có sidebar, topbar, bảng dữ liệu, bộ lọc, modal và toast.
- **Cụm quản trị đơn hàng dùng chung một kho dữ liệu** (`HDOrderStore`) cho `A10`, `A11`, `A12`.
- **Không cần build, không cần cài dependency** — chỉ mở file HTML hoặc chạy một static server là dùng được.
- **Thiết kế theo phong cách Vibrant Academic Minimal**, màu cam `#FF6900`, font Be Vietnam Pro, hỗ trợ responsive và accessibility cơ bản.

---

## 2. Thông tin nhanh

| Thuộc tính | Giá trị |
| --- | --- |
| Tên dự án | Học Đường Store — Website bán đồ dùng học tập |
| Loại dự án | Website thương mại điện tử frontend-only (demo) |
| Ngôn ngữ hiển thị | Tiếng Việt |
| Công nghệ | HTML5, CSS3, JavaScript ES6+ (Vanilla JS) |
| Kiến trúc | Multi-page HTML + một SPA nội bộ ở trang chủ |
| Backend | Chưa có |
| Cơ sở dữ liệu | Chưa có; dùng `localStorage` / `sessionStorage` |
| Build tool | Không có |
| Package manager | Không có `package.json`, không có thư viện npm |
| Thư viện ngoài | Chỉ Google Fonts (Be Vietnam Pro) và ảnh từ Unsplash/URL bên ngoài |
| Điểm vào | `index.html` → tự chuyển hướng tới `page/homepage/main.html` |
| Trình duyệt mục tiêu | Chrome, Edge, Firefox, Safari phiên bản hiện đại |
| Repository | <https://github.com/phicongtai/website-selling-school-supplies> |

---

## 3. Tính năng

### 3.1. Khu vực khách hàng (Storefront)

#### Trang chủ — `page/homepage/main.html`

Trang chủ hoạt động như một **SPA thu nhỏ** với 4 view được điều khiển bởi `homepage.js`:

| View | Hash | Nội dung |
| --- | --- | --- |
| Trang chủ | `#view-home` | Hero banner, danh mục nổi bật, sản phẩm nổi bật |
| Danh mục | `#view-category` | Sidebar lọc + lưới sản phẩm + sắp xếp |
| Chi tiết | `#view-detail` | Chi tiết sản phẩm render động |
| Tìm kiếm nâng cao | `#view-advanced-search` | Từ khóa, danh mục, khoảng giá, gợi ý nhanh |

Các chức năng chính:

- **Điều hướng SPA** không tải lại trang, giữ trạng thái trên URL (`hash` + query params) để reload không mất màn hình đang xem.
- **Tìm kiếm trực tiếp trên header:** gợi ý tối đa 4 sản phẩm theo mã hoặc tên, dropdown đóng khi click ra ngoài.
- **Bộ lọc danh mục:** chọn nhiều danh mục, khoảng giá, đang giảm giá, sản phẩm nổi bật.
- **Sắp xếp:** phổ biến, giá thấp → cao, giá cao → thấp, tên A → Z.
- **Đồng bộ bộ lọc với URL:** `categories`, `min`, `max`, `sort`, `sale`, `hot`, `q`, `cat`.
- **Đếm số lượng sản phẩm** theo từng danh mục và ưu đãi ngay trên sidebar.
- **Tìm kiếm nâng cao:** từ khóa, danh mục, khoảng giá, nút đặt lại và 4 preset giá.
- **Giỏ hàng dạng drawer** ngay trên header: tăng/giảm số lượng, xóa sản phẩm, xem tổng tiền, chuyển tới giỏ hàng hoặc thanh toán.
- **Floating dock** ở góc màn hình với 4 lối tắt: trang chủ, danh mục, tìm kiếm, giỏ hàng.
- **Toast thông báo** khi thêm sản phẩm hoặc đăng ký nhận tin.

> Trang chủ có một phiên bản chi tiết sản phẩm SPA riêng (`renderProductDetail`) dùng `id` số. Trang `page/products/product-detail.html` là phiên bản chi tiết đầy đủ hơn, dùng `code` sản phẩm. Hai cách triển khai này cùng tồn tại trong dự án.

#### Trang danh mục sản phẩm — `page/products/`

- 6 trang danh mục riêng: `pens.html`, `notebooks.html`, `backpacks.html`, `school-supplies.html`, `art.html`, `computers.html`.
- Mỗi trang khai báo danh mục qua `body[data-product-category]`, dùng chung `category.js` và `category.css`.
- **Tìm kiếm trong danh mục** theo mã hoặc tên sản phẩm.
- **Sắp xếp** theo giá thấp/cao, tên A → Z.
- **Phân trang 6 sản phẩm/trang**, có nút trước/sau và số trang.
- **Thêm nhanh vào giỏ** ngay trên card sản phẩm, có phản hồi trạng thái nút và toast.
- Đếm số sản phẩm của từng danh mục trên sidebar.
- Danh mục **Hộp bút** (`cases`) không có trang riêng; chỉ xuất hiện trong bộ lọc của trang chủ.

#### Trang chi tiết sản phẩm — `page/products/product-detail.html`

- Nhận tham số `?id=` là **mã sản phẩm** (ví dụ `HP01`) hoặc **id số** (ví dụ `1`).
- Hiển thị ảnh, danh mục, breadcrumb, mã, tên, giá, giá cũ, phần trăm giảm, quy cách đóng gói, tồn kho và mô tả.
- Chọn số lượng trong khoảng `1..stock`, có nút tăng/giảm và thông báo lỗi khi vượt tồn kho.
- Nút **Thêm vào giỏ hàng** cập nhật `window.StoreCart` và hiển thị toast.
- Nút **Mua ngay** hiện chỉ hiển thị thông báo tổng tiền, chưa chuyển sang trang thanh toán.
- Khối **sản phẩm cùng loại** (tối đa 4); nếu danh mục chỉ có một sản phẩm, tự gợi ý sản phẩm nổi bật khác.
- Nhãn **Best/Hot** hiển thị theo thuộc tính `hot` của sản phẩm.

#### Giỏ hàng và đơn hàng — `page/customer/cart.html`

- Hiển thị **đơn nháp** được tạo từ giỏ hàng hiện tại với trạng thái “Chờ thanh toán”.
- Hiển thị thêm 2 đơn hàng mẫu: một đơn “Đang giao” và một đơn “Hoàn thành”.
- **Tab lọc:** tất cả, đang xử lý, hoàn thành; số lượng cập nhật động.
- **Tìm kiếm đơn** theo mã đơn hoặc tên sản phẩm.
- **Chỉnh số lượng** trực tiếp trong đơn nháp, xóa sản phẩm khỏi giỏ.
- **Theo dõi đơn:** hiển thị toast trạng thái giao hàng và ngày dự kiến.
- **Mua lại:** thêm lại toàn bộ sản phẩm của đơn cũ vào giỏ.
- **Mở rộng đơn bị thu gọn** để xem toàn bộ sản phẩm.
- Trạng thái rỗng có CTA quay lại mua sắm.
- Mọi trang storefront đều có **cart drawer** dùng chung qua `assets/js/site.js`; riêng trang chủ có drawer riêng.

#### Thanh toán — `page/customer/checkout.html`

- Hiển thị thông tin người mua lấy từ hồ sơ: họ tên, số điện thoại, email.
- **Chọn địa chỉ giao hàng** từ sổ địa chỉ; địa chỉ mặc định được chọn sẵn.
- **Thêm địa chỉ mới** ngay tại trang thanh toán: tỉnh/thành, quận/huyện, phường/xã, số nhà.
- Tùy chọn **lưu địa chỉ mới** vào sổ địa chỉ.
- **Phương thức thanh toán:** thanh toán trực tuyến hoặc COD.
- **Mã giảm giá `WELCOME2026`** giảm 20% tạm tính (demo).
- **Ghi chú giao hàng** không bắt buộc.
- Tóm tắt đơn: số sản phẩm, tạm tính, giảm giá, tổng cộng (đã bao gồm VAT).
- Khi đặt hàng:
  - Kiểm tra giỏ hàng và địa chỉ.
  - Tạo mã đơn dạng `HD` + 7 chữ số cuối của timestamp.
  - Lưu đơn vào `hds_last_order_v1`.
  - Xóa giỏ hàng.
  - Chuyển sang `order-success.html`.
- Nếu giỏ trống, nút đặt hàng bị vô hiệu hóa và có CTA mua sắm.

#### Đặt hàng thành công — `page/customer/order-success.html`

- Hiển thị mã đơn, ngày đặt, địa chỉ, phương thức thanh toán, ngày dự kiến giao.
- Danh sách sản phẩm, số lượng, đơn giá và tổng tiền.
- Hiển thị giảm giá nếu có.
- Nếu chưa có đơn thật trong `localStorage`, trang tự tạo **đơn fallback** từ giỏ hàng hiện tại hoặc 2 sản phẩm mẫu.
- Lời cảm ơn hiển thị tên khách hàng mới nhất từ hồ sơ.

#### Tài khoản cá nhân — `page/customer/profile.html`

- Xem và chỉnh sửa hồ sơ: họ tên, ngày sinh, email, số điện thoại, mã học sinh.
- Chế độ xem/chỉnh sửa chuyển đổi ngay trên trang.
- **Sổ địa chỉ:** thêm, sửa, xóa, đặt mặc định.
- Modal thêm/sửa địa chỉ có validate HTML, đóng bằng nút, click nền hoặc `Escape`.
- Các mục “Phương thức thanh toán”, “Đổi mật khẩu”… hiện chỉ hiển thị toast “sẽ sớm được cập nhật”.

#### Đăng nhập / Đăng ký — `page/auth/`

- **Đăng nhập:** tên đăng nhập/email, mật khẩu, ghi nhớ đăng nhập, hiện/ẩn mật khẩu.
- **Đăng ký:** họ tên, username, email, số điện thoại, mật khẩu, xác nhận mật khẩu và địa chỉ mặc định.
- Kiểm tra mật khẩu nhập lại theo thời gian thực; báo “Khớp” / “Chưa khớp”.
- Có nút đăng ký bằng Google và Email Giáo dục (chỉ là giao diện).
- **Chưa có xác thực thật:** submit form hợp lệ sẽ chuyển về trang chủ, không lưu tài khoản.

### 3.2. Khu vực quản trị (Admin)

Sidebar admin gồm 4 nhóm chính: **Người dùng**, **Sản phẩm**, **Đơn hàng**, **Thống kê**; cuối sidebar có tài khoản quản trị và đăng xuất.

| Màn hình | Đường dẫn | Chức năng chính |
| --- | --- | --- |
| A01 — Đăng nhập quản trị | `admin_page/A01 Đăng nhập quản trị/index.html` | Đăng nhập demo, ghi nhớ username, hiện/ẩn mật khẩu |
| A02 — Quản lý người dùng | `admin_page/A02 Quản lý người dùng/index.html` | Bảng người dùng, thống kê, tìm kiếm, lọc, khóa/mở khóa, xuất CSV |
| A03 — Thêm người dùng | `admin_page/A03 Thêm người dùng/index.html` | Form thêm người dùng dạng overlay, lưu tạm, quay lại A02 |
| A04 — Sửa người dùng | `admin_page/A04 Sửa người dùng/index.html` | Form sửa người dùng, nhận `?code=`, lưu tạm, quay lại A02 |
| A05 — Quản lý sản phẩm | `admin_page/A05 Quản lý sản phẩm/index.html` | Bảng sản phẩm, thống kê, lọc, chọn nhiều, xóa/ẩn, thêm, xuất CSV |
| A06 — Thêm sản phẩm | `admin_page/A06 Thêm sản phẩm/index.html` | Form thêm sản phẩm, mã tự động, ảnh mẫu/upload, xem trước giá |
| A07 — Sửa sản phẩm | `admin_page/A07_sửa_sản _phẩm/index.html` | Form sửa sản phẩm, nhận `?code=`, đồng bộ lại A05 |
| A08 — Xóa sản phẩm chưa bán | `admin_page/A08_xóa_sản _phẩm_chưa_bán/index.html` | Modal xác nhận xóa vĩnh viễn; chặn nếu đã phát sinh đơn |
| A09 — Ẩn sản phẩm đã bán | `admin_page/A09_xóa_sản_phẩm_đã_bán/index.html` | Modal xác nhận ẩn sản phẩm đã bán, toast và phân trang demo |
| A10 — Quản lý đơn hàng | `admin_page/A10 Quản lí đơn hàng/index.html` | Tab trạng thái, bộ lọc, đổi trạng thái, tạo đơn tại quầy, xuất CSV |
| A11 — Chi tiết đơn hàng | `admin_page/A11 chi tiết đơn hàng/index.html` | Chi tiết đơn, tiến trình, cập nhật trạng thái, audit log |
| A12 — Thống kê khách hàng | `admin_page/A12 thống kê khách hàng/index.html` | Lọc theo ngày, KPI, top khách hàng, chi tiết đơn, xuất CSV |

#### A01 — Đăng nhập quản trị

- Form đăng nhập có username, password, checkbox ghi nhớ phiên.
- Hiện/ẩn mật khẩu bằng SVG.
- **Demo:** mọi thông tin đều được chấp nhận; để trống cũng đăng nhập được.
- Lưu `hd_admin_saved_username` (localStorage) nếu chọn ghi nhớ.
- Lưu `hd_admin_authenticated` và `hd_admin_user` (sessionStorage).
- Chuyển hướng tới A02 sau khoảng 400 ms.

#### A02 — Quản lý người dùng

- 8 tài khoản mẫu `U01`–`U08`: 6 khách hàng, 1 nhân viên, 2 tài khoản bị khóa (trong đó có 1 nhân viên).
- Thẻ thống kê: tổng tài khoản, đang hoạt động, đã khóa.
- Bảng: mã, họ tên + avatar chữ cái, username, email, số điện thoại, trạng thái, thao tác.
- Tìm kiếm theo mã, tên, username, email, số điện thoại.
- Lọc theo trạng thái hoạt động/đã khóa.
- Khóa/mở khóa tài khoản ngay trên bảng, lưu tạm vào `hd_temp_users`.
- Nút “Sửa” mở A04 với `?code=U01`.
- Làm mới danh sách để quay về dữ liệu gốc.
- Xuất CSV UTF-8 có BOM (mở được bằng Excel).
- Phân trang demo (thao tác hiện tải lại trang 1).
- Toast phản hồi thao tác và flash message khi quay về từ A03/A04.

#### A03 / A04 — Thêm và sửa người dùng

- Là các **trang overlay toàn màn hình** mô phỏng modal, nền phía sau là bảng A02.
- A03: mã người dùng tự tăng, username, họ tên, email, số điện thoại, mật khẩu, xác nhận mật khẩu, vai trò, trạng thái.
- A04: nhận `?code=` hoặc `?id=`, điền sẵn dữ liệu; mã và username cố định; mật khẩu mới có thể để trống.
- Validate các trường bắt buộc, định dạng email/số điện thoại, mật khẩu tối thiểu.
- Lưu thay đổi vào `sessionStorage` (`hd_temp_users`) và quay về A02.
- Đóng bằng nút Hủy, `Escape`, click ra ngoài hoặc sau khi lưu thành công.
- Hiện/ẩn mật khẩu, khóa/mở khóa tài khoản ngay trên bảng nền.

#### A05 — Quản lý sản phẩm

- 8 sản phẩm mẫu `SP01`–`SP08`, dùng ảnh cục bộ trong `assets/img/`.
- Thẻ thống kê: tổng sản phẩm, đang bán, đã ẩn, tổng đã bán.
- Bảng: checkbox chọn, mã, ảnh + tên, giá, trạng thái, đã bán, thao tác.
- Tìm kiếm theo mã/tên/danh mục; lọc danh mục và trạng thái.
- Chọn tất cả / chọn từng dòng.
- Nút thêm sản phẩm mở modal (đồng bộ với A06).
- Xóa sản phẩm chưa bán: mở modal A08, chỉ cho xóa khi `sold = 0`.
- Ẩn sản phẩm đã bán: mở modal A09, giữ dữ liệu nhưng chuyển trạng thái `hidden`.
- Xuất CSV danh sách sản phẩm.
- Phân trang demo.
- Lưu danh sách trong `sessionStorage`; **F5 sẽ khôi phục dữ liệu mẫu**.
- Hiển thị ngày hiện tại trên topbar.

#### A06 / A07 — Thêm và sửa sản phẩm

- Form chia 4 nhóm: thông tin cơ bản, quy cách & tiêu chuẩn học tập, hình ảnh, hiển thị storefront.
- Trường chính: tên, danh mục, tồn kho, giá bán, SKU, mô tả, thương hiệu, đơn vị tính, cấp học phù hợp.
- Mã sản phẩm mới tự động tăng; SKU gợi ý theo danh mục.
- Xem trước giá bán theo thời gian thực.
- Chọn **ảnh mẫu** từ bộ ảnh sản phẩm của dự án hoặc **tải ảnh JPG/PNG/WebP** từ máy.
- Toggle bật/tắt hiển thị storefront; trạng thái chuyển giữa `active` và `hidden`.
- A07 nhận `?code=SP01`, điền sẵn dữ liệu, hiển thị thêm chỉ số giao dịch (đã bán, số đơn).
- Lưu vào `sessionStorage` và quay lại A05 kèm toast.
- **Lưu ý:** ảnh upload từ máy dùng `blob:` URL tạm, không được lưu vĩnh viễn.

#### A08 / A09 — Xóa và ẩn sản phẩm

Đây là hai trang độc lập mô phỏng luồng xác nhận:

- **A08 — Xóa sản phẩm chưa bán:**
  - Modal xác nhận xóa vĩnh viễn.
  - Chặn xóa nếu `sold > 0` và hiển thị thông báo.
  - Xóa dòng khỏi bảng khi hợp lệ.
- **A09 — Ẩn sản phẩm đã bán:**
  - Modal xác nhận ẩn sản phẩm.
  - Hiển thị số đơn đã phát sinh, cảnh báo dữ liệu được giữ lại.
  - Cập nhật trạng thái sản phẩm và hiển thị toast.
  - Có phân trang demo 125 trang.

Cả hai đều hỗ trợ đóng bằng `Escape`, click nền, quản lý focus và trap focus trong modal.

#### A10 / A11 / A12 — Cụm quản trị đơn hàng

Ba trang dùng chung `admin_page/shared/order-store.js` với:

- 10 đơn mẫu `DH1001`–`DH1010`.
- 6 khách hàng mẫu `KH001`–`KH006`.
- 4 trạng thái: `pending`, `confirmed`, `delivered`, `cancelled`.
- Lưu trạng thái, đơn tạo tại quầy và audit log vào `localStorage`.
- Cơ chế fallback `localStorage → sessionStorage → bộ nhớ tạm → window.name/history.state` cho môi trường chặn storage.
- Tự khôi phục dữ liệu mẫu khi F5 hoặc mở trực tiếp; giữ thay đổi khi điều hướng trong cụm A10–A12.
- Đồng bộ giữa nhiều tab qua sự kiện `storage`.

**A10 — Quản lý đơn hàng:**

- Tab: tất cả, chưa duyệt, đang xử lý, đã kết thúc; có badge số lượng.
- Bộ lọc: tình trạng, từ ngày, đến ngày, địa điểm giao, tìm theo mã/tên khách.
- Bảng: mã đơn, khách hàng, ngày đặt, địa chỉ, tổng tiền, tình trạng, thao tác.
- Link mã đơn sang A11; link khách hàng sang A12.
- Đổi trạng thái nhanh: `pending → confirmed → delivered`; có thể hủy khi chưa hoàn tất.
- Modal **Tạo đơn hàng tại quầy**: khách hàng, địa chỉ, khu vực, tổng tiền.
- Xuất CSV danh sách đơn đang lọc.
- Đơn đã giao/đã hủy bị khóa thao tác.

**A11 — Chi tiết đơn hàng:**

- Nhận `?order=DH1003`; nếu không có sẽ dùng đơn mặc định.
- Hiển thị mã đơn, ngày tạo, kênh đặt, khách hàng, email, điện thoại, hạng thành viên.
- Địa chỉ giao, người nhận, thanh toán, ghi chú.
- Bảng sản phẩm, đơn giá, số lượng, tạm tính, tổng tiền.
- Tiến trình 3 bước: Chưa xác nhận → Đã xác nhận → Đã giao.
- Cập nhật trạng thái một chiều; không thể quay lại trạng thái trước.
- Ghi chú xử lý tùy chọn; lưu audit log với thời gian và người thao tác.
- Đơn đã giao/đã hủy bị khóa và hiển thị lý do.
- Toast phản hồi và modal xác nhận chuyển trạng thái.

**A12 — Thống kê khách hàng:**

- Lọc theo khoảng ngày (mặc định `01/10/2026` – `10/10/2026`).
- KPI: tổng doanh thu, tổng đơn, số khách hàng, tổng tài khoản.
- Top 5 khách hàng mua nhiều nhất, có hạng và tổng chi tiêu.
- Xem chi tiết đơn của từng khách, mở rộng/thu gọn.
- Modal chi tiết báo cáo.
- Xuất CSV UTF-8 có BOM với đầy đủ mã khách, họ tên, email, điện thoại, thành phố, hạng, chi tiêu, đơn hàng và mặt hàng.
- Kết hợp dữ liệu khách hàng mẫu với trạng thái đơn từ `HDOrderStore`.

---

## 4. Cấu trúc thư mục

```text
website-selling-school-supplies/
├── index.html                     # Chuyển hướng về page/homepage/main.html
├── README.md                      # Tài liệu dự án
├── download_all_products.ps1      # Script PowerShell tải ảnh sản phẩm mẫu
├── test_audit.cjs                 # Script Node kiểm tra link CSS trong các file HTML
│
├── assets/
│   ├── css/
│   │   └── style.css              # Design system dùng chung: tokens, reset, component, utility
│   ├── js/
│   │   ├── cart.js                # StoreCart: giỏ hàng localStorage dùng chung
│   │   └── site.js                # Toast, cart drawer, tìm kiếm Enter cho storefront
│   ├── icons/                     # 75 icon SVG (logo, giỏ hàng, admin, danh mục, trạng thái...)
│   │   ├── README.md              # Hướng dẫn và danh mục icon
│   │   └── preview.html           # Trang xem trước icon
│   └── img/                       # Ảnh sản phẩm cục bộ (product-1..7, balo-chong-gu-sp17)
│
├── page/
│   ├── homepage/
│   │   ├── main.html              # Trang chủ + SPA view danh mục/chi tiết/tìm kiếm
│   │   ├── homepage.css           # Style riêng trang chủ + biến thể storefront
│   │   └── homepage.js            # SPA engine, lọc, tìm kiếm, chi tiết, cart drawer
│   ├── products/
│   │   ├── product-data.js        # Catalog 54 sản phẩm, 7 danh mục
│   │   ├── pens.html              # Danh mục Bút viết
│   │   ├── notebooks.html         # Danh mục Vở & giấy
│   │   ├── backpacks.html         # Danh mục Cặp & balo
│   │   ├── school-supplies.html   # Danh mục Dụng cụ học tập
│   │   ├── art.html               # Danh mục Dụng cụ vẽ & mỹ thuật
│   │   ├── computers.html         # Danh mục Máy tính & thiết bị học tập
│   │   ├── category.js            # Tìm kiếm, sắp xếp, phân trang, thêm giỏ cho danh mục
│   │   ├── category.css           # Layout trang danh mục
│   │   ├── product-detail.html    # Trang chi tiết sản phẩm
│   │   ├── product-detail.js      # Render chi tiết, số lượng, sản phẩm liên quan
│   │   ├── product-detail.css     # Style trang chi tiết
│   │   └── README.txt             # Ghi chú lịch sử chỉnh sửa trang sản phẩm
│   ├── auth/
│   │   ├── login.html             # Đăng nhập khách hàng
│   │   ├── register.html          # Đăng ký khách hàng
│   │   ├── auth.js                # Hiện/ẩn mật khẩu, validate đăng ký (demo)
│   │   └── auth.css               # Style khu vực xác thực
│   └── customer/
│       ├── cart.html              # Giỏ hàng & đơn hàng
│       ├── checkout.html          # Thanh toán
│       ├── order-success.html     # Đặt hàng thành công
│       ├── profile.html           # Hồ sơ & sổ địa chỉ
│       ├── customer.js            # Logic 4 màn hình khách hàng
│       └── customer.css           # Style khu vực khách hàng
│
└── admin_page/
    ├── shared/
    │   └── order-store.js         # HDOrderStore dùng chung cho A10/A11/A12
    ├── A01 Đăng nhập quản trị/
    │   ├── index.html
    │   ├── admin.js
    │   └── admin.css
    ├── A02 Quản lý người dùng/
    │   ├── index.html
    │   ├── admin.js
    │   └── admin.css              # Shell/sidebar admin được các trang khác tái sử dụng
    ├── A03 Thêm người dùng/
    ├── A04 Sửa người dùng/
    ├── A05 Quản lý sản phẩm/
    ├── A06 Thêm sản phẩm/
    ├── A07_sửa_sản _phẩm/
    ├── A08_xóa_sản _phẩm_chưa_bán/
    ├── A09_xóa_sản_phẩm_đã_bán/
    ├── A10 Quản lí đơn hàng/
    ├── A11 chi tiết đơn hàng/
    └── A12 thống kê khách hàng/
```

Mỗi thư mục `A01`–`A12` đều có bộ ba `index.html`, `admin.js`, `admin.css` riêng. Riêng A05, A10, A11, A12 còn tái sử dụng `A02 Quản lý người dùng/admin.css` để đồng bộ layout sidebar/topbar.

> **Lưu ý về tên thư mục:** một số thư mục admin có khoảng trắng hoặc dấu gạch dưới không đồng nhất (`A07_sửa_sản _phẩm`, `A08_xóa_sản _phẩm_chưa_bán`). Khi dùng terminal cần đặt đường dẫn trong dấu nháy.

---

## 5. Sitemap và đường dẫn

### 5.1. Storefront

| Trang | Đường dẫn | Ghi chú |
| --- | --- | --- |
| Điểm vào | `index.html` | Tự chuyển hướng sang trang chủ |
| Trang chủ | `page/homepage/main.html` | SPA 4 view |
| Danh mục Bút viết | `page/products/pens.html` | |
| Danh mục Vở & giấy | `page/products/notebooks.html` | |
| Danh mục Cặp & balo | `page/products/backpacks.html` | |
| Danh mục Dụng cụ học tập | `page/products/school-supplies.html` | |
| Danh mục Mỹ thuật | `page/products/art.html` | |
| Danh mục Máy tính & thiết bị | `page/products/computers.html` | |
| Chi tiết sản phẩm | `page/products/product-detail.html?id=HP01` | Nhận `code` hoặc `id` |
| Giỏ hàng & đơn hàng | `page/customer/cart.html` | `?tab=orders` để cuộn tới danh sách đơn |
| Thanh toán | `page/customer/checkout.html` | |
| Đặt hàng thành công | `page/customer/order-success.html` | |
| Tài khoản | `page/customer/profile.html` | `#addresses` để tới sổ địa chỉ |
| Đăng nhập | `page/auth/login.html` | |
| Đăng ký | `page/auth/register.html` | |

### 5.2. Admin

| Trang | Đường dẫn | Tham số |
| --- | --- | --- |
| A01 | `admin_page/A01 Đăng nhập quản trị/index.html` | — |
| A02 | `admin_page/A02 Quản lý người dùng/index.html` | — |
| A03 | `admin_page/A03 Thêm người dùng/index.html` | — |
| A04 | `admin_page/A04 Sửa người dùng/index.html` | `?code=U01` |
| A05 | `admin_page/A05 Quản lý sản phẩm/index.html` | — |
| A06 | `admin_page/A06 Thêm sản phẩm/index.html` | — |
| A07 | `admin_page/A07_sửa_sản _phẩm/index.html` | `?code=SP01` |
| A08 | `admin_page/A08_xóa_sản _phẩm_chưa_bán/index.html` | — |
| A09 | `admin_page/A09_xóa_sản_phẩm_đã_bán/index.html` | — |
| A10 | `admin_page/A10 Quản lí đơn hàng/index.html` | `?q=từ-khóa` |
| A11 | `admin_page/A11 chi tiết đơn hàng/index.html` | `?order=DH1003` |
| A12 | `admin_page/A12 thống kê khách hàng/index.html` | `?customer=KH003` |

### 5.3. Tham số URL của trang chủ

| Tham số | Giá trị | Ý nghĩa |
| --- | --- | --- |
| `q` / `search` | chuỗi | Từ khóa tìm kiếm nâng cao |
| `categories` | `pens,notebooks,...` | Nhiều danh mục, phân tách bằng dấu phẩy |
| `category` | mã danh mục | Danh mục đơn |
| `cat` | mã danh mục / `all` | Danh mục trong tìm kiếm nâng cao |
| `min` | số | Giá tối thiểu |
| `max` | số | Giá tối đa |
| `sort` | `default`, `price-asc`, `price-desc`, `name` | Kiểu sắp xếp |
| `sale` | `1` | Chỉ sản phẩm đang giảm giá |
| `hot` | `1` | Chỉ sản phẩm nổi bật |
| Hash | `view-home`, `view-category`, `view-detail`, `view-advanced-search` | Màn hình đang hiển thị |

---

## 6. Luồng nghiệp vụ

### 6.1. Luồng mua hàng

```text
Trang chủ / Danh mục
        │
        ├── Tìm kiếm, lọc, sắp xếp
        │
        ▼
Chi tiết sản phẩm
        │  chọn số lượng
        ▼
Thêm vào giỏ (StoreCart + localStorage)
        │
        ├── Cart drawer: tăng/giảm/xóa
        │
        ▼
Giỏ hàng & đơn hàng (cart.html)
        │  kiểm tra đơn nháp
        ▼
Thanh toán (checkout.html)
        │  chọn địa chỉ / thêm địa chỉ
        │  chọn thanh toán
        │  áp voucher WELCOME2026
        ▼
Tạo đơn + lưu hds_last_order_v1 + xóa giỏ
        │
        ▼
Đặt hàng thành công (order-success.html)
```

### 6.2. Luồng trạng thái đơn hàng (Admin)

```text
pending (Chưa xác nhận)
    ├──► confirmed (Đã xác nhận)
    │        ├──► delivered (Đã giao – Thành công)
    │        └──► cancelled (Đã huỷ)
    └──► cancelled (Đã huỷ)
```

- Luồng **một chiều**, không hỗ trợ quay lại trạng thái trước.
- `delivered` và `cancelled` là trạng thái cuối, khóa thao tác.
- Mỗi lần đổi trạng thái ghi một bản ghi vào audit log kèm thời gian và ghi chú.

### 6.3. Luồng quản lý người dùng

```text
A02 danh sách người dùng
   ├── Sửa  ──► A04 (?code=U01) ──► lưu sessionStorage ──► A02
   ├── Khóa / Mở khóa ──► cập nhật sessionStorage ──► A02
   ├── Xuất CSV
   └── Làm mới ──► khôi phục 8 user mẫu
```

### 6.4. Luồng quản lý sản phẩm

```text
A05 danh sách sản phẩm
   ├── Thêm mới ──► A06 ──► sessionStorage ──► A05
   ├── Sửa ──► A07 (?code=SP01) ──► sessionStorage ──► A05
   ├── Xóa (sold = 0) ──► modal A08 ──► xóa dòng
   ├── Ẩn (đã bán) ──► modal A09 ──► status = hidden
   ├── Xuất CSV
   └── F5 ──► khôi phục 8 sản phẩm mẫu
```

---

## 7. Dữ liệu và lưu trữ

### 7.1. Catalog sản phẩm — `page/products/product-data.js`

Dữ liệu được gắn vào `window.StoreCatalog`:

```js
window.StoreCatalog = {
  categories: {
    pens: "Bút viết",
    notebooks: "Vở & giấy",
    backpacks: "Cặp & balo",
    cases: "Hộp bút",
    art: "Dụng cụ vẽ & mỹ thuật",
    "school-supplies": "Dụng cụ học tập",
    computers: "Máy tính & thiết bị học tập"
  },
  products: [
    {
      id: 1,
      code: "HP01",
      title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm",
      category: "pens",
      price: 65000,
      oldPrice: 85000,
      stock: 120,
      pack: "10 cây / Bộ",
      image: "https://images.unsplash.com/...",
      description: "...",
      featured: true,
      hot: false
    }
  ]
};
```

| Trường | Bắt buộc | Mô tả |
| --- | --- | --- |
| `id` | Có | ID số, dùng cho giỏ hàng |
| `code` | Có | Mã sản phẩm, dùng cho URL chi tiết |
| `title` | Có | Tên hiển thị |
| `category` | Có | Khóa danh mục trong `categories` |
| `price` | Có | Giá bán (VNĐ) |
| `oldPrice` | Không | Giá gốc, tạo nhãn giảm giá |
| `stock` | Có | Tồn kho |
| `pack` | Không | Quy cách đóng gói |
| `image` | Có | URL ảnh |
| `description` | Không | Mô tả chi tiết |
| `featured` | Không | Hiển thị ở “Sản phẩm nổi bật” |
| `hot` | Không | Nhãn “Hot” |

**Thống kê catalog hiện tại:**

| Danh mục | Số sản phẩm | Khoảng giá |
| --- | ---: | --- |
| Bút viết (`pens`) | 10 | 18.000 – 195.000 ₫ |
| Vở & giấy (`notebooks`) | 9 | 10.000 – 89.000 ₫ |
| Cặp & balo (`backpacks`) | 9 | 99.000 – 459.000 ₫ |
| Hộp bút (`cases`) | 1 | 68.000 ₫ |
| Dụng cụ vẽ & mỹ thuật (`art`) | 8 | 55.000 – 420.000 ₫ |
| Dụng cụ học tập (`school-supplies`) | 9 | 5.000 – 385.000 ₫ |
| Máy tính & thiết bị (`computers`) | 8 | 159.000 – 11.900.000 ₫ |
| **Tổng** | **54** | **5.000 – 11.900.000 ₫** |

- 7 sản phẩm có `featured: true`.
- 4 sản phẩm có `hot: true`.
- 36 sản phẩm có `oldPrice`.

### 7.2. Khóa lưu trữ Storefront

| Khóa | Nơi lưu | Nội dung |
| --- | --- | --- |
| `hds_cart_v1` | `localStorage` | Giỏ hàng `[{ id, quantity }]` |
| `hds_profile_v1` | `localStorage` | Hồ sơ khách hàng |
| `hds_addresses_v1` | `localStorage` | Sổ địa chỉ |
| `hds_last_order_v1` | `localStorage` | Đơn hàng vừa đặt |

Giỏ hàng mặc định ban đầu có `{ id: 1, quantity: 1 }` và `{ id: 3, quantity: 2 }`, tương ứng badge “3”. Nếu `localStorage` bị chặn, giỏ vẫn hoạt động trong phiên hiện tại nhưng không đồng bộ giữa các trang.

`window.StoreCart` cung cấp:

| Hàm | Mô tả |
| --- | --- |
| `get()` | Đọc giỏ hàng |
| `set(cart)` | Ghi đè giỏ hàng |
| `count(cart?)` | Tổng số lượng |
| `updateBadges()` | Cập nhật badge `.cart-count-badge` |
| `add(id, quantity)` | Thêm sản phẩm |
| `setQuantity(id, quantity)` | Đặt số lượng; `0` sẽ xóa |
| `remove(id)` | Xóa sản phẩm |
| `window.addToCart(id, quantity)` | Thêm + toast |
| `cart:changed` event | Sự kiện phát ra sau mỗi lần ghi |

### 7.3. Khóa lưu trữ Admin

| Khóa | Nơi lưu | Nội dung |
| --- | --- | --- |
| `hd_admin_saved_username` | `localStorage` | Username đã ghi nhớ |
| `hd_admin_authenticated` | `sessionStorage` | Cờ đăng nhập demo |
| `hd_admin_user` | `sessionStorage` | Tên hiển thị trên sidebar |
| `hd_temp_users` | `sessionStorage` | Danh sách người dùng sau thêm/sửa/khóa |
| `hd_users_data` | `localStorage` | Bản sao dữ liệu người dùng cũ (được dọn khi reload) |
| `hd_toast_message` | `sessionStorage` | Flash toast chuyển trang A02 ↔ A03/A04 |
| `hocduong_admin_products_session_v2` | `sessionStorage` | Danh sách sản phẩm admin |
| `hocduong_admin_toast` | `sessionStorage` | Toast sau khi thêm/sửa sản phẩm |
| `hd_admin_order_status` | `localStorage` | Ghi đè trạng thái đơn |
| `hd_admin_custom_orders` | `localStorage` | Đơn tạo tại quầy |
| `hd_admin_order_audit` | `localStorage` | Nhật ký xử lý đơn |
| `hd_admin_order_filters` | `localStorage` | Trạng thái bộ lọc đơn |
| `hd_admin_customer_range` | `localStorage` | Khoảng ngày thống kê |
| `hd_admin_customer_expanded` | `localStorage` | Các thẻ khách hàng đang mở |

### 7.4. `HDOrderStore` — `admin_page/shared/order-store.js`

Đây là API dùng chung cho A10, A11, A12:

| API | Mô tả |
| --- | --- |
| `HDOrderStore.CUSTOMERS` | Danh sách khách hàng mẫu |
| `HDOrderStore.STATUS_LABELS` | Nhãn 4 trạng thái đơn |
| `getCustomer(id)` | Lấy khách hàng theo mã |
| `getOrders()` | Lấy toàn bộ đơn, đã áp dụng ghi đè trạng thái |
| `getOrder(code)` | Lấy một đơn |
| `nextCode()` | Sinh mã đơn kế tiếp `DHxxxx` |
| `updateStatus(code, status, note)` | Cập nhật trạng thái + ghi audit log |
| `getAuditEntries(code)` | Lấy lịch sử xử lý của đơn |
| `getStatusOverrides()` | Lấy bảng ghi đè trạng thái |
| `resetOrders()` | Xóa toàn bộ thay đổi, quay về dữ liệu mẫu |
| `addOrder(order)` | Thêm đơn tạo tại quầy |
| `readState(key, fallback)` | Đọc state an toàn |
| `writeState(key, value)` | Ghi state an toàn |
| `removeState(key)` | Xóa state |
| `formatMoney(amount)` | Định dạng `1.000đ` |
| `formatDateVN(isoDate)` | Đổi `YYYY-MM-DD` sang `DD/MM/YYYY` |

Cơ chế lưu trữ nhiều lớp: `localStorage` → `sessionStorage` → `Map` trong bộ nhớ → `window.name` / `history.state`. Nhờ vậy các thao tác vẫn giữ được trạng thái trong môi trường preview hoặc chế độ riêng tư chặn storage.

### 7.5. Quy tắc reset dữ liệu demo

| Khu vực | Hành vi |
| --- | --- |
| Giỏ hàng | Giữ nguyên trong `localStorage`; có dữ liệu mặc định nếu chưa có |
| Hồ sơ / địa chỉ | Giữ nguyên trong `localStorage` |
| Đơn khách hàng vừa đặt | Lưu tới khi đặt đơn mới |
| A02/A03/A04 | Thay đổi giữ trong phiên; F5 hoặc nút làm mới trả về 8 user mẫu |
| A05/A06/A07 | Thay đổi giữ trong phiên; F5 trả về 8 sản phẩm mẫu |
| A08/A09 | Thao tác chỉ diễn ra trên trang hiện tại |
| A10/A11/A12 | F5 hoặc mở trực tiếp sẽ reset; điều hướng trong cụm giữ thay đổi |

---

## 8. Thiết kế và giao diện

### 8.1. Phong cách

- Tên hệ thống thiết kế: **Vibrant Academic Minimal**.
- Tinh thần: tối giản, sáng, nhiều khoảng trắng, điểm nhấn cam, phù hợp môi trường học đường.
- Font: **Be Vietnam Pro** (Google Fonts), hỗ trợ tiếng Việt tốt.
- Giao diện tiếng Việt, số liệu định dạng `vi-VN`, tiền tệ `₫`.

### 8.2. Design tokens chính

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--color-primary` | `#FF6900` | Cam thương hiệu |
| `--color-primary-800` | `#8A3500` | Nâu cam đậm cho nút/nhấn |
| `--color-secondary` | `#212121` | Đen xám |
| `--color-tertiary` | `#009EFB` | Xanh tri thức |
| `--color-neutral` | `#757575` | Xám trung tính |
| `--color-danger` | `#D32F2F` | Lỗi / xóa |
| `--color-success` | `#10B981` | Thành công |
| `--color-warning` | `#F59E0B` | Cảnh báo |
| `--bg-page` | `#f7f8fa` | Nền trang |
| `--bg-surface` | `#ffffff` | Nền card/bảng |
| `--radius-sm/md/lg/xl` | `8/12/18/24px` | Bo góc |
| `--shadow-sm/md/lg` | Đổ bóng nhẹ → vừa | Chiều sâu |
| `--container-max` | `1240px` | Chiều rộng nội dung storefront |

Các token được khai báo trong `assets/css/style.css`; `homepage.css` và một số CSS trang định nghĩa thêm biến cục bộ.

### 8.3. Thành phần giao diện

- Top announcement bar, header sticky, thanh điều hướng chính.
- Hero banner, category card, product card.
- Filter sidebar, advanced search panel, sort select, pagination.
- Cart drawer, toast, floating dock.
- Auth panel, membership panel, form fields có icon.
- Admin sidebar tối `#1f1f1f`, topbar, breadcrumb, stat card, data table, filter toolbar, modal, toast.
- Icon SVG trong `assets/icons/` dùng qua `<img>`, CSS background hoặc inline SVG.

### 8.4. Responsive

- Storefront dùng `@media` tại các mốc khoảng `1000px`, `760px`, `420px`.
- Danh mục chuyển từ 3 cột → 2 cột → 1 cột sidebar.
- Header search xuống hàng trên mobile.
- Admin sidebar có nút menu mobile ở một số trang.
- Modal và drawer có xử lý focus, `Escape`, click nền.

### 8.5. Accessibility

- Nhiều thành phần có `aria-label`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-hidden`.
- Modal có `role="dialog"`, `aria-modal`, focus management và trap focus ở A08/A09.
- Hỗ trợ `prefers-reduced-motion` ở một số animation.
- Nút có `title`, `aria-label`; input có label hoặc `aria-label`.
- Tuy nhiên chưa có audit accessibility đầy đủ.

---

## 9. Cài đặt và chạy dự án

### 9.1. Yêu cầu

- Trình duyệt hiện đại (Chrome, Edge, Firefox, Safari).
- Không bắt buộc cài Node.js hay Python.
- Khuyến nghị chạy qua HTTP server để `localStorage`, đường dẫn tương đối và chuyển trang hoạt động ổn định.

### 9.2. Cách 1 — Mở trực tiếp

Mở file:

```text
index.html
```

Trình duyệt sẽ tự chuyển tới `page/homepage/main.html`.

Cách này phù hợp để xem giao diện nhanh, nhưng một số trình duyệt có thể hạn chế `localStorage` hoặc chặn tài nguyên khi dùng `file://`.

### 9.3. Cách 2 — Chạy static server (khuyến nghị)

Tại thư mục gốc dự án:

```bash
# Dùng npx serve
npx serve . -l 3000
```

Hoặc dùng Python:

```bash
# Python 3
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:3000/
```

hoặc:

```text
http://localhost:8080/
```

### 9.4. Cách 3 — VS Code Live Server

1. Cài extension **Live Server**.
2. Chuột phải vào `index.html`.
3. Chọn **Open with Live Server**.

### 9.5. Truy cập nhanh

| Khu vực | URL |
| --- | --- |
| Storefront | `http://localhost:3000/page/homepage/main.html` |
| Đăng nhập khách hàng | `http://localhost:3000/page/auth/login.html` |
| Giỏ hàng | `http://localhost:3000/page/customer/cart.html` |
| Thanh toán | `http://localhost:3000/page/customer/checkout.html` |
| Admin | `http://localhost:3000/admin_page/A01%20%C4%90%C4%83ng%20nh%E1%BA%ADp%20qu%E1%BA%A3n%20tr%E1%BB%8B/index.html` |

> Nếu URL có dấu tiếng Việt bị lỗi, hãy điều hướng từ giao diện hoặc mã hóa URL. Tên thư mục admin chứa khoảng trắng và ký tự Unicode.

### 9.6. Tài khoản demo

**Storefront:**

- Không cần tài khoản để xem sản phẩm, thêm giỏ hoặc thanh toán.
- Hồ sơ mặc định: `Nguyễn Minh Anh` / `minhanh@email.com`.
- Đăng nhập/đăng ký chỉ là giao diện demo; nhập hợp lệ sẽ quay về trang chủ.

**Admin:**

- Username/password bất kỳ, kể cả để trống.
- Sau khi đăng nhập sẽ vào thẳng A02.
- Dữ liệu mẫu: 8 người dùng, 8 sản phẩm, 10 đơn hàng, 6 khách hàng.

---

## 10. Script hỗ trợ

### 10.1. `download_all_products.ps1`

Script PowerShell tải ảnh sản phẩm mẫu từ Wikimedia Commons:

```powershell
powershell -ExecutionPolicy Bypass -File .\download_all_products.ps1
```

Đặc điểm:

- Danh sách 100 truy vấn ảnh (id 8–100).
- Lưu vào `assets/img/product-{id}.jpg`.
- Bỏ qua file đã tồn tại và lớn hơn 5 KB.
- Tìm ảnh qua Wikimedia Commons API, có truy vấn mở rộng và ảnh fallback.
- Có delay 150 ms giữa các lần tải.

> Ảnh tải tự động có thể không khớp chính xác với tên sản phẩm. Catalog hiện tại vẫn dùng nhiều URL ảnh bên ngoài (Unsplash, Bing, Shopee...).

### 10.2. `test_audit.cjs`

Script Node liệt kê tất cả file HTML và các link CSS tương ứng:

```bash
node test_audit.cjs
```

Đây là công cụ kiểm tra nhanh, không phải test tự động đầy đủ.

### 10.3. Kiểm tra thủ công gợi ý

1. Mở trang chủ, thử tìm kiếm, lọc, sắp xếp.
2. Thêm sản phẩm vào giỏ, mở cart drawer, tăng/giảm/xóa.
3. Vào giỏ hàng, kiểm tra đơn nháp và đơn mẫu.
4. Thanh toán với địa chỉ mặc định và mã `WELCOME2026`.
5. Kiểm tra trang đặt hàng thành công và hồ sơ.
6. Mở admin, đăng nhập, thử A02 → A04 → A02.
7. Thử A05 → A06 → A05, A05 → A07 → A05.
8. Thử A10 đổi trạng thái đơn, mở A11, quay lại A10.
9. Thử A12 lọc ngày và xuất CSV.

---

## 11. Quy ước phát triển

### 11.1. Thêm sản phẩm vào storefront

Chỉnh `page/products/product-data.js`, thêm object vào mảng `products` với `id` mới không trùng:

```js
{
  id: 55,
  code: "VP09",
  title: "Tên sản phẩm mới",
  category: "pens",
  price: 50000,
  oldPrice: 65000,
  stock: 100,
  pack: "1 cây",
  image: "../../assets/img/product-1.jpg",
  description: "Mô tả sản phẩm.",
  featured: false,
  hot: false
}
```

Sau đó:

- Trang chủ, danh mục và tìm kiếm tự cập nhật.
- Nếu muốn sản phẩm hiện ở “Sản phẩm nổi bật”, đặt `featured: true`.
- Nếu muốn nhãn Hot, đặt `hot: true`.
- Kiểm tra lại số lượng hiển thị trên sidebar.

### 11.2. Thêm sản phẩm vào admin

Admin **không dùng chung** `product-data.js`. Dữ liệu sản phẩm admin nằm trong `DEFAULT_PRODUCTS` của A05/A06/A07 và được lưu tạm trong `sessionStorage`.

Khi thêm sản phẩm admin, cần cập nhật đồng bộ ở cả ba file nếu muốn dữ liệu mẫu khớp nhau:

- `admin_page/A05 Quản lý sản phẩm/admin.js`
- `admin_page/A06 Thêm sản phẩm/admin.js`
- `admin_page/A07_sửa_sản _phẩm/admin.js`

Đây là điểm cần cải thiện trong tương lai (tách dữ liệu dùng chung).

### 11.3. Thêm trang mới

- Storefront: đặt trong `page/<nhóm>/`, dùng chung `assets/css/style.css` và các script cần thiết.
- Admin: tạo thư mục `Axx Tên trang/` với `index.html`, `admin.js`, `admin.css`; tái sử dụng `A02 Quản lý người dùng/admin.css` nếu muốn đồng bộ sidebar.
- Cập nhật sidebar admin và các link liên quan.
- Kiểm tra lại đường dẫn tương đối `../../assets/...`.

### 11.4. Quy ước CSS

- Dùng biến CSS trong `:root`, hạn chế hard-code màu.
- Class đặt theo BEM hoặc tiền tố trang (`c-` cho customer, `od-` cho order detail, `cs-` cho customer stats...).
- Ưu tiên `rem` cho typography, `px` cho border/radius nhỏ.
- Giữ responsive bằng `@media`.
- Không sửa `assets/css/style.css` nếu chỉ cần style cục bộ.

### 11.5. Quy ước JavaScript

- Dùng IIFE cho module dùng chung (`cart.js`, `site.js`, `customer.js`).
- Dùng `defer` cho script ở `<head>` khi có thể.
- Escape HTML khi chèn dữ liệu động bằng `escapeHTML` hoặc hàm tương đương.
- Dùng `Intl.NumberFormat('vi-VN')` để định dạng tiền.
- Dùng `URLSearchParams` cho tham số URL.
- Không thêm thư viện nếu có thể giải quyết bằng JavaScript thuần.

### 11.6. Bảo mật ở mức demo

- Không có xác thực thật, không có phân quyền, không có backend.
- Không lưu mật khẩu thật; form auth chỉ chuyển trang.
- Dữ liệu localStorage có thể bị người dùng sửa trực tiếp.
- Không dùng dự án này cho môi trường production khi chưa bổ sung backend, xác thực, phân quyền và kiểm tra dữ liệu phía server.

---

## 12. Hạn chế đã biết

1. **Chưa có backend**: toàn bộ dữ liệu là mock/localStorage, không có API, không có cơ sở dữ liệu.
2. **Xác thực chỉ là giao diện**: đăng nhập khách hàng và admin đều chấp nhận dữ liệu bất kỳ.
3. **Admin không được bảo vệ**: có thể mở trực tiếp bất kỳ trang A02–A12 mà không cần đăng nhập.
4. **Dữ liệu storefront và admin tách rời**: sản phẩm/đơn hàng ở storefront không tự đồng bộ sang admin.
5. **Admin reset khi F5**: A02, A03/A04, A05/A06/A07 và cụm A10–A12 khôi phục dữ liệu mẫu khi tải lại.
6. **Hai phiên bản chi tiết sản phẩm**: SPA trong trang chủ và trang `product-detail.html` có logic khác nhau.
7. **Nút “Mua ngay” chưa điều hướng**: chỉ hiển thị thông báo tổng tiền.
8. **Thanh toán chưa thật**: không kết nối VNPAY/MoMo/COD thật, không trừ tồn kho.
9. **Ảnh sản phẩm**: phần lớn là URL bên ngoài; một số ảnh không khớp chính xác tên sản phẩm.
10. **Ảnh upload admin là tạm**: dùng `blob:` URL, không tồn tại sau khi đóng tab hoặc tải lại.
11. **A08/A09 là trang demo độc lập**: không đồng bộ trực tiếp với danh sách sản phẩm A05.
12. **Dữ liệu ngày cố định**: nhiều đơn hàng mẫu dùng tháng 10/2026.
13. **Chưa có test tự động, ESLint, Prettier, CI/CD**.
14. **Tên thư mục admin không đồng nhất**: có khoảng trắng, dấu tiếng Việt và typo nhỏ.
15. **README cũ và một số ghi chú nội bộ có thể lỗi thời**; README này là bản mô tả hiện tại.

---

## 13. Hướng phát triển

- Xây dựng backend (Node.js/Express, Laravel, Spring Boot hoặc tương đương).
- Thiết kế cơ sở dữ liệu cho người dùng, sản phẩm, đơn hàng, địa chỉ, đánh giá.
- Thay localStorage bằng API thật.
- Xác thực bằng JWT/session, phân quyền admin – nhân viên – khách hàng.
- Đồng bộ catalog storefront và admin qua một nguồn dữ liệu duy nhất.
- Tích hợp thanh toán VNPAY/MoMo/COD thật.
- Quản lý tồn kho, trừ kho khi đặt hàng, lịch sử kho.
- Upload ảnh sản phẩm lên server/cloud.
- Thêm đánh giá, wishlist, mã giảm giá động, vận chuyển.
- Viết test tự động cho luồng giỏ hàng, thanh toán và quản trị đơn.
- Bổ sung ESLint, Prettier, CI/CD, tối ưu ảnh, SEO, sitemap.
- Cải thiện accessibility và kiểm thử trên nhiều thiết bị.
- Tách dữ liệu admin thành module dùng chung thay vì lặp `DEFAULT_PRODUCTS`/`DEFAULT_USERS`.
- Thống nhất tên thư mục admin (bỏ khoảng trắng, sửa `A07_sửa_sản _phẩm`).

---

## 14. Đóng góp và bản quyền

### Đóng góp

1. Fork repository.
2. Tạo nhánh mới:

```bash
git checkout -b feature/ten-tinh-nang
```

3. Commit theo nội dung rõ ràng:

```bash
git commit -m "feat: them bo loc san pham"
```

4. Push nhánh và tạo Pull Request.

Khuyến nghị kiểm tra lại:

- Đường dẫn tương đối sau khi di chuyển file.
- Giao diện ở mobile và desktop.
- Dữ liệu localStorage sau khi reload.
- Console không có lỗi JavaScript.
- Các link trong sidebar admin vẫn hoạt động.

### Bản quyền

Dự án phục vụ mục đích học tập và thực hành phát triển web. Repository hiện **chưa có file giấy phép mã nguồn mở**. Vui lòng liên hệ tác giả/nhóm phát triển trước khi sử dụng cho mục đích thương mại.

- Repository: <https://github.com/phicongtai/website-selling-school-supplies>
- Hỗ trợ trong giao diện: hotline `1900 6868`, email `cskh@hocduongstore.vn` (dữ liệu demo).

---

<p align="center">
  <strong>Học Đường Store</strong> — Đồng hành cùng tri thức Việt
</p>
