// Hiện/ẩn mật khẩu trên cả trang đăng nhập và đăng ký.
document.querySelectorAll('[data-toggle]').forEach(function (button) {
  button.addEventListener('click', function () {
    const input = document.getElementById(button.dataset.toggle);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? '◎' : '◉';
  });
});

// Xử lý Đăng nhập: Lưu trạng thái vào AuthManager / localStorage
const PROFILE_STORAGE_KEY = 'hds_profile_v1';
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const userData = {
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@email.com',
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.removeItem('hds_logged_out');
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng nhập thành công! Chào mừng Nguyễn Minh Anh');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    let target = '../homepage/main.html';
    if (redirect === 'checkout') target = '../customer/checkout.html';
    else if (redirect === 'cart') target = '../customer/cart.html';
    setTimeout(function () {
      window.location.href = target;
    }, 400);
  });
}

// Xử lý Đăng ký tài khoản
const registerForm = document.getElementById('register-form');
if (registerForm) {
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm-password');
  const confirmField = document.getElementById('confirm-field');
  const status = document.getElementById('confirm-status');

  function checkPasswords() {
    if (!password || !confirm || !confirmField || !status) return true;
    const mismatch = confirm.value.length > 0 && password.value !== confirm.value;
    confirmField.classList.toggle('invalid', mismatch);
    status.textContent = mismatch ? 'Chưa khớp' : (confirm.value ? 'Khớp' : '');
    status.style.color = mismatch ? '#c82020' : '#16804a';
    return !mismatch;
  }

  if (password && confirm) {
    password.addEventListener('input', checkPasswords);
    confirm.addEventListener('input', checkPasswords);
  }

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const userData = {
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@email.com',
      phone: '0901 234 567',
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.removeItem('hds_logged_out');
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng ký tài khoản thành công! Chào mừng Nguyễn Minh Anh');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    let target = '../homepage/main.html';
    if (redirect === 'checkout') target = '../customer/checkout.html';
    else if (redirect === 'cart') target = '../customer/cart.html';
    setTimeout(function () {
      window.location.href = target;
    }, 400);
  });
}

// Xử lý các nút đăng nhập nhanh qua Google / Email Giáo dục
document.querySelectorAll('.social-row button').forEach(function (button) {
  button.addEventListener('click', function () {
    const socialUser = {
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@email.com',
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };
    if (window.AuthManager) {
      window.AuthManager.login(socialUser);
    } else {
      sessionStorage.removeItem('hds_logged_out');
      sessionStorage.setItem('hds_auth_user', JSON.stringify(socialUser));
    }
    if (window.showSiteToast) {
      window.showSiteToast('Đăng nhập thành công! Chào mừng Nguyễn Minh Anh');
    }
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    let target = '../homepage/main.html';
    if (redirect === 'checkout') target = '../customer/checkout.html';
    else if (redirect === 'cart') target = '../customer/cart.html';
    setTimeout(function () {
      window.location.href = target;
    }, 400);
  });
});