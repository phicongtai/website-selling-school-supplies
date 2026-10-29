/**
 * ==========================================================================
 * A02: QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT CONTROLLER)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
 * Ghi chú: Dữ liệu gốc trong JS cố định, khi sửa đổi/thêm mới từ A3/A4 trở về
 * sẽ hiển thị số mới trên trang hiện tại. Khi reload (F5) lại trang sẽ khôi phục về dữ liệu gốc.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Dữ liệu mẫu khởi tạo chuẩn xác theo bản vẽ Figma (8 tài khoản cố định trong JS)
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

  // Nếu người dùng ấn Reload (F5), xóa dữ liệu tạm và nạp lại số gốc cố định từ JS
  if (isPageReload()) {
    try {
      sessionStorage.removeItem('hd_temp_users');
      localStorage.removeItem('hd_users_data');
    } catch (e) {
      console.warn(e);
    }
  }

  // Đọc danh sách người dùng hiển thị
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

  // Các phần tử DOM
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

  // Khi F5/refresh, đưa cả bộ lọc/tìm kiếm về trạng thái mặc định như ảnh thiết kế
  if (isPageReload()) {
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'all';
  }

  // Toast elements
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message, type = 'success') {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastText) toastText.textContent = message;
    if (toastIcon) {
      if (type === 'lock') {
        toastIcon.textContent = '🔒';
      } else if (type === 'unlock') {
        toastIcon.textContent = '🔓';
      } else if (type === 'error') {
        toastIcon.textContent = '✕';
      } else {
        toastIcon.textContent = '✓';
      }
    }

    toast.className = 'toast-msg show ' + (type || '');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Đọc thông báo chuyển trang (Flash message từ A03 / A04 trả về A02)
  try {
    const flashToast = sessionStorage.getItem('hd_toast_message');
    if (flashToast) {
      sessionStorage.removeItem('hd_toast_message');
      const parsed = JSON.parse(flashToast);
      showToast(parsed.text, parsed.type || 'success');
    }
  } catch (err) {
    console.warn('Lỗi đọc flash toast:', err);
  }

  // Hiển thị tên người dùng đăng nhập từ phiên làm việc
  const loggedInUser = sessionStorage.getItem('hd_admin_user');
  if (loggedInUser) {
    const sidebarUserName = document.getElementById('sidebar-user-name');
    if (sidebarUserName) sidebarUserName.textContent = loggedInUser;
  }

  /**
   * 1. Cập nhật các thẻ thống kê tổng số, hoạt động, bị khoá
   */
  function updateStats() {
    const total = usersData.length;
    const active = usersData.filter(u => u.status === 'active').length;
    const locked = usersData.filter(u => u.status === 'locked').length;

    if (statTotalVal) statTotalVal.textContent = total;
    if (statActiveVal) statActiveVal.textContent = active;
    if (statLockedVal) statLockedVal.textContent = locked;
    if (totalUsersText) totalUsersText.textContent = `${total} tài khoản`;
  }

  /**
   * 2. Render danh sách bảng dữ liệu
   */
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

  /**
   * 3. Xử lý thao tác Khoá / Mở khoá trên bảng hiện tại
   */
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-link');
      if (!btn) return;

      // Nếu là thẻ <a> (nút Sửa mở chức năng A04), cho phép điều hướng tự nhiên sang A04
      if (btn.tagName.toLowerCase() === 'a') return;

      const code = btn.getAttribute('data-code');
      const user = usersData.find(u => u.code === code);
      if (!user) return;

      if (btn.classList.contains('lock')) {
        // Khoá tài khoản trên trang hiện tại
        user.status = 'locked';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        updateStats();
        renderTable();
        showToast(`Đã khoá tài khoản ${user.name} (${user.code})`, 'lock');
      } else if (btn.classList.contains('unlock')) {
        // Mở khoá tài khoản trên trang hiện tại
        user.status = 'active';
        sessionStorage.setItem('hd_temp_users', JSON.stringify(usersData));
        updateStats();
        renderTable();
        showToast(`Đã mở khoá tài khoản ${user.name} (${user.code})`, 'unlock');
      }
    });
  }

  /**
   * 4. Tìm kiếm & Lọc
   */
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      renderTable();
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'all';
      // Khôi phục lại dữ liệu gốc từ DEFAULT_USERS
      sessionStorage.removeItem('hd_temp_users');
      usersData = DEFAULT_USERS.map(u => ({ ...u }));
      updateStats();
      renderTable();
      showToast('Đã làm mới danh sách người dùng về dữ liệu gốc');
    });
  }

  /**
   * 5. Xuất Excel (File CSV chuẩn UTF-8 có BOM)
   */
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
  // 6. Xử lý phân trang (Next / Prev / Page 1): Bấm là reload về lại trang 1
  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageBtns = document.querySelectorAll('.pagination-btns .page-btn');

  function reloadA02Page1(label) {
    if (tableBody) {
      tableBody.style.transition = 'opacity 200ms ease';
      tableBody.style.opacity = '0.35';
    }
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }

  if (prevPageBtn) {
    prevPageBtn.removeAttribute('disabled');
    prevPageBtn.style.cursor = 'pointer';
    prevPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      reloadA02Page1('Trang trước');
    });
  }

  if (nextPageBtn) {
    nextPageBtn.removeAttribute('disabled');
    nextPageBtn.style.cursor = 'pointer';
    nextPageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      reloadA02Page1('Trang sau');
    });
  }

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      reloadA02Page1(`Trang ${btn.textContent.trim()}`);
    });
  });

  // Khởi động giao diện ban đầu
  updateStats();
  renderTable();
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
