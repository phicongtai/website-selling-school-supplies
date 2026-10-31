const backdrop = document.querySelector("#delete-backdrop");
const dialog = document.querySelector(".delete-dialog");
const openButton = document.querySelector("#open-delete");
const closeButton = document.querySelector("#close-dialog");
const cancelButton = document.querySelector("#cancel-delete");
const confirmButton = document.querySelector("#confirm-delete");
const productRow = document.querySelector("#product-row");
const pageMessage = document.querySelector("#page-message");

function openDialog() {
  backdrop.hidden = false;
  closeButton.focus();
}

function closeDialog() {
  backdrop.hidden = true;
  openButton.focus();
}

openButton.addEventListener("click", openDialog);
closeButton.addEventListener("click", closeDialog);
cancelButton.addEventListener("click", closeDialog);

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closeDialog();
});

document.addEventListener("keydown", (event) => {
  if (backdrop.hidden) return;

  if (event.key === "Escape") {
    closeDialog();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = [...dialog.querySelectorAll("button:not(:disabled)")];
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

confirmButton.addEventListener("click", () => {
  // Chức năng xóa giả lập: Đóng hộp thoại, giữ nguyên dòng sản phẩm
  backdrop.hidden = true;
  pageMessage.textContent = "Sản phẩm SP48 đã được xóa khỏi danh sách trên trang này.";
});


// Cập nhật ngày realtime trên topbar
(function () {
  function updateTopbarDate() {
    const dateEls = document.querySelectorAll('#current-date-text, .topbar-date span');
    if (dateEls.length) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const text = 'Hôm nay, ' + day + '/' + month + '/' + year;
      dateEls.forEach(el => { el.textContent = text; });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTopbarDate);
  } else {
    updateTopbarDate();
  }
})();
