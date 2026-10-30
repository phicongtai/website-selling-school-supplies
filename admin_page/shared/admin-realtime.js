/**
 * Tự động cập nhật ngày realtime trên topbar tất cả các trang quản trị Admin
 */
(function () {
  function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `Hôm nay, ${day}/${month}/${year}`;
  }

  function updateRealtimeDate() {
    const dateStr = getFormattedDate();
    const elements = document.querySelectorAll('#current-date-text, .topbar-date span');
    elements.forEach(function (el) {
      el.textContent = dateStr;
    });
  }

  // Chạy ngay lập tức nếu DOM đã có sẵn hoặc chờ DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateRealtimeDate);
  } else {
    updateRealtimeDate();
  }

  // Cập nhật lại mỗi 60 giây (realtime liên tục)
  setInterval(updateRealtimeDate, 60000);
})();

/* ==========================================================================
   ĐỊNH DẠNG Ô NHẬP GIÁ / TIỀN TỰ ĐỘNG PHÂN TÁCH HÀNG NGHÌN BẰNG DẤU CHẤM (.)
   ========================================================================== */
(function () {
  function formatPriceString(val) {
    if (val == null || val === '') return '';
    let digits = String(val).replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length > 1 && digits.startsWith('0')) {
      digits = digits.replace(/^0+/, '') || '0';
    }
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function attachPriceFormatter(input) {
    if (!input || input.dataset.priceBound) return;
    input.dataset.priceBound = 'true';

    if (input.type === 'number') {
      input.type = 'text';
      input.inputMode = 'numeric';
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace') {
        const pos = input.selectionStart;
        if (pos === input.selectionEnd && pos > 0 && input.value[pos - 1] === '.') {
          input.setSelectionRange(pos - 1, pos - 1);
        }
      }
    });

    input.addEventListener('input', function () {
      const start = input.selectionStart || 0;
      const oldVal = input.value;
      let digitsBefore = (oldVal.slice(0, start).match(/\d/g) || []).length;
      let rawDigits = oldVal.replace(/\D/g, '');

      if (!rawDigits) {
        input.value = '';
        return;
      }
      if (rawDigits.length > 1 && rawDigits.startsWith('0')) {
        const stripped = rawDigits.replace(/^0+/, '');
        const zeroesRemoved = rawDigits.length - stripped.length;
        rawDigits = stripped || '0';
        digitsBefore = Math.max(0, digitsBefore - zeroesRemoved);
      }

      const formatted = rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      input.value = formatted;

      let newCursor = 0;
      let digitsCount = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) digitsCount++;
        if (digitsCount >= digitsBefore) {
          newCursor = i + 1;
          break;
        }
      }
      if (digitsCount < digitsBefore || newCursor === 0) newCursor = formatted.length;
      input.setSelectionRange(newCursor, newCursor);
    });

    if (input.value) {
      input.value = formatPriceString(input.value);
    }
  }

  function initAdminPriceInputs() {
    const selectors = [
      '#new-product-price',
      '#price',
      'input[name="total"]',
      'input[data-price-input]'
    ];
    document.querySelectorAll(selectors.join(', ')).forEach(attachPriceFormatter);
  }

  window.formatPriceString = formatPriceString;
  window.attachPriceFormatter = attachPriceFormatter;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPriceInputs);
  } else {
    initAdminPriceInputs();
  }

  document.addEventListener('focusin', function (e) {
    const el = e.target;
    if (el && el.matches && el.matches('#new-product-price, #price, input[name="total"], input[data-price-input]')) {
      attachPriceFormatter(el);
    }
  });
})();

