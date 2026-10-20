/**
 * VIBRANT ACADEMIC MINIMAL - FULL SPA ENGINE
 */
document.addEventListener('DOMContentLoaded', () => {
  const products = window.StoreCatalog.products;
  const featuredProducts = products.filter(product => product.featured);

  let cart = [{ id: 1, quantity: 1 }, { id: 3, quantity: 2 }];
  let wishlist = [1, 4];

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

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
      renderCategoryProducts();
    }
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

  // Lọc sản phẩm theo checkbox danh mục bên trái (chỉ hiện khi được tick)
  window.filterCategoryProducts = () => {
    const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
    const selectedCategories = [];
    
    // Ánh xạ tên hiển thị tiếng Việt sang mã category trong mảng products
    const categoryMap = {
      "Bút Viết": "pens",
      "Sổ Vở": "notebooks",
      "Balo & Cặp": "backpacks",
      "Hộp Bút": "cases",
      "Mỹ Thuật": "art",
      "Dụng cụ học tập": "school-supplies"
    };

    checkboxes.forEach(cb => {
      if (cb.checked) {
        const labelText = cb.parentElement.textContent.trim().split(' (')[0];
        if (categoryMap[labelText]) {
          selectedCategories.push(categoryMap[labelText]);
        }
      }
    });

    // Nếu không tick ô nào thì trả về mảng rỗng (không hiện sản phẩm nào)
    const filtered = products.filter(p => {
      if (selectedCategories.length === 0) return false;
      return selectedCategories.includes(p.category);
    });

    renderProductList('categoryProductsGrid', filtered);
  };

  window.showHomeCategory = category => {
    const categoryLabels = {
      pens: "Bút Viết",
      notebooks: "Sổ Vở",
      backpacks: "Balo & Cặp",
      cases: "Hộp Bút",
      "school-supplies": "Dụng cụ học tập",
      art: "Mỹ Thuật"
    };
    const selectedLabel = categoryLabels[category];
    if (!selectedLabel) return;

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(checkbox => {
      const label = checkbox.parentElement.textContent.trim().split(' (')[0];
      checkbox.checked = label === selectedLabel;
    });
    navigateToView('view-category');
    window.filterCategoryProducts();
  };
  // 4. BỘ LỌC TÌM KIẾM NÂNG CAO & CATEGORY
  window.applyAdvancedSearch = () => {
    const keyword = document.getElementById('advKeyword')?.value.toLowerCase().trim() || '';
    const category = document.getElementById('advCategory')?.value || 'all';
    const minPrice = parseInt(document.getElementById('advMinPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('advMaxPrice')?.value) || 1000000;

    const filtered = products.filter(p => {
      const matchKey = !keyword || p.title.toLowerCase().includes(keyword);
      const matchCat = category === 'all' || p.category === category;
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchKey && matchCat && matchPrice;
    });

    renderProductList('advResultGrid', filtered);
    navigateToView('view-advanced-search');
  };

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
          <span class="tag-label" style="margin-bottom:8px;">${product.brand}</span>
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
  const updateBadges = () => {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(b => b.textContent = count);
  };

  window.addToCart = (id) => {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, quantity: 1 });
    updateBadges();
    renderCartDrawer();
    showToast("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const renderCartDrawer = () => {
    const body = document.getElementById('cartDrawerBody');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!body) return;

    let total = 0;
    body.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      if (!p) return '';
      total += p.price * item.quantity;
      return `
        <div style="display:flex; gap:10px; margin-bottom:12px; align-items:center;">
          <img src="${p.image}" style="width:50px; height:50px; border-radius:6px; object-fit:cover;">
          <div style="flex:1;">
            <div style="font-size:0.8rem; font-weight:600;">${p.title}</div>
            <div style="font-size:0.8rem; color:#8A3500; font-weight:700;">${formatMoney(p.price)} x ${item.quantity}</div>
          </div>
        </div>
      `;
    }).join('');
    if (totalEl) totalEl.textContent = formatMoney(total);
  };

  window.openCartDrawer = () => {
    renderCartDrawer();
    document.getElementById('cartDrawerOverlay')?.classList.add('open');
  };
  window.closeCartDrawer = () => {
    document.getElementById('cartDrawerOverlay')?.classList.remove('open');
  };

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

  const renderCategoryProducts = () => renderProductList('categoryProductsGrid', products);

  // Khởi tạo trang chủ và danh mục
  renderProductList('homeProductsGrid', featuredProducts);
  renderCategoryProducts();
  updateBadges();

  // Lắng nghe sự kiện thay đổi cho toàn bộ checkbox bộ lọc bên trái
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', filterCategoryProducts);
  });

  const pageParams = new URLSearchParams(window.location.search);
  const categoryParam = pageParams.get('category');
  const searchParam = pageParams.get('search');

  if (searchParam) {
    document.getElementById('advKeyword').value = searchParam;
    window.applyAdvancedSearch();
  } else if (categoryParam) {
    window.showHomeCategory(categoryParam);
  } else if (['#view-category', '#view-advanced-search'].includes(window.location.hash)) {
    window.navigateToView(window.location.hash.slice(1));
  }
});