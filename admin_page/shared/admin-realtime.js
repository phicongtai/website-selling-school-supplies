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

