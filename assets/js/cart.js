/**
 * Giỏ hàng dùng chung giữa các trang.
 * QUY TẮC HIỂN THỊ:
 * - Khi CHƯA đăng nhập: giỏ hàng rỗng (0 sản phẩm), ẩn hoàn toàn badge giỏ hàng trên header.
 * - Khi ĐÃ đăng nhập: giỏ hàng hiển thị bộ sản phẩm mẫu cố định (5 sản phẩm demo).
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
      if (sessionStorage.getItem('hds_logged_out') === 'true') {
        return false;
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
   * Đọc giỏ hàng:
   * - Nếu CHƯA ĐĂNG NHẬP: luôn trả về rỗng [] (không hiện sản phẩm).
   * - Nếu ĐÃ ĐĂNG NHẬP: trả về bộ sản phẩm cố định (FIXED_CART).
   */
  function read() {
    if (!isUserLoggedIn()) {
      return [];
    }
    return seed();
  }

  function write() {
    if (!isUserLoggedIn()) {
      updateBadges([]);
      document.dispatchEvent(new CustomEvent('cart:changed', { detail: [] }));
      return [];
    }
    const value = seed();
    updateBadges(value);
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: value }));
    return value;
  }

  function count(cart) {
    if (!isUserLoggedIn()) {
      return 0;
    }
    return (cart || read()).reduce((total, item) => total + item.quantity, 0);
  }

  function updateBadges(cart) {
    const loggedIn = isUserLoggedIn();
    const total = loggedIn ? count(cart) : 0;
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = String(total);
      if (!loggedIn || total <= 0) {
        badge.hidden = true;
        badge.style.display = 'none';
      } else {
        badge.hidden = false;
        badge.style.display = '';
      }
    });
  }

  /**
   * Thêm sản phẩm vào giỏ hàng:
   * - Nếu chưa đăng nhập: nhắc nhở người dùng đăng nhập.
   * - Nếu đã đăng nhập: thông báo đã thêm sản phẩm.
   */
  function add() {
    if (!isUserLoggedIn()) {
      const msg = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
      if (typeof window.showSiteToast === 'function') {
        window.showSiteToast(msg);
      } else {
        alert(msg);
      }
      return [];
    }
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

  function setQuantity() {
    if (!isUserLoggedIn()) {
      notifyLocked('Vui lòng đăng nhập để thao tác giỏ hàng.');
      return [];
    }
    notifyLocked('Giỏ hàng demo có số lượng cố định, không thể chỉnh sửa.');
    return read();
  }

  function remove() {
    if (!isUserLoggedIn()) {
      notifyLocked('Vui lòng đăng nhập để thao tác giỏ hàng.');
      return [];
    }
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
    canAdd: function () { return isUserLoggedIn(); }
  };

  window.addToCart = function () {
    add();
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: read() }));
  });

  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === 'hds_auth_user' || event.key === 'hds_logged_out') {
      updateBadges();
      document.dispatchEvent(new CustomEvent('cart:changed', { detail: read() }));
    }
  });

  updateBadges();
})();
