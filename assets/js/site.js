/**
 * Tiện ích dùng chung cho toàn bộ giao diện người dùng.
 * Không áp dụng cho khu vực admin_page.
 */
(function () {
  const CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
  const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>';

  const money = amount => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

  const escapeHTML = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  window.showSiteToast = function (message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 2500);
  };

  // Drawer giỏ hàng dùng chung cho các trang chưa có sẵn drawer (trang chủ đã có).
  function initCartDrawer() {
    if (document.getElementById('cartDrawerOverlay')) return;
    if (!window.StoreCart) return;

    const anchors = document.querySelectorAll('a.action-btn[title="Giỏ hàng"]');
    if (!anchors.length) return;

    const path = window.location.pathname.replace(/\\/g, '/');
    const inCustomer = /\/page\/customer\//.test(path);
    const inProducts = /\/page\/products\//.test(path);
    const cartHref = inCustomer ? 'cart.html' : '../customer/cart.html';
    const checkoutHref = inCustomer ? 'checkout.html' : '../customer/checkout.html';
    const shopHref = '../homepage/main.html#view-category';
    const detailPrefix = inProducts ? '' : '../products/';

    const overlay = document.createElement('div');
    overlay.className = 'cart-drawer-overlay';
    overlay.id = 'cartDrawerOverlay';
    overlay.innerHTML = `
      <div class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartDrawerTitle">
        <div class="cart-drawer-header">
          <h3 id="cartDrawerTitle">Giỏ Hàng Của Bạn <span class="cart-drawer-count" id="cartDrawerCount">0</span></h3>
          <button type="button" data-cart-close aria-label="Đóng giỏ hàng">✕</button>
        </div>
        <div class="cart-drawer-body" id="cartDrawerBody" aria-live="polite"></div>
        <div class="cart-drawer-footer">
          <a class="cart-drawer-add" href="${shopHref}"><span aria-hidden="true">+</span> Thêm sản phẩm khác</a>
          <div class="cart-drawer-total-row">
            <span>Tổng tiền:</span>
            <span id="cartDrawerTotal">0 ₫</span>
          </div>
          <div class="cart-drawer-actions">
            <a class="btn btn-secondary" href="${cartHref}">Xem giỏ hàng</a>
            <a class="btn btn-primary" href="${checkoutHref}">Thanh toán ngay</a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const bodyEl = overlay.querySelector('#cartDrawerBody');
    const totalEl = overlay.querySelector('#cartDrawerTotal');
    const countEl = overlay.querySelector('#cartDrawerCount');
    const closeButton = overlay.querySelector('[data-cart-close]');

    const render = () => {
      const cart = window.StoreCart.get();
      const products = (window.StoreCatalog && window.StoreCatalog.products) || [];
      let total = 0;

      if (!cart.length) {
        bodyEl.innerHTML = `
          <div class="cart-drawer-empty">
            <span class="cart-drawer-empty-icon" aria-hidden="true">${CART_ICON}</span>
            <strong>Giỏ hàng đang trống</strong>
            <p>Thêm vài dụng cụ học tập xinh xắn để bắt đầu đơn hàng của bạn nhé.</p>
            <a class="btn btn-primary" href="${shopHref}">Mua sắm ngay</a>
          </div>`;
      } else {
        bodyEl.innerHTML = cart.map(item => {
          const product = products.find(entry => Number(entry.id) === Number(item.id));
          if (!product) return '';
          const lineTotal = product.price * item.quantity;
          total += lineTotal;
          return `
            <div class="cart-drawer-item" data-cart-item="${product.id}">
              <img class="cart-drawer-thumb" src="${product.image}" alt="${escapeHTML(product.title)}" loading="lazy">
              <div class="cart-drawer-info">
                <a class="cart-drawer-name" href="${detailPrefix}product-detail.html?id=${encodeURIComponent(product.code)}">${escapeHTML(product.title)}</a>
                <div class="cart-drawer-unit">${money(product.price)} / sản phẩm</div>
                <div class="cart-drawer-controls">
                  <div class="cart-drawer-qty" role="group" aria-label="Số lượng ${escapeHTML(product.title)}">
                    <button type="button" data-cart-dec aria-label="${item.quantity > 1 ? 'Giảm số lượng' : 'Xóa sản phẩm'}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-cart-inc aria-label="Tăng số lượng" ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                  </div>
                  <strong class="cart-drawer-line-total">${money(lineTotal)}</strong>
                </div>
              </div>
              <div class="cart-drawer-side">
                <button class="cart-drawer-remove" type="button" data-cart-remove aria-label="Xóa ${escapeHTML(product.title)} khỏi giỏ hàng" title="Xóa sản phẩm">${TRASH_ICON}</button>
              </div>
            </div>`;
        }).join('');
      }

      totalEl.textContent = money(total);
      countEl.textContent = String(window.StoreCart.count(cart));
    };

    const open = () => {
      render();
      overlay.classList.add('open');
      document.body.classList.add('cart-drawer-open');
      closeButton.focus({ preventScroll: true });
    };

    const close = () => {
      overlay.classList.remove('open');
      document.body.classList.remove('cart-drawer-open');
    };

    window.openCartDrawer = open;
    window.closeCartDrawer = close;

    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('[data-cart-close]')) {
        close();
        return;
      }

      if (event.target.closest('a[href]')) {
        close();
        return;
      }

      const row = event.target.closest('[data-cart-item]');
      if (!row) return;

      const id = Number(row.dataset.cartItem);
      const current = window.StoreCart.get().find(item => Number(item.id) === id);
      if (!current) return;

      if (event.target.closest('[data-cart-inc]')) {
        window.StoreCart.setQuantity(id, Math.min(99, current.quantity + 1));
        render();
        return;
      }

      if (event.target.closest('[data-cart-dec]')) {
        if (current.quantity <= 1) window.StoreCart.remove(id);
        else window.StoreCart.setQuantity(id, current.quantity - 1);
        render();
        return;
      }

      if (event.target.closest('[data-cart-remove]')) {
        window.StoreCart.remove(id);
        render();
      }
    });

    anchors.forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        open();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  if (document.readyState === 'complete') {
    initCartDrawer();
  } else {
    document.addEventListener('DOMContentLoaded', initCartDrawer);
  }

  // Cho phép nhấn Enter ở ô tìm kiếm trên các trang không có form tìm kiếm.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    const input = event.target;
    if (!input || !input.matches || !input.matches('.store-search-input')) return;
    const searchButton = input.closest('.store-search')?.querySelector('.store-search-button');
    if (searchButton) {
      event.preventDefault();
      searchButton.click();
    }
  });
})();
