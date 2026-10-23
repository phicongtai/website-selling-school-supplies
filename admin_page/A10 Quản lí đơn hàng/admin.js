document.addEventListener('DOMContentLoaded', () => {
  const store = window.HDOrderStore;
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

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const formatMoney = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
  const formatDate = (date) => {
    const parts = String(date).split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : date;
  };

  function showToast(message) {
    const toast = document.getElementById('orders-toast');
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
    document.getElementById('count-all').textContent = orders.length;
    document.getElementById('count-pending').textContent = pending;
    document.getElementById('count-processing').textContent = processing;
    document.getElementById('count-finished').textContent = finished;
    document.getElementById('count-delivered').textContent = `${delivered} đã giao`;
    document.getElementById('count-cancelled').textContent = `${cancelled} huỷ`;
    document.getElementById('tab-count-all').textContent = orders.length;
    document.getElementById('tab-count-pending').textContent = pending;
    document.getElementById('tab-count-processing').textContent = processing;
    document.getElementById('tab-count-finished').textContent = finished;
  }

  function getFilteredOrders() {
    const status = statusFilter.value;
    const location = locationFilter.value;
    const from = dateFrom.value;
    const to = dateTo.value;
    const query = searchInput.value.trim().toLocaleLowerCase('vi');
    return orders.filter((order) => {
      const inTab = activeTab === 'all'
        || (activeTab === 'pending' && order.status === 'pending')
        || (activeTab === 'processing' && order.status === 'confirmed')
        || (activeTab === 'finished' && ['delivered', 'cancelled'].includes(order.status));
      const inDateRange = (!from || order.date >= from) && (!to || order.date <= to);
      const matchesSearch = !query || `${order.code} ${order.customer}`.toLocaleLowerCase('vi').includes(query);
      return inTab && (status === 'all' || order.status === status)
        && (location === 'all' || order.location === location) && inDateRange && matchesSearch;
    });
  }

  function actionMarkup(order) {
    if (['delivered', 'cancelled'].includes(order.status)) {
      return `<button class="order-action-toggle is-locked" type="button" disabled><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7"/></svg><span>${order.status === 'delivered' ? 'Đã hoàn tất' : 'Đơn đã huỷ'}</span></button>`;
    }
    const nextLabel = order.status === 'pending' ? 'Xác nhận đơn hàng' : 'Đã giao – Thành công';
    return `<button class="order-action-toggle" type="button" data-action-toggle="${order.code}" aria-expanded="false"><span>${order.status === 'pending' ? 'Chưa duyệt' : 'Chuyển: Đã giao'}</span><span aria-hidden="true">⌄</span></button>
      <div class="order-action-menu" data-action-menu="${order.code}" hidden>
        <button class="order-action-option" type="button" data-next-status="${order.code}"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8"/><path d="m5.2 8.2 1.9 1.9 3.7-4"/></svg>${escapeHTML(nextLabel)}</button>
        <button class="order-action-option cancel" type="button" data-cancel-order="${order.code}"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8"/><path d="m5.8 5.8 4.4 4.4m0-4.4-4.4 4.4"/></svg>Huỷ đơn hàng</button>
      </div>`;
  }

  function renderOrders() {
    const filtered = getFilteredOrders();
    tbody.innerHTML = filtered.length ? filtered.map((order) => `
      <tr><td><a class="order-code" href="../A11 chi tiết đơn hàng/index.html?order=${encodeURIComponent(order.code)}" title="Xem chi tiết đơn ${escapeHTML(order.code)}"><span>${escapeHTML(order.code)}</span><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.4 2H8v4.6"/></svg></a></td>
      <td>${order.customerId
        ? `<a class="order-customer" href="../A12 thống kê khách hàng/index.html?customer=${encodeURIComponent(order.customerId)}" title="Xem thống kê khách hàng ${escapeHTML(order.customer)}">${escapeHTML(order.customer)}</a>`
        : `<span class="order-customer">${escapeHTML(order.customer)}</span>`}</td>
      <td><span class="order-date">${formatDate(order.date)}</span></td><td>${escapeHTML(order.address)}</td>
      <td><span class="order-total">${formatMoney(order.total)}</span></td>
      <td><span class="order-status ${order.status}">${labels[order.status]}</span></td>
      <td><div class="order-action-wrap">${actionMarkup(order)}</div></td></tr>`).join('')
      : '<tr><td class="orders-empty" colspan="7">Không tìm thấy đơn hàng phù hợp.</td></tr>';
    paginationInfo.textContent = `Hiển thị ${filtered.length ? `1–${filtered.length}` : '0'} trên tổng số ${filtered.length} đơn hàng`;
  }

  function render() { updateCounts(); renderOrders(); }

  document.querySelectorAll('.order-tab').forEach((tab) => tab.addEventListener('click', () => {
    activeTab = tab.dataset.tab;
    document.querySelectorAll('.order-tab').forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    renderOrders();
  }));

  document.getElementById('apply-filters').addEventListener('click', renderOrders);
  [statusFilter, dateFrom, dateTo, locationFilter].forEach((control) => control.addEventListener('change', renderOrders));
  searchInput.addEventListener('input', renderOrders);
  document.getElementById('reset-filters').addEventListener('click', () => {
    statusFilter.value = 'all'; dateFrom.value = ''; dateTo.value = '';
    locationFilter.value = 'all'; searchInput.value = ''; activeTab = 'all';
    document.querySelectorAll('.order-tab').forEach((tab) => {
      const selected = tab.dataset.tab === 'all';
      tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', String(selected));
    });
    renderOrders();
  });

  tbody.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-action-toggle]');
    const next = event.target.closest('[data-next-status]');
    const cancel = event.target.closest('[data-cancel-order]');
    if (toggle) {
      const menu = tbody.querySelector(`[data-action-menu="${toggle.dataset.actionToggle}"]`);
      const willOpen = menu.hidden;
      tbody.querySelectorAll('.order-action-menu').forEach((item) => { item.hidden = true; });
      tbody.querySelectorAll('[data-action-toggle]').forEach((item) => item.setAttribute('aria-expanded', 'false'));
      menu.hidden = !willOpen; toggle.setAttribute('aria-expanded', String(willOpen)); return;
    }
    if (!next && !cancel) return;
    const code = next ? next.dataset.nextStatus : cancel.dataset.cancelOrder;
    const order = orders.find((item) => item.code === code);
    if (!order) return;
    if (next && order.status === 'pending') { order.status = 'confirmed'; store.updateStatus(code, order.status); showToast(`Đơn ${code} đã được xác nhận.`); }
    else if (next && order.status === 'confirmed') { order.status = 'delivered'; store.updateStatus(code, order.status); showToast(`Đơn ${code} đã được giao thành công.`); }
    else if (cancel && ['pending', 'confirmed'].includes(order.status)) { order.status = 'cancelled'; store.updateStatus(code, order.status); showToast(`Đơn ${code} đã được huỷ.`); }
    render();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.order-action-wrap')) return;
    tbody.querySelectorAll('.order-action-menu').forEach((menu) => { menu.hidden = true; });
    tbody.querySelectorAll('[data-action-toggle]').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  });

  function openModal() { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); form.elements.customer.focus(); }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); form.reset(); }
  document.getElementById('open-order-modal').addEventListener('click', openModal);
  document.getElementById('close-order-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-order-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const code = store.nextCode();
    store.addOrder({
      code,
      customer: String(data.get('customer')).trim(),
      customerId: '',
      date: new Date().toISOString().slice(0, 10),
      address: String(data.get('address')).trim(),
      location: data.get('location'),
      total: Number(data.get('total')),
      status: 'pending',
      payment: 'Tiền mặt khi nhận hàng (COD)',
      note: '',
      channel: 'Tạo đơn tại quầy',
      items: []
    });
    orders = store.getOrders();
    dateFrom.value = ''; dateTo.value = ''; statusFilter.value = 'all'; locationFilter.value = 'all'; searchInput.value = ''; activeTab = 'all';
    document.querySelectorAll('.order-tab').forEach((tab) => {
      const selected = tab.dataset.tab === 'all'; tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', String(selected));
    });
    closeModal(); render(); showToast('Đơn hàng mới đã được tạo và đang chờ xác nhận.');
  });

  document.getElementById('export-orders').addEventListener('click', () => {
    const headers = ['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Địa điểm giao', 'Tổng tiền', 'Tình trạng'];
    const rows = getFilteredOrders().map((order) => [order.code, order.customer, formatDate(order.date), order.address, order.total, labels[order.status]]);
    const csv = '\uFEFF' + [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url;
    link.download = `danh_sach_don_hang_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click(); URL.revokeObjectURL(url); showToast(`Đã xuất ${rows.length} đơn hàng ra file CSV.`);
  });

  const loggedInUser = sessionStorage.getItem('hd_admin_user');
  if (loggedInUser) document.getElementById('sidebar-user-name').textContent = loggedInUser;
  document.getElementById('current-date-text').textContent = `Hôm nay, ${new Intl.DateTimeFormat('vi-VN').format(new Date())}`;

  const searchParam = new URLSearchParams(window.location.search).get('q');
  if (searchParam) searchInput.value = searchParam;

  render();

  // Khi quay lại từ trang A11 bằng nút Back, đồng bộ lại trạng thái mới nhất.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    orders = store.getOrders();
    render();
  });
});