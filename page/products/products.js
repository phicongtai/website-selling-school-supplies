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

  // Cập nhật số lượng cho nhóm "Ưu đãi" trong sidebar
  const offerCounts = {
    sale: cards.filter(card => Number(card.dataset.oldPrice) > Number(card.dataset.price)).length,
    hot: cards.filter(card => card.dataset.hot === "1").length
  };
  Object.entries(offerCounts).forEach(([key, value]) => {
    const el = document.querySelector(`[data-offer-count="${key}"]`);
    if (el) el.textContent = String(value);
  });

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

  // YÊU CẦU: bộ lọc và sắp xếp trên trang chỉ để minh họa (showcasing),
  // KHÔNG lọc/sắp xếp thật. Mọi thao tác chỉ hiện hiệu ứng tải lại (skeleton)
  // rồi hiển thị lại toàn bộ sản phẩm tĩnh của trang.
  const revealAllProducts = () => {
    if (!grid) return;

    cards.forEach(card => {
      card.classList.remove("is-hidden");
      card.style.display = "";
    });

    if (resultCount) {
      resultCount.textContent = `Hiển thị ${cards.length} / ${total} sản phẩm (Trang ${isPageTwo ? "2" : "1"}/2)`;
    }

    if (emptyState) {
      emptyState.hidden = true;
      emptyState.style.display = "none";
    }

    if (filterSummary) {
      filterSummary.textContent = "Đang hiển thị tất cả sản phẩm.";
    }

    if (categoryHint) {
      categoryHint.textContent = "Tất cả";
    }
  };

  // Hàm lọc sản phẩm danh mục: chỉ tạo hiệu ứng reload, không lọc thật.
  window.filterCategoryProducts = (options = {}) => {
    if (!grid) return;

    const silent = Boolean(options && options.silent === true);
    if (silent) {
      revealAllProducts();
      return;
    }

    // Hiệu ứng "đang tải lại": skeleton shimmer ~0.9s rồi bật lại danh sách.
    if (resultCount) resultCount.textContent = "Đang tải lại sản phẩm...";
    if (typeof window.showFakeLoading === "function") {
      window.showFakeLoading(grid, revealAllProducts);
    } else {
      revealAllProducts();
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
