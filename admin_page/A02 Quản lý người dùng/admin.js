/**
 * ==========================================================================
 * A02: QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT CONTROLLER)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Dữ liệu mẫu khởi tạo chuẩn xác theo bản vẽ Figma (8 tài khoản)
  let usersData = [
    { code: 'U01', name: 'Nguyễn Minh Anh', username: 'minhanh', email: 'minhanh@email.com', phone: '0901 234 567', status: 'active', avatar: 'NA', avatarClass: 'avatar-na' },
    { code: 'U02', name: 'Trần Quốc Bảo', username: 'quocbao', email: 'quocbao@email.com', phone: '0912 345 678', status: 'active', avatar: 'QB', avatarClass: 'avatar-qb' },
    { code: 'U03', name: 'Lê Thị Cẩm Tú', username: 'camtu', email: 'camtu@email.com', phone: '0923 456 789', status: 'active', avatar: 'CT', avatarClass: 'avatar-ct' },
    { code: 'U04', name: 'Võ Ngọc Hân', username: 'ngochan', email: 'ngochan@email.com', phone: '0934 567 890', status: 'active', avatar: 'NH', avatarClass: 'avatar-nh' },
    { code: 'U05', name: 'Đặng Gia Huy', username: 'giahuy', email: 'giahuy@email.com', phone: '0945 678 901', status: 'active', avatar: 'GH', avatarClass: 'avatar-gh' },
    { code: 'U06', name: 'Bùi Thu Trang', username: 'thutrang', email: 'thutrang@email.com', phone: '0956 789 012', status: 'active', avatar: 'TT', avatarClass: 'avatar-tt' },
    { code: 'U07', name: 'Phạm Hoàng Duy', username: 'hoangduy', email: 'hoangduy@email.com', phone: '0967 890 123', status: 'locked', avatar: 'HD', avatarClass: 'avatar-hd' },
    { code: 'U08', name: 'Hoàng Anh Tuấn', username: 'anhtuan', email: 'anhtuan@email.com', phone: '0978 901 234', status: 'locked', avatar: 'AT', avatarClass: 'avatar-at' }
  ];

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

  // Modal elements
  const userModal = document.getElementById('user-modal');
  const modalTitle = document.getElementById('modal-title');
  const userForm = document.getElementById('user-form');
  const openAddModalBtn = document.getElementById('open-add-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');

  const modalUserCode = document.getElementById('modal-user-code');
  const modalUsername = document.getElementById('modal-username');
  const modalFullname = document.getElementById('modal-fullname');
  const modalEmail = document.getElementById('modal-email');
  const modalPhone = document.getElementById('modal-phone');
  const modalStatus = document.getElementById('modal-status');

  let editingUserCode = null;

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
            <span class="user-avatar-tag ${user.avatarClass}">${user.avatar}</span>
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

  /**
   * 3. Xử lý thao tác Khoá / Mở khoá và Sửa
   */
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('.action-link');
      if (!btn) return;

      const code = btn.getAttribute('data-code');
      const user = usersData.find(u => u.code === code);
      if (!user) return;

      if (btn.classList.contains('edit')) {
        // Mở modal sửa người dùng
        openEditModal(user);
      } else if (btn.classList.contains('lock')) {
        // Khoá tài khoản
        user.status = 'locked';
        updateStats();
        renderTable();
        showToast(`Đã khoá tài khoản ${user.name} (${user.code})`, 'lock');
      } else if (btn.classList.contains('unlock')) {
        // Mở khoá tài khoản
        user.status = 'active';
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
      renderTable();
      showToast('Đã làm mới danh sách người dùng');
    });
  }

  /**
   * 5. Xuất Excel (File CSV chuẩn UTF-8 có BOM)
   */
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      const headers = ['MÃ', 'HỌ TÊN', 'TÊN ĐĂNG NHẬP', 'EMAIL', 'SỐ ĐIỆN THOẠI', 'TRẠNG THÁI'];
      const rows = usersData.map(u => [
        u.code,
        `"${u.name}"`,
        u.username,
        u.email,
        u.phone,
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

  /**
   * 6. Quản lý Modal Thêm / Sửa người dùng
   */
  function openAddModal() {
    editingUserCode = null;
    modalTitle.textContent = 'Thêm người dùng mới';
    userForm.reset();
    
    // Tự sinh mã tiếp theo
    const nextNum = usersData.length + 1;
    modalUserCode.value = `U${nextNum < 10 ? '0' + nextNum : nextNum}`;
    modalUserCode.disabled = false;
    modalStatus.value = 'active';

    userModal.classList.add('open');
    modalUsername.focus();
  }

  function openEditModal(user) {
    editingUserCode = user.code;
    modalTitle.textContent = `Chỉnh sửa: ${user.name} (${user.code})`;
    modalUserCode.value = user.code;
    modalUserCode.disabled = true;
    modalUsername.value = user.username;
    modalFullname.value = user.name;
    modalEmail.value = user.email;
    modalPhone.value = user.phone;
    modalStatus.value = user.status;

    userModal.classList.add('open');
    modalFullname.focus();
  }

  function closeModal() {
    userModal.classList.remove('open');
    userForm.reset();
    editingUserCode = null;
  }

  if (openAddModalBtn) openAddModalBtn.addEventListener('click', openAddModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (userModal) {
    userModal.addEventListener('click', (e) => {
      if (e.target === userModal) closeModal();
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const code = modalUserCode.value.trim().toUpperCase();
      const username = modalUsername.value.trim();
      const name = modalFullname.value.trim();
      const email = modalEmail.value.trim();
      const phone = modalPhone.value.trim();
      const status = modalStatus.value;

      // Tạo avatar 2 chữ cái đầu
      const words = name.split(' ');
      const avatar = words.length > 1 
        ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase() 
        : name.slice(0, 2).toUpperCase();

      if (editingUserCode) {
        // Cập nhật người dùng hiện có
        const user = usersData.find(u => u.code === editingUserCode);
        if (user) {
          user.username = username;
          user.name = name;
          user.email = email;
          user.phone = phone;
          user.status = status;
          user.avatar = avatar;
        }
        showToast(`Đã cập nhật thông tin người dùng ${name}`);
      } else {
        // Thêm mới
        const colorClasses = ['avatar-na', 'avatar-qb', 'avatar-ct', 'avatar-nh', 'avatar-gh', 'avatar-tt'];
        const avatarClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

        usersData.unshift({
          code,
          name,
          username,
          email,
          phone,
          status,
          avatar,
          avatarClass
        });
        showToast(`Đã thêm thành công người dùng mới ${name}`);
      }

      closeModal();
      updateStats();
      renderTable();
    });
  }

  /**
   * 7. Toast thông báo
   */
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  function showToast(message, type = 'success') {
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastText.textContent = message;
    if (type === 'lock') {
      toastIcon.textContent = '🔒';
    } else if (type === 'unlock') {
      toastIcon.textContent = '🔓';
    } else {
      toastIcon.textContent = '✓';
    }

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Khởi động giao diện ban đầu
  updateStats();
  renderTable();
});

