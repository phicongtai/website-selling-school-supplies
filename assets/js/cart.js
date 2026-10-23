/**
 * Giỏ hàng demo dùng chung giữa các trang.
 * Dữ liệu được lưu trong localStorage để số lượng trên badge không bị lệch.
 */
(function () {
  const STORAGE_KEY = 'hds_cart_v1';
  const DEFAULT_CART = [
    { id: 1, quantity: 1 },
    { id: 3, quantity: 2 }
  ];

  function normalize(cart) {
    if (!Array.isArray(cart)) return DEFAULT_CART.map(item => ({ ...item }));
    return cart
      .map(item => ({ id: Number(item.id), quantity: Math.max(0, Number(item.quantity) || 0) }))
      .filter(item => Number.isFinite(item.id) && item.quantity > 0);
  }

  function read() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_CART.map(item => ({ ...item }));
      return normalize(JSON.parse(stored));
    } catch (error) {
      return DEFAULT_CART.map(item => ({ ...item }));
    }
  }

  function write(cart) {
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
    return (cart || read()).reduce((total, item) => total + item.quantity, 0);
  }

  function updateBadges(cart) {
    const total = count(cart);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = String(total);
      badge.hidden = total === 0;
    });
  }

  function add(id, quantity) {
    const amount = Math.max(1, Number(quantity) || 1);
    const cart = read();
    const item = cart.find(entry => entry.id === Number(id));
    if (item) item.quantity += amount;
    else cart.push({ id: Number(id), quantity: amount });
    return write(cart);
  }

  function setQuantity(id, quantity) {
    const amount = Math.max(0, Number(quantity) || 0);
    const cart = read().filter(entry => {
      if (entry.id !== Number(id)) return true;
      entry.quantity = amount;
      return amount > 0;
    });
    return write(cart);
  }

  function remove(id) {
    return write(read().filter(entry => entry.id !== Number(id)));
  }

  window.StoreCart = {
    get: read,
    set: write,
    count,
    updateBadges,
    add,
    setQuantity,
    remove
  };

  window.addToCart = function (id, quantity) {
    add(id, quantity);
    if (window.showSiteToast) window.showSiteToast('Đã thêm sản phẩm vào giỏ hàng!');
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
  });
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) updateBadges();
  });

  updateBadges();
})();
