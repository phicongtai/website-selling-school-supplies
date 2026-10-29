/**
 * ==========================================================================
 * A04: SỬA NGƯỜI DÙNG CONTROLLER (CHUẨN FIGMA FRAME 1:5843)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store Admin
 * Ghi chú: Chỉ mở khi ấn chức năng Sửa người dùng của A4.
 * Khi thoát (✕, Hủy bỏ, click ra ngoài, Escape, hoặc Cập nhật thành công)
 * sẽ tự động trả về trang A02.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dữ liệu mẫu mặc định cố định trong JS (8 tài khoản chuẩn Figma)
  const DEFAULT_USERS = [
    { code: 'U01', name: 'Nguyễn Minh Anh', username: 'minhanh', email: 'minhanh@email.com', phone: '0901 234 567', role: 'customer', status: 'active', avatar: 'NA', avatarClass: 'avatar-na' },
    { code: 'U02', name: 'Trần Quốc Bảo', username: 'quocbao', email: 'quocbao@email.com', phone: '0912 345 678', role: 'customer', status: 'active', avatar: 'QB', avatarClass: 'avatar-qb' },
    { code: 'U03', name: 'Lê Thị Cẩm Tú', username: 'camtu', email: 'camtu@email.com', phone: '0923 456 789', role: 'customer', status: 'active', avatar: 'CT', avatarClass: 'avatar-ct' },
    { code: 'U04', name: 'Võ Ngọc Hân', username: 'ngochan', email: 'ngochan@email.com', phone: '0934 567 890', role: 'customer', status: 'active', avatar: 'NH', avatarClass: 'avatar-nh' },
    { code: 'U05', name: 'Đặng Gia Huy', username: 'giahuy', email: 'giahuy@email.com', phone: '0945 678 901', role: 'customer', status: 'active', avatar: 'GH', avatarClass: 'avatar-gh' },
    { code: 'U06', name: 'Bùi Thu Trang', username: 'thutrang', email: 'thutrang@email.com', phone: '0956 789 012', role: 'staff', status: 'active', avatar: 'TT', avatarClass: 'avatar-tt' },
    { code: 'U07', name: 'Phạm Hoàng Duy', username: 'hoangduy', email: 'hoangduy@email.com', phone: '0967 890 123', role: 'customer', status: 'locked', avatar: 'HD', avatarClass: 'avatar-hd' },
    { code: 'U08', name: 'Hoàng Anh Tuấn', username: 'anhtuan', email: 'anhtuan@email.com', phone: '0978 901 234', role: 'customer', status: 'locked', avatar: 'AT', avatarClass: 'avatar-at' }
  ];

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
    } catch (e) {
      console.warn(e);
    }
    return false;
  }

  if (isPageReload()) {
    try {
      sessionStorage.removeItem('hd_temp_users');
      localStorage.removeItem('hd_users_data');
    } catch (e) {
      console.warn(e);
    }
  }

  function loadCurrentUsers() {
    try {
      const stored = sessionStorage.getItem('hd_temp_users');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_USERS.map(u => ({ ...u }));
  }

  let usersData = loadCurrentUsers();

  // 2. Xác định người dùng cần sửa từ URL query param (VD: ?code=U01 hoặc ?id=U01)
  const urlParams = new URLSearchParams(window.location.search);
  const targetCode = urlParams.get('code') || urlParams.get('id') || 'U01';

  let currentUser = usersData.find(u => (u.code || '').toUpperCase() === targetCode.toUpperCase());
  if (!currentUser) {
    currentUser = usersData[0];
  }

  // DOM Elements nền tảng
  const tbody = document.getElementById('users-tbody');
  const searchInput = document.getElementById('user-search-input');
  const statusFilter = document.getElementById('status-filter');
  const btnRefresh = document.getElementById('btn-refresh');
  const btnExportExcel = document.getElementById('btn-export-excel');
  const totalUsersText = document.getElementById('total-users-text');
  const statTotalVal = document.getElementById('stat-total-val');
  const statActiveVal = document.getElementById('stat-active-val');
  const statLockedVal = document.getElementById('stat-locked-val');
  const paginationInfo = document.getElementById('pagination-info');

  // Modal Elements
  const modalA04 = document.getElementById('modal-a04');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const formEditUser = document.getElementById('form-edit-user');
  const modalSubtitleUser = document.getElementById('modal-subtitle-user');

  const modalUserCode = document.getElementById('modal-user-code');
  const modalUsername = document.getElementById('modal-username');
  const modalFullname = document.getElementById('modal-fullname');
  const modalEmail = document.getElementById('modal-email');
  const modalPhone = document.getElementById('modal-phone');
  const modalRole = document.getElementById('modal-role');
  const modalStatus = document.getElementById('modal-status');
  const modalPassword = document.getElementById('modal-password');

  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  // Đọc tên người quản trị từ phiên làm việc
  const loggedInUser = sessionStorage.getItem('hd_admin_user');
  if (loggedInUser) {
    const sidebarUserName = document.getElementById('sidebar-user-name');
    if (sidebarUserName) sidebarUserName.textContent = loggedInUser;
  }

  // 3. Điền thông tin người dùng vào modal form
  function populateModal(user) {
    if (!user) return;
    if (modalUserCode) modalUserCode.value = user.code;
    if (modalUsername) modalUsername.value = user.username;
    if (modalFullname) modalFullname.value = user.name;
    if (modalEmail) modalEmail.value = user.email;
    if (modalPhone) modalPhone.value = user.phone;
    if (modalRole) modalRole.value = user.role || 'customer';
    if (modalStatus) modalStatus.value = user.status || 'active';
    if (modalPassword) modalPassword.value = '';
    if (modalSubtitleUser) modalSubtitleUser.textContent = `${user.name} (${user.code})`;
  }

  populateModal(currentUser);

  // 4. Render bảng danh sách người dùng phía sau (Nền)
  function updateStats() {
    const total = usersData.length;
    const active = usersData.filter(u => u.status === 'active').length;
    const locked = usersData.filter(u => u.status === 'locked').length;

    if (statTotalVal) statTotalVal.textContent = total;
    if (statActiveVal) statActiveVal.textContent = active;
    if (statLockedVal) statLockedVal.textContent = locked;
    if (totalUsersText) totalUsersText.textContent = `${total} tài khoản`;
  }

  function renderTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    const filtered = usersData.filter(user => {
      const matchSearch =
        user.code.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm);

      const matchStatus =
        selectedStatus === 'all' || user.status === selectedStatus;

      return matchSearch && matchStatus;
    });

    if (!tbody) return;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #6b7280;">
            Không tìm thấy tài khoản người dùng phù hợp.
          </td>
        </tr>
      `;
      if (paginationInfo) paginationInfo.textContent = `Hiển thị 0 trên tổng số ${usersData.length} người dùng`;
      return;
    }

    filtered.forEach(user => {
      const tr = document.createElement('tr');
      const isActive = user.status === 'active';
      const isSelected = user.code.toUpperCase() === currentUser.code.toUpperCase();

      if (isSelected) tr.classList.add('selected-row');

      tr.innerHTML = `
        <td><span class="user-code">${user.code}</span></td>
        <td>
          <div class="user-name-cell">
            <span class="user-avatar-tag ${user.avatarClass || 'avatar-na'}">${user.avatar || 'UN'}</span>
            <span class="user-fullname">${user.name}</span>
          </div>
        </td>
        <td><span class="user-username">${user.username}</span></td>
        <td><span class="user-email">${user.email}</span></td>
        <td><span class="user-phone">${user.phone}</span></td>
        <td>
          <span class="badge-status ${isActive ? 'active' : 'locked'}">
            <i class="status-dot"></i>
            ${isActive ? 'Hoạt động' : 'Đã khoá'}
          </span>
        </td>
        <td>
          <div class="action-links">
            <button type="button" class="action-link edit" data-code="${user.code}">Sửa</button>
            <button type="button" class="action-link ${isActive ? 'lock' : 'unlock'}" data-code="${user.code}">
              ${isActive ? 'Khoá' : 'Mở khoá'}
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (paginationInfo) {
      paginationInfo.textContent = `Hiển thị ${filtered.length} trên tổng số ${usersData.length} người dùng`;
    }
  }

  updateStats();
  renderTable();

  // 5. Thoát khỏi A04: TỰ ĐỘNG TRẢ VỀ TRANG A02
  function returnToA02() {
    window.location.href = "../A02 Quản lý người dùng/index.html";
  }

  // Nút ✕ trên modal: trả về trang A02
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', (e) => {
      e.preventDefault();
      returnToA02();
    });
  }

  // Nút Hủy bỏ trên modal: trả về trang A02
  if (btnCancelModal) {
    btnCancelModal.addEventListener('click', (e) => {
      e.preventDefault();
      returnToA02();
    });
  }

  // Đóng khi click ngoài backdrop: trả về trang A02
  if (modalA04) {
    modalA04.addEventListener('click', (e) => {
      if (e.target === modalA04) {
        returnToA02();
      }
    });
  }

  // Đóng khi nhấn phím Escape: trả về trang A02
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      returnToA02();
    }
  });

  // 6. Ẩn / Hiện mật khẩu
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // 7. Initials Helper
  function getInitials(name) {
    if (!name) return 'UN';
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return 'UN';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // 8. Toast Message
  function showToast(message, type = 'success') {
    if (!toast || !toastText) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.className = `toast-msg show ${type}`;
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 9. Submit Form Cập Nhật Người Dùng: LƯU TẠM THỜI VÀ TRẢ VỀ TRANG A02
  if (formEditUser) {
    formEditUser.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      document.querySelectorAll('.modal-field').forEach(f => f.classList.remove('has-error'));

      const fullname = modalFullname ? modalFullname.value.trim() : '';
      if (!fullname) {
        const field = document.getElementById('field-fullname');
        if (field) field.classList.add('has-error');
        isValid = false;
      }

      const email = modalEmail ? modalEmail.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        const field = document.getElementById('field-email');
        if (field) field.classList.add('has-error');
        isValid = false;
      }

      const phone = modalPhone ? modalPhone.value.trim().replace(/\s+/g, '') : '';
      const phoneRegex = /^0\d{9}$/;
      if (!phone || !phoneRegex.test(phone)) {
        const field = document.getElementById('field-phone');
        if (field) field.classList.add('has-error');
        isValid = false;
      }

      const pwd = modalPassword ? modalPassword.value : '';
      if (pwd && pwd.length < 6) {
        const field = document.getElementById('field-password');
        if (field) field.classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc', 'error');
        return;
      }

      // Cập nhật thông tin người dùng
      const newPhoneFormatted = modalPhone ? modalPhone.value.trim() : phone;
      currentUser.name = fullname;
      currentUser.email = email;
      currentUser.phone = newPhoneFormatted;
      currentUser.role = modalRole ? modalRole.value : 'customer';
      currentUser.status = modalStatus ? modalStatus.value : 'active';
      currentUser.avatar = getInitials(fullname);

      // Cập nhật vào mảng hiển thị
      const idx = usersData.findIndex(u => (u.code || '').toUpperCase() === currentUser.code.toUpperCase());
      if (idx !== -1) {
        usersData[idx] = { ...currentUser };
      }

      // Lưu tạm thời cho phiên làm việc để A02 hiển thị số mới
      sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));

      // Lưu thông báo thành công cho A02
      sessionStorage.setItem('hd_toast_message', JSON.stringify({
        text: `Đã cập nhật thông tin người dùng ${fullname} (${currentUser.code}) thành công!`,
        type: 'success'
      }));

      // Thoát và trả về trang A02
      returnToA02();
    });
  }

  // 10. Khoá / Mở khoá và Sửa trên bảng nền A04
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-link');
      if (!btn) return;

      const code = btn.getAttribute('data-code');
      const user = usersData.find(u => (u.code || '').toUpperCase() === (code || '').toUpperCase());
      if (!user) return;

      if (btn.classList.contains('edit')) {
        currentUser = user;
        populateModal(currentUser);
        try {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('code', currentUser.code);
          window.history.replaceState({ code: currentUser.code }, '', newUrl.toString());
        } catch (err) {
          console.warn(err);
        }
        renderTable();
        if (modalA04) modalA04.classList.add('open');
      } else if (btn.classList.contains('lock')) {
        user.status = 'locked';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        if (currentUser.code.toUpperCase() === user.code.toUpperCase()) {
          currentUser.status = 'locked';
          if (modalStatus) modalStatus.value = 'locked';
        }
        updateStats();
        renderTable();
        showToast(`Đã khoá tài khoản ${user.name} (${user.code})`, 'lock');
      } else if (btn.classList.contains('unlock')) {
        user.status = 'active';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        if (currentUser.code.toUpperCase() === user.code.toUpperCase()) {
          currentUser.status = 'active';
          if (modalStatus) modalStatus.value = 'active';
        }
        updateStats();
        renderTable();
        showToast(`Đã mở khoá tài khoản ${user.name} (${user.code})`, 'unlock');
      }
    });
  }

  // 11. Tìm kiếm & Lọc trên bảng
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (statusFilter) statusFilter.addEventListener('change', renderTable);
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'all';
      renderTable();
      showToast('Đã làm mới danh sách người dùng');
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      const headers = ['MÃ', 'HỌ TÊN', 'TÊN ĐĂNG NHẬP', 'EMAIL', 'SỐ ĐIỆN THOẠI', 'VAI TRÒ', 'TRẠNG THÁI'];
      const rows = usersData.map(u => [
        u.code,
        `"${u.name}"`,
        u.username,
        u.email,
        u.phone,
        u.role === 'staff' ? 'Nhân viên' : (u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'),
        u.status === 'active' ? 'Hoạt động' : 'Đã khoá'
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `danh_sach_nguoi_dung_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Đã tải xuống file Excel danh sách người dùng');
    });
  }
});

// Xử lý đăng xuất an toàn
document.querySelectorAll('.sidebar-logout').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionStorage.removeItem('hd_admin_authenticated');
    sessionStorage.removeItem('hd_admin_user');
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
