/**
 * ==========================================================================
 * A07: SỬA SẢN PHẨM (PRODUCT EDITOR CONTROLLER)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
 * --------------------------------------------------------------------------
 * Cơ chế dữ liệu (đồng bộ với A02 - Quản lý người dùng):
 *  - Dữ liệu gốc SP17 được khai báo cố định trong JS (DEFAULT_PRODUCT).
 *  - Khi sửa và bấm "Lưu thay đổi", dữ liệu được lưu tạm vào sessionStorage
 *    để giữ nguyên khi chuyển trang trong cùng phiên làm việc.
 *  - Khi người dùng nhấn Refresh (F5), dữ liệu tạm bị xoá và giao diện quay
 *    về đúng trạng thái ban đầu như bản thiết kế.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const STORAGE_KEY = 'hd_temp_products';
  const PRODUCT_CODE = 'SP17';

  /* ------------------------------------------------------------------------
   * 1. DỮ LIỆU GỐC CỐ ĐỊNH (THEO BẢN THIẾT KẾ)
   * ---------------------------------------------------------------------- */
  const DEFAULT_PRODUCT = {
    code: PRODUCT_CODE,
    name: 'Balo chống gù tiểu học',
    category: 'Cặp & balo',
    stock: 45,
    price: 389000,
    sku: 'BALO-TH-XANH-D17',
    description: 'Balo chống gù cao cấp dành cho học sinh tiểu học, đệm lưng thoáng khí công nghệ tổ ong, quai đeo trợ lực chống cong vẹo cột sống, chất liệu vải chống thấm nước tuyệt đối.',
    visible: true,
    imageName: 'balo-chong-gu-sp17.jpg',
    imageSize: '1.2 MB',
    createdAt: '12/08/2024 - 09:42',
    updatedAt: '21/10/2024 - 15:18',
    updatedBy: 'admin@hocduong.vn',
    channel: 'Trực tuyến & Đại lý trường học'
  };

  // Kiểm tra nếu trang được Reload (F5 / Refresh)
  function isPageReload() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      if (window.performance && window.performance.navigation) {
        return window.performance.navigation.type === 1;
      }
    } catch (error) {
      console.warn(error);
    }
    return false;
  }

  // Nếu người dùng ấn Reload (F5), xoá dữ liệu tạm để nạp lại dữ liệu gốc
  if (isPageReload()) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('hd_products_data');
    } catch (error) {
      console.warn(error);
    }
  }

  // Đọc danh sách sản phẩm đang lưu tạm trong phiên làm việc
  function readTempProducts() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      console.warn(error);
      return [];
    }
  }

  // Lấy sản phẩm hiện tại: ưu tiên bản lưu tạm, nếu không có thì dùng dữ liệu gốc
  function loadCurrentProduct() {
    const saved = readTempProducts().find(
      (item) => item && String(item.code).toUpperCase() === PRODUCT_CODE
    );
    return { ...DEFAULT_PRODUCT, ...(saved || {}) };
  }

  let currentProduct = loadCurrentProduct();
  let pendingImage = null;
  let uploadedPreviewUrl = null;
  let hasUserInteraction = false;

  /* ------------------------------------------------------------------------
   * 2. CÁC PHẦN TỬ DOM
   * ---------------------------------------------------------------------- */
  const productForm = document.querySelector('#product-form');
  const formMessage = document.querySelector('#form-message');
  const productName = document.querySelector('#product-name');
  const category = document.querySelector('#category');
  const stock = document.querySelector('#stock');
  const price = document.querySelector('#price');
  const sku = document.querySelector('#sku');
  const description = document.querySelector('#description');
  const visibleToggle = document.querySelector('#visible-toggle');
  const sellingStatus = document.querySelector('#selling-status');
  const sellingStatusTitle = document.querySelector('#selling-status-title');
  const sellingStatusNote = document.querySelector('#selling-status-note');
  const productSubtitle = document.querySelector('#product-subtitle');
  const productStatusBadge = document.querySelector('#product-status-badge');
  const productStatusText = document.querySelector('#product-status-text');
  const metricTitle = document.querySelector('#metric-title');
  const updatedAt = document.querySelector('#updated-at');
  const updatedBy = document.querySelector('#updated-by');
  const imageUpload = document.querySelector('#image-upload');
  const imagePreview = document.querySelector('#image-preview');
  const fileName = document.querySelector('#file-name');
  const fileSize = document.querySelector('#file-size');
  const cancelButton = document.querySelector('#cancel-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const sidebar = document.querySelector('.admin-sidebar');

  /* ------------------------------------------------------------------------
   * 3. TOAST THÔNG BÁO
   * ---------------------------------------------------------------------- */
  const toast = document.querySelector('#toast');
  const toastIcon = document.querySelector('#toast-icon');
  const toastText = document.querySelector('#toast-text');
  let toastTimer = null;

  function showToast(message, type = 'success') {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastText) toastText.textContent = message;
    if (toastIcon) {
      if (type === 'error') {
        toastIcon.textContent = '✕';
      } else if (type === 'info') {
        toastIcon.textContent = 'ⓘ';
      } else {
        toastIcon.textContent = '✓';
      }
    }

    toast.className = 'toast-msg show ' + (type || '');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ------------------------------------------------------------------------
   * 4. CÁC HÀM ĐỊNH DẠNG
   * ---------------------------------------------------------------------- */
  function formatPrice(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('vi-VN');
  }

  function parsePrice(value) {
    return Number(String(value ?? '').replace(/\D/g, '')) || 0;
  }

  function formatDateTime(date = new Date()) {
    const pad = (number) => String(number).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  /* ------------------------------------------------------------------------
   * 5. HIỂN THỊ DỮ LIỆU
   * ---------------------------------------------------------------------- */
  function renderImagePreview(imageUrl) {
    const defaultPhoto = imagePreview.querySelector('.product-photo');
    const oldPreview = imagePreview.querySelector('.uploaded-preview');

    if (oldPreview) oldPreview.remove();

    if (imageUrl) {
      const preview = document.createElement('img');
      preview.className = 'uploaded-preview';
      preview.src = imageUrl;
      preview.alt = 'Ảnh xem trước sản phẩm';
      imagePreview.append(preview);
      if (defaultPhoto) defaultPhoto.hidden = true;
      return;
    }

    if (defaultPhoto) defaultPhoto.hidden = false;
  }

  // Gán ảnh xem trước mới và giải phóng URL blob cũ (tránh rò rỉ bộ nhớ)
  function setUploadedPreview(imageUrl) {
    if (uploadedPreviewUrl && uploadedPreviewUrl !== imageUrl) {
      URL.revokeObjectURL(uploadedPreviewUrl);
    }
    uploadedPreviewUrl = imageUrl;
    renderImagePreview(imageUrl);
  }

  // Hiển thị thông báo trong biểu mẫu kèm trạng thái lỗi
  function setFormMessage(message, type = 'success') {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.classList.toggle('is-error', type === 'error');
  }

  function updateSellingStatus() {
    const isVisible = Boolean(visibleToggle && visibleToggle.checked);

    if (sellingStatus) sellingStatus.classList.toggle('is-off', !isVisible);
    if (sellingStatusTitle) sellingStatusTitle.textContent = isVisible ? 'Đang bán' : 'Tạm ẩn';
    if (sellingStatusNote) {
      sellingStatusNote.textContent = isVisible
        ? 'Sẵn sàng tiếp nhận đơn'
        : 'Không hiển thị trên cửa hàng';
    }

    if (productStatusBadge) {
      productStatusBadge.classList.toggle('is-off', !isVisible);
    }
    if (productStatusText) {
      productStatusText.textContent = isVisible ? 'Đang bán' : 'Tạm ẩn';
    }
  }

  // Đổ dữ liệu sản phẩm vào toàn bộ biểu mẫu
  function renderProduct(product, options = {}) {
    if (!product) return;
    const { previewUrl = null } = options;

    if (productName) productName.value = product.name;
    if (category) category.value = product.category;
    if (stock) stock.value = product.stock;
    if (price) price.value = formatPrice(product.price);
    if (sku) sku.value = product.sku;
    if (description) description.value = product.description;
    if (visibleToggle) visibleToggle.checked = Boolean(product.visible);

    if (fileName) fileName.textContent = product.imageName;
    if (fileSize) fileSize.textContent = product.imageSize;
    if (productSubtitle) productSubtitle.textContent = `Chỉnh sửa sản phẩm: ${product.name}`;
    if (metricTitle) metricTitle.textContent = `Chỉ số giao dịch của ${product.code}`;
    if (updatedAt) updatedAt.textContent = product.updatedAt;
    if (updatedBy) updatedBy.textContent = product.updatedBy;

    pendingImage = null;
    if (previewUrl) {
      // Giữ nguyên ảnh vừa chọn sau khi lưu, tránh xoá oan bản xem trước
      if (uploadedPreviewUrl !== previewUrl) setUploadedPreview(previewUrl);
    } else if (uploadedPreviewUrl) {
      setUploadedPreview(null);
    } else {
      renderImagePreview(null);
    }
    updateSellingStatus();
  }

  // Lưu sản phẩm vào sessionStorage (chỉ tồn tại trong phiên làm việc)
  function saveTempProduct(product) {
    try {
      const products = readTempProducts().filter(
        (item) => item && String(item.code).toUpperCase() !== PRODUCT_CODE
      );
      products.push(product);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.warn(error);
      showToast('Không thể lưu tạm dữ liệu trong trình duyệt.', 'error');
    }
  }

  /* ------------------------------------------------------------------------
   * 6. XỬ LÝ NHẬP LIỆU
   * ---------------------------------------------------------------------- */
  const markInteraction = () => { hasUserInteraction = true; };
  if (productForm) {
    productForm.addEventListener('input', markInteraction, { once: true });
    productForm.addEventListener('change', markInteraction, { once: true });
  }

  if (price) {
    price.addEventListener('input', () => {
      const digits = price.value.replace(/\D/g, '');
      price.value = digits ? Number(digits).toLocaleString('vi-VN') : '';
    });

    price.addEventListener('blur', () => {
      price.value = formatPrice(price.value);
    });
  }

  if (stock) {
    stock.addEventListener('change', () => {
      const value = Number(stock.value);
      if (!Number.isFinite(value) || value < 0 || stock.value === '') {
        stock.value = 0;
      }
    });
  }

  if (visibleToggle) {
    visibleToggle.addEventListener('change', updateSellingStatus);
  }

  // Đổi ảnh sản phẩm
  if (imageUpload) {
    imageUpload.addEventListener('change', () => {
      const file = imageUpload.files?.[0];
      if (!file) return;

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setFormMessage('Vui lòng chọn ảnh JPG, PNG hoặc WebP.', 'error');
        showToast('Định dạng ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG hoặc WebP.', 'error');
        imageUpload.value = '';
        return;
      }

      setUploadedPreview(URL.createObjectURL(file));

      pendingImage = {
        name: file.name,
        size: formatFileSize(file.size)
      };

      if (fileName) fileName.textContent = pendingImage.name;
      if (fileSize) fileSize.textContent = pendingImage.size;
      setFormMessage('');
      showToast('Đã chọn ảnh mới. Nhấn "Lưu thay đổi" để áp dụng.', 'info');
    });
  }

  // Gửi biểu mẫu: cập nhật dữ liệu tạm và giao diện
  if (productForm) {
    productForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!productForm.reportValidity()) return;

      const name = productName.value.trim();
      const priceValue = parsePrice(price.value);
      const stockValue = Number(stock.value);

      if (!name) {
        productName.focus();
        showToast('Vui lòng nhập tên sản phẩm.', 'error');
        return;
      }

      if (priceValue <= 0) {
        price.focus();
        showToast('Giá bán phải lớn hơn 0.', 'error');
        return;
      }

      if (!Number.isFinite(stockValue) || stockValue < 0) {
        stock.focus();
        showToast('Số lượng tồn kho không hợp lệ.', 'error');
        return;
      }

      const previewToKeep = uploadedPreviewUrl;

      currentProduct = {
        ...currentProduct,
        name,
        category: category.value,
        stock: stockValue,
        price: priceValue,
        sku: sku.value.trim(),
        description: description.value.trim(),
        visible: visibleToggle.checked,
        imageName: pendingImage ? pendingImage.name : currentProduct.imageName,
        imageSize: pendingImage ? pendingImage.size : currentProduct.imageSize,
        updatedAt: formatDateTime(),
        updatedBy: sessionStorage.getItem('hd_admin_user') || 'admin@hocduong.vn'
      };

      saveTempProduct(currentProduct);
      renderProduct(currentProduct, { previewUrl: previewToKeep });
      if (imageUpload) imageUpload.value = '';

      setFormMessage('Thông tin sản phẩm đã được lưu.');
      showToast(`Đã lưu thay đổi cho sản phẩm ${currentProduct.code}`);
    });
  }

  // Hủy thay đổi: quay lại trạng thái đã lưu gần nhất (mặc định là ảnh gốc)
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      setUploadedPreview(null);
      if (imageUpload) imageUpload.value = '';

      renderProduct(currentProduct);

      setFormMessage('Đã hủy các thay đổi trong biểu mẫu.');
      showToast('Đã hủy các thay đổi trong biểu mẫu.', 'info');
    });
  }

  /* ------------------------------------------------------------------------
   * 7. ĐIỀU HƯỚNG DI ĐỘNG
   * ---------------------------------------------------------------------- */
  if (mobileMenu && sidebar) {
    mobileMenu.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 560
        && sidebar.classList.contains('is-open')
        && !sidebar.contains(event.target)
        && !mobileMenu.contains(event.target)) {
        sidebar.classList.remove('is-open');
        mobileMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Đăng xuất an toàn
  document.querySelectorAll('.sidebar-logout').forEach((button) => {
    button.addEventListener('click', () => {
      sessionStorage.removeItem('hd_admin_authenticated');
      sessionStorage.removeItem('hd_admin_user');
    });
  });

  /* ------------------------------------------------------------------------
   * 8. KHỞI TẠO GIAO DIỆN
   * ---------------------------------------------------------------------- */
  const loggedInUser = (() => {
    try { return sessionStorage.getItem('hd_admin_user'); } catch (error) { return null; }
  })();
  const sidebarUserName = document.querySelector('#sidebar-user-name');
  if (loggedInUser && sidebarUserName) sidebarUserName.textContent = loggedInUser;

  renderProduct(currentProduct);

  // Ghi đè trạng thái form mà trình duyệt có thể khôi phục sau khi reload
  window.addEventListener('load', () => {
    if (!hasUserInteraction) renderProduct(currentProduct);
    if (isPageReload()) window.scrollTo(0, 0);
  });

  window.addEventListener('pageshow', () => {
    if (!hasUserInteraction) renderProduct(currentProduct);
  });
});
