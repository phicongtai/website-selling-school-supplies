document.addEventListener('DOMContentLoaded', () => {
  const store = window.HDOrderStore;

  /* ------------------------------------------------------------------
     Khôi phục đúng dữ liệu mẫu như thiết kế khi tải lại trang.
     - Bấm F5 / refresh  → xoá các thay đổi trạng thái, đơn tạo tại quầy,
       nhật ký xử lý và bộ lọc để trang trở về đúng ảnh thiết kế.
     - Đi từ A10 → A11 → A10 (hoặc từ A12) thì giữ nguyên thay đổi trong
       phiên làm việc để các trang vẫn khớp nhau.
     ------------------------------------------------------------------ */
  function navigationType() {
    try {
      const entries = performance.getEntriesByType('navigation');
      if (entries && entries.length && entries[0].type) return entries[0].type;
      if (performance.navigation) {
        const legacy = performance.navigation.type;
        if (legacy === 1) return 'reload';
        if (legacy === 2) return 'back_forward';
      }
    } catch (error) {
      /* Bỏ qua */
    }
    return 'navigate';
  }

  function openedFromOrderPages() {
    if (!document.referrer) return false;
    try {
      return /A1[012][^/]*\/index\.html/i.test(decodeURIComponent(document.referrer));
    } catch (error) {
      return false;
    }
  }

  const shouldResetDemoData = navigationType() === 'reload' || !openedFromOrderPages();

  if (store && typeof store.resetOrders === 'function' && shouldResetDemoData) {
    store.resetOrders();
    if (typeof store.removeState === 'function') store.removeState('hd_admin_order_filters');
  }

  let orders = store.getOrders();
  const labels = store.STATUS_LABELS;
  const tbody = document.getElementById('orders-tbody');
  const statusFilter = document.getElementById('status-filter');
  const dateFrom = document.getElementById('date-from');
  const dateTo = document.getElementById('date-to');
  const locationFilter = document.getElementById('location-filter');
  const searchInput = document.getElementById('order-search');
  const paginationInfo = document.getElementById('pagination-info');
  const modal = document.getElementById('order-modal');
  const form = document.getElementById('order-form');
  let activeTab = 'all';
  let toastTimer;
  let orderAnimTimer = null;

  const DEFAULT_FILTERS = Object.freeze({
    status: 'all',
    from: '2026-10-01',
    to: '2026-10-10',
    location: 'all',
    search: ''
  });

  function setActiveTab(tabName) {
    activeTab = ['all', 'pending', 'processing', 'finished'].includes(tabName) ? tabName : 'all';
    document.querySelectorAll('.order-tab').forEach((tab) => {
      const selected = tab.dataset.tab === activeTab;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
  }

  // Đưa toàn bộ điều khiển lọc về trạng thái ban đầu như ảnh thiết kế.
  function resetFilterControls() {
    statusFilter.value = DEFAULT_FILTERS.status;
    dateFrom.value = DEFAULT_FILTERS.from;
    dateTo.value = DEFAULT_FILTERS.to;
    locationFilter.value = DEFAULT_FILTERS.location;
    searchInput.value = DEFAULT_FILTERS.search;
    setActiveTab('all');
    closeActionMenus();
  }

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const formatMoney = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
  const formatDate = (date) => {
    const parts = String(date).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
  };

  function showToast(message) {
    const toast = document.getElementById('orders-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function updateCounts() {
    const count = (status) => orders.filter((order) => order.status === status).length;
    const pending = count('pending');
    const processing = count('confirmed');
    const delivered = count('delivered');
    const cancelled = count('cancelled');
    const finished = delivered + cancelled;
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    setText('count-all', orders.length);
    setText('count-pending', pending);
    setText('count-processing', processing);
    setText('count-finished', finished);
    setText('count-delivered', `${delivered} đã giao`);
    setText('count-cancelled', `${cancelled} huỷ`);
    setText('tab-count-all', orders.length);
    setText('tab-count-pending', pending);
    setText('tab-count-processing', processing);
    setText('tab-count-finished', finished);
    setText('orders-subtitle', `Theo dõi, xử lý và điều phối ${orders.length} đơn hàng trên hệ thống thương mại Học Đường Store`);
  }

  /* Trang demo: bộ lọc và tab chỉ tạo hiệu ứng, luôn hiển thị đủ danh sách
     đơn hàng thay vì cắt bớt hoặc ẩn dữ liệu. */
  function getFilteredOrders() {
    return orders.slice();
  }

  function actionMarkup(order) {
    if (['delivered', 'cancelled'].includes(order.status)) {
      const isDelivered = order.status === 'delivered';
      const lockedLabel = isDelivered ? 'Đã chốt hoàn' : 'Đơn đã huỷ';
      const lockedIcon = isDelivered
        ? '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7"/></svg>'
        : '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.6"/><path d="m5.8 5.8 4.4 4.4m0-4.4-4.4 4.4"/></svg>';
      return `<button class="order-action-toggle is-locked" type="button" disabled>${lockedIcon}<span>${lockedLabel}</span></button>`;
    }
    const isPending = order.status === 'pending';
    const toggleLabel = isPending ? 'Chuyển: Đã xác nhận' : 'Đã xác nhận';
    const nextLabel = isPending ? 'Đã xác nhận' : 'Đã giao – Thành công';
    /* Với đơn đã xác nhận, trạng thái lùi về "Chưa xác nhận" bị khoá để
       đảm bảo quy tắc luồng trạng thái chỉ tiến một chiều. */
    const lockedPrevious = isPending ? '' : `
        <button class="order-action-option is-blocked" type="button" disabled title="Không thể quay lui trạng thái" aria-disabled="true">
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7"/></svg><s>Chưa xác nhận</s>
        </button>`;
    return `<button class="order-action-toggle" type="button" data-action-toggle="${order.code}" aria-expanded="false" aria-haspopup="true"><span>${toggleLabel}</span><span class="order-action-caret" aria-hidden="true">⌄</span></button>
      <div class="order-action-menu" data-action-menu="${order.code}" hidden>${lockedPrevious}
        <button class="order-action-option deliver" type="button" data-next-status="${order.code}"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8"/><path d="m5.2 8.2 1.9 1.9 3.7-4"/></svg>${escapeHTML(nextLabel)}</button>
        <button class="order-action-option cancel" type="button" data-cancel-order="${order.code}"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8"/><path d="m5.8 5.8 4.4 4.4m0-4.4-4.4 4.4"/></svg>Huỷ đơn hàng</button>
      </div>`;
  }

  function statusMarkup(order) {
    /* Nhãn huỷ hiển thị gọn đúng như thiết kế ("Huỷ đơn"). */
    const label = order.status === 'cancelled' ? 'Huỷ đơn' : labels[order.status];
    return `<span class="order-status ${order.status}">${label}</span>`;
  }

  function renderOrders() {
    const visible = getFilteredOrders();
    tbody.innerHTML = visible.length ? visible.map((order) => {
      const isStatic = /^DH10(0[1-9]|10)$/i.test(order.code);
      const detailHref = isStatic
        ? `../A11 chi tiết đơn hàng/${order.code.toLowerCase()}.html`
        : `../A11 chi tiết đơn hàng/index.html?order=${encodeURIComponent(order.code)}`;
      return `
      <tr><td><a class="order-code" href="${detailHref}" title="Xem chi tiết đơn ${escapeHTML(order.code)}"><span>${escapeHTML(order.code)}</span><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.4 2H8v4.6"/></svg></a></td>
      <td>${order.customerId
        ? `<a class="order-customer" href="../A12 thống kê khách hàng/index.html?customer=${encodeURIComponent(order.customerId)}" title="Xem thống kê khách hàng ${escapeHTML(order.customer)}">${escapeHTML(order.customer)}</a>`
        : `<span class="order-customer">${escapeHTML(order.customer)}</span>`}</td>
      <td><span class="order-date">${formatDate(order.date)}</span></td><td>${escapeHTML(order.address)}</td>
      <td><span class="order-total">${formatMoney(order.total)}</span></td>
      <td>${statusMarkup(order)}</td>
      <td><div class="order-action-wrap">${actionMarkup(order)}</div></td></tr>`;
    }).join('')
      : '<tr><td class="orders-empty" colspan="7">Không tìm thấy đơn hàng phù hợp.</td></tr>';
    paginationInfo.textContent = `Hiển thị ${visible.length ? `1–${visible.length}` : '0'} trên tổng số ${visible.length} đơn hàng`;
  }

  function render() {
    updateCounts();
    renderOrders();
  }

  function closeActionMenus() {
    tbody.querySelectorAll('.order-action-menu').forEach((menu) => { menu.hidden = true; });
    tbody.querySelectorAll('[data-action-toggle]').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  }

  /* Hiệu ứng làm mới bảng: mờ nhẹ rồi hiện lại, dùng chung cho tab, bộ lọc,
     tìm kiếm và phân trang. */
  function triggerOrderTableAnimation(callback) {
    if (tbody) {
      tbody.style.transition = 'opacity 0.22s ease, filter 0.22s ease';
      tbody.style.opacity = '0.35';
      tbody.style.filter = 'blur(0.6px)';
    }
    if (orderAnimTimer) clearTimeout(orderAnimTimer);
    orderAnimTimer = setTimeout(() => {
      if (tbody) {
        tbody.style.opacity = '1';
        tbody.style.filter = 'none';
      }
      if (typeof callback === 'function') callback();
      renderOrders();
    }, 280);
  }

  function triggerSearchAnimation() {
    const searchIconSvg = document.querySelector('.search-wrap svg');
    if (searchIconSvg) {
      searchIconSvg.style.transition = 'transform 0.35s ease';
      searchIconSvg.style.transform = 'rotate(180deg)';
    }
    triggerOrderTableAnimation(() => {
      if (searchIconSvg) {
        searchIconSvg.style.transform = 'rotate(0deg)';
      }
    });
  }

  document.querySelectorAll('.order-tab').forEach((tab) => tab.addEventListener('click', () => {
    setActiveTab(tab.dataset.tab);
    triggerOrderTableAnimation();
  }));

  document.getElementById('apply-filters').addEventListener('click', () => {
    triggerOrderTableAnimation();
  });

  [statusFilter, dateFrom, dateTo, locationFilter].forEach((control) => control.addEventListener('change', () => {
    triggerOrderTableAnimation();
  }));

  let searchDebounce = null;
  searchInput.addEventListener('input', () => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      triggerSearchAnimation();
    }, 200);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchDebounce) clearTimeout(searchDebounce);
      triggerSearchAnimation();
    }
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    resetFilterControls();
    triggerOrderTableAnimation();
    showToast('Đã khôi phục bộ lọc mặc định.');
  });

  // Phân trang mô phỏng: có hiệu ứng làm mới, luôn giữ đủ danh sách đơn hàng.
  document.querySelectorAll('.pagination-controls button').forEach((btn) => {
    btn.removeAttribute('disabled');
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerOrderTableAnimation();
    });
  });

  tbody.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-action-toggle]');
    const next = event.target.closest('[data-next-status]');
    const cancel = event.target.closest('[data-cancel-order]');
    if (toggle) {
      const menu = tbody.querySelector(`[data-action-menu="${toggle.dataset.actionToggle}"]`);
      if (!menu) return;
      const isOpen = !menu.hidden;
      closeActionMenus();
      menu.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
      return;
    }
    if (next || cancel) {
      closeActionMenus();
      const code = next ? next.dataset.nextStatus : cancel.dataset.cancelOrder;
      const order = orders.find((item) => item.code === code);
      if (order) {
        // Cập nhật trạng thái ngay trên giao diện để người dùng thấy rõ
        // sự thay đổi (pill trạng thái, nút thao tác và số liệu thống kê).
        // Dữ liệu gốc vẫn được giữ nguyên khi tải lại trang.
        if (next && order.status === 'pending') {
          order.status = 'confirmed';
          showToast(`Đơn ${code} đã được xác nhận.`);
        } else if (next && order.status === 'confirmed') {
          order.status = 'delivered';
          showToast(`Đơn ${code} đã được giao thành công.`);
        } else if (cancel && ['pending', 'confirmed'].includes(order.status)) {
          order.status = 'cancelled';
          showToast(`Đơn ${code} đã được huỷ.`);
        }
        updateCounts();
      }
      triggerOrderTableAnimation();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.order-action-wrap')) return;
    closeActionMenus();
  });

  function openModal() { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); form.elements.customer.focus(); }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); form.reset(); }
  document.getElementById('open-order-modal').addEventListener('click', openModal);
  document.getElementById('close-order-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-order-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      closeActionMenus();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Chức năng tạo đơn giả lập: đóng modal và thông báo, không thêm đơn vào dữ liệu gốc.
    closeModal();
    showToast('Đơn hàng mới đã được tạo và đang chờ xác nhận.');
  });

  const sidebarUserName = document.getElementById('sidebar-user-name');
  if (sidebarUserName) sidebarUserName.textContent = 'Nguyễn Văn A';

  // Trình duyệt có thể khôi phục giá trị đã nhập sau khi F5, nên đặt lại
  // điều khiển lọc trước khi áp dụng tham số tìm kiếm trên URL.
  if (shouldResetDemoData) resetFilterControls();

  const searchParam = new URLSearchParams(window.location.search).get('q');
  if (searchParam) searchInput.value = searchParam;

  render();

  // Khi quay lại từ trang A11 bằng nút Back, đồng bộ lại trạng thái mới nhất.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    orders = store.getOrders();
    render();
  });

  /* Đồng bộ khi A10/A11/A12 được mở ở nhiều tab: tab này cập nhật ngay khi
     tab khác thay đổi trạng thái hoặc tạo đơn mới. */
  window.addEventListener('storage', (event) => {
    if (event.key && !['hd_admin_order_status', 'hd_admin_custom_orders', 'hd_admin_order_audit'].includes(event.key)) return;
    orders = store.getOrders();
    render();
  });
});


// Cập nhật ngày realtime trên topbar
(function () {
  function updateTopbarDate() {
    const dateEls = document.querySelectorAll('#current-date-text, .topbar-date span');
    if (dateEls.length) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const text = 'Hôm nay, ' + day + '/' + month + '/' + year;
      dateEls.forEach(el => { el.textContent = text; });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTopbarDate);
  } else {
    updateTopbarDate();
  }
})();
