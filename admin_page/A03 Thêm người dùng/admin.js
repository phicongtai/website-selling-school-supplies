/**
 * ==========================================================================
 * A03: THÊM NGƯỜI DÙNG CONTROLLER (CHUẨN FIGMA FRAME 1:5395)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store Admin
 * Ghi chú: Chỉ mở khi ấn chức năng Thêm người dùng của A3.
 * Khi thoát (✕, Hủy bỏ, click ra ngoài, Escape, hoặc Thêm thành công)
 * sẽ tự động trả về trang A02.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dữ liệu mẫu chuẩn Figma cố định trong JS (8 tài khoản)
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
  const modalA03 = document.getElementById('modal-a03');
  const openModalTrigger = document.getElementById('open-modal-trigger');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const formAddUser = document.getElementById('form-add-user');

  const modalUserCode = document.getElementById('modal-user-code');
  const modalUsername = document.getElementById('modal-username');
  const modalFullname = document.getElementById('modal-fullname');
  const modalEmail = document.getElementById('modal-email');
  const modalPhone = document.getElementById('modal-phone');
  const modalPassword = document.getElementById('modal-password');
  const modalConfirmPassword = document.getElementById('modal-confirm-password');
  const modalRole = document.getElementById('modal-role');
  const modalStatus = document.getElementById('modal-status');

  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  // Đọc tên người quản trị
  const loggedInUser = sessionStorage.getItem('hd_admin_user');
  if (loggedInUser) {
    const sidebarUserName = document.getElementById('sidebar-user-name');
    if (sidebarUserName) sidebarUserName.textContent = loggedInUser;
  }

  // 2. Tính toán mã người dùng kế tiếp
  function calculateNextCode() {
    let maxNum = 0;
    usersData.forEach(u => {
      const match = (u.code || '').match(/U(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `U${nextNum < 10 ? '0' + nextNum : nextNum}`;
  }

  if (modalUserCode) {
    modalUserCode.value = calculateNextCode();
  }

  // 3. Render bảng danh sách người dùng phía sau (Nền)
  function updateStats() {
    // Cố định cứng số liệu thống kê chuẩn
    if (statTotalVal) statTotalVal.textContent = '8';
    if (statActiveVal) statActiveVal.textContent = '6';
    if (statLockedVal) statLockedVal.textContent = '2';
    if (totalUsersText) totalUsersText.textContent = '8 tài khoản';
  }

  function renderTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    // Chức năng Tìm kiếm & Lọc là mô phỏng giao diện tượng trưng — luôn hiển thị đầy đủ danh sách
    const filtered = usersData;

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
            <a href="../A04 Sửa người dùng/index.html?code=${user.code}" class="action-link edit" style="text-decoration: none;">Sửa</a>
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

  // 4. Thoát khỏi A03: TỰ ĐỘNG TRẢ VỀ TRANG A02
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
  if (modalA03) {
    modalA03.addEventListener('click', (e) => {
      if (e.target === modalA03) {
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

  // 5. Ẩn / Hiện mật khẩu
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // 6. Initials Helper
  function getInitials(name) {
    if (!name) return 'UN';
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return 'UN';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // 7. Toast Message
  function showToast(message, type = 'success') {
    if (!toast || !toastText) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.className = `toast-msg show ${type}`;
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // 8. Submit Form Thêm Người Dùng: Mô phỏng giao diện (Chức năng giả, không thêm vào danh sách)
  if (formAddUser) {
    formAddUser.addEventListener('submit', (e) => {
      e.preventDefault();

      // Mô phỏng giao diện: Khi ấn Thêm người dùng, không thêm dữ liệu thực tế vào bảng
      // Bảng danh sách người dùng giữ nguyên vẹn 8 tài khoản gốc
      if (modalA03) {
        modalA03.classList.remove('open');
      }

      // Đóng modal và chuyển về trang A02 mà không lưu người dùng mới
      returnToA02();
    });
  }

  // 9. Khoá / Mở khoá trên bảng nền
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-link');
      if (!btn || btn.tagName.toLowerCase() === 'a') return;

      const code = btn.getAttribute('data-code');
      const user = usersData.find(u => u.code === code);
      if (!user) return;

      if (btn.classList.contains('lock')) {
        user.status = 'locked';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        updateStats();
        renderTable();
        showToast(`Đã khoá tài khoản ${user.name} (${user.code})`, 'lock');
      } else if (btn.classList.contains('unlock')) {
        user.status = 'active';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        updateStats();
        renderTable();
        showToast(`Đã mở khoá tài khoản ${user.name} (${user.code})`, 'unlock');
      }
    });
  }

  // 10. Tìm kiếm & Lọc trên bảng (Chức năng giả/mô phỏng: có animation nhưng không lọc dữ liệu)
  let animTimer = null;
  function triggerTableAnimation(callback) {
    if (tbody) {
      tbody.style.transition = 'opacity 0.22s ease, filter 0.22s ease';
      tbody.style.opacity = '0.35';
      tbody.style.filter = 'blur(0.6px)';
    }
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(() => {
      if (tbody) {
        tbody.style.opacity = '1';
        tbody.style.filter = 'none';
      }
      if (typeof callback === 'function') callback();
      renderTable();
    }, 280);
  }

  function triggerSearchAnimation() {
    const searchIconSvg = document.querySelector('.search-input-wrapper .search-icon svg');
    if (searchIconSvg) {
      searchIconSvg.style.transition = 'transform 0.35s ease';
      searchIconSvg.style.transform = 'rotate(180deg)';
    }
    triggerTableAnimation(() => {
      if (searchIconSvg) {
        searchIconSvg.style.transform = 'rotate(0deg)';
      }
    });
  }

  let searchDebounce = null;
  if (searchInput) {
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
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      triggerTableAnimation();
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'all';
      try {
        sessionStorage.removeItem('hd_temp_users');
      } catch (e) {}
      usersData = DEFAULT_USERS.map(u => ({ ...u }));
      updateStats();

      const refreshSvg = btnRefresh.querySelector('svg');
      if (refreshSvg) {
        refreshSvg.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
        refreshSvg.style.transform = 'rotate(360deg)';
      }

      triggerTableAnimation(() => {
        if (refreshSvg) {
          refreshSvg.style.transition = 'none';
          refreshSvg.style.transform = 'rotate(0deg)';
        }
      });
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

  // Xử lý phân trang (Chức năng fake: có animation giống làm mới)
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageBtns = document.querySelectorAll('.pagination-btns .page-btn');

  if (prevPageBtn) {
    prevPageBtn.removeAttribute('disabled');
    prevPageBtn.style.cursor = 'pointer';
    prevPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTableAnimation();
    });
  }

  if (nextPageBtn) {
    nextPageBtn.removeAttribute('disabled');
    nextPageBtn.style.cursor = 'pointer';
    nextPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTableAnimation();
    });
  }

  pageBtns.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTableAnimation();
    });
  });
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
