/**
 * VIBRANT ACADEMIC MINIMAL - FULL SPA ENGINE
 */
document.addEventListener('DOMContentLoaded', () => {
  const products = window.StoreCatalog.products;
  const featuredProducts = products.filter(product => product.featured);

  let wishlist = [1, 4];

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

  // Giữ lại màn hình đang xem trong URL để reload không bị quay về trang chủ.
  const updateViewUrl = (viewId) => {
    const url = new URL(window.location.href);
    url.hash = viewId;
    if (viewId === 'view-home') url.search = '';
    try {
      window.history.replaceState(null, '', url);
    } catch (error) {
      window.location.hash = viewId;
    }
  };

  // 2. CHUYỂN ĐỔI MÀN HÌNH (SPA NAVIGATION)
  window.navigateToView = (viewId, param = null) => {
    const targetView = document.getElementById(viewId);
    if (!targetView) return;

    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeNavTarget = viewId === 'view-home' ? 'view-home' : 'view-category';
    document.querySelectorAll('.main-nav .nav-link[data-target]').forEach(link => {
      const isActive = link.dataset.target === activeNavTarget;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
        link.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (viewId === 'view-detail' && param) {
      renderProductDetail(param);
    } else if (viewId === 'view-category') {
      window.filterCategoryProducts({ syncUrl: false, silent: true });
    }

    updateViewUrl(viewId);
  };

  // 3. TÌM KIẾM CƠ BẢN ĐÃ VÔ HIỆU HÓA: chỉ đóng gợi ý, không lọc gì cả.
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', () => {
      if (liveSearchDropdown) liveSearchDropdown.classList.remove('open');
    });
  }

  const getCategoryCheckboxes = () => Array.from(document.querySelectorAll('.filter-categories input[type="checkbox"]'));

  // Dropdown sắp xếp tùy chỉnh: giao diện giống bộ lọc tìm kiếm nâng cao,
  // mở/đóng có animation và vẫn đồng bộ với <select> ẩn để tái sử dụng logic lọc.
  const initCategorySortDropdown = () => {
    const control = document.getElementById('categorySort');
    const nativeSelect = document.getElementById('categorySortSelect');
    const trigger = document.getElementById('categorySortTrigger');
    const valueNode = document.getElementById('categorySortValue');
    const menu = document.getElementById('categorySortMenu');
    if (!control || !nativeSelect || !trigger || !valueNode || !menu) return;

    const options = Array.from(menu.querySelectorAll('.sort-dropdown-option'));
    if (!options.length) return;

    const selectedOption = () => options.find(option => option.dataset.value === nativeSelect.value) || options[0];

    const paint = value => {
      const active = options.find(option => option.dataset.value === value) || options[0];
      nativeSelect.value = active.dataset.value;
      valueNode.textContent = active.textContent.trim();
      options.forEach(option => {
        const isSelected = option === active;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
      });
    };

    const open = (focusTarget = selectedOption()) => {
      control.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      window.requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
    };

    const close = (returnFocus = false) => {
      control.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus({ preventScroll: true });
    };

    const choose = (option, { emit = true, returnFocus = true } = {}) => {
      paint(option.dataset.value);
      close(returnFocus);
      if (emit) nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    };

    trigger.addEventListener('click', () => {
      if (control.classList.contains('is-open')) close();
      else open();
    });

    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      } else if (event.key === 'Escape') {
        close();
      }
    });

    options.forEach((option, index) => {
      option.addEventListener('click', () => choose(option));
      option.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choose(option);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          close(true);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          options[(index + delta + options.length) % options.length].focus();
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          options[event.key === 'Home' ? 0 : options.length - 1].focus();
        } else if (event.key === 'Tab') {
          close();
        }
      });
    });

    document.addEventListener('click', event => {
      if (!control.contains(event.target)) close();
    });

    document.addEventListener('focusin', event => {
      if (!control.contains(event.target)) close();
    });

    // Cho phép các luồng khôi phục bộ lọc / đặt lại cập nhật giao diện dropdown.
    window.setCategorySortValue = (value, { emit = false } = {}) => {
      paint(value);
      if (emit) nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    };

    paint(nativeSelect.value || 'default');
  };

  const parsePriceNumber = val => {
    if (val == null || val === '') return NaN;
    const clean = String(val).replace(/\./g, '').trim();
    if (!clean) return NaN;
    const num = Number(clean);
    return Number.isFinite(num) ? num : NaN;
  };

  const formatPrice = val => {
    if (val == null || val === '') return '';
    let digits = String(val).replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length > 1 && digits.startsWith('0')) {
      digits = digits.replace(/^0+/, '') || '0';
    }
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const updateCategoryUrl = ({ categories, min, max, sort, sale, hot }) => {
    const url = new URL(window.location.href);
    url.hash = 'view-category';
    ['categories', 'category', 'min', 'max', 'sort', 'sale', 'hot', 'q', 'cat', 'search']
      .forEach(key => url.searchParams.delete(key));

    if (categories.length) url.searchParams.set('categories', categories.join(','));
    if (min > 0) url.searchParams.set('min', String(min));
    if (Number.isFinite(max)) url.searchParams.set('max', String(max));
    if (sort !== 'default') url.searchParams.set('sort', sort);
    if (sale) url.searchParams.set('sale', '1');
    if (hot) url.searchParams.set('hot', '1');

    try {
      window.history.replaceState(null, '', url);
    } catch (error) {
      window.location.hash = 'view-category';
    }
  };

  // Lọc sản phẩm trên lưới HTML tĩnh (sản phẩm đã viết sẵn trong trang,
  // phân trang là các file khác nhau nên JS không render lại danh sách).
  // YÊU CẦU: danh mục / khoảng giá / ưu đãi chỉ để showcasing.
  // Luôn hiển thị toàn bộ sản phẩm đã được viết tĩnh trong trang này,
  // nửa còn lại nằm ở file Trang 2 (không có lọc thực sự).
  const revealCategoryResults = () => {
    const grid = document.getElementById('categoryProductsGrid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.store-product-card'));

    const total = (window.StoreCatalog && window.StoreCatalog.products) ? window.StoreCatalog.products.length : cards.length;

    // Sắp xếp chỉ để minh họa giống "Tìm kiếm nâng cao": đổi lựa chọn sẽ hiện
    // loading giả rồi giữ nguyên thứ tự sản phẩm, không sắp xếp thật.
    cards.forEach(card => {
      card.classList.remove('is-hidden');
      card.style.display = '';
    });

    const isPageTwo = document.body.dataset.catalogPage === '2';
    const resultTitle = document.getElementById('categoryResultTitle');
    const resultCount = document.getElementById('categoryResultCount');
    const categoryHint = document.getElementById('filterCategoryHint');
    const summary = document.getElementById('filterSummary');
    const emptyState = document.getElementById('categoryEmptyState');

    if (resultTitle) {
      resultTitle.textContent = 'Tất cả sản phẩm';
    }
    if (resultCount) {
      resultCount.textContent = `Hiển thị ${cards.length} / ${total} sản phẩm (Trang ${isPageTwo ? '2' : '1'}/2)`;
    }
    if (emptyState) { emptyState.hidden = true; emptyState.style.display = 'none'; }
    if (categoryHint) {
      categoryHint.textContent = 'Tất cả';
    }
    if (summary) {
      summary.textContent = 'Danh sách được chia đều: một nửa ở Trang 1, một nửa ở Trang 2.';
    }
  };

  window.filterCategoryProducts = (options = {}) => {
    const shouldSyncUrl = !options || options.syncUrl !== false;
    const grid = document.getElementById('categoryProductsGrid');
    if (!grid) return;

    const silent = Boolean(options && options.silent === true);
    if (!silent) {
      // Người dùng bấm "Áp dụng" / "Xóa": hiện loading giả rồi bật lại toàn bộ danh sách.
      const resultCount = document.getElementById('categoryResultCount');
      if (resultCount) resultCount.textContent = 'Đang tải sản phẩm...';
      window.showFakeLoading(grid, revealCategoryResults);
    } else {
      revealCategoryResults();
    }

    if (shouldSyncUrl) {
      updateCategoryUrl({
        categories: [],
        min: 0,
        max: Infinity,
        sort: document.getElementById('categorySortSelect')?.value || 'default',
        sale: false,
        hot: false
      });
    }
  };

  window.resetHomeFilters = () => {
    getCategoryCheckboxes().forEach(checkbox => { checkbox.checked = false; });
    document.querySelectorAll('.filter-offers input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    const minInput = document.getElementById('filterMinPrice');
    const maxInput = document.getElementById('filterMaxPrice');
    const sortSelect = document.getElementById('categorySortSelect');
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';
    if (sortSelect) {
      sortSelect.value = 'default';
      if (window.setCategorySortValue) window.setCategorySortValue('default');
    }
    window.filterCategoryProducts();
  };
  // 4. BỘ LỌC TÌM KIẾM NÂNG CAO & CATEGORY
  const updateAdvancedUrl = ({ keyword, category, minPrice, maxPrice }) => {
    const url = new URL(window.location.href);
    url.hash = 'view-advanced-search';
    ['categories', 'category', 'min', 'max', 'sort', 'sale', 'hot', 'q', 'cat', 'search']
      .forEach(key => url.searchParams.delete(key));

    if (keyword) url.searchParams.set('q', keyword);
    if (category !== 'all') url.searchParams.set('cat', category);
    if (minPrice > 0) url.searchParams.set('min', String(minPrice));
    if (Number.isFinite(maxPrice)) url.searchParams.set('max', String(maxPrice));

    try {
      window.history.replaceState(null, '', url);
    } catch (error) {
      window.location.hash = 'view-advanced-search';
    }
  };

  // YÊU CẦU: tìm kiếm nâng cao chỉ để showcasing — KHÔNG lọc thật.
  // Kết quả luôn là toàn bộ sản phẩm viết tĩnh trong trang (nửa còn lại ở Trang 2).
  const revealAdvResults = () => {
    const grid = document.getElementById('advResultGrid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.store-product-card'));

    // Bất kể từ khóa / danh mục / khoảng giá nhập gì, luôn hiện toàn bộ danh sách.
    cards.forEach(card => {
      card.classList.remove('is-hidden');
      card.style.display = '';
    });

    const total = (window.StoreCatalog && window.StoreCatalog.products) ? window.StoreCatalog.products.length : cards.length;
    const isPageTwo = document.body.dataset.catalogPage === '2';
    const resultCount = document.getElementById('advResultCount');
    const emptyState = document.getElementById('advEmptyState');
    if (resultCount) {
      resultCount.textContent = `Hiển thị ${cards.length} / ${total} sản phẩm (Trang ${isPageTwo ? '2' : '1'}/2)`;
    }
    if (emptyState) { emptyState.hidden = true; emptyState.style.display = 'none'; }
  };

  window.applyAdvancedSearch = (options = {}) => {
    const grid = document.getElementById('advResultGrid');
    if (!grid) return;
    const silent = Boolean(options && (options.silent === true || options.navigate === false));

    // Người dùng bấm "Tìm kiếm" / "Áp dụng": hiện hiệu ứng loading giả
    // rồi mới bật toàn bộ kết quả (việc lọc bị vô hiệu hóa).
    if (!silent) {
      navigateToView('view-advanced-search');
      const resultCount = document.getElementById('advResultCount');
      if (resultCount) resultCount.textContent = 'Đang tải sản phẩm...';
      window.showFakeLoading(grid, revealAdvResults);
      return;
    }
    revealAdvResults();
  };

  window.resetAdvancedSearch = () => {
    const keyword = document.getElementById('advKeyword');
    const category = document.getElementById('advCategory');
    const minPrice = document.getElementById('advMinPrice');
    const maxPrice = document.getElementById('advMaxPrice');
    if (keyword) keyword.value = '';
    if (category) category.value = 'all';
    if (minPrice) minPrice.value = '0';
    if (maxPrice) maxPrice.value = '5.000.000';
    window.applyAdvancedSearch();
  };

  window.applyPricePreset = (min, max) => {
    const minInput = document.getElementById('advMinPrice');
    const maxInput = document.getElementById('advMaxPrice');
    if (minInput) minInput.value = formatPrice(min);
    if (maxInput) maxInput.value = formatPrice(max);
    window.applyAdvancedSearch();
  };

  // Tìm kiếm từ thanh header: đưa từ khóa vào bộ lọc nâng cao và hiển thị kết quả.
  window.headerSearch = () => {
    const term = headerSearchInput ? headerSearchInput.value.trim() : '';
    const advancedKeyword = document.getElementById('advKeyword');
    const advancedCategory = document.getElementById('advCategory');
    if (advancedKeyword) advancedKeyword.value = term;
    if (advancedCategory) advancedCategory.value = 'all';
    window.applyAdvancedSearch();
    if (liveSearchDropdown) liveSearchDropdown.classList.remove('open');
  };

  document.addEventListener('click', event => {
    if (liveSearchDropdown && !event.target.closest('.header-search')) {
      liveSearchDropdown.classList.remove('open');
    }
  });

  // 5. RENDER DETAIL PAGE
  const renderProductDetail = (productId) => {
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('detailContainer');
    if (!product || !container) return;

    container.innerHTML = `
      <div class="detail-layout">
        <div>
          <div class="detail-main-img"><img src="${product.image}" alt="${product.title}"></div>
          <div class="detail-thumbs">
            <img src="${product.image}">
            <img src="${product.image}">
          </div>
        </div>
        <div>
          <span class="tag-label" style="margin-bottom:8px;">${product.brand || window.StoreCatalog.categories[product.category] || 'Sản phẩm'}</span>
          <h1 style="font-size:1.5rem; font-weight:800; margin-bottom:12px;">${product.title}</h1>
          <div style="font-size:1.5rem; font-weight:800; color:#8A3500; margin-bottom:12px;">${formatMoney(product.price)}</div>
          <p style="font-size:0.9rem; color:#4a4542; margin-bottom:20px;">${product.description}</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" style="flex:1;" onclick="addToCart(${product.id})">Thêm Vào Giỏ Hàng</button>
            <button class="btn btn-outlined" onclick="navigateToView('view-category')">Quay Lại</button>
          </div>
        </div>
      </div>
    `;
  };

  // 6. GIỎ HÀNG & MODAL XEM NHANH
  const updateBadges = () => window.StoreCart.updateBadges();

  window.addToCart = () => {
    // Giỏ hàng CỐ ĐỊNH: cart.js chặn thêm mới và tự hiện toast thông báo.
    window.StoreCart.add();
    renderCartDrawer();
  };

  const CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
  const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>';

  const renderCartDrawer = () => {
    const body = document.getElementById('cartDrawerBody');
    const totalEl = document.getElementById('cartDrawerTotal');
    const countEl = document.getElementById('cartDrawerCount');
    if (!body) return;

    const cart = window.StoreCart.get();
    let total = 0;
    let totalQuantity = 0;

    if (!cart.length) {
      body.innerHTML = `
        <div class="cart-drawer-empty">
          <span class="cart-drawer-empty-icon" aria-hidden="true">${CART_ICON}</span>
          <strong>Giỏ hàng đang trống</strong>
          <p>${(window.StoreCart.isLoggedIn && !window.StoreCart.isLoggedIn()) ? 'Bạn chưa đăng nhập. Vui lòng đăng nhập để bắt đầu chọn mua sản phẩm.' : 'Thêm vài dụng cụ học tập xinh xắn để bắt đầu đơn hàng của bạn nhé.'}</p>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px;">
            ${(window.StoreCart.isLoggedIn && !window.StoreCart.isLoggedIn()) ? '<a class="btn btn-primary" href="../auth/login.html">Đăng nhập ngay</a>' : ''}
            <a class="btn ${(window.StoreCart.isLoggedIn && !window.StoreCart.isLoggedIn()) ? 'btn-outlined' : 'btn-primary'}" href="../homepage/main.html#view-category" onclick="closeCartDrawer()">Mua sắm ngay</a>
          </div>
        </div>
      `;
    } else {
      body.innerHTML = cart.map(item => {
        const p = products.find(prod => prod.id === item.id);
        if (!p) return '';
        const lineTotal = p.price * item.quantity;
        total += lineTotal;
        totalQuantity += item.quantity;
        return `
          <div class="cart-drawer-item" data-cart-item="${p.id}">
            <img class="cart-drawer-thumb" src="${p.image}" alt="${p.title}" loading="lazy">
            <div class="cart-drawer-info">
              <a class="cart-drawer-name" href="../products/product-${String(p.code).toLowerCase()}.html">${p.title}</a>
              <div class="cart-drawer-unit">${formatMoney(p.price)} / sản phẩm</div>
              <div class="cart-drawer-controls">
                <div class="cart-drawer-qty" role="group" aria-label="Số lượng ${p.title}">
                  <button type="button" data-cart-dec aria-label="Giảm số lượng" disabled>−</button>
                  <span>${item.quantity}</span>
                  <button type="button" data-cart-inc aria-label="Tăng số lượng" disabled>+</button>
                </div>
                <strong class="cart-drawer-line-total">${formatMoney(lineTotal)}</strong>
              </div>
            </div>
            <div class="cart-drawer-side">
              <button class="cart-drawer-remove" type="button" data-cart-remove aria-label="Xóa ${p.title} khỏi giỏ hàng" title="Giỏ hàng cố định" disabled>${TRASH_ICON}</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (totalEl) totalEl.textContent = formatMoney(total);
    if (countEl) countEl.textContent = String(totalQuantity);
  };

  const cartDrawerBody = document.getElementById('cartDrawerBody');
  cartDrawerBody?.addEventListener('click', event => {
    const row = event.target.closest('[data-cart-item]');
    if (!row) return;

    const id = Number(row.dataset.cartItem);
    const current = window.StoreCart.get().find(item => Number(item.id) === id);
    if (!current) return;

    if (event.target.closest('[data-cart-inc]')) {
      window.StoreCart.setQuantity(id, Math.min(99, current.quantity + 1));
      renderCartDrawer();
      return;
    }

    if (event.target.closest('[data-cart-dec]')) {
      if (current.quantity <= 1) {
        window.StoreCart.remove(id);
      } else {
        window.StoreCart.setQuantity(id, current.quantity - 1);
      }
      renderCartDrawer();
      return;
    }

    if (event.target.closest('[data-cart-remove]')) {
      window.StoreCart.remove(id);
      renderCartDrawer();
    }
  });

  window.openCartDrawer = () => {
    renderCartDrawer();
    document.getElementById('cartDrawerOverlay')?.classList.add('open');
    document.body.classList.add('cart-drawer-open');
  };
  window.closeCartDrawer = () => {
    document.getElementById('cartDrawerOverlay')?.classList.remove('open');
    document.body.classList.remove('cart-drawer-open');
  };

  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  cartDrawerOverlay?.addEventListener('click', event => {
    if (event.target === cartDrawerOverlay) window.closeCartDrawer();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && cartDrawerOverlay?.classList.contains('open')) {
      window.closeCartDrawer();
    }
  });

  window.showToast = (msg) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };

  const renderProductList = (containerId, list) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!list.length) {
      el.innerHTML = `
        <div class="empty-products">
          <span>⌕</span>
          <strong>Không tìm thấy sản phẩm</strong>
          <p>Thử thay đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.</p>
        </div>
      `;
      return;
    }
    el.innerHTML = list.map(p => `
      <article class="store-product-card">
        <a class="store-product-image-link" href="../products/product-${String(p.code).toLowerCase()}.html">
          <div class="store-product-visual">
            <span class="store-product-tag">${window.StoreCatalog.categories[p.category]}</span>
            ${p.hot ? '<span class="store-product-tag store-product-hot">Hot</span>' : ''}
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </div>
        </a>
        <div class="store-product-code">Mã: ${p.code}</div>
        <a class="store-product-name" href="../products/product-${String(p.code).toLowerCase()}.html">${p.title}</a>
        <div class="store-product-meta">
          <strong class="store-product-price">${formatMoney(p.price)}</strong>
          ${p.oldPrice
            ? `<span class="store-product-old-price">${formatMoney(p.oldPrice)}</span>`
            : `<span class="store-product-stock">Kho: ${p.stock}</span>`}
        </div>
        <button class="store-product-cart" type="button" onclick="addToCart(${p.id})">🛒 Thêm vào giỏ</button>
      </article>
    `).join('');
  };

  // Khởi tạo số lượng cho bộ lọc và nội dung các màn hình.
  document.querySelectorAll('[data-category-count]').forEach(node => {
    node.textContent = String(products.filter(product => product.category === node.dataset.categoryCount).length);
  });
  document.querySelectorAll('[data-offer-count]').forEach(node => {
    const count = node.dataset.offerCount === 'sale'
      ? products.filter(product => product.oldPrice).length
      : products.filter(product => product.hot).length;
    node.textContent = String(count);
  });

  initCategorySortDropdown();
  renderProductList('homeProductsGrid', featuredProducts);
  window.filterCategoryProducts({ syncUrl: false, silent: true });
  window.applyAdvancedSearch({ syncUrl: false, navigate: false, silent: true });
  updateBadges();

  // Khôi phục màn hình hiện tại sau khi reload.
  const pageParams = new URLSearchParams(window.location.search);
  const hashView = window.location.hash.replace(/^#/, '');
  const searchParam = pageParams.get('q') ?? pageParams.get('search');
  const categoryParam = pageParams.get('categories') ?? pageParams.get('category');

  const restoreCategoryFilters = () => {
    const categories = (categoryParam || '').split(',').map(item => item.trim()).filter(Boolean);
    getCategoryCheckboxes().forEach(checkbox => {
      checkbox.checked = categories.includes(checkbox.dataset.category);
    });

    const minInput = document.getElementById('filterMinPrice');
    const maxInput = document.getElementById('filterMaxPrice');
    const sortSelect = document.getElementById('categorySortSelect');
    const saleInput = document.querySelector('.filter-offers input[data-filter="sale"]');
    const hotInput = document.querySelector('.filter-offers input[data-filter="hot"]');
    if (minInput) minInput.value = formatPrice(pageParams.get('min') || '');
    if (maxInput) maxInput.value = formatPrice(pageParams.get('max') || '');
    if (sortSelect) {
      sortSelect.value = pageParams.get('sort') || 'default';
      if (window.setCategorySortValue) window.setCategorySortValue(sortSelect.value);
    }
    if (saleInput) saleInput.checked = pageParams.get('sale') === '1';
    if (hotInput) hotInput.checked = pageParams.get('hot') === '1';
  };

  const restoreAdvancedSearch = () => {
    const keyword = document.getElementById('advKeyword');
    const category = document.getElementById('advCategory');
    const minPrice = document.getElementById('advMinPrice');
    const maxPrice = document.getElementById('advMaxPrice');
    if (keyword) keyword.value = searchParam || '';
    if (category) category.value = pageParams.get('cat') || 'all';
    if (minPrice) minPrice.value = formatPrice(pageParams.get('min') || '0');
    if (maxPrice) maxPrice.value = formatPrice(pageParams.get('max') || '5000000');
    window.applyAdvancedSearch({ syncUrl: false });
  };

  ['advMinPrice', 'advMaxPrice', 'filterMinPrice', 'filterMaxPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el && window.attachPriceFormatter) window.attachPriceFormatter(el);
  });

  if (searchParam !== null || hashView === 'view-advanced-search') {
    restoreAdvancedSearch();
  } else if (categoryParam || hashView === 'view-category') {
    restoreCategoryFilters();
    window.navigateToView('view-category');
  } else if (hashView === 'view-home') {
    window.navigateToView('view-home');
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === 'view-advanced-search') {
      window.navigateToView('view-advanced-search');
      window.applyAdvancedSearch({ silent: true, navigate: false });
    } else if (hash === 'view-category') {
      window.navigateToView('view-category');
    } else if (hash === 'view-home') {
      window.navigateToView('view-home');
    }
  });
});