// Hiện/ẩn mật khẩu trên cả trang đăng nhập và đăng ký.
document.querySelectorAll('[data-toggle]').forEach(function (button) {
  button.addEventListener('click', function () {
    const input = document.getElementById(button.dataset.toggle);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? '◎' : '◉';
  });
});

// Đăng nhập bản giao diện: kiểm tra trường bắt buộc bằng HTML rồi chuyển về trang chủ.
// Đây chưa phải xác thực tài khoản thật vì dự án hiện chưa có backend đăng nhập.
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = '../homepage/main.html';
  });
}

// Kiểm tra hai mật khẩu ở trang đăng ký; không hiển thị thông báo yêu cầu kết nối backend.
const registerForm = document.getElementById('register-form');
if (registerForm) {
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');
  const confirmField = document.getElementById('confirm-field');
  const status = document.getElementById('confirm-status');
  function checkPasswords() {
    const mismatch = confirm.value.length > 0 && password.value !== confirm.value;
    confirmField.classList.toggle('invalid', mismatch);
    status.textContent = mismatch ? 'Chưa khớp' : (confirm.value ? 'Khớp' : '');
    status.style.color = mismatch ? '#c82020' : '#16804a';
    confirm.setCustomValidity(mismatch ? 'Mật khẩu không khớp' : '');
    return !mismatch;
  }
  password.addEventListener('input', checkPasswords);
  confirm.addEventListener('input', checkPasswords);
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!checkPasswords()) {
      confirm.reportValidity();
      return;
    }
    // Bản demo chưa lưu tài khoản; chuyển về trang chủ thay vì hiện cảnh báo backend.
    window.location.href = '../homepage/main.html';
  });
}
