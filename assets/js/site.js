/**
 * Tiện ích dùng chung cho toàn bộ giao diện người dùng.
 * Không áp dụng cho khu vực admin_page.
 */
(function () {
  window.showSiteToast = function (message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 2500);
  };

  // Cho phép nhấn Enter ở ô tìm kiếm trên các trang không có form tìm kiếm.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    const input = event.target;
    if (!input || !input.matches || !input.matches('.store-search-input')) return;
    const searchButton = input.closest('.store-search')?.querySelector('.store-search-button');
    if (searchButton) {
      event.preventDefault();
      searchButton.click();
    }
  });
})();
