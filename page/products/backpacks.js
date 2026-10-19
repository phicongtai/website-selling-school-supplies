
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      code: "CB01",
      name: "Balo học sinh chống thấm",
      price: 289000,
      oldPrice: 350000,
      stock: 45,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85",
      hot: true
    },
    {
      code: "CB02",
      name: "Balo laptop 15.6 inch",
      price: 459000,
      oldPrice: 520000,
      stock: 30,
      image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB03",
      name: "Cặp sách học sinh tiểu học",
      price: 235000,
      stock: 60,
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB04",
      name: "Balo mini thời trang",
      price: 199000,
      stock: 38,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB05",
      name: "Balo nhiều ngăn đi học",
      price: 329000,
      oldPrice: 390000,
      stock: 42,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB06",
      name: "Túi tote đựng sách vở",
      price: 99000,
      stock: 80,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB07",
      name: "Balo thể thao đa năng",
      price: 279000,
      stock: 25,
      image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "CB08",
      name: "Cặp đeo chéo đựng tài liệu",
      price: 159000,
      oldPrice: 189000,
      stock: 33,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85"
    }
  ];

  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  const sort = document.getElementById("sortSelect");
  const search = document.getElementById("searchInput");

  let page = 1;
  const perPage = 6;

  const money = value =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  function render() {
    let list = products.filter(p =>
      `${p.code} ${p.name}`
        .toLowerCase()
        .includes(search.value.trim().toLowerCase())
    );

    if (sort.value === "low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort.value === "high") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sort.value === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    const totalPages = Math.max(1, Math.ceil(list.length / perPage));
    page = Math.min(page, totalPages);

    const shown = list.slice(
      (page - 1) * perPage,
      page * perPage
    );

    count.textContent = list.length
      ? `Hiển thị ${(page - 1) * perPage + 1}–${Math.min(page * perPage, list.length)} của ${list.length} sản phẩm`
      : "Không tìm thấy sản phẩm phù hợp";

    grid.innerHTML = shown.map(p => `
      <article class="product-card">
        <a class="product-detail-link"
           href="product-detail.html?id=${p.code}">
          <div class="product-visual">
            <span class="product-tag">Cặp &amp; balo</span>
            ${p.hot ? '<span class="product-tag hot">Hot</span>' : ''}
            <img src="${p.image}" alt="${p.name}" loading="lazy"
              onerror="this.style.display='none';this.parentElement.classList.add('image-missing')">
          </div>
        </a>

        <div class="product-code">Mã: ${p.code}</div>

        <a class="product-detail-link product-name-link"
           href="product-detail.html?id=${p.code}">
          <div class="product-name">${p.name}</div>
        </a>

        <div class="product-meta">
          <strong class="price">${money(p.price)}</strong>
          ${p.oldPrice
            ? `<span class="old-price">${money(p.oldPrice)}</span>`
            : `<span class="stock">Kho: ${p.stock}</span>`}
        </div>

        <button class="add-cart" type="button">
          <span>🛒</span> Thêm vào giỏ
        </button>
      </article>
    `).join("");

    document.querySelectorAll(".page-number").forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.page) === page);
      btn.hidden = Number(btn.dataset.page) > totalPages;
    });

    document.getElementById("prevPage").disabled = page === 1;
    document.getElementById("nextPage").disabled = page === totalPages;

    grid.querySelectorAll(".add-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.add("added");
        btn.textContent = "✓ Đã thêm vào giỏ";

        setTimeout(() => {
          btn.classList.remove("added");
          btn.innerHTML = "<span>🛒</span> Thêm vào giỏ";
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

  document.getElementById("searchButton").addEventListener("click", () => {
    search.focus();
    page = 1;
    render();
  });

  document.querySelectorAll(".page-number").forEach(btn => {
    btn.addEventListener("click", () => {
      page = Number(btn.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    page = Math.max(1, page - 1);
    render();
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    page = Math.min(Math.ceil(products.length / perPage), page + 1);
    render();
  });

  render();
});
