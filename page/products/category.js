document.addEventListener("DOMContentLoaded", () => {
  const activeNavigationLink = document.querySelector(".category-nav a.active");
  if (activeNavigationLink) {
    activeNavigationLink.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  // Sản phẩm đã được viết tĩnh trong HTML của từng trang (trang 1 / trang 2 là
  // hai file khác nhau), JS chỉ đóng vai trò hiển thị trên các thẻ tĩnh đó.
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  const search = document.getElementById("searchInput");
  const emptyState = document.getElementById("categoryEmptyState");
  const categoryLinks = {
    "pens.html": "pens",
    "notebooks.html": "notebooks",
    "backpacks.html": "backpacks",
    "school-supplies.html": "school-supplies",
    "art.html": "art",
    "computers.html": "computers"
  };

  if (!grid || !count || !search) {
    throw new Error("Thiếu dữ liệu hoặc thành phần cần thiết cho trang danh mục sản phẩm.");
  }

  document.querySelectorAll(".category-option").forEach(link => {
    const target = Object.entries(categoryLinks)
      .find(([file]) => link.getAttribute("href").endsWith(file));
    const number = link.querySelector("span:last-child");
    if (target && number) {
      number.textContent = String(
        window.StoreCatalog.products.filter(item => item.category === target[1]).length
      );
    } else if (link.textContent.includes("Tất cả sản phẩm")) {
      const number = link.querySelector("span:last-child");
      if (number) number.textContent = String(window.StoreCatalog.products.length);
    }
  });

  const cards = Array.from(grid.querySelectorAll(".store-product-card"));
  cards.forEach((card, index) => {
    if (card.dataset.order === undefined) card.dataset.order = String(index);
  });

  // Sắp xếp: dropdown tự viết (giống trang "Sản phẩm") — chỉ sổ ra để chọn,
  // không sắp xếp lại danh sách sản phẩm.
  const sortControl = document.querySelector(".sort-control");
  const sortDropdown = sortControl ? sortControl.querySelector(".sort-dropdown") : null;
  const sortTrigger = sortDropdown ? sortDropdown.querySelector(".sort-dropdown-trigger") : null;
  const sortLabel = sortTrigger ? sortTrigger.querySelector("span") : null;
  const sortOptions = sortDropdown
    ? Array.from(sortDropdown.querySelectorAll(".sort-dropdown-option"))
    : [];

  function closeSortMenu() {
    if (!sortDropdown) return;
    sortDropdown.classList.remove("is-open");
    if (sortTrigger) sortTrigger.setAttribute("aria-expanded", "false");
  }

  if (sortDropdown && sortTrigger && sortLabel) {
    sortTrigger.addEventListener("click", () => {
      const isOpen = sortDropdown.classList.toggle("is-open");
      sortTrigger.setAttribute("aria-expanded", String(isOpen));
    });

    sortOptions.forEach(option => {
      option.addEventListener("click", () => {
        sortOptions.forEach(item => {
          const selected = item === option;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-selected", String(selected));
        });
        sortLabel.textContent = option.textContent.trim();
        closeSortMenu();

        // Sắp xếp chỉ để minh họa: hiện loading giả rồi giữ nguyên thứ tự
        // sản phẩm, không sắp xếp thật.
        if (typeof window.showFakeLoading === "function") {
          count.textContent = "Đang tải sản phẩm...";
          window.showFakeLoading(grid, render);
        }
      });
    });

    document.addEventListener("click", event => {
      if (!sortDropdown.contains(event.target)) closeSortMenu();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeSortMenu();
    });
  }

  function render() {
    // YÊU CẦU: từ khóa tìm kiếm chỉ để showcasing — KHÔNG lọc thật.
    // Luôn hiển thị toàn bộ sản phẩm đã viết tĩnh trong trang này,
    // nửa còn lại nằm ở file Trang 2.
    cards.forEach(card => {
      card.classList.remove("is-hidden");
      card.style.display = "";
    });

    const body = document.body;
    const catalog = window.StoreCatalog && window.StoreCatalog.products;
    const categoryKey = body.dataset.productCategory;
    const total = catalog && categoryKey
      ? catalog.filter(item => item.category === categoryKey).length
      : cards.length;
    const isPageTwo = body.dataset.catalogPage === "2";
    count.textContent = `Hiển thị ${cards.length} / ${total} sản phẩm (Trang ${isPageTwo ? "2" : "1"}/2)`;
    if (emptyState) emptyState.hidden = true;
  }

  search.addEventListener("input", render);
  document.getElementById("searchButton")?.addEventListener("click", () => {
    // Người dùng bấm "Tìm kiếm": hiện hiệu ứng loading giả rồi bật lại toàn bộ danh sách.
    count.textContent = "Đang tải sản phẩm...";
    window.showFakeLoading(grid, () => {
      render();
      search.focus();
    });
  });

  // Thêm giỏ hàng (delegation): giỏ hàng đang ở chế độ CỐ ĐỊNH nên mọi lần
  // bấm đều bị chặn và chỉ hiển thị thông báo (xử lý trong cart.js).
  grid.addEventListener("click", event => {
    const button = event.target.closest(".store-product-cart");
    if (!button) return;
    const productId = Number(button.dataset.productId);
    if (window.StoreCart) window.StoreCart.add(productId, 1);
  });

  render();
});
