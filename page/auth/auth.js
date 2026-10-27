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
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const userInput = document.getElementById('login-user');
    const rawVal = userInput ? userInput.value.trim() : '';
    const isEmail = rawVal.includes('@');

    const userData = {
      name: 'Nguyễn Minh Anh',
      email: isEmail ? rawVal : 'minhanh@email.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      loginTime: new Date().toISOString()
    };

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng nhập thành công! Chào mừng Nguyễn Minh Anh');
    }
    setTimeout(function () {
      window.location.href = '../homepage/main.html';
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
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    const userData = {
      name: 'Nguyễn Minh Anh',
      email: (emailInput && emailInput.value.trim()) || 'minhanh@email.com',
      phone: (phoneInput && phoneInput.value.trim()) || '0901 234 567',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      loginTime: new Date().toISOString()
    };

    if (window.AuthManager) {
      window.AuthManager.login(userData);
    } else {
      sessionStorage.setItem('hds_auth_user', JSON.stringify(userData));
    }

    if (window.showSiteToast) {
      window.showSiteToast('Đăng ký tài khoản thành công! Đang chuyển hướng...');
    }
    setTimeout(function () {
      window.location.href = '../homepage/main.html';
    }, 400);
  });
}
