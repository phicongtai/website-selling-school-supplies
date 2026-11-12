/**
 * Trang danh mục Tất cả sản phẩm (products.html / products-2.html)
 */
document.addEventListener("DOMContentLoaded", () => {
  const activeNavigationLink = document.querySelector(".category-nav a.active, .homepage-nav a.active");
  if (activeNavigationLink) {
    activeNavigationLink.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  const grid = document.getElementById("categoryProductsGrid");
  const resultTitle = document.getElementById("categoryResultTitle");
  const resultCount = document.getElementById("categoryResultCount");
  const emptyState = document.getElementById("categoryEmptyState");
  const filterSummary = document.getElementById("filterSummary");
  const categoryHint = document.getElementById("filterCategoryHint");

  const cards = grid ? Array.from(grid.querySelectorAll(".store-product-card")) : [];
  cards.forEach((card, index) => {
    if (card.dataset.order === undefined) card.dataset.order = String(index);
  });

  const total = (window.StoreCatalog && window.StoreCatalog.products)
    ? window.StoreCatalog.products.length
    : 54;
  const isPageTwo = document.body.dataset.catalogPage === "2";

  // Cập nhật số lượng sản phẩm mỗi nhóm danh mục trong sidebar
  const categoryKeys = ["pens", "notebooks", "backpacks", "cases", "art", "school-supplies", "computers"];
  if (window.StoreCatalog && Array.isArray(window.StoreCatalog.products)) {
    categoryKeys.forEach(cat => {
      const el = document.querySelector(`[data-category-count="${cat}"]`);
      if (el) {
        el.textContent = String(window.StoreCatalog.products.filter(p => p.category === cat).length);
      }
    });
  }

  // Khởi tạo dòng kết quả
  if (resultCount) {
    resultCount.textContent = `Hiển thị ${cards.length} / ${total} sản phẩm (Trang ${isPageTwo ? "2" : "1"}/2)`;
  }

  // Dropdown sắp xếp tùy chỉnh
  const sortDropdown = document.getElementById("categorySort");
  const sortTrigger = document.getElementById("categorySortTrigger");
  const sortLabel = document.getElementById("categorySortValue");
  const sortMenu = document.getElementById("categorySortMenu");
  const sortSelect = document.getElementById("categorySortSelect");
  const sortOptions = sortMenu ? Array.from(sortMenu.querySelectorAll(".sort-dropdown-option")) : [];

  function closeSortMenu() {
    if (!sortDropdown) return;
    sortDropdown.classList.remove("is-open");
    if (sortTrigger) sortTrigger.setAttribute("aria-expanded", "false");
  }

  function openSortMenu() {
    if (!sortDropdown) return;
    sortDropdown.classList.add("is-open");
    if (sortTrigger) sortTrigger.setAttribute("aria-expanded", "true");
  }

  if (sortTrigger && sortDropdown) {
    sortTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      sortDropdown.classList.contains("is-open") ? closeSortMenu() : openSortMenu();
    });

    document.addEventListener("click", (e) => {
      if (!sortDropdown.contains(e.target)) closeSortMenu();
    });

    sortOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        sortOptions.forEach(o => {
          o.classList.remove("is-selected");
          o.setAttribute("aria-selected", "false");
        });
        opt.classList.add("is-selected");
        opt.setAttribute("aria-selected", "true");
        if (sortLabel) sortLabel.textContent = opt.textContent.trim();
        const val = opt.dataset.value || "default";
        if (sortSelect) sortSelect.value = val;
        closeSortMenu();
        filterCategoryProducts();
      });
    });
  }

  // Hàm lọc sản phẩm danh mục
  window.filterCategoryProducts = (options = {}) => {
    if (!grid) return;

    const checkedCategories = Array.from(
      document.querySelectorAll(".filter-categories input[type='checkbox']:checked")
    ).map(cb => cb.dataset.category);

    const minPriceInput = document.getElementById("filterMinPrice");
    const maxPriceInput = document.getElementById("filterMaxPrice");
    const minPrice = minPriceInput && minPriceInput.value ? Number(minPriceInput.value.replace(/\D/g, "")) : 0;
    const maxPrice = maxPriceInput && maxPriceInput.value ? Number(maxPriceInput.value.replace(/\D/g, "")) : Infinity;

    const saleOnly = Boolean(document.querySelector(".filter-offers input[data-filter='sale']:checked"));
    const hotOnly = Boolean(document.querySelector(".filter-offers input[data-filter='hot']:checked"));

    let visibleCount = 0;
    cards.forEach(card => {
      const cat = card.dataset.category;
      const price = Number(card.dataset.price) || 0;
      const oldPrice = Number(card.dataset.oldPrice) || 0;

      let match = true;
      if (checkedCategories.length > 0 && !checkedCategories.includes(cat)) {
        match = false;
      }
      if (price < minPrice || price > maxPrice) {
        match = false;
      }
      if (saleOnly && !(oldPrice > price)) {
        match = false;
      }

      if (match) {
        card.style.display = "";
        card.classList.remove("is-hidden");
        visibleCount++;
      } else {
        card.style.display = "none";
        card.classList.add("is-hidden");
      }
    });

    // Cập nhật nhãn đếm
    if (resultCount) {
      resultCount.textContent = `Hiển thị ${visibleCount} / ${cards.length} sản phẩm (Trang ${isPageTwo ? "2" : "1"}/2)`;
    }

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.hidden = false;
        emptyState.style.display = "block";
      } else {
        emptyState.hidden = true;
        emptyState.style.display = "none";
      }
    }

    if (filterSummary) {
      if (checkedCategories.length > 0) {
        filterSummary.textContent = `Đang lọc theo ${checkedCategories.length} nhóm danh mục.`;
      } else {
        filterSummary.textContent = "Đang hiển thị tất cả sản phẩm.";
      }
    }

    if (categoryHint) {
      categoryHint.textContent = checkedCategories.length > 0 ? `${checkedCategories.length} đã chọn` : "Tất cả";
    }
  };

  window.resetHomeFilters = () => {
    document.querySelectorAll(".filter-sidebar input[type='checkbox']").forEach(cb => { cb.checked = false; });
    const minPriceInput = document.getElementById("filterMinPrice");
    const maxPriceInput = document.getElementById("filterMaxPrice");
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    if (sortSelect) sortSelect.value = "default";
    if (sortLabel) sortLabel.textContent = "Phổ biến";
    if (sortOptions.length > 0) {
      sortOptions.forEach(o => {
        const isDef = o.dataset.value === "default";
        o.classList.toggle("is-selected", isDef);
        o.setAttribute("aria-selected", String(isDef));
      });
    }
    window.filterCategoryProducts();
  };
});
