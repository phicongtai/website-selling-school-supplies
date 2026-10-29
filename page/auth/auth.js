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

    const loginName = (document.getElementById('username') || {}).value || '';
    const loginEmail = (document.getElementById('email') || {}).value || '';
    const userData = {
      name: loginName.trim() || 'Khách hàng mới',
      email: loginEmail.trim() || 'minhanh@email.com',
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng nhập thành công! Chào mừng ' + userData.name);
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
    const mismatch = confirm.value.length > 0 && password.value !== confirm.value;
    confirmField.classList.toggle('invalid', mismatch);
    status.textContent = mismatch ? 'Chưa khớp' : (confirm.value ? 'Khớp' : '');
    status.style.color = mismatch ? '#c82020' : '#16804a';
    confirm.setCustomValidity(mismatch ? 'Mật khẩu không khớp' : '');
    return !mismatch;
  }

  if (password && confirm) {
    password.addEventListener('input', checkPasswords);
    confirm.addEventListener('input', checkPasswords);
  }

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!checkPasswords()) {
      confirm.reportValidity();
      return;
    }

    const fullnameInput = document.getElementById('fullname');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const registeredName = (fullnameInput && fullnameInput.value.trim())
      || (usernameInput && usernameInput.value.trim())
      || 'Khách hàng mới';
    const registeredEmail = (emailInput && emailInput.value.trim()) || 'minhanh@email.com';
    const registeredPhone = (phoneInput && phoneInput.value.trim()) || '0912 234 567';
    const userData = {
      name: registeredName,
      email: registeredEmail,
      phone: registeredPhone,
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };
    // Luu ho so nguoi mua theo thong tin vua dang ky (customer.js doc PROFILE_KEY)
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        name: registeredName,
        email: registeredEmail,
        phone: registeredPhone
      }));
    } catch (err) {}

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng ký tài khoản thành công! Chào mừng ' + registeredName);
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
      name: 'Khách hàng mới',
      email: 'minhanh@email.com',
      avatar: '../../assets/img/avatar.jpg',
      loginTime: new Date().toISOString()
    };
    if (window.AuthManager) {
      window.AuthManager.login(socialUser);
    } else {
      sessionStorage.setItem('hds_auth_user', JSON.stringify(socialUser));
    }
    if (window.showSiteToast) {
      window.showSiteToast('Đăng nhập thành công! Chào mừng ' + (socialUser.name || userData.name || 'Khách hàng mới'));
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
