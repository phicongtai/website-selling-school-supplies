const backdrop = document.querySelector("#delete-backdrop");
const dialog = document.querySelector(".sold-dialog");
const openButton = document.querySelector("#open-delete");
const closeButton = document.querySelector("#close-dialog");
const cancelButton = document.querySelector("#cancel-delete");
const confirmButton = document.querySelector("#confirm-hide");
const productStatus = document.querySelector("#product-status");
const statusBadge = productStatus.closest(".product-status");
const pageMessage = document.querySelector("#page-message");
const toast = document.querySelector("#hide-toast");
const dismissToastButton = document.querySelector("#dismiss-toast");
const mobileMenu = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".admin-sidebar");
const paginationControls = document.querySelector("#pagination-controls");
const paginationSummary = document.querySelector("#pagination-summary");
const totalPages = 125;
let currentPage = 1;

function createPageButton(label, page, ariaLabel = `Trang ${page}`, isNavigation = false) {
  const button = document.createElement("button");
  button.className = "pagination-button";
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.dataset.page = String(page);

  if (!isNavigation && page === currentPage) {
    button.classList.add("is-current");
    button.setAttribute("aria-current", "page");
  }

  return button;
}

function renderPagination() {
  paginationControls.replaceChildren();

  const previousButton = createPageButton("‹", Math.max(1, currentPage - 1), "Trang trước", true);
  previousButton.disabled = currentPage === 1;
  paginationControls.append(previousButton);

  const visiblePages = currentPage <= 3
    ? [1, 2, 3, "ellipsis", totalPages]
    : currentPage >= totalPages - 2
      ? [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
      : [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];

  visiblePages.forEach((page) => {
    if (page === "ellipsis") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.setAttribute("aria-hidden", "true");
      ellipsis.textContent = "…";
      paginationControls.append(ellipsis);
      return;
    }

    paginationControls.append(createPageButton(String(page), page));
  });

  const nextButton = createPageButton("›", Math.min(totalPages, currentPage + 1), "Trang tiếp theo", true);
  nextButton.disabled = currentPage === totalPages;
  paginationControls.append(nextButton);
  paginationSummary.textContent = `Trang ${currentPage} trên ${totalPages}`;
}

paginationControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button || button.disabled) return;

  currentPage = Number(button.dataset.page);
  renderPagination();
});

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
dismissToastButton.addEventListener("click", () => {
  toast.hidden = true;
});

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
  productStatus.textContent = "Đã ẩn";
  statusBadge.classList.add("is-hidden");
  openButton.disabled = true;
  openButton.classList.add("row-delete-disabled");
  openButton.setAttribute("aria-label", "Sản phẩm SP01 đã được ẩn");
  backdrop.hidden = true;
  toast.hidden = false;
  pageMessage.textContent = "Sản phẩm SP01 đã được ẩn khỏi storefront. Lịch sử 42 đơn hàng vẫn được bảo toàn.";
});

mobileMenu.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (window.innerWidth <= 560
      && sidebar.classList.contains("is-open")
      && !sidebar.contains(event.target)
      && !mobileMenu.contains(event.target)) {
    sidebar.classList.remove("is-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }
});

openDialog();
renderPagination();
