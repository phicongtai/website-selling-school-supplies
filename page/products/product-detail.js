document.addEventListener("DOMContentLoaded", () => {
  const products = window.StoreCatalog.products;
  const money = value => new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  const params = new URLSearchParams(window.location.search);
  const requestedCode = params.get("id");

  // Tìm sản phẩm theo code hoặc id
  const product = requestedCode
    ? products.find(item => item.code === requestedCode || String(item.id) === requestedCode)
    : products.find(item => item.code === "SP01" || item.code === "HP01");

  if (!product) {
    document.querySelector(".product-overview").innerHTML =
      '<p style="padding: 40px; text-align: center; font-size: 18px;">❌ Không tìm thấy sản phẩm. <a href="../homepage/main.html">Quay lại trang chủ</a></p>';
    return;
  }

  const categoryName = window.StoreCatalog.categories[product.category] || "Sản phẩm";
  const categoryPages = {
    pens: "pens.html",
    notebooks: "notebooks.html",
    backpacks: "backpacks.html",
    "school-supplies": "school-supplies.html",
    art: "art.html",
    computers: "computers.html",
    cases: "../homepage/main.html?category=cases"
  };
  const categoryLink = document.getElementById("categoryLink");
  const categoryPage = categoryPages[product.category] || "../homepage/main.html";

  document.title = `${product.title} | Học Đường Store`;
  document.getElementById("productCategory").textContent = categoryName;
  document.getElementById("productCategorySummary").textContent = categoryName;
  if (categoryLink) {
    categoryLink.textContent = categoryName;
    categoryLink.href = categoryPage;
  }
  
  const breadcrumbName = document.getElementById("breadcrumbName");
  if (breadcrumbName) {
    breadcrumbName.textContent = `${product.code} ${product.title}`;
  }

  document.getElementById("productCode").textContent = `Mã: ${product.code}`;
  document.getElementById("productCodeSummary").textContent = product.code;
  document.getElementById("productName").textContent = product.title;

  const image = document.getElementById("productImage");
  if (image) {
    image.src = product.image;
    image.alt = product.title;
  }
  
  const thumbnail = document.getElementById("thumbnail");
  if (thumbnail) {
    thumbnail.src = product.image;
    thumbnail.alt = product.title;
  }

  document.getElementById("productPrice").textContent = money(product.price);
  const oldPriceEl = document.getElementById("oldPrice");
  const discountEl = document.getElementById("discount");

  if (product.oldPrice) {
    oldPriceEl.textContent = money(product.oldPrice);
    discountEl.textContent = `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`;
  } else {
    oldPriceEl.textContent = "";
    discountEl.textContent = "";
  }

  document.getElementById("productPack").textContent = product.pack || "1 sản phẩm";
  document.getElementById("stockText").textContent = `Còn ${product.stock} sản phẩm trong kho`;
  document.getElementById("descriptionTitle").textContent = `Trải nghiệm ${product.title}`;
  document.getElementById("descriptionText").textContent =
    product.description || `${product.title} (${product.code}) là lựa chọn phù hợp cho nhu cầu học tập hằng ngày.`;
  document.getElementById("productDescription").textContent =
    product.description || `${product.title} phù hợp cho nhu cầu học tập hằng ngày.`;

  const bestTag = document.querySelector(".best-tag");
  if (bestTag) {
    bestTag.hidden = !product.hot;
    bestTag.style.display = product.hot ? "" : "none";
  }

  const quantity = document.getElementById("quantity");
  const notice = document.getElementById("notice");
  if (quantity) {
    quantity.max = String(product.stock);

    document.getElementById("decrease").addEventListener("click", () => {
      quantity.value = String(Math.max(1, Number(quantity.value) - 1));
    });
    document.getElementById("increase").addEventListener("click", () => {
      quantity.value = String(Math.min(product.stock, Number(quantity.value) + 1));
    });
  }

  function getQuantity() {
    if (!quantity) return 1;
    const value = Number(quantity.value);
    if (!Number.isInteger(value) || value < 1 || value > product.stock) {
      notice.textContent = `Vui lòng chọn số lượng từ 1 đến ${product.stock}.`;
      return null;
    }
    return value;
  }

  document.getElementById("addToCart").addEventListener("click", () => {
    const amount = getQuantity();
    if (amount !== null) {
      if (window.StoreCart) window.StoreCart.add(product.id, amount);
      notice.textContent = `Đã thêm ${amount} × ${product.title} vào giỏ hàng.`;
      if (window.showSiteToast) window.showSiteToast("Đã thêm sản phẩm vào giỏ hàng!");
    }
  });

  document.getElementById("buyNow").addEventListener("click", () => {
    const amount = getQuantity();
    if (amount !== null) {
      notice.textContent = `Bạn đã chọn ${amount} sản phẩm, tổng tiền ${money(amount * product.price)}.`;
    }
  });

  let relatedProducts = products
    .filter(item => item.category === product.category && item.code !== product.code)
    .slice(0, 4);
  let relatedTitle = "Sản phẩm cùng loại";

  // Danh mục chỉ có một sản phẩm: gợi ý các sản phẩm nổi bật khác để không bỏ trống khu vực.
  if (relatedProducts.length === 0) {
    relatedProducts = products
      .filter(item => item.code !== product.code && (item.featured || item.hot))
      .slice(0, 4);
    relatedTitle = "Sản phẩm gợi ý";
  }
  if (relatedProducts.length === 0) {
    relatedProducts = products.filter(item => item.code !== product.code).slice(0, 4);
    relatedTitle = "Sản phẩm gợi ý";
  }

  const relatedHeading = document.querySelector(".related-section h2");
  if (relatedHeading) relatedHeading.textContent = relatedTitle;

  document.getElementById("relatedProducts").innerHTML = relatedProducts.map(item => `
    <a class="related-card" href="product-detail.html?id=${encodeURIComponent(item.code)}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <small>${item.code}</small>
      <strong>${item.title}</strong>
      <span>${money(item.price)}</span>
    </a>
  `).join("");
});
