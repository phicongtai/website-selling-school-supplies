/**
 * ==========================================================================
 * A01: ĐĂNG NHẬP QUẢN TRỊ (ADMIN LOGIN CONTROLLER)
 * Dự án: Web Bán Đồ Dùng Học Tập - Học Đường Store
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const formAlert = document.getElementById('form-alert');
  const rememberCheckbox = document.getElementById('remember-me');

  // Đọc tên đăng nhập đã lưu trước đó nếu có
  const savedUsername = localStorage.getItem('hd_admin_saved_username');
  if (savedUsername && usernameInput) {
    usernameInput.value = savedUsername;
    if (rememberCheckbox) rememberCheckbox.checked = true;
    if (passwordInput) passwordInput.focus();
  }

  /**
   * 1. Ẩn / Hiện mật khẩu
   */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu');
      togglePasswordBtn.setAttribute('title', isPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu');
      
      if (isPassword) {
        togglePasswordBtn.innerHTML = `
          <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 1L17 14M9.5 10.36C8.85 10.36 8.3 10.13 7.85 9.68C7.39 9.23 7.17 8.68 7.17 8.03C7.17 7.38 7.39 6.83 7.85 6.38C8.3 5.92 8.85 5.7 9.5 5.7C10.15 5.7 10.7 5.92 11.15 6.38C11.61 6.83 11.83 7.38 11.83 8.03C11.83 8.68 11.61 9.23 11.15 9.68C10.7 10.13 10.15 10.36 9.5 10.36ZM9.5 12.95C7.4 12.95 5.48 12.37 3.76 11.19C2.03 10.02 0.78 8.45 0 6.48C0.52 5.16 1.25 4.02 2.19 3.06L3.6 4.3C2.86 5.04 2.27 5.77 1.9 6.48C2.62 7.93 3.66 9.09 5.02 9.94C6.38 10.8 7.87 11.23 9.5 11.23C10.45 11.23 11.36 11.03 12.22 10.63L13.72 11.95C12.44 12.62 11.03 12.95 9.5 12.95Z" stroke="#5F5E5E" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else {
        togglePasswordBtn.innerHTML = `
          <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 10.36C10.58 10.36 11.5 9.99 12.25 9.23C13.01 8.47 13.39 7.56 13.39 6.48C13.39 5.4 13.01 4.48 12.25 3.72C11.5 2.97 10.58 2.59 9.5 2.59C8.42 2.59 7.5 2.97 6.75 3.72C5.99 4.48 5.61 5.4 5.61 6.48C5.61 7.56 5.99 8.47 6.75 9.23C7.5 9.99 8.42 10.36 9.5 10.36ZM9.5 8.81C8.85 8.81 8.3 8.58 7.85 8.13C7.39 7.68 7.17 7.13 7.17 6.48C7.17 5.83 7.39 5.28 7.85 4.83C8.3 4.37 8.85 4.15 9.5 4.15C10.15 4.15 10.7 4.37 11.15 4.83C11.61 5.28 11.83 5.83 11.83 6.48C11.83 7.13 11.61 7.68 11.15 8.13C10.7 8.58 10.15 8.81 9.5 8.81ZM9.5 12.95C7.4 12.95 5.48 12.37 3.76 11.19C2.03 10.02 0.78 8.45 0 6.48C0.78 4.51 2.03 2.93 3.76 1.76C5.48 0.59 7.4 0 9.5 0C11.6 0 13.52 0.59 15.24 1.76C16.97 2.93 18.22 4.51 19 6.48C18.22 8.45 16.97 10.02 15.24 11.19C13.52 12.37 11.6 12.95 9.5 12.95ZM9.5 11.23C11.13 11.23 12.62 10.8 13.98 9.94C15.34 9.09 16.38 7.93 17.1 6.48C16.38 5.02 15.34 3.87 13.98 3.01C12.62 2.16 11.13 1.73 9.5 1.73C7.87 1.73 6.38 2.16 5.02 3.01C3.66 3.87 2.62 5.02 1.9 6.48C2.62 7.93 3.66 9.09 5.02 9.94C6.38 10.8 7.87 11.23 9.5 11.23Z" fill="#5F5E5E"/>
          </svg>
        `;
      }
    });
  }

  /**
   * 2. Xử lý đăng nhập: Bất kỳ thông tin nào nhập vào hoặc để trống, nhấn là tự động login
   */
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = (usernameInput && usernameInput.value.trim()) ? usernameInput.value.trim() : 'Quản trị viên';

      // Trạng thái đang xác thực
      setLoading(true);

      // Lưu thông tin phiên đăng nhập
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem('hd_admin_saved_username', username);
      } else {
        localStorage.removeItem('hd_admin_saved_username');
      }

      sessionStorage.setItem('hd_admin_authenticated', 'true');
      sessionStorage.setItem('hd_admin_user', username);

      showSuccess('Đăng nhập thành công! Đang chuyển hướng vào hệ thống...');

      // Chuyển hướng trực tiếp vào trang A02 Quản lý người dùng
      setTimeout(() => {
        window.location.href = '../A02 Quản lý người dùng/index.html';
      }, 400);
    });
  }

  function showSuccess(msg) {
    if (!formAlert) return;
    formAlert.className = 'form-alert alert-success';
    formAlert.innerHTML = `
      <span aria-hidden="true">✓</span>
      <span>${msg}</span>
    `;
    formAlert.style.display = 'flex';
  }

  function setLoading(isLoading) {
    if (!submitBtn || !submitText) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitText.textContent = 'Đang chuyển hướng...';
    } else {
      submitText.textContent = 'Đăng nhập hệ thống';
    }
  }
});
