
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      code: "DC01",
      name: "Thước kẻ nhựa 20cm",
      price: 8000,
      oldPrice: 10000,
      stock: 150,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC02",
      name: "Hộp bút học sinh đa năng",
      price: 45000,
      oldPrice: 55000,
      stock: 80,
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC03",
      name: "Máy tính cầm tay học sinh",
      price: 185000,
      oldPrice: 210000,
      stock: 35,
      image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC04",
      name: "Gôm tẩy trắng sạch",
      price: 5000,
      stock: 200,
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC05",
      name: "Đồ chuốt bút chì",
      price: 12000,
      stock: 100,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC06",
      name: "Compa học sinh kèm bút chì",
      price: 25000,
      oldPrice: 30000,
      stock: 60,
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC07",
      name: "Kéo học sinh đầu tròn",
      price: 18000,
      stock: 75,
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "DC08",
      name: "Keo dán giấy học sinh",
      price: 15000,
      stock: 90,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85"
    }
  ];

  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  const sort = document.getElementById("sortSelect");
  const search = document.getElementById("searchInput");
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const pageButtons = [...document.querySelectorAll(".page-number")];

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
    } else if (sort.value === "high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort.value === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    const totalPages = Math.max(1, Math.ceil(list.length / perPage));
    page = Math.min(page, totalPages);
    page = Math.max(1, page);

    const shown = list.slice(
      (page - 1) * perPage,
      page * perPage
    );

    count.textContent = list.length
      ? `Hiển thị ${(page - 1) * perPage + 1}–${Math.min(
          page * perPage,
          list.length
        )} của ${list.length} sản phẩm`
      : "Không tìm thấy sản phẩm phù hợp";

    grid.innerHTML = shown.map(p => `
      <article class="store-product-card">
        <a class="store-product-image-link"
           href="product-detail.html?id=${p.code}">
          <div class="store-product-visual">
            <span class="store-product-tag">Dụng cụ học tập</span>
            <img
              src="${p.image}"
              alt="${p.name}"
              loading="lazy"
              onerror="this.style.display='none';this.parentElement.classList.add('image-missing')"
            >
          </div>
        </a>

        <div class="store-product-code">Mã: ${p.code}</div>

        <a class="store-product-name"
           href="product-detail.html?id=${p.code}">
          ${p.name}
        </a>

        <div class="store-product-meta">
          <strong class="store-product-price">${money(p.price)}</strong>
          ${
            p.oldPrice
              ? `<span class="store-product-old-price">${money(p.oldPrice)}</span>`
              : `<span class="store-product-stock">Kho: ${p.stock}</span>`
          }
        </div>

        <button class="store-product-cart add-cart" type="button">
          <span>🛒</span> Thêm vào giỏ
        </button>
      </article>
    `).join("");

    pageButtons.forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.page) === page);
      btn.hidden = Number(btn.dataset.page) > totalPages;
    });

    prevPage.disabled = page === 1;
    nextPage.disabled = page >= totalPages;

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

  pageButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      page = Number(btn.dataset.page);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  prevPage.addEventListener("click", () => {
    page = Math.max(1, page - 1);
    render();
  });

  nextPage.addEventListener("click", () => {
    page = Math.min(Math.ceil(products.length / perPage), page + 1);
    render();
  });

  render();
});
