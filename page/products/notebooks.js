
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      code: "VG01",
      name: "Vở học sinh 200 trang",
      price: 18000,
      oldPrice: 22000,
      stock: 150,
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG02",
      name: "Vở ô ly học sinh 96 trang",
      price: 12000,
      stock: 180,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG03",
      name: "Sổ tay lò xo A5",
      price: 35000,
      oldPrice: 42000,
      stock: 75,
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG04",
      name: "Giấy kiểm tra học sinh",
      price: 10000,
      stock: 200,
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG05",
      name: "Giấy A4 80gsm (500 tờ)",
      price: 85000,
      oldPrice: 95000,
      stock: 65,
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG06",
      name: "Sổ ghi chép bìa cứng",
      price: 45000,
      stock: 55,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG07",
      name: "Giấy note nhiều màu",
      price: 22000,
      stock: 90,
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85"
    },
    {
      code: "VG08",
      name: "Vở ghi chép đại học A4",
      price: 28000,
      oldPrice: 32000,
      stock: 110,
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85"
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
            <span class="product-tag">Vở &amp; giấy</span>
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
