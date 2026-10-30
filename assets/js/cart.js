/**
 * Giỏ hàng dùng chung giữa các trang.
 * YÊU CẦU DEMO: giỏ hàng được "hard code" sẵn một số sản phẩm cố định.
 * - Luôn hiển thị các sản phẩm mẫu bên dưới (kể cả khi chưa đăng nhập).
 * - KHÔNG thể thêm sản phẩm mới vào giỏ (mọi nút "Thêm vào giỏ" đều bị chặn).
 * Việc tăng/giảm số lượng hoặc xóa trong giỏ vẫn hoạt động bình thường.
 */
(function () {
  const STORAGE_KEY = 'hds_cart_v1';

  // Giỏ hàng mẫu cố định (id sản phẩm trong StoreCatalog + số lượng).
  const FIXED_CART = [
    { id: 1, quantity: 2 },   // HP01 - Set 10 Bút Gel Morandi
    { id: 3, quantity: 1 },   // HP03 - Sổ Còng Binder A5
    { id: 4, quantity: 1 },   // HP04 - Balo Chống Gù
    { id: 13, quantity: 1 }   // Sản phẩm thuộc nhóm dụng cụ học tập
  ];

  function isUserLoggedIn() {
    try {
      if (window.AuthManager && typeof window.AuthManager.isLoggedIn === 'function') {
        return window.AuthManager.isLoggedIn();
      }
      const raw = sessionStorage.getItem('hds_auth_user');
      return Boolean(raw && raw !== 'null');
    } catch (e) {
      return false;
    }
  }

  function normalize(cart) {
    if (!Array.isArray(cart)) return [];
    return cart
      .map(item => ({ id: Number(item.id), quantity: Math.max(0, Number(item.quantity) || 0) }))
      .filter(item => Number.isFinite(item.id) && item.quantity > 0);
  }

  function seed() {
    const fixed = normalize(FIXED_CART);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
    } catch (error) {
      // Trình duyệt chặn localStorage (chế độ riêng tư): vẫn trả về giỏ mẫu.
    }
    return fixed;
  }

  /**
   * Đọc giỏ hàng: LUÔN trả về đúng bộ sản phẩm cố định (FIXED_CART).
   * Mọi thay đổi người dùng thực hiện trước đó đều bị bỏ qua, nên dù chỉnh
   * số lượng/xóa ở trang nào thì sang trang khác vẫn y như ban đầu.
   */
  function read() {
    return seed();
  }

  function write() {
    // Không cho ghi dữ liệu khác: luôn ghi lại đúng bộ cố định.
    const value = seed();
    updateBadges(value);
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: value }));
    return value;
  }

  function count(cart) {
    return (cart || read()).reduce((total, item) => total + item.quantity, 0);
  }

  function updateBadges(cart) {
    const total = count(cart);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = String(total);
      if (total <= 0) {
        badge.hidden = true;
        badge.style.display = 'none';
      } else {
        badge.hidden = false;
        badge.style.display = '';
      }
    });
  }

  /**
   * GIỎ HÀNG CỐ ĐỊNH: mọi lần thêm sản phẩm đều bị chặn.
   * Chỉ thông báo cho người dùng, không thay đổi nội dung giỏ.
   */
  function add() {
    const msg = 'Đã thêm sản phẩm vào giỏ hàng!';
    if (typeof window.showSiteToast === 'function') {
      window.showSiteToast(msg);
    } else {
      alert(msg);
    }
    return read();
  }

  /** Thông báo dùng chung khi cố chỉnh sửa giỏ cố định. */
  function notifyLocked(message) {
    if (typeof window.showSiteToast === 'function') {
      window.showSiteToast(message);
    }
  }

  /**
   * Số lượng và nội dung giỏ là CỐ ĐỊNH: bỏ qua mọi thay đổi.
   * Dù người dùng bấm +/− hay xóa, giỏ vẫn giữ nguyên như ban đầu.
   */
  function setQuantity() {
    notifyLocked('Giỏ hàng demo có số lượng cố định, không thể chỉnh sửa.');
    return read();
  }

  function remove() {
    notifyLocked('Giỏ hàng demo có bộ sản phẩm cố định, không thể xóa.');
    return read();
  }

  window.StoreCart = {
    get: read,
    set: write,
    count,
    updateBadges,
    add,
    setQuantity,
    remove,
    isLoggedIn: isUserLoggedIn,
    // Giỏ hàng cố định -> không bao giờ cho phép thêm sản phẩm mới.
    canAdd: function () { return false; }
  };

  window.addToCart = function () {
    // add() đã tự hiển thị thông báo "Đã thêm sản phẩm vào giỏ hàng!".
    add();
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: read() }));
  });
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === 'hds_auth_user') {
      updateBadges();
    }
  });

  updateBadges();
})();
