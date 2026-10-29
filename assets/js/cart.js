/**
 * Giỏ hàng dùng chung giữa các trang.
 * Dữ liệu được lưu trong localStorage.
 * Khi chưa đăng nhập: Giỏ hàng trống (0 món đồ), badge ẩn.
 */
(function () {
  const STORAGE_KEY = 'hds_cart_v1';
  const DEFAULT_CART = [];

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

  function read() {
    // Khi chưa đăng nhập thì tại giỏ hàng KHÔNG CÓ món đồ gì hết
    if (!isUserLoggedIn()) {
      return [];
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return normalize(JSON.parse(stored));
    } catch (error) {
      return [];
    }
  }

  function write(cart) {
    if (!isUserLoggedIn()) {
      return [];
    }
    const normalized = normalize(cart);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
      // Trình duyệt có thể chặn localStorage ở chế độ riêng tư; vẫn cập nhật giao diện.
    }
    updateBadges(normalized);
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: normalized }));
    return normalized;
  }

  function count(cart) {
    if (!isUserLoggedIn()) return 0;
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

  function add(id, quantity) {
    if (!isUserLoggedIn()) {
      const msg = 'Vui lòng đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng!';
      if (typeof window.showSiteToast === 'function') {
        window.showSiteToast(msg);
      } else {
        alert(msg);
      }
      setTimeout(function () {
        const p = window.location.pathname.replace(/\\/g, '/');
        let loginUrl = '../auth/login.html';
        if (p.includes('/page/auth/')) {
          loginUrl = 'login.html';
        } else if (p.includes('/page/')) {
          loginUrl = '../auth/login.html';
        } else {
          loginUrl = 'page/auth/login.html';
        }
        window.location.href = loginUrl;
      }, 700);
      return [];
    }

    const amount = Math.max(1, Number(quantity) || 1);
    const cart = read();
    const item = cart.find(entry => entry.id === Number(id));
    if (item) item.quantity += amount;
    else cart.push({ id: Number(id), quantity: amount });
    return write(cart);
  }

  function setQuantity(id, quantity) {
    if (!isUserLoggedIn()) return [];
    const amount = Math.max(0, Number(quantity) || 0);
    const cart = read().filter(entry => {
      if (entry.id !== Number(id)) return true;
      entry.quantity = amount;
      return amount > 0;
    });
    return write(cart);
  }

  function remove(id) {
    if (!isUserLoggedIn()) return [];
    return write(read().filter(entry => entry.id !== Number(id)));
  }

  window.StoreCart = {
    get: read,
    set: write,
    count,
    updateBadges,
    add,
    setQuantity,
    remove,
    isLoggedIn: isUserLoggedIn
  };

  window.addToCart = function (id, quantity) {
    const res = add(id, quantity);
    if (isUserLoggedIn() && res.length && window.showSiteToast) {
      window.showSiteToast('Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
  });
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY || event.key === 'hds_auth_user') {
      updateBadges();
    }
  });

  updateBadges();
})();
