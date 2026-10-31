/**
 * Trang chi tiết sản phẩm TĨNH (product-*.html).
 * Toàn bộ dữ liệu sản phẩm đã được viết cứng trong HTML — script này KHÔNG
 * render lại nội dung, chỉ xử lý tương tác: số lượng, thêm giỏ, mua ngay.
 * Thông tin sản phẩm lấy từ các data-* attribute trên <body>.
 */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const productId = Number(body.dataset.productId);
  const stock = Number(body.dataset.productStock) || 1;
  const title = body.dataset.productTitle || 'sản phẩm';

  const quantity = document.getElementById('quantity');
  const notice = document.getElementById('notice');
  const decrease = document.getElementById('decrease');
  const increase = document.getElementById('increase');

  if (quantity) {
    quantity.max = String(stock);
    if (decrease) {
      decrease.addEventListener('click', () => {
        quantity.value = String(Math.max(1, Number(quantity.value) - 1));
      });
    }
    if (increase) {
      increase.addEventListener('click', () => {
        quantity.value = String(Math.min(stock, Number(quantity.value) + 1));
      });
    }
  }

  function getQuantity() {
    if (!quantity) return 1;
    const value = Number(quantity.value);
    if (!Number.isInteger(value) || value < 1 || value > stock) {
      if (notice) notice.textContent = `Vui lòng chọn số lượng từ 1 đến ${stock}.`;
      return null;
    }
    return value;
  }

  document.getElementById('addToCart')?.addEventListener('click', () => {
    const amount = getQuantity();
    if (amount === null) return;
    // Giỏ hàng CỐ ĐỊNH: cart.js chặn thêm mới và tự hiện toast thông báo.
    const added = window.StoreCart ? window.StoreCart.add(productId, amount) : null;
    const isLoggedIn = window.StoreCart && typeof window.StoreCart.isLoggedIn === 'function' ? window.StoreCart.isLoggedIn() : false;
    if (notice) {
      if (isLoggedIn) {
        notice.textContent = 'Đã thêm sản phẩm vào giỏ hàng!';
        notice.style.color = 'var(--color-primary-700)';
      } else {
        notice.textContent = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
        notice.style.color = '#dc2626';
      }
    }
  });

  document.getElementById('buyNow')?.addEventListener('click', () => {
    const amount = getQuantity();
    if (amount === null) return;
    if (window.StoreCart) window.StoreCart.add(productId, amount);
    window.location.href = '../customer/checkout.html';
  });
});
