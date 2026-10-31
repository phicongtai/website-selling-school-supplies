/**
 * HỌC ĐƯỜNG STORE - KHU VỰC KHÁCH HÀNG
 * Xử lý: giỏ hàng & đơn hàng, thanh toán, đặt hàng thành công, hồ sơ cá nhân.
 * Dữ liệu dùng chung với homepage qua localStorage và window.StoreCatalog.
 */
(function () {
  'use strict';

  const PROFILE_KEY = 'hds_profile_v1';
  const ADDRESS_KEY = 'hds_addresses_v1';
  const LAST_ORDER_KEY = 'hds_last_order_v1';
  const ORDER_HISTORY_KEY = 'hds_order_history_v1';
  const DRAFT_ORDER_CODE = 'HD1011010';

  // Luôn dọn dẹp dữ liệu lưu tạm để bảo đảm dữ liệu gốc chuẩn không bị sửa
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(ADDRESS_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(ADDRESS_KEY);
  } catch (e) {}

  const DEFAULT_PROFILE = {
    name: 'Nguyễn Minh Anh',
    email: 'minhanh@email.com',
    phone: '0912 234 567',
    birthday: '12/03/2008',
    studentId: 'HS-2026-0158',
    points: 1460,
    tier: 'Vàng'
  };

  const DEFAULT_ADDRESSES = [
    {
      id: 'addr-1',
      name: 'Nguyễn Minh Anh',
      phone: '0912 234 567',
      type: 'Nhà riêng',
      street: '12 Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
      isDefault: true
    },
    {
      id: 'addr-2',
      name: 'Nguyễn Minh Anh',
      phone: '0912 234 567',
      type: 'Trường học',
      street: '45 Lê Văn Việt',
      ward: 'Phường Hiệp Phú',
      district: 'TP. Thủ Đức',
      province: 'TP. Hồ Chí Minh',
      isDefault: false
    }
  ];

  const ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5M14 11v5"></path></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 7h11v10H3z"></path><path d="M14 10h4l3 3v4h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>'
  };

  const money = amount => new Intl.NumberFormat('vi-VN').format(Number(amount) || 0) + ' ₫';
  const numberVN = value => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);

  const formatDate = value => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return String(value || '');
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const readJSON = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  };

  const writeJSON = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Chế độ riêng tư có thể chặn localStorage; giao diện vẫn hoạt động trong phiên hiện tại.
    }
    return value;
  };

  const isUserLoggedIn = () => {
    try {
      if (window.AuthManager && typeof window.AuthManager.isLoggedIn === 'function') {
        return window.AuthManager.isLoggedIn();
      }
      const raw = sessionStorage.getItem('hds_auth_user');
      return Boolean(raw && raw !== 'null');
    } catch (e) {
      return false;
    }
  };

  const getProfile = () => {
    // Dữ liệu gốc chuẩn cố định không bị sửa
    return Object.assign({}, DEFAULT_PROFILE);
  };

  const cloneAddresses = list => list.map(item => Object.assign({}, item));

  const normalizeDefault = list => {
    if (!list.length) return list;
    if (!list.some(item => item.isDefault)) list[0].isDefault = true;
    return list;
  };

  const getAddresses = () => {
    // Dữ liệu danh sách địa chỉ gốc chuẩn cố định không bị sửa
    return cloneAddresses(DEFAULT_ADDRESSES);
  };

  const saveAddresses = list => writeJSON(ADDRESS_KEY, normalizeDefault(cloneAddresses(list)));

  const fullAddress = address => {
    if (!address) return '';
    return [address.street, address.ward, address.district, address.province]
      .filter(Boolean)
      .join(', ');
  };

  const getProducts = () => (window.StoreCatalog && window.StoreCatalog.products) || [];
  const findProduct = id => getProducts().find(product => Number(product.id) === Number(id));

  const getCartItems = () => {
    const cart = window.StoreCart ? window.StoreCart.get() : [];
    return cart
      .map(entry => {
        const product = findProduct(entry.id);
        return product ? { product: product, quantity: Number(entry.quantity) || 0 } : null;
      })
      .filter(item => item && item.quantity > 0);
  };

  const cartSubtotal = items => items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toast = message => {
    if (typeof window.showSiteToast === 'function') {
      window.showSiteToast(message);
    } else {
      window.alert(message);
    }
  };

  const defaultAddress = () => {
    const list = getAddresses();
    return list.find(item => item.isDefault) || list[0] || null;
  };

  const syncProfileLabels = () => {
    const memberCard = document.querySelector('.c-member-card');
    if (!isUserLoggedIn()) {
      if (memberCard) {
        memberCard.style.display = 'none';
      }
      document.querySelectorAll('[data-profile-name]').forEach(node => {
        node.textContent = 'Khách vãng lai';
      });
      document.querySelectorAll('[data-profile-email]').forEach(node => {
        node.textContent = 'Chưa đăng nhập';
      });
      document.querySelectorAll('[data-profile-points]').forEach(node => {
        node.textContent = '0 điểm';
      });
      document.querySelectorAll('.homepage-user span').forEach(node => {
        node.textContent = 'Đăng nhập';
      });
      return;
    }
    if (memberCard) {
      memberCard.style.display = '';
    }
    const profile = getProfile();
    document.querySelectorAll('[data-profile-name]').forEach(node => {
      node.textContent = profile.name;
    });
    document.querySelectorAll('[data-profile-email]').forEach(node => {
      node.textContent = profile.email;
    });
    document.querySelectorAll('.homepage-user span').forEach(node => {
      node.textContent = profile.name;
    });
  };

  const escapeHTML = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  /* -----------------------------------------------------------------------
     GIỎ HÀNG & ĐƠN HÀNG
     ----------------------------------------------------------------------- */
  const DEMO_ORDERS = [
    {
      code: 'HD1011064',
      status: 'shipping',
      statusLabel: 'Đang giao',
      date: '09/01/2026',
      items: [{ id: 32, quantity: 1 }, { id: 31, quantity: 1 }],
      eta: '12/01/2026'
    },
    {
      code: 'HD1011001',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      date: '28/12/2025',
      items: [{ id: 24, quantity: 1 }, { id: 32, quantity: 1 }, { id: 13, quantity: 1 }, { id: 47, quantity: 1 }],
      eta: '31/12/2025',
      collapsed: true
    }
  ];

  const demoOrderItems = order => order.items
    .map(entry => ({ product: findProduct(entry.id), quantity: entry.quantity }))
    .filter(item => item.product);

  const demoOrderTotal = order => cartSubtotal(demoOrderItems(order));

  const renderOrderItem = (item, options) => {
    const product = item.product;
    const editable = Boolean(options && options.editable);
    const quantity = item.quantity;
    const qtyMarkup = editable
      ? `<div class="c-qty" aria-label="Số lượng sản phẩm (cố định)">
           <button type="button" data-qty="-1" data-id="${product.id}" aria-label="Giảm số lượng" disabled>−</button>
           <input type="number" min="1" max="99" value="${quantity}" data-qty-input data-id="${product.id}" aria-label="Số lượng ${escapeHTML(product.title)}" disabled>
           <button type="button" data-qty="1" data-id="${product.id}" aria-label="Tăng số lượng" disabled>+</button>
         </div>`
      : `<span class="c-item-qty-static">SL: ${quantity}</span>`;

    const removeMarkup = editable
      ? `<button class="c-item-remove" type="button" data-remove="${product.id}" title="Giỏ hàng cố định" aria-label="Xóa ${escapeHTML(product.title)} khỏi giỏ hàng" disabled>${ICONS.trash}</button>`
      : '<span aria-hidden="true"></span>';

    return `<div class="c-order-item">
      <div class="c-item-thumb"><img src="${product.image}" alt="${escapeHTML(product.title)}" loading="lazy"></div>
      <div class="c-item-main">
        <a href="../products/product-${String(product.code).toLowerCase()}.html">${escapeHTML(product.title)}</a>
        <div class="c-item-meta"><span>Mã: ${product.code}</span><span>${escapeHTML(product.pack || '1 sản phẩm')}</span></div>
      </div>
      ${qtyMarkup}
      <div class="c-item-price">${money(product.price * quantity)}</div>
      ${removeMarkup}
    </div>`;
  };

  const renderOrderCard = order => {
    const items = order.type === 'draft' ? order.cartItems : demoOrderItems(order);
    if (!items.length) return '';
    const total = cartSubtotal(items);
    const address = order.address || defaultAddress();
    const addressText = address ? fullAddress(address) : 'Chưa có địa chỉ giao hàng';
    const isDraft = order.type === 'draft';
    const isCollapsed = Boolean(order.collapsed) && !order.expanded;
    const visibleItems = isCollapsed ? items.slice(0, 1) : items;
    const hiddenCount = items.length - visibleItems.length;

    const hiddenRow = isCollapsed && hiddenCount > 0
      ? `<div class="c-order-more">
           <span>+ ${hiddenCount} sản phẩm khác trong đơn hàng</span>
           <button type="button" data-expand-order="${order.code}">Xem tất cả (${items.length})</button>
         </div>`
      : '';

    let actionMarkup;
    if (isDraft) {
      actionMarkup = `<a class="c-text-link" href="checkout.html">Chi tiết đơn hàng</a>
        <a class="c-btn c-btn--primary" href="checkout.html">Đặt hàng</a>`;
    } else if (order.status === 'shipping') {
      actionMarkup = `<button class="c-text-link" type="button" data-track-order="${order.code}">Chi tiết đơn hàng</button>
        <button class="c-btn c-btn--primary" type="button" data-track-order="${order.code}">Theo dõi đơn</button>`;
    } else {
      actionMarkup = `<button class="c-text-link" type="button" data-track-order="${order.code}">Chi tiết đơn hàng</button>
        <button class="c-btn c-btn--primary" type="button" data-reorder="${order.code}">Mua lại</button>`;
    }

    const subtitle = isDraft
      ? `Cập nhật ${formatDate(new Date())} · Sẵn sàng thanh toán`
      : `Đặt ngày ${order.date}`;
    const searchText = `${order.code} ${items.map(item => item.product.title).join(' ')}`.toLowerCase();
    const statusClass = order.status === 'completed'
      ? 'c-status--completed'
      : (order.status === 'shipping' ? 'c-status--shipping' : 'c-status--pending');

    return `<article class="c-order-card" data-order-status="${order.status}" data-order-search="${escapeHTML(searchText)}" id="order-${order.code}">
      <header class="c-order-head">
        <div class="c-order-title">
          <span class="c-icon-circle">${ICONS.cart}</span>
          <div><h2>Đơn hàng #${isDraft ? DRAFT_ORDER_CODE : order.code}</h2><p>${subtitle}</p></div>
        </div>
        <span class="c-status ${statusClass}">${order.statusLabel || 'Chờ thanh toán'}</span>
      </header>
      <div class="c-order-address">
        ${ICONS.pin}
        <span><strong>Giao đến:</strong> ${escapeHTML(addressText)}</span>
      </div>
      <div class="c-order-items">
        ${visibleItems.map(item => renderOrderItem(item, { editable: isDraft })).join('')}
        ${hiddenRow}
      </div>
      <footer class="c-order-foot">
        <div class="c-order-total"><span>Tổng tiền</span><strong>${money(total)}</strong></div>
        <div class="c-order-actions">${actionMarkup}</div>
      </footer>
    </article>`;
  };

  const initCartPage = () => {
    const list = document.getElementById('cartOrderList');
    if (!list) return;

    const searchInput = document.getElementById('orderSearch');
    const tabs = Array.from(document.querySelectorAll('[data-order-filter]'));
    const expandedOrders = new Set();
    let activeFilter = 'all';
    let keyword = '';

    const getOrders = () => {
      if (!isUserLoggedIn()) {
        return [];
      }
      const orders = [];
      const cartItems = getCartItems();
      if (cartItems.length) {
        orders.push({
          type: 'draft',
          code: DRAFT_ORDER_CODE,
          status: 'processing',
          statusLabel: 'Chờ thanh toán',
          cartItems: cartItems,
          address: defaultAddress()
        });
      }
      // Dong bo lich su mua hang: nap cac don da dat (checkout) tu localStorage
      const history = Array.isArray(readJSON(ORDER_HISTORY_KEY, [])) ? readJSON(ORDER_HISTORY_KEY, []) : [];
      const lastOrder = readJSON(LAST_ORDER_KEY, null);
      if (lastOrder && Array.isArray(lastOrder.items) && lastOrder.items.length
        && !history.some(item => item.code === lastOrder.code)
        && !DEMO_ORDERS.some(item => item.code === lastOrder.code)) {
        history.push(lastOrder);
        writeJSON(ORDER_HISTORY_KEY, history);
      }
      history.forEach(saved => {
        if (DEMO_ORDERS.some(item => item.code === saved.code)) return;
        orders.push({
          type: 'placed',
          code: saved.code,
          status: 'shipping',
          statusLabel: 'Đang xử lý',
          date: formatDate(saved.date),
          eta: saved.eta ? formatDate(saved.eta) : '',
          items: saved.items.map(item => ({ id: item.id, quantity: item.quantity })),
          address: Object.assign({}, saved.address || defaultAddress()),
          expanded: expandedOrders.has(saved.code)
        });
      });
      DEMO_ORDERS.forEach(order => {
        orders.push(Object.assign({}, order, {
          address: defaultAddress(),
          expanded: expandedOrders.has(order.code)
        }));
      });
      return orders;
    };

    const updateCounts = orders => {
      const counts = {
        all: orders.length,
        processing: orders.filter(order => order.status === 'processing' || order.status === 'shipping').length,
        completed: orders.filter(order => order.status === 'completed').length
      };
      Object.keys(counts).forEach(key => {
        const node = document.querySelector(`[data-count="${key}"]`);
        if (node) node.textContent = String(counts[key]);
      });
    };

    const render = () => {
      const orders = getOrders();
      updateCounts(orders);

      const filtered = orders.filter(order => {
        const matchStatus = activeFilter === 'all'
          || (activeFilter === 'processing' && (order.status === 'processing' || order.status === 'shipping'))
          || (activeFilter === 'completed' && order.status === 'completed');
        const text = `${order.code} ${(order.type === 'draft' ? order.cartItems : demoOrderItems(order)).map(item => item.product.title).join(' ')}`.toLowerCase();
        const matchKeyword = !keyword || text.includes(keyword);
        return matchStatus && matchKeyword;
      });

      if (!filtered.length) {
        list.innerHTML = `<div class="c-orders-empty">
          <span class="c-icon-circle">${ICONS.cart}</span>
          <h3>${!isUserLoggedIn() ? 'Bạn chưa đăng nhập' : (keyword ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng phù hợp')}</h3>
          <p>${!isUserLoggedIn() ? 'Giỏ hàng của bạn đang trống. Vui lòng đăng nhập để xem giỏ hàng và theo dõi đơn hàng của bạn.' : (keyword ? 'Thử tìm bằng mã đơn hàng hoặc tên sản phẩm khác.' : 'Giỏ hàng của bạn đang trống. Khám phá thêm dụng cụ học tập mới nhé!')}</p>
          <div style="display:flex; gap:10px; justify-content:center; margin-top:14px;">
            ${!isUserLoggedIn() ? '<a class="c-btn c-btn--primary" href="../auth/login.html?redirect=cart">Đăng nhập ngay</a>' : ''}
            <a class="c-btn ${!isUserLoggedIn() ? 'c-btn--secondary' : 'c-btn--primary'}" href="../homepage/main.html#view-category">Khám phá sản phẩm</a>
          </div>
        </div>`;
        return;
      }

      list.innerHTML = filtered.map(renderOrderCard).join('');
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activeFilter = tab.dataset.orderFilter;
        tabs.forEach(item => {
          const selected = item === tab;
          item.classList.toggle('is-active', selected);
          item.setAttribute('aria-selected', selected ? 'true' : 'false');
        });
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', event => {
        keyword = event.target.value.trim().toLowerCase();
        render();
      });
    }

    list.addEventListener('click', event => {
      const qtyButton = event.target.closest('[data-qty]');
      if (qtyButton) {
        const id = Number(qtyButton.dataset.id);
        const delta = Number(qtyButton.dataset.qty);
        const current = window.StoreCart.get().find(item => Number(item.id) === id);
        const next = Math.min(99, Math.max(1, (current ? current.quantity : 1) + delta));
        window.StoreCart.setQuantity(id, next);
        render();
        return;
      }

      const removeButton = event.target.closest('[data-remove]');
      if (removeButton) {
        window.StoreCart.remove(Number(removeButton.dataset.remove));
        toast('Giỏ hàng demo có bộ sản phẩm cố định, không thể xóa.');
        render();
        return;
      }

      const expandButton = event.target.closest('[data-expand-order]');
      if (expandButton) {
        expandedOrders.add(expandButton.dataset.expandOrder);
        render();
        return;
      }

      const trackButton = event.target.closest('[data-track-order]');
      if (trackButton) {
        const code = trackButton.dataset.trackOrder;
        const demoOrder = DEMO_ORDERS.find(item => item.code === code);
        const placedOrder = (readJSON(ORDER_HISTORY_KEY, []) || []).find(item => item.code === code);
        const order = demoOrder || (placedOrder ? {
          code: placedOrder.code,
          status: 'shipping',
          eta: formatDate(placedOrder.eta)
        } : null);
        toast(order && order.status === 'shipping'
          ? `Đơn hàng #${code} đang được giao, dự kiến nhận ${order.eta}.`
          : `Đơn hàng #${code} đã giao thành công. Cảm ơn bạn đã tin chọn Học Đường Store!`);
        return;
      }

      const reorderButton = event.target.closest('[data-reorder]');
      if (reorderButton) {
        const order = DEMO_ORDERS.find(item => item.code === reorderButton.dataset.reorder);
        if (!order) return;
        demoOrderItems(order).forEach(item => window.StoreCart.add(item.product.id, item.quantity));
        toast('Đã thêm lại các sản phẩm vào giỏ hàng.');
        render();
      }
    });

    list.addEventListener('change', event => {
      const input = event.target.closest('[data-qty-input]');
      if (!input) return;
      const id = Number(input.dataset.id);
      const value = Math.min(99, Math.max(1, Number(input.value) || 1));
      window.StoreCart.setQuantity(id, value);
      render();
    });

    document.addEventListener('cart:changed', render);
    render();

    if (new URLSearchParams(window.location.search).get('tab') === 'orders') {
      window.setTimeout(() => {
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  /* -----------------------------------------------------------------------
     THANH TOÁN
     ----------------------------------------------------------------------- */
  const initCheckoutPage = () => {
    const form = document.getElementById('checkoutForm');
    const itemsContainer = document.getElementById('checkoutItems');
    if (!form || !itemsContainer) return;

    if (!isUserLoggedIn()) {
      if (typeof window.showSiteToast === 'function') {
        window.showSiteToast('Vui lòng đăng nhập tài khoản trước khi tiến hành thanh toán!');
      } else {
        alert('Vui lòng đăng nhập tài khoản trước khi tiến hành thanh toán!');
      }
      setTimeout(() => {
        window.location.replace('../auth/login.html?redirect=checkout');
      }, 500);
      return;
    }

    const profile = getProfile();
    const buyerGrid = document.getElementById('buyerInfoGrid');
    const addressList = document.getElementById('checkoutAddressList');
    const newAddressForm = document.getElementById('newAddressForm');
    const newAddressRadio = document.getElementById('addressNew');
    const submitButton = document.querySelector('[form="checkoutForm"][type="submit"]');
    const countNode = document.getElementById('summaryCount');
    const subtotalNode = document.getElementById('summarySubtotal');
    const totalNode = document.getElementById('summaryTotal');
    const discountRow = document.getElementById('discountRow');
    const discountNode = document.getElementById('summaryDiscount');
    const voucherInput = document.getElementById('voucherInput');
    const voucherButton = document.getElementById('applyVoucher');

    let items = getCartItems();
    let subtotal = cartSubtotal(items);
    let discount = 0;

    if (buyerGrid) {
      buyerGrid.innerHTML = `
        <div class="c-info-tile"><span>Họ và tên</span><strong>${escapeHTML(profile.name)}</strong></div>
        <div class="c-info-tile"><span>Số điện thoại</span><strong>${escapeHTML(profile.phone)}</strong></div>
        <div class="c-info-tile"><span>Email liên hệ</span><strong>${escapeHTML(profile.email)}</strong></div>`;
    }

    const renderAddresses = () => {
      if (!addressList) return;
      const addresses = getAddresses();
      if (!addresses.length) {
        addressList.innerHTML = `<div class="c-empty-note">
          <strong>Bạn chưa có địa chỉ nhận hàng</strong>
          Vui lòng chọn “Giao đến địa chỉ mới” bên dưới hoặc <a href="profile.html#addresses">thêm địa chỉ trong hồ sơ</a>.
        </div>`;
        if (newAddressRadio) newAddressRadio.checked = true;
        if (newAddressForm) newAddressForm.hidden = false;
        return;
      }

      const hasDefault = addresses.some(address => address.isDefault);
      addressList.innerHTML = addresses.map((address, index) => {
        const checked = address.isDefault || (!hasDefault && index === 0);
        return `<label class="c-address${checked ? ' is-selected' : ''}" for="checkout-${address.id}">
          <input type="radio" id="checkout-${address.id}" name="deliveryAddress" value="${address.id}"${checked ? ' checked' : ''}>
          <span class="c-radio"></span>
          <div class="c-address-body">
            <div class="c-address-top">
              <strong>${escapeHTML(address.name)}</strong>
              <span class="c-dot">·</span>
              <span>${escapeHTML(address.phone)}</span>
              ${address.isDefault ? '<span class="c-badge">Mặc định</span>' : ''}
              <span class="c-badge c-badge--soft">${escapeHTML(address.type || 'Nhà riêng')}</span>
            </div>
            <p>${escapeHTML(fullAddress(address))}</p>
          </div>
          <a class="c-icon-btn" href="profile.html#addresses" title="Chỉnh sửa địa chỉ" aria-label="Chỉnh sửa địa chỉ" onclick="event.stopPropagation()">${ICONS.pencil}</a>
        </label>`;
      }).join('');
    };

    const setAddressSelection = () => {
      const selected = form.querySelector('input[name="deliveryAddress"]:checked');
      const useNew = !selected || selected.value === 'new';
      if (newAddressForm) newAddressForm.hidden = !useNew;
      addressList.querySelectorAll('.c-address').forEach(card => {
        const input = card.querySelector('input');
        card.classList.toggle('is-selected', Boolean(input && input.checked));
      });
      if (useNew) {
        const streetInput = document.getElementById('newStreet');
        if (streetInput && !newAddressForm.hidden) streetInput.focus({ preventScroll: true });
      }
    };

    const renderSummary = () => {
      items = getCartItems();
      subtotal = cartSubtotal(items);
      const quantity = items.reduce((total, item) => total + item.quantity, 0);
      if (countNode) countNode.textContent = `${quantity} sản phẩm`;

      if (!items.length) {
        itemsContainer.innerHTML = `<div class="c-empty-note">
          <strong>Giỏ hàng đang trống</strong>
          Thêm sản phẩm để tiếp tục thanh toán. <a href="../homepage/main.html#view-category">Mua sắm ngay</a>
        </div>`;
        if (submitButton) submitButton.disabled = true;
      } else {
        itemsContainer.innerHTML = items.map(item => `<div class="c-summary-item">
          <div class="c-summary-thumb"><img src="${item.product.image}" alt="${escapeHTML(item.product.title)}" loading="lazy"></div>
          <div>
            <span class="c-summary-name">${escapeHTML(item.product.title)}</span>
            <span class="c-summary-meta">SL: ${item.quantity} · ${escapeHTML(item.product.pack || '1 sản phẩm')}</span>
          </div>
          <span class="c-summary-price">${money(item.product.price * item.quantity)}</span>
        </div>`).join('');
        if (submitButton) submitButton.disabled = false;
      }

      updateTotals();
    };

    const updateTotals = () => {
      discount = Math.round(subtotal * (voucherButton && voucherButton.dataset.applied === '1' ? 0.2 : 0));
      if (subtotalNode) subtotalNode.textContent = money(subtotal);
      if (discountRow) discountRow.hidden = discount <= 0;
      if (discountNode) discountNode.textContent = `-${money(discount)}`;
      if (totalNode) totalNode.textContent = money(Math.max(0, subtotal - discount));
    };

    renderAddresses();
    renderSummary();
    setAddressSelection();

    form.addEventListener('change', event => {
      if (event.target.name === 'deliveryAddress') setAddressSelection();

      if (event.target.name === 'payment') {
        form.querySelectorAll('.c-pay-option').forEach(option => {
          const input = option.querySelector('input[name="payment"]');
          option.classList.toggle('is-selected', Boolean(input && input.checked));
        });
      }
    });

    if (voucherInput) {
      voucherInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (voucherButton) voucherButton.click();
        }
      });
    }

    if (voucherButton) {
      voucherButton.addEventListener('click', () => {
        const code = (voucherInput ? voucherInput.value : '').trim().toUpperCase();
        if (code === 'WELCOME2026') {
          voucherButton.dataset.applied = '1';
          voucherButton.textContent = 'Đã áp dụng';
          voucherButton.style.background = 'var(--color-primary)';
          voucherButton.style.color = '#fff';
          toast('Đã áp dụng mã WELCOME2026 - giảm 20% đơn hàng.');
        } else {
          voucherButton.dataset.applied = '0';
          voucherButton.textContent = 'Áp dụng';
          voucherButton.style.background = '#fff';
          voucherButton.style.color = '';
          toast(code ? 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' : 'Vui lòng nhập mã giảm giá.');
        }
        updateTotals();
      });
    }

    const validateNewAddress = () => {
      const fields = [
        { node: document.getElementById('newProvince'), label: 'Tỉnh / Thành phố' },
        { node: document.getElementById('newDistrict'), label: 'Quận / Huyện' },
        { node: document.getElementById('newWard'), label: 'Phường / Xã' },
        { node: document.getElementById('newStreet'), label: 'Số nhà, tên đường' }
      ];
      for (const field of fields) {
        if (!field.node || !String(field.node.value).trim()) {
          toast(`Vui lòng nhập ${field.label.toLowerCase()}.`);
          if (field.node) {
            field.node.focus();
            field.node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return null;
        }
      }
      return {
        name: profile.name,
        phone: profile.phone,
        type: 'Địa chỉ mới',
        street: document.getElementById('newStreet').value.trim(),
        ward: document.getElementById('newWard').value,
        district: document.getElementById('newDistrict').value,
        province: document.getElementById('newProvince').value
      };
    };

    form.addEventListener('submit', event => {
      event.preventDefault();

      if (!items.length) {
        toast('Giỏ hàng đang trống, vui lòng thêm sản phẩm trước khi đặt hàng.');
        return;
      }

      const selectedAddressInput = form.querySelector('input[name="deliveryAddress"]:checked');
      let address = null;

      if (!selectedAddressInput) {
        toast('Vui lòng chọn địa chỉ giao hàng.');
        return;
      }

      if (selectedAddressInput.value === 'new') {
        address = validateNewAddress();
        if (!address) return;

        const saveCheckbox = document.getElementById('saveNewAddress');
        if (saveCheckbox && saveCheckbox.checked) {
          const list = getAddresses();
          const newAddress = Object.assign({}, address, {
            id: `addr-${Date.now()}`,
            isDefault: list.length === 0
          });
          list.push(newAddress);
          saveAddresses(list);
        }
      } else {
        address = getAddresses().find(item => item.id === selectedAddressInput.value) || null;
      }

      if (!address) {
        toast('Không tìm thấy địa chỉ đã chọn. Vui lòng thử lại.');
        return;
      }

      const paymentInput = form.querySelector('input[name="payment"]:checked');
      const payment = paymentInput ? paymentInput.value : 'cod';
      const noteField = document.getElementById('checkoutNote');
      const orderCode = 'HD' + String(Date.now()).slice(-7);
      const now = new Date();
      const finalTotal = Math.max(0, subtotal - discount);

      const order = {
        code: orderCode,
        date: now.toISOString(),
        eta: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: items.map(item => ({
          id: item.product.id,
          code: item.product.code,
          title: item.product.title,
          image: item.product.image,
          pack: item.product.pack || '1 sản phẩm',
          price: item.product.price,
          quantity: item.quantity
        })),
        subtotal: subtotal,
        discount: discount,
        shipping: 0,
        total: finalTotal,
        payment: payment,
        paymentLabel: payment === 'online' ? 'Thanh toán trực tuyến' : 'Thanh toán khi nhận hàng (COD)',
        address: Object.assign({}, address),
        note: noteField ? noteField.value.trim() : '',
        customer: { name: profile.name, phone: profile.phone, email: profile.email }
      };

      writeJSON(LAST_ORDER_KEY, order);
      if (window.StoreCart) window.StoreCart.set([]);
      window.location.href = 'order-success.html';
    });
  };

  /* -----------------------------------------------------------------------
     ĐẶT HÀNG THÀNH CÔNG
     ----------------------------------------------------------------------- */
  const buildFallbackOrder = () => {
    const address = defaultAddress();
    const seed = getCartItems();
    const source = seed.length
      ? seed
      : [
          { product: findProduct(10), quantity: 1 },
          { product: findProduct(18), quantity: 1 }
        ].filter(item => item.product);
    const subtotal = cartSubtotal(source);
    const now = new Date();
    return {
      code: DRAFT_ORDER_CODE,
      date: now.toISOString(),
      eta: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      items: source.map(item => ({
        id: item.product.id,
        code: item.product.code,
        title: item.product.title,
        image: item.product.image,
        pack: item.product.pack || '1 sản phẩm',
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: subtotal,
      discount: 0,
      shipping: 0,
      total: subtotal,
      payment: 'cod',
      paymentLabel: 'Thanh toán khi nhận hàng (COD)',
      address: address || DEFAULT_ADDRESSES[0]
    };
  };

  const initSuccessPage = () => {
    const container = document.getElementById('successItems');
    if (!container) return;

    const stored = readJSON(LAST_ORDER_KEY, null);
    const order = stored && Array.isArray(stored.items) && stored.items.length ? stored : buildFallbackOrder();
    const profile = getProfile();

    const codeText = `#${order.code}`;
    const codeNode = document.getElementById('successCode');
    const metaCode = document.getElementById('successMetaCode');
    const metaDate = document.getElementById('successMetaDate');
    const metaAddress = document.getElementById('successMetaAddress');
    const metaPayment = document.getElementById('successMetaPayment');
    const metaEta = document.getElementById('successMetaEta');
    const countNode = document.getElementById('successItemCount');
    const subtotalNode = document.getElementById('successSubtotal');
    const discountRow = document.getElementById('successDiscountRow');
    const discountNode = document.getElementById('successDiscount');
    const totalNode = document.getElementById('successTotal');

    if (codeNode) codeNode.textContent = codeText;
    if (metaCode) metaCode.textContent = codeText;
    if (metaDate) metaDate.textContent = formatDate(order.date);
    if (metaAddress) metaAddress.textContent = fullAddress(order.address) || 'Đang cập nhật';
    if (metaPayment) metaPayment.textContent = order.paymentLabel || 'Thanh toán khi nhận hàng (COD)';
    if (metaEta) metaEta.textContent = formatDate(order.eta);
    if (countNode) countNode.textContent = `(${order.items.length} sản phẩm)`;

    container.innerHTML = order.items.map(item => {
      const product = findProduct(item.id);
      return `<div class="c-order-item">
        <div class="c-item-thumb"><img src="${item.image || (product && product.image) || ''}" alt="${escapeHTML(item.title)}" loading="lazy"></div>
        <div class="c-item-main">
          <a href="../products/product-${String(item.code || '').toLowerCase()}.html">${escapeHTML(item.title)}</a>
          <div class="c-item-meta"><span>Mã: ${escapeHTML(item.code || '')}</span><span>${escapeHTML(item.pack || '1 sản phẩm')}</span></div>
        </div>
        <span class="c-item-qty-static">SL: ${item.quantity}</span>
        <div class="c-item-price">${money(item.price * item.quantity)}</div>
        <span aria-hidden="true"></span>
      </div>`;
    }).join('');

    if (subtotalNode) subtotalNode.textContent = money(order.subtotal);
    if (discountRow) discountRow.hidden = !(order.discount > 0);
    if (discountNode) discountNode.textContent = `-${money(order.discount)}`;
    if (totalNode) totalNode.textContent = money(order.total);

    // Hiển thị tên người nhận mới nhất trong lời cảm ơn.
    document.querySelectorAll('.c-success-hero p strong').forEach(node => {
      if (!node.classList.contains('c-order-code')) node.textContent = profile.name;
    });
  };

  /* -----------------------------------------------------------------------
     HỒ SƠ CÁ NHÂN
     ----------------------------------------------------------------------- */
  const initProfilePage = () => {
    const fields = document.getElementById('profileFields');
    if (!fields) return;

    const editButton = document.getElementById('editProfileBtn');
    const addressList = document.getElementById('profileAddressList');
    const addAddressButtons = [
      document.getElementById('addAddressBtn')
    ].concat(Array.from(document.querySelectorAll('[data-add-address]')));
    const modal = document.getElementById('addressModal');
    const addressForm = document.getElementById('addressForm');
    let editingProfile = false;

    const fieldDefinitions = [
      { key: 'name', label: 'Họ và tên', type: 'text', autocomplete: 'name' },
      { key: 'birthday', label: 'Ngày sinh', type: 'text', autocomplete: 'bday' },
      { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
      { key: 'phone', label: 'Số điện thoại', type: 'tel', autocomplete: 'tel' },
      { key: 'studentId', label: 'Mã học sinh', type: 'text', autocomplete: 'off', wide: true }
    ];

    const setEditButton = editing => {
      if (!editButton) return;
      editButton.hidden = editing;
      editButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg> Chỉnh sửa hồ sơ`;
    };

    const renderProfile = (focusKey) => {
      const profile = getProfile();

      if (!editingProfile) {
        fields.innerHTML = fieldDefinitions.map(field => `<div class="c-profile-field${field.wide ? ' c-profile-field--wide' : ''}">
          <div><span>${field.label}</span><strong>${escapeHTML(profile[field.key] || 'Chưa cập nhật')}</strong></div>
          <button class="c-icon-btn" type="button" data-edit-field="${field.key}" title="Chỉnh sửa ${field.label}" aria-label="Chỉnh sửa ${field.label}">${ICONS.pencil}</button>
        </div>`).join('');
        setEditButton(false);
        return;
      }

      fields.innerHTML = `<form id="profileForm" class="c-profile-edit" novalidate>
        ${fieldDefinitions.map(field => `<label class="c-field${field.wide ? ' c-field--wide' : ''}">
          <span>${field.label}</span>
          <input type="${field.type}" name="${field.key}" value="${escapeHTML(profile[field.key] || '')}" autocomplete="${field.autocomplete}"${field.key === 'name' || field.key === 'email' ? ' required' : ''}>
        </label>`).join('')}
        <div class="c-form-actions">
          <button class="c-btn c-btn--ghost" type="button" data-cancel-profile>Hủy</button>
          <button class="c-btn c-btn--primary" type="submit">Lưu thay đổi</button>
        </div>
      </form>`;

      setEditButton(true);
      window.requestAnimationFrame(() => {
        const target = focusKey
          ? fields.querySelector(`[name="${focusKey}"]`)
          : fields.querySelector('input');
        if (target) target.focus({ preventScroll: true });
      });
    };

    const enterEditMode = focusKey => {
      editingProfile = true;
      renderProfile(focusKey);
    };

    if (editButton) {
      editButton.addEventListener('click', () => enterEditMode());
    }

    fields.addEventListener('click', event => {
      const editFieldButton = event.target.closest('[data-edit-field]');
      if (editFieldButton) {
        enterEditMode(editFieldButton.dataset.editField);
        return;
      }
      if (event.target.closest('[data-cancel-profile]')) {
        editingProfile = false;
        renderProfile();
      }
    });

    fields.addEventListener('submit', event => {
      if (!event.target.matches('#profileForm')) return;
      event.preventDefault();

      const submitBtn = event.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Đang lưu...</span>`;
      }

      toast('Đã cập nhật hồ sơ cá nhân.');

      // Fake: Sau khi ấn lưu, tự động reload lại hiển thị thông tin gốc không bị sửa
      setTimeout(() => {
        try {
          localStorage.removeItem(PROFILE_KEY);
          sessionStorage.removeItem(PROFILE_KEY);
        } catch (e) {}
        window.location.reload();
      }, 600);
    });

    const renderAddresses = () => {
      if (!addressList) return;
      const addresses = getAddresses();

      const cards = addresses.map(address => `<article class="c-saved-address${address.isDefault ? ' is-default' : ''}">
        <div class="c-saved-address-head">
          <div class="c-saved-address-person">
            <strong>${escapeHTML(address.name)}</strong>
            <span class="c-dot">·</span>
            <span>${escapeHTML(address.phone)}</span>
            ${address.isDefault ? '<span class="c-badge">Mặc định</span>' : ''}
            <span class="c-badge c-badge--soft">${escapeHTML(address.type || 'Nhà riêng')}</span>
          </div>
          <div class="c-addr-actions">
            <button class="c-icon-btn" type="button" data-edit-address="${address.id}" title="Chỉnh sửa địa chỉ" aria-label="Chỉnh sửa địa chỉ">${ICONS.pencil}</button>
            <button class="c-icon-btn c-icon-btn--danger" type="button" data-delete-address="${address.id}" title="Xóa địa chỉ" aria-label="Xóa địa chỉ">${ICONS.trash}</button>
          </div>
        </div>
        <p>${escapeHTML(fullAddress(address))}</p>
        ${address.isDefault
          ? `<span class="c-addr-default-text">${ICONS.check} Địa chỉ mặc định</span>`
          : `<button class="c-set-default" type="button" data-default-address="${address.id}">Đặt làm mặc định</button>`}
      </article>`).join('');

      addressList.innerHTML = `${cards}
        <div class="c-address-dashed">
          <span class="c-icon-circle">${ICONS.pin}</span>
          <p>Bạn có thể lưu thêm địa chỉ nhận hàng để thanh toán nhanh hơn trong những lần sau.</p>
          <button type="button" data-add-address>${ICONS.plus} Thêm địa chỉ</button>
        </div>`;
    };

    const fillSelect = (node, value) => {
      if (!node) return;
      const options = Array.from(node.options).map(option => option.value);
      node.value = options.includes(value) ? value : (options[1] || '');
    };

    const openModal = id => {
      if (!modal || !addressForm) return;
      addressForm.reset();
      const title = document.getElementById('addressModalTitle');
      const idField = document.getElementById('addressId');
      const nameField = document.getElementById('addrName');
      const phoneField = document.getElementById('addrPhone');
      const profile = getProfile();
      const existing = id ? getAddresses().find(address => address.id === id) : null;

      if (existing) {
        if (title) title.textContent = 'Chỉnh sửa địa chỉ';
        if (idField) idField.value = existing.id;
        if (nameField) nameField.value = existing.name;
        if (phoneField) phoneField.value = existing.phone;
        fillSelect(document.getElementById('addrProvince'), existing.province);
        fillSelect(document.getElementById('addrDistrict'), existing.district);
        fillSelect(document.getElementById('addrWard'), existing.ward);
        const street = document.getElementById('addrStreet');
        if (street) street.value = existing.street;
        const type = document.getElementById('addrType');
        if (type) type.value = existing.type || 'Nhà riêng';
        const defaultField = document.getElementById('addrDefault');
        if (defaultField) defaultField.checked = Boolean(existing.isDefault);
      } else {
        if (title) title.textContent = 'Thêm địa chỉ mới';
        if (idField) idField.value = '';
        if (nameField) nameField.value = profile.name;
        if (phoneField) phoneField.value = profile.phone;
        const defaultField = document.getElementById('addrDefault');
        if (defaultField) defaultField.checked = getAddresses().length === 0;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('c-modal-open');
      window.setTimeout(() => {
        if (nameField) nameField.focus();
      }, 30);
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('c-modal-open');
    };

    addAddressButtons.forEach(button => {
      if (button) button.addEventListener('click', () => openModal());
    });

    if (addressList) {
      addressList.addEventListener('click', event => {
        const edit = event.target.closest('[data-edit-address]');
        if (edit) {
          openModal(edit.dataset.editAddress);
          return;
        }

        const remove = event.target.closest('[data-delete-address]');
        if (remove) {
          if (!window.confirm('Bạn chắc chắn muốn xóa địa chỉ này?')) return;
          toast('Đã xóa địa chỉ nhận hàng.');
          setTimeout(() => {
            try {
              localStorage.removeItem(ADDRESS_KEY);
              sessionStorage.removeItem(ADDRESS_KEY);
            } catch (e) {}
            window.location.reload();
          }, 600);
          return;
        }

        const makeDefault = event.target.closest('[data-default-address]');
        if (makeDefault) {
          toast('Đã cập nhật địa chỉ mặc định.');
          setTimeout(() => {
            try {
              localStorage.removeItem(ADDRESS_KEY);
              sessionStorage.removeItem(ADDRESS_KEY);
            } catch (e) {}
            window.location.reload();
          }, 600);
          return;
        }

        if (event.target.closest('[data-add-address]')) openModal();
      });
    }

    if (modal) {
      modal.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', closeModal);
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
      });
    }

    if (addressForm) {
      addressForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!addressForm.reportValidity()) return;

        const idField = document.getElementById('addressId');
        const id = idField ? idField.value : '';
        const submitBtn = addressForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Đang lưu...</span>`;
        }

        closeModal();
        toast(id ? 'Đã cập nhật địa chỉ nhận hàng.' : 'Đã thêm địa chỉ nhận hàng mới.');

        // Fake: Sau khi thêm/sửa, reload lại hiển thị danh sách địa chỉ gốc không bị sửa
        setTimeout(() => {
          try {
            localStorage.removeItem(ADDRESS_KEY);
            sessionStorage.removeItem(ADDRESS_KEY);
          } catch (e) {}
          window.location.reload();
        }, 600);
      });
    }

    document.querySelectorAll('[data-feature]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        toast(`${link.dataset.feature} sẽ sớm được cập nhật.`);
      });
    });

    renderProfile();
    renderAddresses();
  };

  document.addEventListener('DOMContentLoaded', () => {
    syncProfileLabels();
    initCartPage();
    initCheckoutPage();
    initSuccessPage();
    initProfilePage();
  });
})();
