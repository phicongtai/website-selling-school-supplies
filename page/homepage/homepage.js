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
      window.filterCategoryProducts();
    }

    updateViewUrl(viewId);
  };

  // 3. RENDER LIVE SEARCH (TÌM KIẾM CƠ BẢN)
  const headerSearchInput = document.getElementById('headerSearchInput');
  const liveSearchDropdown = document.getElementById('liveSearchDropdown');

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) {
        liveSearchDropdown.classList.remove('open');
        return;
      }

      const matches = products.filter(p =>
        `${p.code} ${p.title}`.toLowerCase().includes(term)
      ).slice(0, 4);
      if (matches.length > 0) {
        liveSearchDropdown.innerHTML = matches.map(p => `
          <a class="live-search-item" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">
            <img src="${p.image}" alt="${p.title}">
            <div>
              <div style="font-size:0.8rem; font-weight:600;">${p.title}</div>
              <div style="font-size:0.75rem; color:#8A3500; font-weight:700;">${formatMoney(p.price)}</div>
            </div>
          </a>
        `).join('');
        liveSearchDropdown.classList.add('open');
      } else {
        liveSearchDropdown.innerHTML = `<div style="padding:8px; font-size:0.8rem; color:#757575;">Không tìm thấy sản phẩm</div>`;
        liveSearchDropdown.classList.add('open');
      }
    });
  }

  const getCategoryCheckboxes = () => Array.from(document.querySelectorAll('.filter-categories input[type="checkbox"]'));

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

  // Lọc sản phẩm theo danh mục, khoảng giá và ưu đãi.
  window.filterCategoryProducts = (options = {}) => {
    const shouldSyncUrl = !options || options.syncUrl !== false;
    const selectedCategories = getCategoryCheckboxes()
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.dataset.category);

    const minInput = document.getElementById('filterMinPrice');
    const maxInput = document.getElementById('filterMaxPrice');
    const min = Math.max(0, Number(minInput?.value) || 0);
    const rawMax = Number(maxInput?.value);
    const max = Number.isFinite(rawMax) && rawMax > 0 ? Math.max(rawMax, min) : Infinity;
    const sortValue = document.getElementById('categorySortSelect')?.value || 'default';
    const saleOnly = Boolean(document.querySelector('.filter-offers input[data-filter="sale"]')?.checked);
    const hotOnly = Boolean(document.querySelector('.filter-offers input[data-filter="hot"]')?.checked);

    let filtered = products.filter(product => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchPrice = product.price >= min && product.price <= max;
      const matchSale = !saleOnly || Boolean(product.oldPrice);
      const matchHot = !hotOnly || Boolean(product.hot);
      return matchCategory && matchPrice && matchSale && matchHot;
    });

    if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortValue === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title, 'vi'));

    renderProductList('categoryProductsGrid', filtered);

    const categoryNames = selectedCategories.map(category => window.StoreCatalog.categories[category]);
    const resultTitle = document.getElementById('categoryResultTitle');
    const resultCount = document.getElementById('categoryResultCount');
    const categoryHint = document.getElementById('filterCategoryHint');
    const summary = document.getElementById('filterSummary');

    if (resultTitle) {
      resultTitle.textContent = categoryNames.length === 1
        ? categoryNames[0]
        : (categoryNames.length > 1 ? 'Sản phẩm đã chọn' : 'Tất cả sản phẩm');
    }
    if (resultCount) {
      resultCount.textContent = filtered.length
        ? `Hiển thị ${filtered.length} sản phẩm`
        : 'Không tìm thấy sản phẩm phù hợp';
    }
    if (categoryHint) {
      categoryHint.textContent = selectedCategories.length ? `${selectedCategories.length} nhóm` : 'Tất cả';
    }
    if (summary) {
      const filters = [];
      if (categoryNames.length) filters.push(categoryNames.join(', '));
      if (min > 0 || Number.isFinite(max)) {
        filters.push(`${formatMoney(min)} – ${Number.isFinite(max) ? formatMoney(max) : 'không giới hạn'}`);
      }
      if (saleOnly) filters.push('Đang giảm giá');
      if (hotOnly) filters.push('Nổi bật');
      summary.textContent = filters.length
        ? `Đang lọc: ${filters.join(' · ')}.`
        : 'Đang hiển thị tất cả sản phẩm.';
    }

    if (shouldSyncUrl) {
      updateCategoryUrl({
        categories: selectedCategories,
        min,
        max,
        sort: sortValue,
        sale: saleOnly,
        hot: hotOnly
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
    if (sortSelect) sortSelect.value = 'default';
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

  window.applyAdvancedSearch = (options = {}) => {
    const shouldSyncUrl = !options || options.syncUrl !== false;
    const keyword = document.getElementById('advKeyword')?.value.toLowerCase().trim() || '';
    const category = document.getElementById('advCategory')?.value || 'all';
    const minPrice = Math.max(0, parseInt(document.getElementById('advMinPrice')?.value, 10) || 0);
    const parsedMaxPrice = parseInt(document.getElementById('advMaxPrice')?.value, 10);
    const maxPrice = Number.isFinite(parsedMaxPrice) && parsedMaxPrice > 0
      ? Math.max(parsedMaxPrice, minPrice)
      : Infinity;

    const filtered = products.filter(p => {
      const matchKey = !keyword || `${p.code} ${p.title}`.toLowerCase().includes(keyword);
      const matchCat = category === 'all' || p.category === category;
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchKey && matchCat && matchPrice;
    });

    renderProductList('advResultGrid', filtered);
    const resultCount = document.getElementById('advResultCount');
    if (resultCount) {
      resultCount.textContent = filtered.length
        ? `Tìm thấy ${filtered.length} sản phẩm phù hợp`
        : 'Không tìm thấy sản phẩm phù hợp với bộ lọc.';
    }

    if (!options || options.navigate !== false) navigateToView('view-advanced-search');
    if (shouldSyncUrl) updateAdvancedUrl({ keyword, category, minPrice, maxPrice });
  };

  window.resetAdvancedSearch = () => {
    const keyword = document.getElementById('advKeyword');
    const category = document.getElementById('advCategory');
    const minPrice = document.getElementById('advMinPrice');
    const maxPrice = document.getElementById('advMaxPrice');
    if (keyword) keyword.value = '';
    if (category) category.value = 'all';
    if (minPrice) minPrice.value = '0';
    if (maxPrice) maxPrice.value = '5000000';
    window.applyAdvancedSearch();
  };

  window.applyPricePreset = (min, max) => {
    const minInput = document.getElementById('advMinPrice');
    const maxInput = document.getElementById('advMaxPrice');
    if (minInput) minInput.value = String(min);
    if (maxInput) maxInput.value = String(max);
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

  window.addToCart = (id, quantity = 1) => {
    window.StoreCart.add(id, quantity);
    renderCartDrawer();
    showToast("Đã thêm sản phẩm vào giỏ hàng!");
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
          <p>Thêm vài dụng cụ học tập xinh xắn để bắt đầu đơn hàng của bạn nhé.</p>
          <a class="btn btn-primary" href="../homepage/main.html#view-category" onclick="closeCartDrawer()">Mua sắm ngay</a>
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
              <a class="cart-drawer-name" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">${p.title}</a>
              <div class="cart-drawer-unit">${formatMoney(p.price)} / sản phẩm</div>
              <div class="cart-drawer-controls">
                <div class="cart-drawer-qty" role="group" aria-label="Số lượng ${p.title}">
                  <button type="button" data-cart-dec aria-label="${item.quantity > 1 ? 'Giảm số lượng' : 'Xóa sản phẩm'}">−</button>
                  <span>${item.quantity}</span>
                  <button type="button" data-cart-inc aria-label="Tăng số lượng" ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                </div>
                <strong class="cart-drawer-line-total">${formatMoney(lineTotal)}</strong>
              </div>
            </div>
            <div class="cart-drawer-side">
              <button class="cart-drawer-remove" type="button" data-cart-remove aria-label="Xóa ${p.title} khỏi giỏ hàng" title="Xóa sản phẩm">${TRASH_ICON}</button>
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
        <a class="store-product-image-link" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">
          <div class="store-product-visual">
            <span class="store-product-tag">${window.StoreCatalog.categories[p.category]}</span>
            ${p.hot ? '<span class="store-product-tag store-product-hot">Hot</span>' : ''}
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </div>
        </a>
        <div class="store-product-code">Mã: ${p.code}</div>
        <a class="store-product-name" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">${p.title}</a>
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

  renderProductList('homeProductsGrid', featuredProducts);
  window.filterCategoryProducts({ syncUrl: false });
  window.applyAdvancedSearch({ syncUrl: false, navigate: false });
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
    if (minInput) minInput.value = pageParams.get('min') || '';
    if (maxInput) maxInput.value = pageParams.get('max') || '';
    if (sortSelect) sortSelect.value = pageParams.get('sort') || 'default';
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
    if (minPrice) minPrice.value = pageParams.get('min') || '0';
    if (maxPrice) maxPrice.value = pageParams.get('max') || '5000000';
    window.applyAdvancedSearch({ syncUrl: false });
  };

  if (searchParam !== null || hashView === 'view-advanced-search') {
    restoreAdvancedSearch();
  } else if (categoryParam || hashView === 'view-category') {
    restoreCategoryFilters();
    window.navigateToView('view-category');
  } else if (hashView === 'view-home') {
    window.navigateToView('view-home');
  }
});