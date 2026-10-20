
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      code: "SP01",
      name: "Bút gel đen 0.5mm (hộp 10 cây)",
      price: 45000,
      oldPrice: 55000,
      stock: 120,
      pack: "10 cây / Hộp",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP02",
      name: "Bút bi xanh êm tay (vỉ 5 cây)",
      price: 25000,
      stock: 120,
      pack: "5 cây / Vỉ",
      image: "https://down-vn.img.susercontent.com/file/e1d32d504e8bb3568ca14d404f30e82a"
    },
    {
      code: "SP03",
      name: "Bút máy luyện chữ học sinh",
      price: 89000,
      oldPrice: 110000,
      stock: 35,
      pack: "1 cây",
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP04",
      name: "Bút highlight pastel (bộ 6 màu)",
      price: 59000,
      stock: 45,
      pack: "6 màu / Bộ",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP05",
      name: "Bút gel nhiều màu (bộ 12 màu)",
      price: 78000,
      oldPrice: 95000,
      stock: 60,
      pack: "12 màu / Bộ",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP06",
      name: "Bút chì gỗ 2B (hộp 12 cây)",
      price: 36000,
      stock: 210,
      pack: "12 cây / Hộp",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP07",
      name: "Bút bi mực đen nét mảnh",
      price: 18000,
      stock: 95,
      pack: "1 cây",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "SP08",
      name: "Bút ký thân kim loại",
      price: 125000,
      oldPrice: 150000,
      stock: 18,
      pack: "1 cây",
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=800&q=85"
    },
    
    // ===== VỞ & GIẤY =====
    {
      code: "VG01",
      name: "Vở học sinh 200 trang",
      price: 18000,
      oldPrice: 22000,
      stock: 150,
      pack: "200 trang",
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG02",
      name: "Vở ô ly học sinh 96 trang",
      price: 12000,
      stock: 180,
      pack: "96 trang",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG03",
      name: "Sổ tay lò xo A5",
      price: 35000,
      oldPrice: 42000,
      stock: 75,
      pack: "Khổ A5",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG04",
      name: "Giấy kiểm tra học sinh",
      price: 10000,
      stock: 200,
      pack: "1 tập",
      image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG05",
      name: "Giấy A4 80gsm (500 tờ)",
      price: 85000,
      oldPrice: 95000,
      stock: 65,
      pack: "500 tờ / Ram",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG06",
      name: "Sổ ghi chép bìa cứng",
      price: 45000,
      stock: 55,
      pack: "1 quyển",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG07",
      name: "Giấy note nhiều màu",
      price: 22000,
      stock: 90,
      pack: "1 bộ nhiều màu",
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "VG08",
      name: "Vở ghi chép đại học A4",
      price: 28000,
      oldPrice: 32000,
      stock: 110,
      pack: "Khổ A4",
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85"
    },

    // ===== CẶP & BALO =====
    {
      code: "CB01",
      name: "Balo học sinh chống thấm",
      price: 289000,
      oldPrice: 350000,
      stock: 45,
      pack: "1 balo",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB02",
      name: "Balo laptop 15.6 inch",
      price: 459000,
      oldPrice: 520000,
      stock: 30,
      pack: "1 balo",
      image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB03",
      name: "Cặp sách học sinh tiểu học",
      price: 235000,
      stock: 60,
      pack: "1 cặp",
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB04",
      name: "Balo mini thời trang",
      price: 199000,
      stock: 38,
      pack: "1 balo",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB05",
      name: "Balo nhiều ngăn đi học",
      price: 329000,
      oldPrice: 390000,
      stock: 42,
      pack: "1 balo",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB06",
      name: "Túi tote đựng sách vở",
      price: 99000,
      stock: 80,
      pack: "1 túi",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB07",
      name: "Balo thể thao đa năng",
      price: 279000,
      stock: 25,
      pack: "1 balo",
      image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=800&q=85"
    },
    {
      code: "CB08",
      name: "Cặp đeo chéo đựng tài liệu",
      price: 159000,
      oldPrice: 189000,
      stock: 33,
      pack: "1 cặp",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85"
    }
    ,
    { code: "DC01", name: "Thước kẻ nhựa 20cm", price: 8000, oldPrice: 10000, stock: 150, pack: "20 cm", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85" },
    { code: "DC02", name: "Hộp bút học sinh đa năng", price: 45000, oldPrice: 55000, stock: 80, pack: "1 hộp", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=85" },
    { code: "DC03", name: "Máy tính cầm tay học sinh", price: 185000, oldPrice: 210000, stock: 35, pack: "1 máy", image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=85" },
    { code: "DC04", name: "Gôm tẩy trắng sạch", price: 5000, stock: 200, pack: "1 cục", image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=800&q=85" },
    { code: "DC05", name: "Đồ chuốt bút chì", price: 12000, stock: 100, pack: "1 chiếc", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85" },
    { code: "DC06", name: "Compa học sinh kèm bút chì", price: 25000, oldPrice: 30000, stock: 60, pack: "1 bộ", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85" },
    { code: "DC07", name: "Kéo học sinh đầu tròn", price: 18000, stock: 75, pack: "1 chiếc", image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=800&q=85" },
    { code: "DC08", name: "Keo dán giấy học sinh", price: 15000, stock: 90, pack: "1 chai", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85" }
  ];


  const money = value =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const params = new URLSearchParams(window.location.search);
  const code = params.get("id") || "SP01";
  const product = products.find(p => p.code === code);

  if (!product) {
    document.querySelector(".product-overview").innerHTML =
      '<p>Không tìm thấy sản phẩm. <a href="pens.html">Quay lại danh mục</a></p>';
    return;
  }

  document.title = `${product.name} | Học Đường Store`;
  const categoryInfo = {
  SP: { name: "Bút viết", link: "pens.html" },
  VG: { name: "Vở & giấy", link: "notebooks.html" },
  CB: { name: "Cặp & balo", link: "backpacks.html" },
  DC: { name: "Dụng cụ học tập", link: "school-supplies.html" }
};

const category = categoryInfo[product.code.substring(0, 2)];

if (category) {
  document.getElementById("productCategory").textContent = category.name;

  const categoryLink = document.getElementById("categoryLink");
  categoryLink.textContent = category.name;
  categoryLink.href = category.link;
}

  document.getElementById("breadcrumbName").textContent =
    `${product.code} ${product.name}`;

  document.getElementById("productCode").textContent =
    `Mã: ${product.code}`;

  document.getElementById("productName").textContent = product.name;

  const image = document.getElementById("productImage");
  image.src = product.image;
  image.alt = product.name;

  document.getElementById("thumbnail").src = product.image;
  document.getElementById("thumbnail").alt = product.name;

  document.getElementById("productPrice").textContent =
    money(product.price);

  document.getElementById("oldPrice").textContent =
    product.oldPrice ? money(product.oldPrice) : "";

  document.getElementById("discount").textContent =
    product.oldPrice
      ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
      : "";

  document.getElementById("productPack").textContent = product.pack;
  document.getElementById("stockText").textContent =
    `Còn ${product.stock} sản phẩm trong kho`;

  document.getElementById("descriptionTitle").textContent =
    `Trải nghiệm ${product.name}`;

  document.getElementById("descriptionText").textContent =
    `${product.name} (${product.code}) là lựa chọn dành cho học sinh, sinh viên và người đi làm. Sản phẩm có quy cách ${product.pack}, phù hợp với nhu cầu học tập và ghi chép hằng ngày.`;

  const quantity = document.getElementById("quantity");
  const notice = document.getElementById("notice");

  document.getElementById("decrease").addEventListener("click", () => {
    quantity.value = Math.max(1, Number(quantity.value) - 1);
  });

  document.getElementById("increase").addEventListener("click", () => {
    quantity.value = Math.min(
      product.stock,
      Math.max(1, Number(quantity.value) + 1)
    );
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
    if (amount === null) return;

    notice.textContent =
      `Đã chọn ${amount} × ${product.name}.`;

    // Đây mới là thông báo giao diện, chưa lưu giỏ hàng thực tế.
  });

  document.getElementById("buyNow").addEventListener("click", () => {
    const amount = getQuantity();
    if (amount === null) return;

    notice.textContent =
      `Bạn đã chọn ${amount} sản phẩm, tổng tiền ${money(amount * product.price)}.`;
  });

  const relatedProducts = products.filter(p => p.code !== product.code).slice(0, 4);

  document.getElementById("relatedProducts").innerHTML =
    relatedProducts.map(p => `
      <a class="related-card" href="product-detail.html?id=${p.code}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <small>${p.code}</small>
        <strong>${p.name}</strong>
        <span>${money(p.price)}</span>
      </a>
    `).join("");
});
