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

  // Tên đăng nhập quản trị để trống khi mở trang đăng nhập
  if (usernameInput) {
    usernameInput.value = '';
  }

  /**
   * 1. Ẩn / Hiện mật khẩu
   */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';

      // Đổi type và chỉ bật/tắt class để hiển thị đúng 1 icon
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.classList.toggle('is-visible', isPassword);
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu');
      togglePasswordBtn.setAttribute('title', isPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu');
      togglePasswordBtn.setAttribute('aria-pressed', String(isPassword));

      // Giữ nguyên vị trí con trỏ, tránh nhảy lên đầu khi đổi type
      const caretPos = passwordInput.value.length;
      passwordInput.focus({ preventScroll: true });
      if (typeof passwordInput.setSelectionRange === 'function') {
        passwordInput.setSelectionRange(caretPos, caretPos);
      }
    });
  }

  /**
   * 2. Xử lý đăng nhập: Bất kỳ thông tin nào nhập vào hoặc để trống, nhấn là tự động login
   */
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = 'Nguyễn Văn A';

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
