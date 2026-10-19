/**
 * VIBRANT ACADEMIC MINIMAL - FULL SPA ENGINE
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. DỮ LIỆU SẢN PHẨM MẪU
  const products = [
    { id: 1, title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm", price: 65000, oldPrice: 85000, category: "pens", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80", description: "Bút gel màu Morandi thanh lịch, ngòi 0.5mm êm ái, mau khô không lem giấy." },
    { id: 2, title: "Bút Máy Pilot Kakuno Ngòi F Nhật Bản", price: 195000, oldPrice: 230000, category: "pens", image: "https://down-vn.img.susercontent.com/file/e1d32d504e8bb3568ca14d404f30e82a", description: "Bút máy học sinh Nhật Bản ngòi thép định hình tay cầm chuẩn." },
    { id: 3, title: "Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro", price: 89000, oldPrice: 120000, category: "notebooks", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80", description: "Sổ còng 6 lỗ tháo lắp dễ dàng, giấy 100gsm chống thấm mực." },
    { id: 4, title: "Balo Chống Gù Lưng Học Sinh Công Thái Học", price: 360000, oldPrice: 480000, category: "backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", description: "Đệm lưng thoáng khí chống gù, vải Oxford trượt nước." },
    { id: 5, title: "Hộp Bút Vải Canvas Mở Rộng 3 Tầng Ngăn Lớn", price: 68000, oldPrice: 85000, category: "cases", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lr75wcf0547tad", description: "Sức chứa hơn 40 cây bút cùng thước kẻ và máy tính bỏ túi." },
    { id: 6, title: "Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha", price: 185000, oldPrice: 240000, category: "art", image: "https://tse2.mm.bing.net/th/id/OIP.VTjDllEC4wzo8Tdum9wjBAHaHa?r=0&pid=Api&h=220&P=0", description: "Bột màu nén cao cấp hạt siêu mịn trong hộp thiếc cao cấp." },
    { id: 7, title: "Bàn học công thái học", price: 385000, oldPrice: 640000, category: "cases", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLeUM0p5TFnMOzgySTkFZ9i9kKTb8cR5cBnO3AaLFTSw&s=10", description: "Bàn học giúp bé điểu chỉnh tư thế sao cho phụ hợp." }
  ];

  let cart = [{ id: 1, quantity: 1 }, { id: 3, quantity: 2 }];
  let wishlist = [1, 4];

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

  // 2. CHUYỂN ĐỔI MÀN HÌNH (SPA NAVIGATION)
  window.navigateToView = (viewId, param = null) => {
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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

      const matches = products.filter(p => p.title.toLowerCase().includes(term)).slice(0, 4);
      if (matches.length > 0) {
        liveSearchDropdown.innerHTML = matches.map(p => `
          <div class="live-search-item" onclick="navigateToView('view-detail', ${p.id}); liveSearchDropdown.classList.remove('open');">
            <img src="${p.image}" alt="${p.title}">
            <div>
              <div style="font-size:0.8rem; font-weight:600;">${p.title}</div>
              <div style="font-size:0.75rem; color:#8A3500; font-weight:700;">${formatMoney(p.price)}</div>
            </div>
          </div>
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
      "Mỹ Thuật": "art",
      "Bàn Học": "cases"
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
      <article class="product-card">
        <div class="product-thumb">
          <img src="${p.image}" alt="${p.title}">
          <div class="product-badges"><span class="badge badge-sale">-20%</span></div>
          <button class="product-quickview-btn" onclick="navigateToView('view-detail', ${p.id})">Xem Chi Tiết</button>
        </div>
        <div class="product-body">
          <h3 class="product-title" onclick="navigateToView('view-detail', ${p.id})">${p.title}</h3>
          <div class="product-footer">
            <span class="product-price-current">${formatMoney(p.price)}</span>
            <button class="btn btn-primary" style="padding:6px 10px;" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      </article>
    `).join('');
  };

  const renderCategoryProducts = () => renderProductList('categoryProductsGrid', products);

  // Khởi tạo trang chủ và danh mục
  renderProductList('homeProductsGrid', products);
  renderCategoryProducts();
  updateBadges();

  // Lắng nghe sự kiện thay đổi cho toàn bộ checkbox bộ lọc bên trái
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', filterCategoryProducts);
  });
});