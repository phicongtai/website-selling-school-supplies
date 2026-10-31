/* ==========================================================================
   A11: CHI TIẾT ĐƠN HÀNG - LOGIC TRANG & LUỒNG TRẠNG THÁI
   Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
   --------------------------------------------------------------------------
   - Đọc mã đơn từ URL (?order=DH1003) do A10 / A12 truyền sang.
   - Dùng chung kho dữ liệu ../shared/order-store.js với A10.
   - Cập nhật trạng thái sẽ được lưu lại và đồng bộ khi quay về A10.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. DỮ LIỆU ĐƠN HÀNG & TỪ ĐIỂN TRẠNG THÁI
     ------------------------------------------------------------------------ */
  const store = window.HDOrderStore;

  /* ------------------------------------------------------------------------
     0. KHÔI PHỤC DỮ LIỆU MẪU KHI TẢI LẠI TRANG
     ------------------------------------------------------------------------
     - Bấm F5/refresh: xoá các thay đổi trạng thái đã lưu để tiến trình xử lý
       và nhật ký trở về đúng như thiết kế.
     - Đi từ A10 (hoặc A12) sang: giữ nguyên trạng thái vừa cập nhật để các
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

  if (store && typeof store.resetOrders === 'function'
    && (navigationType() === 'reload' || !openedFromOrderPages())) {
    store.resetOrders();
  }

  const params = new URLSearchParams(window.location.search);
  const requestedCode = params.get('order');
  let order = store.getOrder(requestedCode) || store.getOrder('DH1003') || store.getOrders()[0];

  const STATUS = {
    pending: {
      label: 'Chưa xác nhận',
      badge: 'pending',
      dot: ''
    },
    confirmed: {
      label: 'Đã xác nhận',
      badge: 'confirmed',
      dot: 'is-blue'
    },
    delivered: {
      label: 'Đã giao – Thành công',
      badge: 'delivered',
      dot: 'is-green'
    },
    cancelled: {
      label: 'Đã huỷ',
      badge: 'cancelled',
      dot: 'is-red'
    }
  };

  /* Biểu tượng nhỏ trong badge trạng thái (giống thiết kế). */
  const STATUS_ICONS = {
    pending: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4"/><path d="M6 3.5v2.8l1.8 1.1"/></svg>',
    confirmed: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4"/><path d="M6 3.5v2.8l1.8 1.1"/></svg>',
    delivered: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4"/><path d="m3.9 6.2 1.5 1.5 2.8-3"/></svg>',
    cancelled: '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.4"/><path d="m4.3 4.3 3.4 3.4m0-3.4L4.3 7.7"/></svg>'
  };

  /* Luồng trạng thái một chiều: Chưa xác nhận → Đã xác nhận → Đã giao / Huỷ */
  const TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
  };

  const NEXT_OPTION_LABEL = {
    confirmed: 'Xác nhận đơn hàng',
    delivered: 'Đã giao – Thành công',
    cancelled: 'Huỷ đơn hàng'
  };

  const STEP_TITLES = [
    'Bước 1: Chưa xác nhận',
    'Bước 2: Đã xác nhận',
    'Bước 3: Đã giao – Thành công'
  ];

  const STEP_STATE = {
    pending: ['is-current', 'is-upcoming', 'is-upcoming'],
    confirmed: ['is-done', 'is-current', 'is-upcoming'],
    delivered: ['is-done', 'is-done', 'is-current'],
    cancelled: ['is-done', 'is-cancelled', 'is-upcoming']
  };

  const LOCK_NOTE = {
    pending: 'Đơn hàng đang chờ xác nhận — Vui lòng xác nhận để mở bước tiếp theo.',
    confirmed: 'Bước "Chưa xác nhận" đã khoá — Không thể quay lại trạng thái trước theo quy trình hệ thống.',
    delivered: 'Đơn hàng đã giao thành công — Không thể thay đổi trạng thái.',
    cancelled: 'Đơn hàng đã huỷ — Không thể khôi phục trạng thái trước.'
  };

  const AVATAR_PALETTE = {
    KH001: ['#dbeaff', '#003c64'],
    KH002: ['#e8ecd9', '#3d4a1f'],
    KH003: ['#ffdbcc', '#351000'],
    KH004: ['#ffdbe4', '#6b1534'],
    KH005: ['#dbeaff', '#003c64'],
    KH006: ['#d3f1ee', '#0d4b46']
  };

  /* ------------------------------------------------------------------------
     2. THAM CHIẾU DOM
     ------------------------------------------------------------------------ */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const statusBadge = $('[data-status-badge]');
  const statusTextNodes = $$('[data-status-text]');
  const steps = $$('#progress-steps .od-step');
  const nextSelect = $('#next-status');
  const confirmTransition = $('#confirm-transition');
  const lockNoteText = $('#lock-note-text');
  const auditList = $('#audit-list');

  const openStatusModalBtn = $('#open-status-modal');
  const statusModal = $('#status-modal');
  const closeStatusModalBtn = $('#close-status-modal');
  const cancelStatusModalBtn = $('#cancel-status-modal');
  const statusForm = $('#status-form');
  const modalSelect = $('#modal-status-select');
  const statusNote = $('#status-note');

  const toast = $('#od-toast');
  let toastTimer;
  let lastFocusedElement = null;

  /* ------------------------------------------------------------------------
     3. TIỆN ÍCH
     ------------------------------------------------------------------------ */
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  const formatMoney = (value) => store.formatMoney(value);

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function allowedNextStatuses() {
    return TRANSITIONS[order.status] || [];
  }

  function canTransition(nextStatus) {
    return allowedNextStatuses().includes(nextStatus);
  }

  function getOrderItems() {
    if (Array.isArray(order.items) && order.items.length) return order.items;
    return [{
      code: 'SP00',
      name: 'Đơn hàng tổng hợp tại quầy',
      category: 'Đơn tạo tại quầy',
      price: order.total,
      quantity: 1,
      image: ''
    }];
  }

  function timeAfter(createdAt, minutes) {
    const match = String(createdAt || '').match(/(\d{2})\/(\d{2})\/(\d{4})\s*·\s*(\d{2}):(\d{2})/);
    if (!match) return createdAt;
    const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), Number(match[4]), Number(match[5]));
    date.setMinutes(date.getMinutes() + minutes);
    const pad = (value) => String(value).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function initialsOf(name) {
    return String(name || 'KH')
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  function createdLabel() {
    return order.createdAt || `${store.formatDateVN(order.date)} · ${order.createdTime || '00:00'}`;
  }

  /* ------------------------------------------------------------------------
     4. TIÊU ĐỀ & THÔNG TIN CHUNG CỦA ĐƠN
     ------------------------------------------------------------------------ */
  function renderHeader() {
    const customer = store.getCustomer(order.customerId);

    $('#od-code-title').textContent = `#${order.code}`;
    $('#od-breadcrumb-code').textContent = `Chi tiết đơn hàng #${order.code}`;
    $('#od-modal-code').textContent = `#${order.code}`;
    document.title = `Chi tiết đơn hàng #${order.code} - Học Đường Store Admin`;

    const meta = $('#od-meta');
    if (meta) {
      meta.textContent = `Ngày tạo: ${createdLabel()} · Kênh đặt hàng: ${order.channel || 'Storefront Học Sinh'}`;
    }

    const codePill = $('#od-customer-code');
    if (codePill) codePill.textContent = customer ? `Mã ${customer.id}` : 'Khách lẻ';

    const avatar = $('#od-customer-avatar');
    if (avatar) {
      avatar.textContent = customer ? customer.initials : initialsOf(order.customer);
      const colors = (customer && AVATAR_PALETTE[customer.id]) || ['#ffdbcc', '#351000'];
      avatar.style.background = colors[0];
      avatar.style.color = colors[1];
    }

    const name = $('#od-customer-name');
    if (name) name.textContent = order.customer;

    const sub = $('#od-customer-sub');
    if (sub) {
      const alias = String(order.email || '').split('@')[0] || 'khachhang';
      sub.textContent = `${alias} · ${customer ? customer.membership : 'Khách lẻ'}`;
    }

    const email = $('#od-customer-email');
    if (email) email.textContent = order.email || 'Chưa cập nhật';

    const phone = $('#od-customer-phone');
    if (phone) phone.textContent = order.phone || 'Chưa cập nhật';

    const account = $('#od-customer-account');
    if (account) {
      account.innerHTML = `<i aria-hidden="true"></i>${escapeHTML(customer ? customer.accountType : 'Khách lẻ - Hoạt động')}`;
    }

    const customerLink = $('#od-customer-link');
    if (customerLink) {
      customerLink.href = customer
        ? `../A12 thống kê khách hàng/index.html?customer=${encodeURIComponent(customer.id)}`
        : '../A12 thống kê khách hàng/index.html';
    }

    const recipientName = $('#od-recipient-name');
    if (recipientName) recipientName.textContent = order.customer;

    const recipientPhone = $('#od-recipient-phone');
    if (recipientPhone) recipientPhone.textContent = order.phone || 'Chưa cập nhật';

    const address = $('#od-address');
    if (address) address.textContent = order.address;

    const payment = $('#od-payment');
    if (payment) payment.textContent = order.payment || 'Tiền mặt khi nhận hàng (COD)';

    const note = $('#od-note');
    if (note) {
      note.textContent = order.note
        ? `"${order.note}"`
        : 'Không có ghi chú giao hàng.';
    }
  }

  /* ------------------------------------------------------------------------
     5. DANH SÁCH SẢN PHẨM & TỔNG TIỀN
     ------------------------------------------------------------------------ */
  function productImage(item) {
    if (item.image) {
      return `<img class="od-product-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">`;
    }
    return `<span class="od-product-img od-product-img-empty" aria-hidden="true">${escapeHTML(item.code || 'SP')}</span>`;
  }

  function renderProducts() {
    const items = getOrderItems();
    const body = $('#od-products-body');
    const countPill = $('#od-item-count');

    if (body) {
      body.innerHTML = items.map((item) => `
        <tr>
          <td>
            <div class="od-product">
              ${productImage(item)}
              <div class="od-product-info">
                <span class="od-product-name">${escapeHTML(item.name)}</span>
                <div class="od-product-meta">
                  <span class="od-code">Mã: ${escapeHTML(item.code)}</span>
                  <span>${escapeHTML(item.category || 'Đồ dùng học tập')}</span>
                </div>
              </div>
            </div>
          </td>
          <td class="od-price">${formatMoney(item.price)}</td>
          <td class="od-qty">${Number(item.quantity) || 1}</td>
        </tr>
      `).join('');
    }

    if (countPill) countPill.textContent = `${items.length} mặt hàng`;

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * (Number(item.quantity) || 1), 0);
    const subtotalNode = $('#od-subtotal');
    if (subtotalNode) subtotalNode.textContent = formatMoney(subtotal);

    const totalNode = $('#od-total');
    if (totalNode) totalNode.textContent = formatMoney(order.total);

    const discountNode = $('#od-discount');
    if (discountNode) discountNode.textContent = '0đ';
  }

  /* ------------------------------------------------------------------------
     6. HIỂN THỊ TRẠNG THÁI
     ------------------------------------------------------------------------ */
  function renderBadge() {
    const meta = STATUS[order.status] || STATUS.pending;
    statusTextNodes.forEach((node) => { node.textContent = meta.label; });

    if (statusBadge) {
      statusBadge.classList.remove('pending', 'confirmed', 'delivered', 'cancelled');
      statusBadge.classList.add(meta.badge);

      const icon = $('[data-status-icon]', statusBadge);
      if (icon) icon.innerHTML = STATUS_ICONS[order.status] || '';
    }
  }

  function stepNotesFor(status) {
    const completedAt = `Hoàn tất lúc ${order.createdTime || '14:20'} · Tự động khoá`;
    const notes = {
      pending: [
        'Đang chờ quản trị viên xác nhận',
        'Sẽ mở sau khi đơn được xác nhận',
        'Chờ đơn vị vận chuyển phản hồi'
      ],
      confirmed: [
        completedAt,
        'Sẵn sàng đóng gói & xuất kho',
        'Chờ đơn vị vận chuyển phản hồi'
      ],
      delivered: [
        completedAt,
        'Đã xác nhận · Hoàn tất',
        'Đã giao thành công'
      ],
      cancelled: [
        completedAt,
        'Đơn hàng đã bị huỷ',
        'Không thực hiện'
      ]
    };
    return notes[status] || notes.pending;
  }

  function renderSteps() {
    const states = STEP_STATE[order.status] || STEP_STATE.pending;
    const notes = stepNotesFor(order.status);

    steps.forEach((step, index) => {
      step.classList.remove('is-done', 'is-current', 'is-upcoming', 'is-cancelled');
      step.classList.add(states[index]);

      const title = $('.od-step-title', step);
      const note = $('.od-step-note', step);

      if (title) {
        let titleText = STEP_TITLES[index];
        if (order.status === 'cancelled' && index === 1) titleText = 'Bước 2: Đã huỷ';
        title.textContent = titleText;

        if (states[index] === 'is-current') {
          const tag = document.createElement('em');
          tag.className = 'od-current-tag';
          tag.textContent = '(Hiện tại)';
          title.appendChild(tag);
        }
      }

      if (note) note.textContent = notes[index];
    });
  }

  function buildOptions(statuses) {
    return statuses.map((status) => {
      const label = NEXT_OPTION_LABEL[status] || STATUS[status].label;
      return `<option value="${status}">${escapeHTML(label)}</option>`;
    }).join('');
  }

  function renderTransitionControls() {
    const statuses = allowedNextStatuses();

    if (nextSelect) {
      nextSelect.innerHTML = statuses.length
        ? buildOptions(statuses)
        : `<option value="">${order.status === 'cancelled' ? 'Đơn hàng đã huỷ' : 'Đơn hàng đã hoàn tất'}</option>`;
      nextSelect.disabled = statuses.length === 0;
    }

    if (modalSelect) {
      modalSelect.innerHTML = nextSelect && statuses.length
        ? nextSelect.innerHTML
        : buildOptions(statuses);
      modalSelect.disabled = statuses.length === 0;
    }

    if (confirmTransition) confirmTransition.disabled = statuses.length === 0;
    if (openStatusModalBtn) openStatusModalBtn.disabled = statuses.length === 0;
    if (lockNoteText) lockNoteText.textContent = LOCK_NOTE[order.status] || LOCK_NOTE.pending;
  }

  function renderAll() {
    renderBadge();
    renderSteps();
    renderTransitionControls();
  }

  /* ------------------------------------------------------------------------
     7. NHẬT KÝ XỬ LÝ (AUDIT LOG)
     ------------------------------------------------------------------------ */
  function auditMarkup(time, status, note, isSystem) {
    const meta = STATUS[status] || STATUS.pending;
    const noteMarkup = note
      ? `<br><span class="od-audit-note-text">${escapeHTML(note)}</span>`
      : '';

    if (isSystem) {
      return `
        <article class="od-audit-item">
          <span class="od-audit-dot" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M13 6v6m-3-3h6"/></svg>
          </span>
          <div class="od-audit-body">
            <div class="od-audit-top">
              <strong>${escapeHTML(time)}</strong>
              <span class="od-tag od-tag-neutral">Hệ thống ghi nhận</span>
            </div>
            <p class="od-audit-text">Khách hàng <strong>${escapeHTML(order.customer)}</strong> tạo đơn hàng thành công qua cổng thanh toán ${escapeHTML(order.channel || 'Storefront Học Sinh')}.<br>Trạng thái khởi tạo: Chưa xác nhận.</p>
          </div>
        </article>`;
    }

    return `
      <article class="od-audit-item">
        <span class="od-audit-dot ${meta.dot}" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3.5 8.4 6.4 11 12.5 5"/></svg>
        </span>
        <div class="od-audit-body">
          <div class="od-audit-top">
            <strong>${escapeHTML(time)}</strong>
            <span class="od-tag od-tag-blue">Quản trị viên thao tác</span>
          </div>
          <p class="od-audit-text">Quản trị viên <span class="od-admin-mail">admin@hocduong.vn</span> đã cập nhật trạng thái đơn hàng sang: <strong>${escapeHTML(meta.label)}</strong>.${noteMarkup}</p>
        </div>
      </article>`;
  }

  function renderAuditLog() {
    if (!auditList) return;

    const createdAt = createdLabel();
    const entries = [auditMarkup(createdAt, 'pending', '', true)];
    const history = typeof store.getAuditEntries === 'function'
      ? store.getAuditEntries(order.code)
      : [];

    if (history.length) {
      /* Đã có thao tác thật của quản trị viên: hiển thị đúng lịch sử đã lưu
         (kể cả ghi chú xử lý) để reload không bị mất. */
      history.forEach((entry) => {
        entries.push(auditMarkup(entry.time, entry.status, entry.note, false));
      });
    } else {
      if (order.status === 'confirmed' || order.status === 'delivered') {
        entries.push(auditMarkup(timeAfter(createdAt, 145), 'confirmed', '', false));
      }
      if (order.status === 'delivered') {
        entries.push(auditMarkup(timeAfter(createdAt, 1585), 'delivered', '', false));
      }
      if (order.status === 'cancelled') {
        entries.push(auditMarkup(timeAfter(createdAt, 145), 'cancelled', 'Khách hàng yêu cầu huỷ đơn và hoàn tồn kho.', false));
      }
    }

    auditList.innerHTML = entries.join('');
  }

  /* ------------------------------------------------------------------------
     8. MODAL CẬP NHẬT TRẠNG THÁI
     ------------------------------------------------------------------------ */
  function openModal() {
    if (!allowedNextStatuses().length) {
      showToast('Đơn hàng đã ở trạng thái kết thúc, không thể cập nhật thêm.');
      return;
    }

    lastFocusedElement = document.activeElement;
    renderTransitionControls();
    if (nextSelect && !nextSelect.disabled && modalSelect) {
      modalSelect.value = nextSelect.value;
    }
    statusModal.classList.add('open');
    statusModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    statusNote.value = '';
    if (modalSelect) modalSelect.focus();
  }

  function closeModal() {
    statusModal.classList.remove('open');
    statusModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    statusForm.reset();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function applyStatus(nextStatus, note) {
    if (!canTransition(nextStatus)) {
      showToast('Không thể chuyển sang trạng thái này theo quy trình hệ thống.');
      return false;
    }

    order.status = nextStatus;
    store.updateStatus(order.code, nextStatus, note);
    renderAll();
    renderAuditLog();
    showToast(`Đơn hàng ${order.code} đã chuyển sang: ${STATUS[nextStatus].label}.`);
    return true;
  }

  /* ------------------------------------------------------------------------
     9. GẮN SỰ KIỆN
     ------------------------------------------------------------------------ */
  if (confirmTransition) {
    confirmTransition.addEventListener('click', () => {
      if (!nextSelect || !nextSelect.value) {
        showToast('Đơn hàng đã ở trạng thái kết thúc, không thể cập nhật thêm.');
        return;
      }
      const selectedStatus = nextSelect.value;
      openModal();
      if (modalSelect && !modalSelect.disabled) modalSelect.value = selectedStatus;
    });
  }

  if (openStatusModalBtn) openStatusModalBtn.addEventListener('click', openModal);
  if (closeStatusModalBtn) closeStatusModalBtn.addEventListener('click', closeModal);
  if (cancelStatusModalBtn) cancelStatusModalBtn.addEventListener('click', closeModal);

  if (statusModal) {
    statusModal.addEventListener('click', (event) => {
      if (event.target === statusModal) closeModal();
    });
  }

  if (statusForm) {
    statusForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Chức năng chuyển trạng thái mô phỏng: Đóng modal và thông báo thành công
      closeModal();
      showToast('Cập nhật trạng thái đơn hàng thành công.');
    });
  }

  const printButton = $('#print-order');
  if (printButton) {
    printButton.addEventListener('click', () => {
      showToast('Đang chuẩn bị phiếu giao hàng để in…');
      window.setTimeout(() => window.print(), 160);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && statusModal && statusModal.classList.contains('open')) {
      closeModal();
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

  renderHeader();
  renderProducts();
  renderAll();
  renderAuditLog();

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    const refreshed = store.getOrder(order.code);
    if (!refreshed) return;
    order = refreshed;
    renderHeader();
    renderProducts();
    renderAll();
    renderAuditLog();
  });

  /* Đồng bộ trạng thái khi đơn hàng được cập nhật từ tab khác (A10/A12). */
  window.addEventListener('storage', (event) => {
    if (event.key && !['hd_admin_order_status', 'hd_admin_custom_orders', 'hd_admin_order_audit'].includes(event.key)) return;
    const refreshed = store.getOrder(order.code);
    if (!refreshed) return;
    order = refreshed;
    renderHeader();
    renderProducts();
    renderAll();
    renderAuditLog();
  });

  if (requestedCode && requestedCode !== order.code) {
    showToast(`Không tìm thấy đơn ${requestedCode}, đang hiển thị đơn ${order.code}.`);
  }
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
