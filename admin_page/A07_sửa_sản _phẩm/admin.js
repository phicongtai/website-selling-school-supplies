/**
 * ============================================================================
 * TRANG QUẢN TRỊ A07: SỬA SẢN PHẨM (EDIT PRODUCT CONTROLLER)
 * Học Đường Store - Quản lý Danh mục & Kho hàng
 * Thiết kế chuẩn Figma: Frame 1:7230 (1280 x 1498)
 * Tái sử dụng bộ lưu trữ & Đồng bộ dữ liệu liền mạch với A05 & A06
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DỮ LIỆU GỐC DỰ PHÒNG (ĐỒNG BỘ VỚI A05 & A06)
  const DEFAULT_PRODUCTS = [
    {
      code: 'SP01',
      name: 'Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm',
      category: 'Bút viết',
      price: 65000,
      status: 'active',
      sold: 342,
      stock: 450,
      ordersCount: 42,
      image: '../../assets/img/product-1.jpg',
      iconType: 'pen',
      sku: 'HD-PEN-001',
      description: 'Set 10 bút gel màu Morandi cao cấp ngòi 0.5mm êm mượt, mực nhanh khô chống lem, thiết kế thân nhám cầm êm tay.',
      brand: 'Morandi Stationery',
      unit: 'Hộp / Set',
      grades: ['Tiểu học', 'THCS', 'THPT', 'Đại học']
    },
    {
      code: 'SP02',
      name: 'Bút Máy Pilot Kakuno Ngòi F Nhật Bản',
      category: 'Bút viết',
      price: 195000,
      status: 'active',
      sold: 156,
      stock: 120,
      ordersCount: 28,
      image: '../../assets/img/product-2.jpg',
      iconType: 'pen',
      sku: 'HD-PEN-002',
      description: 'Bút máy chính hãng Pilot Kakuno ngòi thép không gỉ cỡ F, thân bút công thái học hỗ trợ định hình tay cầm bút chuẩn.',
      brand: 'Pilot Pen Japan',
      unit: 'Cây / Chiếc',
      grades: ['Tiểu học', 'THCS']
    },
    {
      code: 'SP03',
      name: 'Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro',
      category: 'Sổ & vở',
      price: 89000,
      status: 'active',
      sold: 240,
      stock: 200,
      ordersCount: 35,
      image: '../../assets/img/product-3.jpg',
      iconType: 'book',
      sku: 'HD-BOOK-003',
      description: 'Sổ còng sắt 6 lỗ bìa da mềm cao cấp kích thước A5, đi kèm 80 tờ ruột ô vuông Caro 100gsm chống thấm.',
      brand: 'Klong',
      unit: 'Quyển / Tập',
      grades: ['THCS', 'THPT', 'Đại học']
    },
    {
      code: 'SP04',
      name: 'Vở Kẻ Ngang B5 Klong 120 Trang Giấy Dày Chống Lem',
      category: 'Sổ & vở',
      price: 28000,
      status: 'active',
      sold: 480,
      stock: 350,
      ordersCount: 62,
      image: '../../assets/img/product-3.jpg',
      iconType: 'book',
      sku: 'HD-BOOK-004',
      description: 'Vở B5 kẻ ngang 120 trang giấy định lượng 100gsm không lem khi viết bút máy hay bút dạ highlight.',
      brand: 'Klong',
      unit: 'Quyển / Tập',
      grades: ['Tiểu học', 'THCS', 'THPT']
    },
    {
      code: 'SP05',
      name: 'Balo Chống Gù Lưng Học Sinh Công Thái Học',
      category: 'Cặp & balo',
      price: 389000,
      status: 'active',
      sold: 65,
      stock: 45,
      ordersCount: 19,
      image: '../../assets/img/product-4.jpg',
      iconType: 'backpack',
      sku: 'HD-BAG-005',
      description: 'Balo chống gù lưng công thái học cho học sinh, đệm lưng lưới tổ ong thoáng khí trợ lực cột sống, vải polyester trượt nước.',
      brand: 'Học Đường Ergonomics',
      unit: 'Cái',
      grades: ['Tiểu học', 'THCS']
    },
    {
      code: 'SP06',
      name: 'Balo Đi Học Canvas Hàn Quốc Trơn Unisex',
      category: 'Cặp & balo',
      price: 215000,
      status: 'active',
      sold: 98,
      stock: 80,
      ordersCount: 24,
      image: '../../assets/img/product-5.jpg',
      iconType: 'backpack',
      sku: 'HD-BAG-006',
      description: 'Balo canvas Hàn Quốc phong cách tối giản, ngăn chống sốc laptop 15.6 inch, quai đeo êm ái chống mỏi.',
      brand: 'Korean Style',
      unit: 'Cái',
      grades: ['THPT', 'Đại học']
    },
    {
      code: 'SP07',
      name: 'Hộp Bút Vải Canvas Mở Rộng 3 Tầng Ngăn Lớn',
      category: 'Hộp bút',
      price: 58000,
      status: 'active',
      sold: 175,
      stock: 110,
      ordersCount: 31,
      image: '../../assets/img/product-6.jpg',
      iconType: 'palette',
      sku: 'HD-CASE-007',
      description: 'Hộp bút vải canvas dung lượng lớn 3 ngăn khóa kéo riêng biệt, chứa được hơn 50 bút viết và máy tính cầm tay.',
      brand: 'Deli',
      unit: 'Cái',
      grades: ['Tiểu học', 'THCS', 'THPT', 'Đại học']
    },
    {
      code: 'SP08',
      name: 'Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha Hộp Thiếc',
      category: 'Dụng cụ mỹ thuật',
      price: 175000,
      status: 'active',
      sold: 0,
      stock: 60,
      ordersCount: 0,
      image: '../../assets/img/product-7.jpg',
      iconType: 'palette',
      sku: 'HD-ART-008',
      description: 'Hộp màu nước bánh nén 36 màu tươi sáng, độ bão hòa cao, kèm cọ vẽ ngậm nước chuyên nghiệp và khay pha màu hộp thiếc cao cấp.',
      brand: 'Deli Art',
      unit: 'Bộ',
      grades: ['Tiểu học', 'THCS', 'THPT', 'Đại học']
    }
  ];

  const STORAGE_KEY = 'hocduong_admin_products_session_v2';

  // Kiểm tra nếu trang được Reload (F5 / Refresh) - Khôi phục về dữ liệu gốc cố định
  function isPageReload() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      if (window.performance && window.performance.navigation) {
        return window.performance.navigation.type === 1;
      }
    } catch (e) {
      console.warn(e);
    }
    return false;
  }

  if (isPageReload()) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  }

  // Lấy danh sách sản phẩm hiện hành từ sessionStorage
  function getProductList() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Lỗi đọc session products, khôi phục mặc định:', e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  }

  const productList = getProductList();

  // 2. TRÍCH XUẤT THAM SỐ TRUY VẤN MÃ SẢN PHẨM ?code=...
  const urlParams = new URLSearchParams(window.location.search);
  const targetCode = urlParams.get('code') || 'SP01';

  // Tìm sản phẩm cần chỉnh sửa
  let product = productList.find(p => p.code.toUpperCase() === targetCode.toUpperCase());
  if (!product) {
    product = productList[0] || DEFAULT_PRODUCTS[0];
  }

  // 3. THAM CHIẾU CÁC PHẦN TỬ FORM & GIAO DIỆN
  const form = document.getElementById('product-form');
  const breadcrumbCode = document.getElementById('breadcrumb-current-code');
  const headingProductName = document.getElementById('heading-product-name');
  const badgeCode = document.getElementById('product-badge-code');
  const badgeStatus = document.getElementById('product-badge-status');
  const badgeStatusText = document.getElementById('badge-status-text');

  // Input Fields
  const productNameInput = document.getElementById('product-name');
  const categorySelect = document.getElementById('category');
  const stockInput = document.getElementById('stock');
  const priceInput = document.getElementById('price');
  const pricePreviewText = document.getElementById('price-preview-text');
  const skuInput = document.getElementById('sku');
  const descriptionInput = document.getElementById('description');
  const brandInput = document.getElementById('brand');
  const unitSelect = document.getElementById('unit');

  // Metrics Card Elements (A07)
  const metricHeadingTitle = document.getElementById('metric-heading-title');
  const metricSoldOrders = document.getElementById('metric-sold-orders');
  const metricRevenueVal = document.getElementById('metric-revenue-val');
  const metricReviewsCount = document.getElementById('metric-reviews-count');

  // Side Column Elements
  const imagePreview = document.getElementById('image-preview');
  const fileNameDisplay = document.getElementById('file-name');
  const imageUploadInput = document.getElementById('image-upload');
  const sampleThumbs = document.querySelectorAll('.sample-thumb');
  const storefrontToggle = document.getElementById('storefront-visible');
  const sellingStatusBox = document.getElementById('selling-status-box');
  const statusHeadline = document.getElementById('status-text-headline');
  const statusSub = document.getElementById('status-text-sub');

  // Toast
  const adminToast = document.getElementById('admin-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const closeToastBtn = document.getElementById('close-toast-btn');
  let toastTimer = null;

  // 4. TIỆN ÍCH ĐỊNH DẠNG
  function formatVnd(val) {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  }

  // Cập nhật ngày tháng trên Topbar
  const currentDateEl = document.getElementById('current-date-text');
  if (currentDateEl) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    currentDateEl.textContent = `Hôm nay, ${day}/${month}/${year}`;
  }

  // Hiển thị thông báo Toast
  function showToast(title, desc, duration = 3000) {
    if (!adminToast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    adminToast.setAttribute('aria-hidden', 'false');
    adminToast.classList.add('is-visible');

    toastTimer = setTimeout(() => {
      adminToast.classList.remove('is-visible');
      adminToast.setAttribute('aria-hidden', 'true');
    }, duration);
  }

  if (closeToastBtn) {
    closeToastBtn.addEventListener('click', () => {
      if (adminToast) {
        adminToast.classList.remove('is-visible');
        adminToast.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 5. ĐIỀN DỮ LIỆU SẢN PHẨM HIỆN TẠI VÀO BIỂU MẪU (PRE-FILL)
  document.title = `Sửa sản phẩm ${product.code} - Học Đường Store Admin`;
  if (breadcrumbCode) breadcrumbCode.textContent = `Sửa sản phẩm ${product.code}`;
  if (headingProductName) headingProductName.textContent = product.name;
  if (badgeCode) badgeCode.textContent = `Mã: ${product.code}`;

  const isActive = product.status === 'active';
  if (badgeStatus && badgeStatusText) {
    if (isActive) {
      badgeStatus.className = 'badge-status badge-active';
      badgeStatusText.textContent = 'Đang bán';
    } else {
      badgeStatus.className = 'badge-status badge-hidden';
      badgeStatusText.textContent = 'Tạm ẩn';
    }
  }

  // Điền thông tin cơ bản
  productNameInput.value = product.name || '';
  if (categorySelect) {
    categorySelect.value = product.category || 'Bút viết';
  }
  stockInput.value = product.stock !== undefined ? product.stock : 100;
  priceInput.value = product.price || 0;
  if (pricePreviewText) {
    pricePreviewText.textContent = `Giá niêm yết: ${formatVnd(product.price || 0)}`;
    pricePreviewText.style.color = 'var(--color-primary, #FF6900)';
  }
  skuInput.value = product.sku || `HD-${product.code}`;
  if (descriptionInput) {
    descriptionInput.value = product.description || `Sản phẩm ${product.name} chính hãng chất lượng cao, an toàn cho học sinh.`;
  }
  if (brandInput) {
    brandInput.value = product.brand || 'Học Đường';
  }
  if (unitSelect) {
    unitSelect.value = product.unit || 'Cây / Chiếc';
  }

  // Điền cấp học
  if (Array.isArray(product.grades) && product.grades.length > 0) {
    document.querySelectorAll('input[name="grades"]').forEach(cb => {
      cb.checked = product.grades.includes(cb.value);
    });
  }

  // Cập nhật thẻ chỉ số 30 ngày (A07 Metrics)
  const soldQty = product.sold !== undefined ? product.sold : 0;
  const productPrice = product.price || 0;
  const revenue = soldQty * productPrice;
  const ordersCount = product.ordersCount !== undefined ? product.ordersCount : Math.round(soldQty / 4) + 5;

  if (metricHeadingTitle) metricHeadingTitle.textContent = `Chỉ số giao dịch của ${product.code}`;
  if (metricSoldOrders) metricSoldOrders.textContent = `${soldQty} đơn`;
  if (metricRevenueVal) metricRevenueVal.textContent = formatVnd(revenue);
  if (metricReviewsCount) metricReviewsCount.textContent = `${ordersCount} lượt phản hồi`;

  // Cập nhật khung hình ảnh
  let currentImageUrl = product.image || '../../assets/img/product-1.jpg';
  if (imagePreview) {
    imagePreview.src = currentImageUrl;
  }
  if (fileNameDisplay) {
    fileNameDisplay.textContent = currentImageUrl.split('/').pop() || 'product-image.jpg';
  }

  // Highlight thumbnail mẫu khớp với ảnh hiện tại
  sampleThumbs.forEach(thumb => {
    if (thumb.dataset.img === currentImageUrl) {
      thumb.classList.add('active');
    } else {
      thumb.classList.remove('active');
    }
  });

  // Cập nhật công tắc Storefront
  if (storefrontToggle && sellingStatusBox) {
    storefrontToggle.checked = isActive;
    if (isActive) {
      statusHeadline.textContent = 'Đang bán';
      statusSub.textContent = 'Sẵn sàng tiếp nhận đơn đặt hàng từ khách';
      sellingStatusBox.classList.remove('hidden-status');
    } else {
      statusHeadline.textContent = 'Tạm ẩn';
      statusSub.textContent = 'Không xuất hiện trên storefront, giữ nguyên dữ liệu';
      sellingStatusBox.classList.add('hidden-status');
    }

    storefrontToggle.addEventListener('change', () => {
      if (storefrontToggle.checked) {
        statusHeadline.textContent = 'Đang bán';
        statusSub.textContent = 'Sẵn sàng tiếp nhận đơn đặt hàng từ khách';
        sellingStatusBox.classList.remove('hidden-status');
        if (badgeStatus && badgeStatusText) {
          badgeStatus.className = 'badge-status badge-active';
          badgeStatusText.textContent = 'Đang bán';
        }
      } else {
        statusHeadline.textContent = 'Tạm ẩn';
        statusSub.textContent = 'Không xuất hiện trên storefront, giữ nguyên dữ liệu';
        sellingStatusBox.classList.add('hidden-status');
        if (badgeStatus && badgeStatusText) {
          badgeStatus.className = 'badge-status badge-hidden';
          badgeStatusText.textContent = 'Tạm ẩn';
        }
      }
    });
  }

  // 6. XỬ LÝ SỰ KIỆN GIÁ BÁN THỜI GIAN THỰC
  if (priceInput && pricePreviewText) {
    priceInput.addEventListener('input', () => {
      const val = parseInt(priceInput.value, 10);
      if (!isNaN(val) && val > 0) {
        pricePreviewText.textContent = `Giá niêm yết: ${formatVnd(val)}`;
        pricePreviewText.style.color = 'var(--color-primary, #FF6900)';
        // Đồng thời cập nhật doanh thu dự kiến trong thẻ metrics
        if (metricRevenueVal) metricRevenueVal.textContent = formatVnd(soldQty * val);
      } else {
        pricePreviewText.textContent = 'Giá niêm yết: 0₫';
        pricePreviewText.style.color = '#6b7280';
      }
    });
  }

  // 7. CHỌN ẢNH TỪ BỘ MẪU SẴN
  sampleThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      sampleThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const imgPath = thumb.dataset.img;
      if (imgPath && imagePreview) {
        imagePreview.src = imgPath;
        currentImageUrl = imgPath;
        const baseName = imgPath.split('/').pop();
        if (fileNameDisplay) fileNameDisplay.textContent = baseName;
      }
    });
  });

  // 8. TẢI TỆP ẢNH TỪ MÁY
  if (imageUploadInput) {
    imageUploadInput.addEventListener('change', () => {
      const file = imageUploadInput.files?.[0];
      if (!file) return;

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Vui lòng chọn hình ảnh định dạng JPG, PNG hoặc WebP.');
        imageUploadInput.value = '';
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      currentImageUrl = objectUrl;

      if (imagePreview) {
        imagePreview.src = objectUrl;
      }

      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }

      sampleThumbs.forEach(t => t.classList.remove('active'));
    });
  }

  // 9. LƯU THAY ĐỔI & ĐỒNG BỘ VỀ A05
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      const name = productNameInput.value.trim();
      const category = categorySelect.value;
      const stock = parseInt(stockInput.value, 10);
      const price = parseInt(priceInput.value, 10);
      const sku = skuInput.value.trim() || `HD-${product.code}`;
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      const brand = brandInput ? brandInput.value.trim() : 'Học Đường';
      const unit = unitSelect ? unitSelect.value : 'Cây / Chiếc';

      const gradeCheckboxes = document.querySelectorAll('input[name="grades"]:checked');
      const selectedGrades = Array.from(gradeCheckboxes).map(cb => cb.value);

      const isStorefrontVisible = storefrontToggle ? storefrontToggle.checked : true;
      const status = isStorefrontVisible ? 'active' : 'hidden';

      // Xác định iconType tương ứng theo danh mục
      let iconType = 'pen';
      if (category.includes('Sổ') || category.includes('vở')) {
        iconType = 'book';
      } else if (category.includes('Cặp') || category.includes('balo')) {
        iconType = 'backpack';
      } else if (category.includes('Hộp') || category.includes('mỹ thuật')) {
        iconType = 'palette';
      }

      // Cập nhật sản phẩm trực tiếp vào productList
      product.name = name;
      product.category = category;
      product.stock = stock;
      product.price = price;
      product.sku = sku;
      product.description = description;
      product.brand = brand;
      product.unit = unit;
      product.grades = selectedGrades;
      product.status = status;
      product.image = currentImageUrl;
      product.iconType = iconType;

      // Lưu lại vào sessionStorage để A05 tự động hiển thị dữ liệu đã sửa
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(productList));
        sessionStorage.setItem('hocduong_admin_toast', JSON.stringify({
          title: 'Cập nhật thành công',
          desc: `Đã cập nhật thông tin sản phẩm [${product.code}] ${name} thành công.`
        }));
      } catch (err) {
        console.error('Không thể lưu thay đổi vào sessionStorage:', err);
      }

      // Trở về ngay trang danh sách A05
      window.location.href = '../A05 Quản lý sản phẩm/index.html';
    });
  }

});
