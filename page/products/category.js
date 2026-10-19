// S02 - Dữ liệu và tương tác trang danh mục Bút viết
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {code:"SP01",name:"Bút gel đen 0.5mm (hộp 10 cây)",price:45000,oldPrice:55000,stock:120,image:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=85"},
    {code:"SP02",name:"Bút bi xanh êm tay (vỉ 5 cây)",price:25000,stock:120,image:"https://down-vn.img.susercontent.com/file/e1d32d504e8bb3568ca14d404f30e82a"},
    {code:"SP03",name:"Bút máy luyện chữ học sinh",price:89000,oldPrice:110000,stock:35,image:"https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85",hot:true},
    {code:"SP04",name:"Bút highlight pastel (bộ 6 màu)",price:59000,stock:45,image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85"},
    {code:"SP05",name:"Bút gel nhiều màu (bộ 12 màu)",price:78000,oldPrice:95000,stock:60,image:"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=85"},
    {code:"SP06",name:"Bút chì gỗ 2B (hộp 12 cây)",price:36000,stock:210,image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85"},
    {code:"SP07",name:"Bút bi mực đen nét mảnh",price:18000,stock:95,image:"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=85"},
    {code:"SP08",name:"Bút ký thân kim loại",price:125000,oldPrice:150000,stock:18,image:"https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85"}
  ];
  // Ảnh pastel có URL riêng để tránh lỗi tải do nguồn ảnh không hợp lệ.
  products[3].image = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85";
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("resultCount");
  const sort = document.getElementById("sortSelect");
  const search = document.getElementById("searchInput");
  let page = 1;
  const perPage = 6;
  const money = value => new Intl.NumberFormat("vi-VN").format(value) + "đ";

  function render() {
    let list = products.filter(p => `${p.code} ${p.name}`.toLowerCase().includes(search.value.trim().toLowerCase()));
    if (sort.value === "low") list.sort((a,b)=>a.price-b.price);
    if (sort.value === "high") list.sort((a,b)=>b.price-a.price);
    if (sort.value === "name") list.sort((a,b)=>a.name.localeCompare(b.name,"vi"));
    const totalPages = Math.max(1,Math.ceil(list.length/perPage));
    page = Math.min(page,totalPages);
    const shown = list.slice((page-1)*perPage,page*perPage);
    count.textContent = list.length ? `Hiển thị ${(page-1)*perPage+1}–${Math.min(page*perPage,list.length)} của ${list.length} sản phẩm` : "Không tìm thấy sản phẩm phù hợp";
    grid.innerHTML = shown.map(p => `
  <article class="product-card">
    <a class="product-detail-link" href="product-detail.html?id=${p.code}">
      <div class="product-visual">
        <span class="product-tag">Bút viết</span>
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

    document.querySelectorAll(".page-number").forEach(btn=>{btn.classList.toggle("active",Number(btn.dataset.page)===page);btn.hidden=Number(btn.dataset.page)>totalPages});
    document.getElementById("prevPage").disabled=page===1;
    document.getElementById("nextPage").disabled=page===totalPages;
    grid.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{btn.classList.add("added");btn.textContent="✓ Đã thêm vào giỏ";setTimeout(()=>{btn.classList.remove("added");btn.innerHTML='<span>🛒</span> Thêm vào giỏ'},1200)}));
  }
  sort.addEventListener("change",()=>{page=1;render()});
  search.addEventListener("input",()=>{page=1;render()});
  document.getElementById("searchButton").addEventListener("click",()=>{search.focus();page=1;render()});
  document.querySelectorAll(".page-number").forEach(btn=>btn.addEventListener("click",()=>{page=Number(btn.dataset.page);render();window.scrollTo({top:0,behavior:"smooth"})}));
  document.getElementById("prevPage").addEventListener("click",()=>{page=Math.max(1,page-1);render()});
  document.getElementById("nextPage").addEventListener("click",()=>{page=Math.min(2,page+1);render()});
  render();
});

grid.innerHTML = shown.map(p => `
  <article class="product-card">
    <a class="product-detail-link" href="product-detail.html?id=${p.code}">
      <div class="product-visual">
        <span class="product-tag">Bút viết</span>
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
