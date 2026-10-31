/**
 * ============================================================================
 * TRANG QUẢN TRỊ A06: THÊM SẢN PHẨM MỚI (ADD PRODUCT CONTROLLER)
 * Học Đường Store - Quản lý Danh mục & Kho hàng
 * Thiết kế chuẩn Figma: Frame 1:8370 (1280 x 1365.50)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DỮ LIỆU GỐC DỰ PHÒNG (ĐỒNG BỘ VỚI A05)
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
      iconType: 'pen'
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
      iconType: 'pen'
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
      iconType: 'book'
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
      iconType: 'book'
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
      iconType: 'backpack'
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
      iconType: 'backpack'
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
      iconType: 'palette'
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
      iconType: 'palette'
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

  // 2. TÍNH TOÁN MÃ SẢN PHẨM MỚI (TỰ ĐỘNG TĂNG)
  let maxCodeNum = 8;
  productList.forEach(p => {
    const num = parseInt(String(p.code).replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxCodeNum) {
      maxCodeNum = num;
    }
  });

  const nextCodeNum = maxCodeNum + 1;
  const proposedCode = 'SP' + String(nextCodeNum).padStart(2, '0');

  // Cập nhật huy hiệu mã sản phẩm
  const previewBadgeCode = document.getElementById('preview-badge-code');
  if (previewBadgeCode) {
    previewBadgeCode.textContent = `Mã dự kiến: ${proposedCode}`;
  }

  // 3. THAM CHIẾU CÁC PHẦN TỬ FORM & GIAO DIỆN
  const form = document.getElementById('create-product-form');
  const productNameInput = document.getElementById('product-name');
  const categorySelect = document.getElementById('category');
  const stockInput = document.getElementById('stock');
  const priceInput = document.getElementById('price');
  const pricePreviewText = document.getElementById('price-preview-text');
  const discountInput = document.getElementById('discount');
  const discountPreviewText = document.getElementById('discount-preview-text');
  const finalPriceInput = document.getElementById('final-price');
  const finalPricePreviewText = document.getElementById('final-price-preview-text');
  const skuInput = document.getElementById('sku');
  const descriptionInput = document.getElementById('description');
  const brandInput = document.getElementById('brand');
  const unitSelect = document.getElementById('unit');

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

  // 4. TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ
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

  // 5. GỢI Ý MÃ SKU TỰ ĐỘNG THEO DANH MỤC
  function updateSkuRecommendation() {
    const cat = categorySelect.value || '';
    let prefix = 'GEN';
    if (cat.includes('Bút')) prefix = 'PEN';
    else if (cat.includes('Sổ') || cat.includes('vở')) prefix = 'BOOK';
    else if (cat.includes('balo') || cat.includes('Cặp')) prefix = 'BAG';
    else if (cat.includes('Hộp bút')) prefix = 'CASE';
    else if (cat.includes('mỹ thuật')) prefix = 'ART';
    else if (cat.includes('thiết bị') || cat.includes('Máy tính')) prefix = 'TECH';

    skuInput.value = `HD-${prefix}-${String(nextCodeNum).padStart(3, '0')}`;
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', updateSkuRecommendation);
  }

  // 6. XEM TRƯỚC GIÁ BÁN VÀ % GIẢM GIÁ THỜI GIAN THỰC
  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function updatePricingCalculation() {
    const rawPrice = parseInt((priceInput ? priceInput.value : '0').replace(/\./g, ''), 10) || 0;
    let discountPct = parseInt(discountInput ? discountInput.value : '0', 10);
    if (isNaN(discountPct) || discountPct < 0) discountPct = 0;
    if (discountPct > 99) discountPct = 99;
    if (discountInput && discountInput.value !== '' && discountInput.value != discountPct) {
      discountInput.value = discountPct;
    }

    const discountAmount = Math.round((rawPrice * discountPct) / 100);
    const finalPrice = Math.max(0, rawPrice - discountAmount);

    if (pricePreviewText) {
      if (rawPrice > 0) {
        pricePreviewText.textContent = `Giá gốc niêm yết: ${formatVnd(rawPrice)}`;
        pricePreviewText.style.color = 'var(--color-primary, #FF6900)';
      } else {
        pricePreviewText.textContent = 'Giá niêm yết: 0₫';
        pricePreviewText.style.color = '#6b7280';
      }
    }

    if (discountPreviewText) {
      if (discountPct > 0) {
        discountPreviewText.textContent = `Tiết kiệm: ${formatVnd(discountAmount)} (-${discountPct}%)`;
        discountPreviewText.style.color = '#ea580c';
      } else {
        discountPreviewText.textContent = 'Không áp dụng giảm giá (0%)';
        discountPreviewText.style.color = '#9ca3af';
      }
    }

    if (finalPriceInput) {
      finalPriceInput.value = formatNumber(finalPrice);
    }

    if (finalPricePreviewText) {
      if (discountPct > 0) {
        finalPricePreviewText.textContent = `Giá ưu đãi Storefront: ${formatVnd(finalPrice)}`;
        finalPricePreviewText.style.color = '#15803d';
      } else {
        finalPricePreviewText.textContent = 'Giá bán ưu đãi hiển thị đến khách hàng';
        finalPricePreviewText.style.color = '#6b7280';
      }
    }
  }

  if (priceInput) {
    priceInput.addEventListener('input', () => {
      let raw = priceInput.value.replace(/\D/g, '');
      if (raw) {
        priceInput.value = formatNumber(parseInt(raw, 10));
      } else {
        priceInput.value = '';
      }
      updatePricingCalculation();
    });
  }

  if (discountInput) {
    discountInput.addEventListener('input', () => {
      updatePricingCalculation();
    });
  }
  updatePricingCalculation();

  // 7. XỬ LÝ CHỌN ẢNH TỪ BỘ MẪU SẴN (HOMEPAGE ASSETS)
  let selectedImageUrl = '../../assets/img/product-1.jpg';

  sampleThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      sampleThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const imgPath = thumb.dataset.img;
      if (imgPath && imagePreview) {
        imagePreview.src = imgPath;
        selectedImageUrl = imgPath;
        const baseName = imgPath.split('/').pop();
        if (fileNameDisplay) fileNameDisplay.textContent = baseName;
      }
    });
  });

  // 8. TẢI TỆP ẢNH TỪ MÁY TÍNH
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
      selectedImageUrl = objectUrl;

      if (imagePreview) {
        imagePreview.src = objectUrl;
      }

      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }

      // Bỏ active ở các thumbnail mẫu
      sampleThumbs.forEach(t => t.classList.remove('active'));
    });
  }

  // 9. THAY ĐỔI TRẠNG THÁI STOREFRONT (TOGGLE BẬT/TẮT)
  if (storefrontToggle && sellingStatusBox) {
    storefrontToggle.addEventListener('change', () => {
      if (storefrontToggle.checked) {
        statusHeadline.textContent = 'Đang bán';
        statusSub.textContent = 'Sẵn sàng tiếp nhận đơn đặt hàng từ khách';
        sellingStatusBox.classList.remove('hidden-status');
      } else {
        statusHeadline.textContent = 'Tạm ẩn';
        statusSub.textContent = 'Không xuất hiện trên storefront, giữ nguyên dữ liệu';
        sellingStatusBox.classList.add('hidden-status');
      }
    });
  }

  // 10. XỬ LÝ LƯU SẢN PHẨM (SUBMIT FORM)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Kiểm tra tính hợp lệ của biểu mẫu
      if (!form.reportValidity()) return;

      const name = productNameInput.value.trim();
      const category = categorySelect.value;
      const stock = parseInt(stockInput.value, 10);
      const price = parseInt(priceInput.value.replace(/\./g, ''), 10);
      const sku = skuInput.value.trim() || `HD-SP${nextCodeNum}`;
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      const brand = brandInput ? brandInput.value.trim() : 'Học Đường';
      const unit = unitSelect ? unitSelect.value : 'Cây / Chiếc';

      // Lấy danh sách cấp học được chọn
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

      // Khởi tạo đối tượng sản phẩm mới
      const newProduct = {
        code: proposedCode,
        name: name,
        category: category,
        price: price,
        status: status,
        sold: 0,
        stock: stock,
        ordersCount: 0,
        image: selectedImageUrl,
        iconType: iconType,
        sku: sku,
        description: description,
        brand: brand,
        unit: unit,
        grades: selectedGrades
      };

      // Mô phỏng giao diện: Khi ấn Thêm sản phẩm, không thêm dữ liệu thực tế vào bảng
      // Bảng danh sách sản phẩm bên ngoài giữ nguyên vẹn các sản phẩm gốc
      window.location.href = '../A05 Quản lý sản phẩm/index.html';
    });
  }

});

