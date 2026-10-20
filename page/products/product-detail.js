document.addEventListener("DOMContentLoaded", () => {
  const products = window.StoreCatalog.products;
  const money = value => new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  const params = new URLSearchParams(window.location.search);
  const requestedCode = params.get("id");
  const product = requestedCode
    ? products.find(item => item.code === requestedCode)
    : products.find(item => item.code === "SP01");

  if (!product) {
    document.querySelector(".product-overview").innerHTML =
      '<p>Không tìm thấy sản phẩm. <a href="../homepage/main.html">Quay lại trang chủ</a></p>';
    return;
  }

  const categoryName = window.StoreCatalog.categories[product.category] || "Sản phẩm";
  const categoryPages = {
    pens: "pens.html",
    notebooks: "notebooks.html",
    backpacks: "backpacks.html"
  };
  const categoryLink = document.getElementById("categoryLink");
  const categoryPage = categoryPages[product.category] || "../homepage/main.html";

  document.title = `${product.title} | Học Đường Store`;
  document.getElementById("productCategory").textContent = categoryName;
  document.getElementById("productCategorySummary").textContent = categoryName;
  categoryLink.textContent = categoryName;
  categoryLink.href = categoryPage;
  document.getElementById("breadcrumbName").textContent =
    `${product.code} ${product.title}`;
  document.getElementById("productCode").textContent = `Mã: ${product.code}`;
  document.getElementById("productCodeSummary").textContent = product.code;
  document.getElementById("productName").textContent = product.title;

  const image = document.getElementById("productImage");
  image.src = product.image;
  image.alt = product.title;
  document.getElementById("thumbnail").src = product.image;
  document.getElementById("thumbnail").alt = product.title;
  document.getElementById("productPrice").textContent = money(product.price);
  document.getElementById("oldPrice").textContent =
    product.oldPrice ? money(product.oldPrice) : "";
  document.getElementById("discount").textContent = product.oldPrice
    ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
    : "";
  document.getElementById("productPack").textContent = product.pack || "1 sản phẩm";
  document.getElementById("stockText").textContent =
    `Còn ${product.stock} sản phẩm trong kho`;
  document.getElementById("descriptionTitle").textContent =
    `Trải nghiệm ${product.title}`;
  document.getElementById("descriptionText").textContent =
    product.description ||
    `${product.title} (${product.code}) là lựa chọn phù hợp cho nhu cầu học tập hằng ngày.`;
  document.getElementById("productDescription").textContent =
    product.description || `${product.title} phù hợp cho nhu cầu học tập hằng ngày.`;

  const quantity = document.getElementById("quantity");
  const notice = document.getElementById("notice");
  quantity.max = String(product.stock);

  document.getElementById("decrease").addEventListener("click", () => {
    quantity.value = String(Math.max(1, Number(quantity.value) - 1));
  });
  document.getElementById("increase").addEventListener("click", () => {
    quantity.value = String(Math.min(product.stock, Number(quantity.value) + 1));
  });

  function getQuantity() {
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
      notice.textContent = `Đã chọn ${amount} × ${product.title}.`;
    }
  });
  document.getElementById("buyNow").addEventListener("click", () => {
    const amount = getQuantity();
    if (amount !== null) {
      notice.textContent =
        `Bạn đã chọn ${amount} sản phẩm, tổng tiền ${money(amount * product.price)}.`;
    }
  });

  const relatedProducts = products
    .filter(item => item.category === product.category && item.code !== product.code)
    .slice(0, 4);
  document.getElementById("relatedProducts").innerHTML = relatedProducts.map(item => `
    <a class="related-card" href="product-detail.html?id=${encodeURIComponent(item.code)}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <small>${item.code}</small>
      <strong>${item.title}</strong>
      <span>${money(item.price)}</span>
    </a>
  `).join("");
});
