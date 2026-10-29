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

    const anchors = document.querySelectorAll('a.action-btn[title="Giỏ hàng"], button.action-btn[title="Giỏ hàng"]');
    if (!anchors.length) return;

    const path = window.location.pathname.replace(/\\/g, '/');
    const inCustomer = /\/page\/customer\//.test(path);
    const inProducts = /\/page\/products\//.test(path);
    const cartHref = inCustomer ? 'cart.html' : '../customer/cart.html';
    const checkoutHref = inCustomer ? 'checkout.html' : '../customer/checkout.html';
    const shopHref = '../homepage/main.html#view-category';
    const detailPrefix = inProducts ? '' : '../products/';
    const loginHref = inCustomer || inProducts ? '../auth/login.html' : 'page/auth/login.html';

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
            <p>${(window.AuthManager && !window.AuthManager.isLoggedIn()) ? 'Bạn chưa đăng nhập. Vui lòng đăng nhập để bắt đầu chọn mua sản phẩm.' : 'Thêm vài dụng cụ học tập xinh xắn để bắt đầu đơn hàng của bạn nhé.'}</p>
            <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px;">
              ${(window.AuthManager && !window.AuthManager.isLoggedIn()) ? `<a class="btn btn-primary" href="${loginHref}">Đăng nhập ngay</a>` : ''}
              <a class="btn ${(window.AuthManager && !window.AuthManager.isLoggedIn()) ? 'btn-outlined' : 'btn-primary'}" href="${shopHref}">Mua sắm ngay</a>
            </div>
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
  /* ==========================================================================
     QUẢN LÝ XÁC THỰC NGƯỜI DÙNG & ĐỒNG BỘ GIAO DIỆN HEADER (AuthManager)
     ========================================================================== */
  const AUTH_STORAGE_KEY = 'hds_auth_user';

  const AuthManager = {
    getUser: function () {
      try {
        const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Object.assign({}, parsed);
      } catch (err) {
        return null;
      }
    },
    isLoggedIn: function () {
      return this.getUser() !== null;
    },
    login: function (data) {
      const user = Object.assign({
        name: 'Khách hàng mới',
        email: 'minhanh@email.com',
        avatar: '../../assets/img/avatar.jpg',
        loginTime: new Date().toISOString()
      }, data || {});
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch (e) {}
      if (window.StoreCart && typeof window.StoreCart.updateBadges === 'function') { window.StoreCart.updateBadges(); }
      return user;
    },
    logout: function () {
      try {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('hds_cart_v1');
      } catch (e) {}
      if (window.StoreCart && typeof window.StoreCart.updateBadges === 'function') { window.StoreCart.updateBadges(); }
      if (window.showSiteToast) {
        window.showSiteToast('Đã đăng xuất tài khoản.');
      }
      setTimeout(function () {
        const path = window.location.pathname.replace(/\\/g, '/');
        if (path.includes('/page/customer/profile.html')) {
          window.location.href = '../homepage/main.html';
        } else {
          window.location.reload();
        }
      }, 400);
    }
  };

  window.AuthManager = AuthManager;

  function getAuthPaths() {
    const p = window.location.pathname.replace(/\\/g, '/');
    const adminLink = '../../admin_page/A01%20Đăng%20nhập%20quản%20trị/index.html';
    if (p.includes('/page/auth/')) {
      return {
        login: 'login.html',
        register: 'register.html',
        admin: adminLink,
        profile: '../customer/profile.html',
        orders: '../customer/cart.html?tab=orders'
      };
    } else if (p.includes('/page/customer/')) {
      return {
        login: '../auth/login.html',
        register: '../auth/register.html',
        admin: adminLink,
        profile: 'profile.html',
        orders: 'cart.html?tab=orders'
      };
    } else {
      return {
        login: '../auth/login.html',
        register: '../auth/register.html',
        admin: adminLink,
        profile: '../customer/profile.html',
        orders: '../customer/cart.html?tab=orders'
      };
    }
  }

  function initHeaderAuth() {
    const slots = document.querySelectorAll('.header-auth-slot, .homepage-user');
    if (!slots.length) return;

    const paths = getAuthPaths();
    const rawUser = AuthManager.getUser();
    const user = rawUser ? Object.assign({}, rawUser, {
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@email.com'
    }) : null;

    slots.forEach(function (slot) {
      let container = slot;
      if (slot.classList.contains('homepage-user') && slot.tagName === 'A' && !slot.classList.contains('header-user-link')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'header-auth-slot';
        slot.parentNode.replaceChild(wrapper, slot);
        container = wrapper;
      }

      if (user) {
        container.innerHTML = `
          <div class="header-user-wrapper">
            <a class="homepage-user header-user-link" href="${paths.profile}" title="Tài khoản cá nhân: ${escapeHTML(user.name)}">
              <img src="${escapeHTML(user.avatar)}" alt="${escapeHTML(user.name)}" width="36" height="36">
              <span>${escapeHTML(user.name)}</span>
            </a>
            <div class="header-user-dropdown" role="menu">
              <div class="header-user-dropdown-header">
                <strong>${escapeHTML(user.name)}</strong>
                <small>${escapeHTML(user.email || 'Học viên Học Đường')}</small>
              </div>
              <a href="${paths.profile}" role="menuitem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>
                <span>Hồ sơ cá nhân</span>
              </a>
              <a href="${paths.orders}" role="menuitem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>Đơn hàng của tôi</span>
              </a>
              <a href="${paths.admin}" role="menuitem" style="color: var(--color-primary-800);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Trang quản trị (Admin)</span>
              </a>
              <button type="button" class="logout-item" data-action="logout" role="menuitem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        `;
        const userWrapper = container.querySelector('.header-user-wrapper');
        const userLink = container.querySelector('.header-user-link');
        if (userLink && userWrapper) {
          userLink.addEventListener('click', function (e) {
            e.preventDefault();
            userWrapper.classList.toggle('is-open');
          });
        }

        const logoutBtn = container.querySelector('[data-action="logout"]');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            AuthManager.logout();
          });
        }
      } else {
        container.innerHTML = `
          <div class="header-auth-group">
            <a class="header-auth-btn header-auth-login" href="${paths.login}" title="Đăng nhập tài khoản">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              <span>Đăng nhập</span>
            </a>
            <a class="header-auth-btn header-auth-register" href="${paths.register}" title="Đăng ký tài khoản">
              <span>Đăng ký</span>
            </a>
          </div>
        `;
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.header-user-wrapper')) {
        document.querySelectorAll('.header-user-wrapper.is-open').forEach(function (el) {
          el.classList.remove('is-open');
        });
      }
    });
  }

  if (document.readyState === 'complete') {
    initHeaderAuth();
  } else {
    document.addEventListener('DOMContentLoaded', initHeaderAuth);
  }

})();
// Hàm mở giỏ hàng (Cart Drawer)
window.openCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer') || document.querySelector('.cart-drawer');
  if (drawer) {
    drawer.classList.add('open'); // Hoặc class hiển thị tương ứng trong CSS của bạn
  } else {
    console.warn('Không tìm thấy element của Cart Drawer trên trang này.');
  }
};

// Hàm đóng giỏ hàng
window.closeCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer') || document.querySelector('.cart-drawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
};
