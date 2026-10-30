/**
 * ============================================================================
 * TRANG QUẢN TRỊ A05: QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT)
 * Hệ thống Quản trị Nội bộ - Học Đường Store
 * Dữ liệu đồng bộ trực tiếp từ Homepage (page/homepage/homepage.js & assets/img/)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. NGUỒN DỮ LIỆU SẢN PHẨM GỐC MẪU LẤY TỪ HOMEPAGE (Đúng vừa đủ 1 trang - 8 sản phẩm tiêu biểu)
  // Hằng số JS bất biến, không bị sửa đổi
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
      sold: 0, // Đã bán 0 -> Kích hoạt modal xác nhận xóa vĩnh viễn (A08)
      stock: 60,
      ordersCount: 0,
      image: '../../assets/img/product-7.jpg',
      iconType: 'palette'
    }
  ];

  // 2. KHỞI TẠO BỘ DỮ LIỆU PHIÊN LÀM VIỆC (SESSION MEMORY)
  // Quy tắc chuẩn: Khi F5 reload lại trang, tự động hồi phục về DEFAULT_PRODUCTS gốc
  function isPageReload() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      return performance.navigation.type === 1;
    } catch (e) {
      return false;
    }
  }

  const STORAGE_KEY = 'hocduong_admin_products_session_v2';
  if (isPageReload()) {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  let products = [];
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      products = JSON.parse(stored);
    } catch (e) {
      products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    }
  } else {
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  }

  function saveSessionProducts() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('SessionStorage save failed', e);
    }
  }

  // 3. THAM CHIẾU CÁC PHẦN TỬ GIAO DIỆN DOM
  const tableBody = document.getElementById('products-tbody');
  const searchInput = document.getElementById('product-search-input');
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnExportExcel = document.getElementById('btn-export-excel');
  const totalProductsText = document.getElementById('total-products-text');
  const paginationInfoText = document.getElementById('pagination-info-text');

  // Thẻ thống kê
  const statTotalVal = document.getElementById('stat-total-val');
  const statActiveVal = document.getElementById('stat-active-val');
  const statHiddenVal = document.getElementById('stat-hidden-val');
  const statSoldVal = document.getElementById('stat-sold-val');

  // Modal Xóa chưa bán (A08)
  const deleteModal = document.getElementById('delete-modal');
  const closeDeleteModalBtn = document.getElementById('close-delete-modal-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const deleteProductNameHighlight = document.getElementById('delete-product-name-highlight');
  const deletePreviewThumb = document.getElementById('delete-preview-thumb');
  const deletePreviewCode = document.getElementById('delete-preview-code');
  const deletePreviewCategory = document.getElementById('delete-preview-category');
  const deletePreviewName = document.getElementById('delete-preview-name');
  const deletePreviewPrice = document.getElementById('delete-preview-price');
  const deletePreviewSold = document.getElementById('delete-preview-sold');

  // Modal Bảo vệ đơn hàng / Ẩn đã bán (A09)
  const protectModal = document.getElementById('protect-modal');
  const closeProtectModalBtn = document.getElementById('close-protect-modal-btn');
  const cancelProtectBtn = document.getElementById('cancel-protect-btn');
  const confirmHideBtn = document.getElementById('confirm-hide-btn');
  const protectProductCode = document.getElementById('protect-product-code');
  const protectProductName = document.getElementById('protect-product-name');
  const protectOrderCount = document.getElementById('protect-order-count');
  const hideBtnText = document.getElementById('hide-btn-text');

  // Modal Thêm sản phẩm
  const addModal = document.getElementById('add-modal');
  const openAddModalBtn = document.getElementById('open-add-modal-btn');
  const closeAddModalBtn = document.getElementById('close-add-modal-btn');
  const cancelAddBtn = document.getElementById('cancel-add-btn');
  const addProductForm = document.getElementById('add-product-form');

  // Toast
  const adminToast = document.getElementById('admin-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const closeToastBtn = document.getElementById('close-toast-btn');

  let activeProductTarget = null;
  let toastTimer = null;

  // 4. HÀM TIỆN ÍCH
  function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + '₫';
  }

  function getCategorySvg(iconType) {
    switch (iconType) {
      case 'pen':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
      case 'book':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
      case 'backpack':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path><path d="M9 6V4h6v2"></path><circle cx="12" cy="13" r="2"></circle></svg>`;
      case 'palette':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>`;
      default:
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
    }
  }

  function showToast(title, desc) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    adminToast.setAttribute('aria-hidden', 'false');
    adminToast.classList.add('is-visible');

    toastTimer = setTimeout(() => {
      adminToast.classList.remove('is-visible');
      adminToast.setAttribute('aria-hidden', 'true');
    }, 4000);
  }

  if (closeToastBtn) {
    closeToastBtn.addEventListener('click', () => {
      adminToast.classList.remove('is-visible');
      adminToast.setAttribute('aria-hidden', 'true');
    });
  }

  // 5. CẬP NHẬT THẺ THỐNG KÊ (STATS CARDS)
  function updateStats() {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const hidden = products.filter(p => p.status === 'hidden').length;
    const totalSold = products.reduce((acc, p) => acc + (p.sold || 0), 0);

    statTotalVal.textContent = total;
    statActiveVal.textContent = active;
    statHiddenVal.textContent = hidden;
    statSoldVal.textContent = new Intl.NumberFormat('vi-VN').format(totalSold);

    totalProductsText.textContent = `${total} sản phẩm`;
  }

  // 6. KẾT XUẤT BẢNG SẢN PHẨM (RENDER TABLE)
  function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const catVal = categoryFilter.value;
    const statusVal = statusFilter.value;

    const filtered = products.filter(p => {
      const matchSearch = p.code.toLowerCase().includes(searchTerm) ||
                          p.name.toLowerCase().includes(searchTerm) ||
                          p.category.toLowerCase().includes(searchTerm);
      const matchCat = (catVal === 'all') || (p.category === catVal);
      const matchStatus = (statusVal === 'all') || (p.status === statusVal);
      return matchSearch && matchCat && matchStatus;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px 16px; color: #9ca3af;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 8px; opacity: 0.5;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p style="font-size: 14px; margin: 0;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
          </td>
        </tr>
      `;
      paginationInfoText.textContent = `Hiển thị 0 trên tổng số ${products.length} sản phẩm`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-code', p.code);

      const isActive = (p.status === 'active');
      const statusClass = isActive ? 'active' : 'hidden';
      const statusLabel = isActive ? 'Đang bán' : 'Đã ẩn';

      const soldDisplay = (p.sold === 0)
        ? `<span class="sold-zero">0</span>`
        : `<span class="sold-number">${new Intl.NumberFormat('vi-VN').format(p.sold)}</span>`;

      tr.innerHTML = `
        <td class="col-checkbox">
          <input type="checkbox" class="product-row-checkbox" data-code="${p.code}" aria-label="Chọn sản phẩm ${p.name}">
        </td>
        <td class="col-code">
          <span class="product-code-tag">${p.code}</span>
        </td>
        <td class="col-product">
          <div class="product-cell">
            <div class="product-thumb" aria-hidden="true">
              <img src="${p.image}" alt="${p.name}" class="product-img-thumb" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="product-thumb-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center;">
                ${getCategorySvg(p.iconType)}
              </div>
            </div>
            <div class="product-info">
              <span class="product-title" title="${p.name}">${p.name}</span>
              <span class="product-category-sub">${p.category}</span>
            </div>
          </div>
        </td>
        <td class="col-price">
          <span class="price-value">${formatCurrency(p.price)}</span>
        </td>
        <td class="col-status">
          <span class="status-pill ${statusClass}">
            <i></i>
            <span>${statusLabel}</span>
          </span>
        </td>
        <td class="col-sold">
          ${soldDisplay}
        </td>
        <td class="col-actions">
          <div class="action-buttons-wrap">
            <a href="../A07_sửa_sản _phẩm/index.html?code=${encodeURIComponent(p.code)}" class="btn-table-icon btn-edit" title="Chỉnh sửa sản phẩm ${p.code}" aria-label="Chỉnh sửa sản phẩm ${p.code}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </a>
            <button type="button" class="btn-table-icon btn-delete" data-code="${p.code}" title="Xóa hoặc ẩn sản phẩm ${p.code}" aria-label="Xóa hoặc ẩn sản phẩm ${p.code}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    paginationInfoText.textContent = `Hiển thị 1 - ${filtered.length} trên tổng số ${products.length} sản phẩm`;
    updateSelectAllState();
  }

  // 7. XỬ LÝ CHECKBOX CHỌN TẤT CẢ
  function updateSelectAllState() {
    const rowCheckboxes = document.querySelectorAll('.product-row-checkbox');
    if (rowCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }
    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
    selectAllCheckbox.checked = (checkedCount === rowCheckboxes.length);
    selectAllCheckbox.indeterminate = (checkedCount > 0 && checkedCount < rowCheckboxes.length);
  }

  selectAllCheckbox.addEventListener('change', () => {
    const rowCheckboxes = document.querySelectorAll('.product-row-checkbox');
    rowCheckboxes.forEach(cb => {
      cb.checked = selectAllCheckbox.checked;
    });
  });

  tableBody.addEventListener('change', (e) => {
    if (e.target.classList.contains('product-row-checkbox')) {
      updateSelectAllState();
    }
  });

  // 8. TƯƠNG TÁC XÓA HOẶC ẨN SẢN PHẨM (LOGIC CHUẨN FIGMA A08 & A09)
  tableBody.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete');
    if (!deleteBtn) return;

    const code = deleteBtn.getAttribute('data-code');
    const p = products.find(item => item.code === code);
    if (!p) return;

    activeProductTarget = p;

    // Phân nhánh logic nghiệp vụ theo Figma:
    // Nếu sản phẩm CHƯA BÁN (Đã bán === 0): Mở modal xác nhận xóa vĩnh viễn (A08)
    // Nếu sản phẩm ĐÃ BÁN (Đã bán > 0): Mở modal bảo vệ đơn hàng, chỉ cho phép ẩn (A09)
    if (p.sold === 0) {
      openDeleteModal(p);
    } else {
      openProtectModal(p);
    }
  });

  // Modal Xóa chưa bán (A08)
  function openDeleteModal(p) {
    deleteProductNameHighlight.textContent = `${p.code} - ${p.name}`;
    deletePreviewCode.textContent = p.code;
    deletePreviewCategory.textContent = p.category;
    deletePreviewName.textContent = p.name;
    deletePreviewPrice.textContent = formatCurrency(p.price);
    deletePreviewSold.textContent = p.sold;

    deletePreviewThumb.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">
        ${getCategorySvg(p.iconType)}
      </div>
    `;

    deleteModal.setAttribute('aria-hidden', 'false');
    deleteModal.classList.add('is-open');
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('is-open');
    deleteModal.setAttribute('aria-hidden', 'true');
    activeProductTarget = null;
  }

  if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  confirmDeleteBtn.addEventListener('click', () => {
    if (!activeProductTarget) return;

    const removedCode = activeProductTarget.code;
    const removedName = activeProductTarget.name;

    products = products.filter(p => p.code !== removedCode);
    saveSessionProducts();

    closeDeleteModal();
    updateStats();
    renderProducts();
    showToast('Đã xóa sản phẩm', `Sản phẩm ${removedCode} (${removedName}) đã được xóa vĩnh viễn.`);
  });

  // Modal Bảo vệ đơn hàng / Ẩn sản phẩm đã bán (A09)
  function openProtectModal(p) {
    protectProductCode.textContent = p.code;
    protectProductName.textContent = p.name;
    protectOrderCount.textContent = `${p.ordersCount || 42} đơn hàng liên quan`;

    if (p.status === 'hidden') {
      hideBtnText.textContent = 'Mở lại sản phẩm';
    } else {
      hideBtnText.textContent = 'Ẩn sản phẩm';
    }

    protectModal.setAttribute('aria-hidden', 'false');
    protectModal.classList.add('is-open');
  }

  function closeProtectModal() {
    protectModal.classList.remove('is-open');
    protectModal.setAttribute('aria-hidden', 'true');
    activeProductTarget = null;
  }

  if (closeProtectModalBtn) closeProtectModalBtn.addEventListener('click', closeProtectModal);
  if (cancelProtectBtn) cancelProtectBtn.addEventListener('click', closeProtectModal);

  confirmHideBtn.addEventListener('click', () => {
    if (!activeProductTarget) return;

    const isCurrentlyHidden = (activeProductTarget.status === 'hidden');
    activeProductTarget.status = isCurrentlyHidden ? 'active' : 'hidden';
    saveSessionProducts();

    const targetCode = activeProductTarget.code;
    const actionText = isCurrentlyHidden ? 'hiển thị trở lại' : 'ẩn khỏi Storefront';

    closeProtectModal();
    updateStats();
    renderProducts();
    showToast('Cập nhật trạng thái', `Sản phẩm ${targetCode} đã được ${actionText}. Lịch sử đơn hàng được bảo toàn.`);
  });

  // 9. THÊM SẢN PHẨM MỚI (MODAL FORM)
  if (openAddModalBtn) {
    openAddModalBtn.addEventListener('click', () => {
      // Đề xuất mã sản phẩm tiếp theo
      const maxSpNumber = products.reduce((max, p) => {
        const num = parseInt(p.code.replace(/\D/g, ''), 10);
        return (!isNaN(num) && num > max) ? num : max;
      }, 8);
      addProductForm.reset();
      document.getElementById('new-product-code').value = 'SP0' + (maxSpNumber + 1);

      addModal.setAttribute('aria-hidden', 'false');
      addModal.classList.add('is-open');
    });
  }

  function closeAddModal() {
    addModal.classList.remove('is-open');
    addModal.setAttribute('aria-hidden', 'true');
  }

  if (closeAddModalBtn) closeAddModalBtn.addEventListener('click', closeAddModal);
  if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const code = document.getElementById('new-product-code').value.trim();
    const category = document.getElementById('new-product-category').value;
    const name = document.getElementById('new-product-name').value.trim();
    const price = parseInt(document.getElementById('new-product-price').value.replace(/\./g, ''), 10) || 0;
    const stock = parseInt(document.getElementById('new-product-stock').value, 10) || 0;
    const status = document.getElementById('new-product-status').value;

    if (!code || !name || price <= 0) {
      alert('Vui lòng nhập đầy đủ mã sản phẩm, tên sản phẩm và giá hợp lệ!');
      return;
    }

    // Chọn ảnh và icon tương ứng theo danh mục lấy từ homepage
    let iconType = 'pen';
    let image = '../../assets/img/product-1.jpg';

    if (category.includes('vở') || category.includes('sách')) {
      iconType = 'book';
      image = '../../assets/img/product-3.jpg';
    } else if (category.includes('balo') || category.includes('cặp')) {
      iconType = 'backpack';
      image = '../../assets/img/product-4.jpg';
    } else if (category.includes('hộp bút')) {
      iconType = 'palette';
      image = '../../assets/img/product-6.jpg';
    } else if (category.includes('mỹ thuật')) {
      iconType = 'palette';
      image = '../../assets/img/product-7.jpg';
    }

    const newProd = {
      code,
      name,
      category,
      price,
      status,
      sold: 0,
      stock,
      ordersCount: 0,
      image,
      iconType
    };

    products.unshift(newProd);
    saveSessionProducts();

    closeAddModal();
    updateStats();
    renderProducts();
    showToast('Thêm sản phẩm thành công', `Đã thêm sản phẩm mới ${code} - ${name} vào danh mục.`);
  });

  // Đóng modal khi click ra backdrop ngoài hoặc nhấn Escape
  [deleteModal, protectModal, addModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal === deleteModal) closeDeleteModal();
        if (modal === protectModal) closeProtectModal();
        if (modal === addModal) closeAddModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (deleteModal.classList.contains('is-open')) closeDeleteModal();
      if (protectModal.classList.contains('is-open')) closeProtectModal();
      if (addModal.classList.contains('is-open')) closeAddModal();
    }
  });

  // 10. BỘ LỌC VÀ TÌM KIẾM
  searchInput.addEventListener('input', renderProducts);
  categoryFilter.addEventListener('change', renderProducts);
  statusFilter.addEventListener('change', renderProducts);

  btnRefresh.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    statusFilter.value = 'all';
    renderProducts();
    showToast('Đã làm mới danh sách', 'Dữ liệu sản phẩm hiển thị đã được làm mới.');
  });

  // 11. XUẤT DANH SÁCH RA FILE CSV (HỖ TRỢ TIẾNG VIỆT EXCEL)
  btnExportExcel.addEventListener('click', () => {
    if (products.length === 0) {
      alert('Không có dữ liệu sản phẩm để xuất!');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM cho Excel
    csvContent += 'MÃ SẢN PHẨM,TÊN SẢN PHẨM,DANH MỤC,GIÁ BÁN (VNĐ),TRẠNG THÁI,ĐÃ BÁN,TỒN KHO\n';

    products.forEach(p => {
      const statusLabel = (p.status === 'active') ? 'Đang bán' : 'Đã ẩn';
      const cleanName = `"${p.name.replace(/"/g, '""')}"`;
      const cleanCat = `"${p.category.replace(/"/g, '""')}"`;
      csvContent += `${p.code},${cleanName},${cleanCat},${p.price},${statusLabel},${p.sold},${p.stock || 0}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_san_pham_hoc_duong_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Xuất tệp thành công', 'File Excel CSV danh sách sản phẩm đã được tải về máy.');
  });

  // 12. CẬP NHẬT NGÀY HIỆN TẠI TRÊN TOPBAR
  const dateEl = document.getElementById('current-date-text');
  if (dateEl) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    dateEl.textContent = `Hôm nay, ${day}/${month}/${year}`;
  }

  // 13. XỬ LÝ PHÂN TRANG (PAGINATION): Cho phép ấn Next, khi ấn là reload về lại trang 1
  const btnNextPage = document.getElementById('btn-next-page');
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnPage1 = document.getElementById('btn-page-1');

  function reloadToPage1() {
    // Reset các bộ lọc và tìm kiếm về mặc định
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';

    // Hiệu ứng mờ nhẹ trước khi reload
    if (tableBody) {
      tableBody.style.transition = 'opacity 150ms ease';
      tableBody.style.opacity = '0.35';
    }

    // Reload trang về lại trang 1 mà không hiện thông báo toast
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }

  if (btnNextPage) {
    btnNextPage.removeAttribute('disabled');
    btnNextPage.style.cursor = 'pointer';
    btnNextPage.addEventListener('click', (e) => {
      e.preventDefault();
      reloadToPage1();
    });
  }

  if (btnPrevPage) {
    btnPrevPage.removeAttribute('disabled');
    btnPrevPage.style.cursor = 'pointer';
    btnPrevPage.addEventListener('click', (e) => {
      e.preventDefault();
      reloadToPage1();
    });
  }

  if (btnPage1) {
    btnPage1.style.cursor = 'pointer';
    btnPage1.addEventListener('click', (e) => {
      e.preventDefault();
      reloadToPage1();
    });
  }

  // 14. KHỞI CHẠY LẦN ĐẦU
  updateStats();
  renderProducts();

  // Hiển thị thông báo Toast nếu vừa chuyển về từ A06 hoặc A07
  const pendingToastRaw = sessionStorage.getItem('hocduong_admin_toast');
  if (pendingToastRaw) {
    sessionStorage.removeItem('hocduong_admin_toast');
    try {
      const parsed = JSON.parse(pendingToastRaw);
      showToast(parsed.title || 'Cập nhật thành công', parsed.desc || '');
    } catch (e) {
      showToast('Cập nhật thành công', pendingToastRaw);
    }
  }

});
