/* ==========================================================================
   A12: THỐNG KÊ KHÁCH HÀNG MUA NHIỀU NHẤT - LOGIC TRANG
   Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
   Lưu ý: Không thay đổi assets/css/style.css hay admin.js của các trang khác.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. DỮ LIỆU MẪU (ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG)
     ------------------------------------------------------------------------ */
  const TOTAL_ACCOUNTS = 8;

  const DEFAULT_RANGE = {
    from: '2026-10-01',
    to: '2026-10-10'
  };

  /* Dùng chung kho đơn hàng với A10/A11 để trạng thái đơn luôn đồng bộ. */
  const store = window.HDOrderStore || null;
  const RANGE_KEY = 'hd_admin_customer_range';
  const EXPANDED_KEY = 'hd_admin_customer_expanded';

  /* ------------------------------------------------------------------------
     0. KHÔI PHỤC DỮ LIỆU MẪU KHI TẢI LẠI TRANG
     ------------------------------------------------------------------------
     - Bấm F5/refresh (hoặc mở thẳng trang): xoá mọi thay đổi đã lưu để
       bảng xếp hạng, bộ lọc và các thẻ đang mở trở về đúng ảnh thiết kế.
     - Đi từ A10/A11 sang: giữ nguyên trạng thái trong phiên làm việc để các
       trang quản trị luôn khớp nhau.
     ------------------------------------------------------------------------ */
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

  if (store && shouldResetDemoData) {
    if (typeof store.resetOrders === 'function') store.resetOrders();
    if (typeof store.removeState === 'function') {
      store.removeState(RANGE_KEY);
      store.removeState(EXPANDED_KEY);
    }
  }

  const CUSTOMERS = [
    {
      id: 'KH003',
      name: 'Lê Thị Cẩm Tú',
      shortName: 'Cẩm Tú',
      initials: 'LT',
      avatarClass: 'av-amber',
      email: 'camtu@email.com',
      phone: '0923 456 789',
      city: 'Đà Nẵng',
      orders: [
        {
          code: 'DH1003',
          date: '2026-10-02',
          status: 'delivered',
          total: 686000,
          products: [
            { name: 'Cặp sách bánh xe kéo đa năng công thái học', code: 'SP24' },
            { name: 'Bộ bút chì màu cao cấp 24 màu', code: 'SP33' },
            { name: 'Máy tính Casio FX-580VN X', code: 'SP23' }
          ]
        },
        {
          code: 'DH1009',
          date: '2026-10-10',
          status: 'delivered',
          total: 337000,
          products: [
            { name: 'Bộ màu nước 12 màu nén kèm cọ vẽ', code: 'SP34' },
            { name: 'Bộ thước kẻ compa học sinh', code: 'SP18' }
          ]
        }
      ]
    },
    {
      id: 'KH001',
      name: 'Nguyễn Minh Anh',
      shortName: 'Minh Anh',
      initials: 'NA',
      avatarClass: 'av-blue',
      email: 'minhanh@email.com',
      phone: '0901 234 567',
      city: 'TP. Hồ Chí Minh',
      orders: [
        {
          code: 'DH1001',
          date: '2026-10-02',
          status: 'delivered',
          total: 479000,
          products: [
            { name: 'Hộp bút chì màu 36 màu', code: 'SP10' },
            { name: 'Bộ sách tham khảo lớp 10', code: 'SP02' }
          ]
        },
        {
          code: 'DH1004',
          date: '2026-10-05',
          status: 'delivered',
          total: 304000,
          products: [
            { name: 'Vở ô ly nâng cao 200 trang', code: 'SP08' },
            { name: 'Bộ bút bi Thiên Long', code: 'SP04' }
          ]
        },
        {
          code: 'DH1010',
          date: '2026-10-10',
          status: 'delivered',
          total: 199000,
          products: [
            { name: 'Bộ sách bài tập bổ trợ', code: 'SP11' }
          ]
        }
      ]
    },
    {
      id: 'KH002',
      name: 'Trần Quốc Bảo',
      shortName: 'Quốc Bảo',
      initials: 'QB',
      avatarClass: 'av-olive',
      email: 'quocbao@email.com',
      phone: '0912 345 678',
      city: 'Hà Nội',
      orders: [
        {
          code: 'DH1002',
          date: '2026-10-03',
          status: 'delivered',
          total: 529000,
          products: [
            { name: 'Cặp sách chống gù lưng', code: 'SP21' },
            { name: 'Hộp bút đa năng', code: 'SP09' }
          ]
        },
        {
          code: 'DH1007',
          date: '2026-10-08',
          status: 'delivered',
          total: 261000,
          products: [
            { name: 'Bộ thước kẻ học sinh', code: 'SP12' },
            { name: 'Bút chì 2B', code: 'SP05' }
          ]
        }
      ]
    },
    {
      id: 'KH004',
      name: 'Võ Ngọc Hân',
      shortName: 'Ngọc Hân',
      initials: 'NH',
      avatarClass: 'av-rose',
      email: 'ngochan@email.com',
      phone: '0934 567 890',
      city: 'Đà Nẵng',
      orders: [
        {
          code: 'DH1005',
          date: '2026-10-06',
          status: 'delivered',
          total: 337000,
          products: [
            { name: 'Sách tham khảo nâng cao', code: 'SP02' },
            { name: 'Vở kẻ ngang 200 trang', code: 'SP08' }
          ]
        }
      ]
    },
    {
      id: 'KH006',
      name: 'Bùi Thu Trang',
      shortName: 'Thu Trang',
      initials: 'TT',
      avatarClass: 'av-teal',
      email: 'thutrang@email.com',
      phone: '0956 789 012',
      city: 'Cần Thơ',
      orders: [
        {
          code: 'DH1006',
          date: '2026-10-07',
          status: 'delivered',
          total: 263000,
          products: [
            { name: 'Bộ bút lông màu', code: 'SP15' },
            { name: 'Giấy vẽ A4', code: 'SP16' }
          ]
        }
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     2. TRẠNG THÁI TRANG & THAM CHIẾU DOM
     ------------------------------------------------------------------------ */
  const isValidIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));

  /* Trang tĩnh: mỗi lần tải lại đều bắt đầu từ khoảng ngày mặc định của thiết kế. */
  const state = {
    from: DEFAULT_RANGE.from,
    to: DEFAULT_RANGE.to,
    expanded: new Set()
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const dateFromInput = $('#date-from');
  const dateToInput = $('#date-to');

  if (dateFromInput && state.from) dateFromInput.value = state.from;
  if (dateToInput && state.to) dateToInput.value = state.to;

  const applyFilterBtn = $('#apply-filter');
  const exportExcelBtn = $('#export-excel');
  const openDataModalBtn = $('#open-data-modal');
  const customerList = $('#customer-list');

  const rangeText = $('#range-text');
  const filterState = $('#filter-state');
  const rankingCount = $('#ranking-count');

  const statRevenue = $('#stat-revenue');
  const statOrders = $('#stat-orders');
  const statCustomers = $('#stat-customers');
  const statTotalCustomers = $('#stat-total-customers');
  const statTopName = $('#stat-top-name');
  const statTopSpend = $('#stat-top-spend');
  const statTopOrders = $('#stat-top-orders');
  const statTopLocation = $('#stat-top-location');

  const dataModal = $('#data-modal');
  const closeDataModalBtn = $('#close-data-modal');
  const cancelDataModalBtn = $('#cancel-data-modal');
  const modalExportExcelBtn = $('#modal-export-excel');
  const modalRangeText = $('#modal-range-text');
  const modalRevenue = $('#modal-revenue');
  const modalOrders = $('#modal-orders');
  const modalCustomers = $('#modal-customers');

  const toast = $('#cs-toast');
  let toastTimer = null;
  let lastFocusedElement = null;

  /* ------------------------------------------------------------------------
     3. TIỆN ÍCH ĐỊNH DẠNG
     ------------------------------------------------------------------------ */
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const formatCurrency = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  const formatDateVN = (isoDate) => {
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const toTimestamp = (isoDate) => {
    const parts = String(isoDate).split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return NaN;
    return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* Lưu trạng thái bộ lọc / thẻ đang mở để reload giữ nguyên thay đổi. */
  function readSaved(key, fallback) {
    try {
      if (store && typeof store.readState === 'function') {
        return store.readState(key, fallback);
      }
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeSaved(key, value) {
    try {
      if (store && typeof store.writeState === 'function') {
        store.writeState(key, value);
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Trình duyệt chặn localStorage: bỏ qua, trang vẫn chạy bình thường. */
    }
  }

  /* ------------------------------------------------------------------------
     4. LỌC & TÍNH TOÁN DỮ LIỆU
     ------------------------------------------------------------------------ */
  function isInRange(isoDate) {
    const timestamp = toTimestamp(isoDate);
    if (Number.isNaN(timestamp)) return false;
    return timestamp >= toTimestamp(state.from) && timestamp <= toTimestamp(state.to);
  }

  function statusOverrides() {
    if (!store || typeof store.getStatusOverrides !== 'function') return {};
    return store.getStatusOverrides();
  }

  /* Đơn do A10 tạo tại quầy (hoặc đơn chưa có trong dữ liệu thống kê) thuộc
     khách hàng đang xét và đã ở trạng thái giao thành công. */
  function liveOrdersFor(customer, knownCodes) {
    if (!store || typeof store.getOrders !== 'function') return [];
    return store.getOrders()
      .filter((order) => !knownCodes.has(order.code) && order.status === 'delivered')
      .filter((order) => order.customerId === customer.id || order.customer === customer.name)
      .map((order) => ({
        code: order.code,
        date: order.date,
        status: order.status,
        total: Number(order.total) || 0,
        products: Array.isArray(order.items) && order.items.length
          ? order.items.map((item) => ({ name: item.name, code: item.code }))
          : [{ name: 'Đơn hàng tổng hợp tại quầy', code: 'SP00' }]
      }));
  }

  function buildRanking() {
    const overrides = statusOverrides();
    const knownCodes = new Set(CUSTOMERS.flatMap((customer) => customer.orders.map((order) => order.code)));

    return CUSTOMERS
      .map((customer) => {
        /* Trạng thái mới nhất do A10/A11 cập nhật được ưu tiên áp dụng. */
        const seeded = customer.orders.map((order) => ({
          ...order,
          status: overrides[order.code] || order.status
        }));

        const orders = [...seeded, ...liveOrdersFor(customer, knownCodes)]
          .filter((order) => order.status === 'delivered' && isInRange(order.date))
          .sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date));

        const total = orders.reduce((sum, order) => sum + order.total, 0);

        return {
          ...customer,
          visibleOrders: orders,
          total,
          orderCount: orders.length
        };
      })
      .filter((customer) => customer.orderCount > 0)
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        if (b.orderCount !== a.orderCount) return b.orderCount - a.orderCount;
        return a.name.localeCompare(b.name, 'vi');
      });
  }

  function buildReport() {
    const ranking = buildRanking();
    const allOrders = ranking.flatMap((customer) => customer.visibleOrders);

    return {
      ranking,
      revenue: allOrders.reduce((sum, order) => sum + order.total, 0),
      orderCount: allOrders.length,
      customerCount: ranking.length,
      top: ranking[0] || null,
      visibleRanking: ranking.slice(0, 5)
    };
  }

  /* ------------------------------------------------------------------------
     5. RENDER THẺ KHÁCH HÀNG
     ------------------------------------------------------------------------ */
  function renderProductList(products) {
    return products.map((product) => `
      <span class="cs-product-item">
        ${escapeHTML(product.name)}<span class="cs-product-code">(${escapeHTML(product.code)})</span>
      </span>
    `).join('');
  }

  function renderOrderRows(orders) {
    return orders.map((order) => `
      <tr>
        <td>
          <a class="cs-order-code" href="../A11 chi tiết đơn hàng/index.html?order=${encodeURIComponent(order.code)}" title="Xem chi tiết đơn ${escapeHTML(order.code)}">
            ${escapeHTML(order.code)}
          </a>
        </td>
        <td class="cs-order-date">${formatDateVN(order.date)}</td>
        <td><div class="cs-product-list">${renderProductList(order.products)}</div></td>
        <td class="cs-order-total">${formatCurrency(order.total)}</td>
        <td>
          <a class="cs-detail-link" href="../A11 chi tiết đơn hàng/index.html?order=${encodeURIComponent(order.code)}">
            Chi tiết
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4"></path></svg>
          </a>
        </td>
      </tr>
    `).join('');
  }

  function renderCustomerCard(customer, rank, totalAccounts) {
    const isExpanded = state.expanded.has(customer.id);
    const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-plain';
    const tier = rank === 1 ? 'Kim Cương' : rank === 2 ? 'Vàng' : rank === 3 ? 'Bạc' : '';
    const detailsId = `orders-${customer.id}`;
    const orderBreakdown = customer.visibleOrders
      .map((order) => `${order.code}: ${formatCurrency(order.total)}`)
      .join(', ');

    return `
      <article class="cs-customer-card ${isExpanded ? 'is-expanded' : ''}" data-customer-id="${escapeHTML(customer.id)}">
        <div class="cs-customer-head">
          <div class="cs-rank-col">
            <span class="cs-rank-badge ${rankClass}" aria-label="Hạng ${rank}">#${rank}</span>
          </div>

          <div class="cs-customer-info">
            <div class="cs-name-row">
              <h3 class="cs-customer-name">${escapeHTML(customer.name)}</h3>
              ${tier ? `<span class="cs-tier-pill ${rankClass}">Hạng ${rank} · ${tier}</span>` : ''}
              <span class="cs-code-pill">Mã KH: ${escapeHTML(customer.id)}</span>
            </div>
            <div class="cs-customer-meta">
              <a class="meta-email" href="mailto:${escapeHTML(customer.email)}">
                <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.2"></rect><path d="m3 5 5 3.8L13 5"></path></svg>
                ${escapeHTML(customer.email)}
              </a>
              <span class="cs-meta-dot" aria-hidden="true"></span>
              <span class="meta-city">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 6.5c0 3.5-5 8-5 8s-5-4.5-5-8a5 5 0 1 1 10 0Z"></path><circle cx="8" cy="6.5" r="1.6"></circle></svg>
                ${escapeHTML(customer.city)}
              </span>
            </div>
            <p class="cs-purchase-line">
              <strong>${customer.orderCount} đơn</strong>
              <span>[${escapeHTML(orderBreakdown)}]</span>
            </p>
          </div>

          <div class="cs-customer-total">
            <span>TỔNG TIỀN MUA</span>
            <strong>${formatCurrency(customer.total)}</strong>
          </div>

          <button class="cs-expand-btn" type="button" data-toggle-customer="${escapeHTML(customer.id)}"
            aria-expanded="${isExpanded}" aria-controls="${detailsId}">
            <span>${isExpanded ? 'Thu gọn' : `Xem ${customer.orderCount} đơn`}</span>
            <span class="cs-chevron" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m3 6 5 5 5-5"></path></svg></span>
          </button>
        </div>

        <div class="cs-order-details" id="${detailsId}" ${isExpanded ? '' : 'hidden'}>
          <div class="cs-table-wrap">
            <table class="cs-order-table">
              <thead>
                <tr>
                  <th scope="col">Mã đơn</th>
                  <th scope="col">Ngày đặt</th>
                  <th scope="col">Danh sách mặt hàng</th>
                  <th scope="col">Tổng tiền đơn</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${renderOrderRows(customer.visibleOrders)}
              </tbody>
            </table>
          </div>

          <div class="cs-card-foot">
            <span class="cs-foot-left">Trong thời: <strong>${customer.orderCount}/${customer.orderCount}</strong> đơn giao hoàn tất thành công</span>
            <span class="cs-foot-right">Tổng mua tích lũy: <strong class="is-orange">${formatCurrency(customer.total)}</strong></span>
          </div>
        </div>
      </article>
    `;
  }

  function renderEmptyState() {
    if (!customerList) return;
    customerList.innerHTML = `
      <div class="cs-empty">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path><path d="M8 11h6"></path></svg>
        <strong>Không có dữ liệu trong khoảng thời gian này</strong>
        <span>Vui lòng chọn lại khoảng ngày để xem bảng xếp hạng khách hàng.</span>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     6. RENDER TỔNG QUAN
     ------------------------------------------------------------------------ */
  function renderStats(report) {
    const { top } = report;

    if (statRevenue) statRevenue.textContent = formatCurrency(report.revenue);

    if (statOrders) {
      statOrders.innerHTML = `${report.orderCount} <small>đơn thành công</small>`;
    }

    if (statCustomers) statCustomers.textContent = report.customerCount;
    if (statTotalCustomers) statTotalCustomers.textContent = TOTAL_ACCOUNTS;

    if (top) {
      if (statTopName) statTopName.textContent = top.name;
      if (statTopSpend) statTopSpend.textContent = formatCurrency(top.total);
      if (statTopOrders) statTopOrders.textContent = `(${top.orderCount} đơn)`;
      if (statTopLocation) statTopLocation.textContent = `${top.shortName} · ${top.city}`;
    } else {
      if (statTopName) statTopName.textContent = 'Chưa có dữ liệu';
      if (statTopSpend) statTopSpend.textContent = '0đ';
      if (statTopOrders) statTopOrders.textContent = '(0 đơn)';
      if (statTopLocation) statTopLocation.textContent = 'Chưa phát sinh đơn hàng';
    }
  }

  function renderFilterMeta(report) {
    const rangeLabel = `${formatDateVN(state.from)} - ${formatDateVN(state.to)}`;
    const isDefault = state.from === DEFAULT_RANGE.from && state.to === DEFAULT_RANGE.to;

    if (rangeText) rangeText.textContent = rangeLabel;
    if (filterState) filterState.textContent = isDefault ? 'Mặc định tháng 10/2026' : 'Khoảng ngày tùy chỉnh';
    if (rankingCount) rankingCount.textContent = `Hiển thị ${report.visibleRanking.length} / ${TOTAL_ACCOUNTS} khách hàng`;

    if (modalRangeText) modalRangeText.textContent = rangeLabel;
    if (modalRevenue) modalRevenue.textContent = formatCurrency(report.revenue);
    if (modalOrders) modalOrders.textContent = report.orderCount;
    if (modalCustomers) modalCustomers.textContent = report.customerCount;
  }

  function renderAll() {
    const report = buildReport();

    if (customerList) {
      if (report.visibleRanking.length === 0) {
        renderEmptyState();
      } else {
        customerList.innerHTML = report.visibleRanking
          .map((customer, index) => renderCustomerCard(customer, index + 1, TOTAL_ACCOUNTS))
          .join('');
      }
    }

    renderStats(report);
    renderFilterMeta(report);
  }

  /* ------------------------------------------------------------------------
     7. TƯƠNG TÁC BỘ LỌC & THẺ
     ------------------------------------------------------------------------ */
  function applyFilter() {
    const from = dateFromInput ? dateFromInput.value : '';
    const to = dateToInput ? dateToInput.value : '';

    if (!from || !to) {
      showToast('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.');
      return;
    }

    if (toTimestamp(from) > toTimestamp(to)) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
      return;
    }

    state.from = from;
    state.to = to;

    // Sau khi lọc, mở sẵn chi tiết của 2 khách hàng đứng đầu.
    const report = buildReport();
    state.expanded = new Set(report.visibleRanking.slice(0, 2).map((customer) => customer.id));

    renderAll();
    showToast(`Đã áp dụng bộ lọc từ ${formatDateVN(from)} đến ${formatDateVN(to)}.`);
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', applyFilter);
  }

  [dateFromInput, dateToInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') applyFilter();
    });
  });

  if (customerList) {
    customerList.addEventListener('click', (event) => {
      const toggleButton = event.target.closest('[data-toggle-customer]');
      if (!toggleButton) return;

      const customerId = toggleButton.getAttribute('data-toggle-customer');
      const card = toggleButton.closest('.cs-customer-card');
      const details = card ? card.querySelector('.cs-order-details') : null;
      if (!customerId || !card || !details) return;

      const willExpand = !state.expanded.has(customerId);

      if (willExpand) {
        state.expanded.add(customerId);
      } else {
        state.expanded.delete(customerId);
      }

      card.classList.toggle('is-expanded', willExpand);
      details.hidden = !willExpand;
      toggleButton.setAttribute('aria-expanded', String(willExpand));
      const label = toggleButton.querySelector('span');
      const orderCount = details.querySelectorAll('.cs-order-table tbody tr').length;
      if (label) label.textContent = willExpand ? 'Thu gọn' : `Xem ${orderCount} đơn`;
    });
  }

  /* ------------------------------------------------------------------------
     8. XUẤT FILE EXCEL (CSV UTF-8 CÓ BOM)
     ------------------------------------------------------------------------ */
  function exportReport() {
    const report = buildReport();

    if (report.visibleRanking.length === 0) {
      showToast('Không có dữ liệu để xuất trong khoảng thời gian đã chọn.');
      return;
    }

    const headers = [
      'MÃ KHÁCH HÀNG',
      'HỌ TÊN',
      'EMAIL',
      'SỐ ĐIỆN THOẠI',
      'THÀNH PHỐ',
      'HẠNG',
      'TỔNG CHI TIÊU',
      'SỐ ĐƠN',
      'MÃ ĐƠN',
      'NGÀY ĐẶT',
      'DANH SÁCH MẶT HÀNG',
      'TỔNG TIỀN ĐƠN'
    ];

    const rows = [];
    report.visibleRanking.forEach((customer, index) => {
      customer.visibleOrders.forEach((order) => {
        const productText = order.products
          .map((product) => `${product.name} (${product.code})`)
          .join('; ');

        rows.push([
          customer.id,
          `"${customer.name}"`,
          customer.email,
          `"${customer.phone}"`,
          `"${customer.city}"`,
          index + 1,
          customer.total,
          customer.orderCount,
          order.code,
          formatDateVN(order.date),
          `"${productText}"`,
          order.total
        ]);
      });
    });

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `thong_ke_khach_hang_${state.from}_${state.to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Đã xuất file Excel thống kê khách hàng.');
    closeDataModal();
  }

  if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportReport);
  if (modalExportExcelBtn) modalExportExcelBtn.addEventListener('click', exportReport);

  /* ------------------------------------------------------------------------
     9. MODAL CHI TIẾT BÁO CÁO
     ------------------------------------------------------------------------ */
  function openDataModal() {
    if (!dataModal) return;

    lastFocusedElement = document.activeElement;
    renderAll();
    dataModal.classList.add('open');
    dataModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeDataModalBtn) closeDataModalBtn.focus();
  }

  function closeDataModal() {
    if (!dataModal) return;

    dataModal.classList.remove('open');
    dataModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (openDataModalBtn) openDataModalBtn.addEventListener('click', openDataModal);
  if (closeDataModalBtn) closeDataModalBtn.addEventListener('click', closeDataModal);
  if (cancelDataModalBtn) cancelDataModalBtn.addEventListener('click', closeDataModal);

  if (dataModal) {
    dataModal.addEventListener('click', (event) => {
      if (event.target === dataModal) closeDataModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dataModal && dataModal.classList.contains('open')) {
      closeDataModal();
    }
  });

  /* ------------------------------------------------------------------------
     10. KHỞI TẠO CHUNG CỦA KHUNG QUẢN TRỊ
     ------------------------------------------------------------------------ */
  const loggedInUser = (() => {
    try { return sessionStorage.getItem('hd_admin_user'); } catch (error) { return null; }
  })();

  const sidebarUserName = $('#sidebar-user-name');
  if (loggedInUser && sidebarUserName) sidebarUserName.textContent = loggedInUser;

  // Mở sẵn chi tiết 2 khách hàng đứng đầu giống bản thiết kế.
  const initialReport = buildReport();
  const customerParam = new URLSearchParams(window.location.search).get('customer');
  const highlightedCustomer = initialReport.visibleRanking.find((customer) => customer.id === customerParam);

  const isReload = navigationType() === 'reload';

  /* Đi từ A10/A11 sang bằng link ?customer=... thì mở thẻ của khách hàng đó.
     Khi người dùng tải lại trang (F5), luôn trở về 2 thẻ mở sẵn mặc định. */
  if (highlightedCustomer && !isReload) {
    state.expanded = new Set([highlightedCustomer.id]);
  } else {
    state.expanded = new Set(initialReport.visibleRanking.slice(0, 2).map((customer) => customer.id));
  }

  renderAll();

  if (highlightedCustomer && !isReload && customerList) {
    const card = customerList.querySelector(`[data-customer-id="${highlightedCustomer.id}"]`);
    if (card) {
      card.classList.add('is-highlighted');
      window.setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
      window.setTimeout(() => card.classList.remove('is-highlighted'), 3200);
    }
  }

  /* Quay lại trang từ A10/A11 (nút Back) thì vẽ lại theo dữ liệu mới nhất. */
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    renderAll();
  });

  /* Đồng bộ khi đơn hàng được cập nhật từ tab khác (A10/A11), đồng thời giữ
     bộ lọc và các thẻ đang mở khớp với thay đổi ở tab khác. */
  window.addEventListener('storage', (event) => {
    if (event.key && !['hd_admin_order_status', 'hd_admin_custom_orders', 'hd_admin_order_audit'].includes(event.key)) return;
    renderAll();
  });
});
