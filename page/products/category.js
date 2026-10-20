document.addEventListener("DOMContentLoaded", () => {
  const activeNavigationLink = document.querySelector(".category-nav a.active");
  if (activeNavigationLink) {
    activeNavigationLink.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  const category = document.body.dataset.productCategory || "pens";
  const products = window.StoreCatalog.products.filter(item => item.category === category);
  const categoryName = window.StoreCatalog.categories[category];
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  const sort = document.getElementById("sortSelect");
  const search = document.getElementById("searchInput");
  const previousButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  const categoryLinks = {
    "pens.html": "pens",
    "notebooks.html": "notebooks",
    "backpacks.html": "backpacks"
  };

  if (!categoryName || !grid || !count || !sort || !search || !previousButton || !nextButton) {
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

  let page = 1;
  const perPage = 6;
  const money = value => new Intl.NumberFormat("vi-VN").format(value) + " ₫";

  function render() {
    let filtered = products.filter(product =>
      `${product.code} ${product.title}`.toLocaleLowerCase("vi")
        .includes(search.value.trim().toLocaleLowerCase("vi"))
    );

    if (sort.value === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort.value === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort.value === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    page = Math.min(page, totalPages);
    const visibleProducts = filtered.slice((page - 1) * perPage, page * perPage);

    count.textContent = filtered.length
      ? `Hiển thị ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} của ${filtered.length} sản phẩm`
      : "Không tìm thấy sản phẩm phù hợp";

    grid.innerHTML = visibleProducts.map(product => `
      <article class="store-product-card">
        <a class="store-product-image-link" href="product-detail.html?id=${encodeURIComponent(product.code)}">
          <div class="store-product-visual">
            <span class="store-product-tag">${categoryName}</span>
            ${product.hot ? '<span class="store-product-tag store-product-hot">Hot</span>' : ""}
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
        </a>
        <div class="store-product-code">Mã: ${product.code}</div>
        <a class="store-product-name" href="product-detail.html?id=${encodeURIComponent(product.code)}">${product.title}</a>
        <div class="store-product-meta">
          <strong class="store-product-price">${money(product.price)}</strong>
          ${product.oldPrice
            ? `<span class="store-product-old-price">${money(product.oldPrice)}</span>`
            : `<span class="store-product-stock">Kho: ${product.stock}</span>`}
        </div>
        <button class="store-product-cart" type="button">🛒 Thêm vào giỏ</button>
      </article>
    `).join("");

    document.querySelectorAll(".page-number").forEach(button => {
      const buttonPage = Number(button.dataset.page);
      button.classList.toggle("active", buttonPage === page);
      button.hidden = buttonPage > totalPages;
    });
    previousButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;

    grid.querySelectorAll(".store-product-cart").forEach(button => {
      button.addEventListener("click", () => {
        button.classList.add("added");
        button.textContent = "✓ Đã thêm vào giỏ";
        window.setTimeout(() => {
          button.classList.remove("added");
          button.textContent = "🛒 Thêm vào giỏ";
        }, 1200);
      });
    });
  }

  sort.addEventListener("change", () => {
    page = 1;
    render();
  });
  search.addEventListener("input", () => {
    page = 1;
    render();
  });
  document.getElementById("searchButton").addEventListener("click", () => search.focus());
  document.querySelectorAll(".page-number").forEach(button => {
    button.addEventListener("click", () => {
      page = Number(button.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  previousButton.addEventListener("click", () => {
    page = Math.max(1, page - 1);
    render();
  });
  nextButton.addEventListener("click", () => {
    page = Math.min(Math.ceil(products.length / perPage), page + 1);
    render();
  });

  render();
});
