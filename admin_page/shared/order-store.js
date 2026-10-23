/* ==========================================================================
   KHO DỮ LIỆU DÙNG CHUNG CHO CỤM TRANG QUẢN TRỊ ĐƠN HÀNG
   A10 (Quản lí đơn hàng) · A11 (Chi tiết đơn hàng) · A12 (Thống kê khách hàng)
   --------------------------------------------------------------------------
   - Dữ liệu mẫu dùng chung để các trang luôn hiển thị thống nhất.
   - Trạng thái đơn và các đơn tạo tại quầy được lưu trong sessionStorage,
     nhờ đó A10 → A11 → A12 giữ được cùng một nguồn dữ liệu khi điều hướng.
   ========================================================================== */
(function () {
  'use strict';

  const STATUS_KEY = 'hd_admin_order_status';
  const CUSTOM_ORDERS_KEY = 'hd_admin_custom_orders';

  const STATUS_LABELS = {
    pending: 'Chưa xác nhận',
    confirmed: 'Đã xác nhận',
    delivered: 'Đã giao – Thành công',
    cancelled: 'Đã huỷ'
  };

  const IMAGES = {
    backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80',
    art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=120&q=80',
    watercolor: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=120&q=80',
    notebook: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=120&q=80',
    book: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=120&q=80',
    pen: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=120&q=80',
    pencilCase: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=120&q=80',
    ruler: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=120&q=80',
    paper: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=120&q=80'
  };

  const CUSTOMERS = {
    KH001: {
      id: 'KH001', name: 'Nguyễn Minh Anh', initials: 'NA', avatarClass: 'av-blue',
      email: 'minhanh@email.com', phone: '0901 234 567', city: 'TP. Hồ Chí Minh',
      membership: 'Thành viên thân thiết', accountType: 'Khách hàng học sinh - Hoạt động'
    },
    KH002: {
      id: 'KH002', name: 'Trần Quốc Bảo', initials: 'QB', avatarClass: 'av-olive',
      email: 'quocbao@email.com', phone: '0912 345 678', city: 'Hà Nội',
      membership: 'Thành viên thân thiết', accountType: 'Khách hàng học sinh - Hoạt động'
    },
    KH003: {
      id: 'KH003', name: 'Lê Thị Cẩm Tú', initials: 'LT', avatarClass: 'av-amber',
      email: 'camtu@email.com', phone: '0923 456 789', city: 'Đà Nẵng',
      membership: 'Thành viên thân thiết', accountType: 'Khách hàng học sinh - Hoạt động'
    },
    KH004: {
      id: 'KH004', name: 'Võ Ngọc Hân', initials: 'NH', avatarClass: 'av-rose',
      email: 'ngochan@email.com', phone: '0934 567 890', city: 'Đà Nẵng',
      membership: 'Thành viên mới', accountType: 'Khách hàng học sinh - Hoạt động'
    },
    KH005: {
      id: 'KH005', name: 'Đặng Gia Huy', initials: 'GH', avatarClass: 'av-blue',
      email: 'giahuy@email.com', phone: '0945 678 901', city: 'TP. Hồ Chí Minh',
      membership: 'Thành viên mới', accountType: 'Khách hàng học sinh - Hoạt động'
    },
    KH006: {
      id: 'KH006', name: 'Bùi Thu Trang', initials: 'TT', avatarClass: 'av-teal',
      email: 'thutrang@email.com', phone: '0956 789 012', city: 'Cần Thơ',
      membership: 'Thành viên thân thiết', accountType: 'Khách hàng học sinh - Hoạt động'
    }
  };

  function item(code, name, category, price, quantity, image) {
    return { code, name, category, price, quantity, image };
  }

  const BASE_ORDERS = [
    {
      code: 'DH1001', customerId: 'KH001', customer: 'Nguyễn Minh Anh', email: 'minhanh@email.com',
      phone: '0901 234 567', date: '2026-10-02', createdAt: '02/10/2026 · 09:15', createdTime: '09:15',
      status: 'delivered', total: 479000, address: 'Quận 1, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao giờ hành chính, gọi trước khi đến.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP10', 'Hộp bút chì màu 36 màu', 'Dụng cụ vẽ & mỹ thuật', 159000, 1, IMAGES.art),
        item('SP02', 'Bộ sách tham khảo lớp 10', 'Sách & vở', 320000, 1, IMAGES.book)
      ]
    },
    {
      code: 'DH1002', customerId: 'KH002', customer: 'Trần Quốc Bảo', email: 'quocbao@email.com',
      phone: '0912 345 678', date: '2026-10-03', createdAt: '03/10/2026 · 10:40', createdTime: '10:40',
      status: 'delivered', total: 623000, address: 'Cầu Giấy, Hà Nội', location: 'Hà Nội',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao ngoài giờ hành chính.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP21', 'Cặp sách chống gù lưng', 'Cặp & balo học sinh', 529000, 1, IMAGES.backpack),
        item('SP09', 'Hộp bút đa năng', 'Hộp bút & phụ kiện', 94000, 1, IMAGES.pencilCase)
      ]
    },
    {
      code: 'DH1003', customerId: 'KH003', customer: 'Lê Thị Cẩm Tú', email: 'camtu@email.com',
      phone: '0923 456 789', date: '2026-10-04', createdAt: '04/10/2026 · 14:20', createdTime: '14:20',
      status: 'confirmed', total: 686000, address: 'Số 58 Bạch Đằng, Phường Thạch Thang, Quận Hải Châu, TP. Đà Nẵng', location: 'Đà Nẵng',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao giờ hành chính, gọi trước khi đến.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP24', 'Cặp sách bánh xe kéo đa năng công thái học', 'Cặp & balo học sinh', 529000, 1, IMAGES.backpack),
        item('SP33', 'Hộp bút chì màu cao cấp 24 màu tươi sáng', 'Dụng cụ vẽ & mỹ thuật', 85000, 1, IMAGES.art),
        item('SP34', 'Bộ màu nước 12 màu nén kèm cọ vẽ tỉ mỉ', 'Dụng cụ vẽ & mỹ thuật', 72000, 1, IMAGES.watercolor)
      ]
    },
    {
      code: 'DH1004', customerId: 'KH001', customer: 'Nguyễn Minh Anh', email: 'minhanh@email.com',
      phone: '0901 234 567', date: '2026-10-05', createdAt: '05/10/2026 · 08:05', createdTime: '08:05',
      status: 'delivered', total: 304000, address: 'TP. Thủ Đức, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Chuyển khoản ngân hàng', note: 'Giao tại sảnh chung cư.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP11', 'Bộ sách bài tập bổ trợ', 'Sách & vở', 165000, 1, IMAGES.book),
        item('SP08', 'Vở ô ly nâng cao 200 trang', 'Sách & vở', 84000, 1, IMAGES.notebook),
        item('SP04', 'Bộ bút bi Thiên Long', 'Bút viết', 55000, 1, IMAGES.pen)
      ]
    },
    {
      code: 'DH1005', customerId: 'KH004', customer: 'Võ Ngọc Hân', email: 'ngochan@email.com',
      phone: '0934 567 890', date: '2026-10-06', createdAt: '06/10/2026 · 13:30', createdTime: '13:30',
      status: 'pending', total: 337000, address: 'Quận 7, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Liên hệ trước 30 phút.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP02', 'Sách tham khảo nâng cao', 'Sách & vở', 252000, 1, IMAGES.book),
        item('SP08', 'Vở kẻ ngang 200 trang', 'Sách & vở', 85000, 1, IMAGES.notebook)
      ]
    },
    {
      code: 'DH1006', customerId: 'KH005', customer: 'Đặng Gia Huy', email: 'giahuy@email.com',
      phone: '0945 678 901', date: '2026-10-07', createdAt: '07/10/2026 · 15:10', createdTime: '15:10',
      status: 'cancelled', total: 264000, address: 'Bình Thạnh, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Khách yêu cầu huỷ do đổi mẫu.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP15', 'Bộ bút lông màu', 'Dụng cụ vẽ & mỹ thuật', 179000, 1, IMAGES.art),
        item('SP16', 'Giấy vẽ A4', 'Giấy & vở', 85000, 1, IMAGES.paper)
      ]
    },
    {
      code: 'DH1007', customerId: 'KH002', customer: 'Trần Quốc Bảo', email: 'quocbao@email.com',
      phone: '0912 345 678', date: '2026-10-08', createdAt: '08/10/2026 · 09:50', createdTime: '09:50',
      status: 'confirmed', total: 167000, address: 'Đống Đa, Hà Nội', location: 'Hà Nội',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao giờ hành chính.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP12', 'Bộ thước kẻ học sinh', 'Dụng cụ học tập', 89000, 1, IMAGES.ruler),
        item('SP05', 'Bút chì 2B', 'Bút viết', 78000, 1, IMAGES.pen)
      ]
    },
    {
      code: 'DH1008', customerId: 'KH006', customer: 'Bùi Thu Trang', email: 'thutrang@email.com',
      phone: '0956 789 012', date: '2026-10-09', createdAt: '09/10/2026 · 11:25', createdTime: '11:25',
      status: 'pending', total: 263000, address: 'Quận 5, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao buổi chiều.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP34', 'Bộ màu nước 12 màu nén kèm cọ vẽ', 'Dụng cụ vẽ & mỹ thuật', 178000, 1, IMAGES.watercolor),
        item('SP08', 'Vở kẻ ngang 200 trang', 'Sách & vở', 85000, 1, IMAGES.notebook)
      ]
    },
    {
      code: 'DH1009', customerId: 'KH003', customer: 'Lê Thị Cẩm Tú', email: 'camtu@email.com',
      phone: '0923 456 789', date: '2026-10-10', createdAt: '10/10/2026 · 16:05', createdTime: '16:05',
      status: 'pending', total: 337000, address: 'Hải Châu, Đà Nẵng', location: 'Đà Nẵng',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Gọi trước khi giao.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP34', 'Bộ màu nước 12 màu nén kèm cọ vẽ', 'Dụng cụ vẽ & mỹ thuật', 252000, 1, IMAGES.watercolor),
        item('SP18', 'Bộ thước kẻ compa học sinh', 'Dụng cụ học tập', 85000, 1, IMAGES.ruler)
      ]
    },
    {
      code: 'DH1010', customerId: 'KH001', customer: 'Nguyễn Minh Anh', email: 'minhanh@email.com',
      phone: '0901 234 567', date: '2026-10-10', createdAt: '10/10/2026 · 18:40', createdTime: '18:40',
      status: 'pending', total: 199000, address: 'Quận 1, TP. Hồ Chí Minh', location: 'Hồ Chí Minh',
      payment: 'Tiền mặt khi nhận hàng (COD)', note: 'Giao giờ hành chính.',
      channel: 'Storefront Học Sinh',
      items: [
        item('SP11', 'Bộ sách bài tập bổ trợ', 'Sách & vở', 199000, 1, IMAGES.book)
      ]
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Tiện ích lưu trữ                                                   */
  /* ------------------------------------------------------------------ */
  function readJSON(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Bỏ qua khi trình duyệt chặn sessionStorage (chế độ riêng tư). */
    }
  }

  function statusOverrides() {
    const value = readJSON(STATUS_KEY, {});
    return value && typeof value === 'object' ? value : {};
  }

  function customOrders() {
    const value = readJSON(CUSTOM_ORDERS_KEY, []);
    return Array.isArray(value) ? value : [];
  }

  /* ------------------------------------------------------------------ */
  /* API công khai                                                      */
  /* ------------------------------------------------------------------ */
  function getCustomer(id) {
    return CUSTOMERS[id] || null;
  }

  function getOrders() {
    const overrides = statusOverrides();
    return [...customOrders(), ...BASE_ORDERS].map((order) => {
      const customer = CUSTOMERS[order.customerId];
      return {
        ...order,
        customer: order.customer || (customer ? customer.name : 'Khách lẻ'),
        email: order.email || (customer ? customer.email : ''),
        phone: order.phone || (customer ? customer.phone : ''),
        customerId: order.customerId || '',
        status: overrides[order.code] || order.status
      };
    });
  }

  function getOrder(code) {
    if (!code) return null;
    return getOrders().find((order) => order.code === code) || null;
  }

  function nextCode() {
    const numbers = getOrders()
      .map((order) => Number(String(order.code).replace(/\D/g, '')))
      .filter((number) => Number.isFinite(number));
    return `DH${(numbers.length ? Math.max(...numbers) : 1000) + 1}`;
  }

  function updateStatus(code, status) {
    if (!code || !STATUS_LABELS[status]) return false;
    const overrides = statusOverrides();
    overrides[code] = status;
    writeJSON(STATUS_KEY, overrides);

    const orders = customOrders();
    const custom = orders.find((order) => order.code === code);
    if (custom) {
      custom.status = status;
      writeJSON(CUSTOM_ORDERS_KEY, orders);
    }
    return true;
  }

  function addOrder(order) {
    if (!order || !order.code) return null;
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const timeLabel = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    if (!order.createdAt) {
      order.createdAt = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} · ${timeLabel}`;
    }
    if (!order.createdTime) order.createdTime = timeLabel;
    const orders = customOrders();
    orders.unshift(order);
    writeJSON(CUSTOM_ORDERS_KEY, orders);
    return order;
  }

  function formatMoney(amount) {
    return `${new Intl.NumberFormat('vi-VN').format(Number(amount) || 0)}đ`;
  }

  function formatDateVN(isoDate) {
    if (!isoDate) return '';
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  window.HDOrderStore = {
    CUSTOMERS,
    STATUS_LABELS,
    getCustomer,
    getOrders,
    getOrder,
    nextCode,
    updateStatus,
    addOrder,
    formatMoney,
    formatDateVN
  };
})();
