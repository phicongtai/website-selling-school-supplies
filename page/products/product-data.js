window.StoreCatalog = {
  categories: {
    pens: "Bút viết",
    notebooks: "Vở & giấy",
    backpacks: "Cặp & balo",
    cases: "Hộp bút",
    art: "Dụng cụ vẽ & mỹ thuật",
    "school-supplies": "Dụng cụ học tập",
    computers: "Máy tính & thiết bị học tập"
  },
  products: [
    { id: 1, code: "HP01", title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm", category: "pens", price: 65000, oldPrice: 85000, stock: 120, pack: "10 cây / Bộ", image: "hp01.jpg", description: "Bút gel màu Morandi thanh lịch, ngòi 0.5mm êm ái, mau khô không lem giấy.", featured: true },
    { id: 2, code: "HP02", title: "Bút Máy Pilot Kakuno Ngòi F Nhật Bản", category: "pens", price: 195000, oldPrice: 230000, stock: 35, pack: "1 cây", image: "hp02.jpg", description: "Bút máy học sinh Nhật Bản ngòi thép định hình tay cầm chuẩn.", featured: true },
    { id: 3, code: "HP03", title: "Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro", category: "notebooks", price: 89000, oldPrice: 120000, stock: 75, pack: "Khổ A5", image: "hp03.jpg", description: "Sổ còng 6 lỗ tháo lắp dễ dàng, giấy 100gsm chống thấm mực.", featured: true },
    { id: 4, code: "HP04", title: "Balo Chống Gù Lưng Học Sinh Công Thái Học", category: "backpacks", price: 360000, oldPrice: 480000, stock: 45, pack: "1 balo", image: "hp04.jpg", description: "Đệm lưng thoáng khí chống gù, vải Oxford trượt nước.", featured: true },
    { id: 5, code: "HP05", title: "Hộp Bút Vải Canvas Mở Rộng 3 Tầng Ngăn Lớn", category: "cases", price: 68000, oldPrice: 85000, stock: 60, pack: "1 hộp", image: "hp05.jpg", description: "Sức chứa hơn 40 cây bút cùng thước kẻ và máy tính bỏ túi.", featured: true },
    { id: 6, code: "HP06", title: "Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha", category: "art", price: 185000, oldPrice: 240000, stock: 40, pack: "36 màu / Bộ", image: "hp06.jpg", description: "Bột màu nén cao cấp hạt siêu mịn trong hộp thiếc cao cấp.", featured: true },
    { id: 7, code: "HP07", title: "Bàn học công thái học", category: "school-supplies", price: 385000, oldPrice: 640000, stock: 20, pack: "1 bàn", image: "hp07.jpg", description: "Bàn học giúp bé điều chỉnh tư thế phù hợp.", featured: true },

    { id: 8, code: "SP01", title: "Bút gel đen 0.5mm (hộp 10 cây)", category: "pens", price: 45000, oldPrice: 55000, stock: 120, pack: "10 cây / Hộp", image: "sp01.jpg" },
    { id: 9, code: "SP02", title: "Bút bi xanh êm tay (vỉ 5 cây)", category: "pens", price: 25000, stock: 120, pack: "5 cây / Vỉ", image: "sp02.jpg" },
    { id: 10, code: "SP03", title: "Bút máy luyện chữ học sinh", category: "pens", price: 89000, oldPrice: 110000, stock: 35, pack: "1 cây", image: "sp03.jpg", hot: true },
    { id: 11, code: "SP04", title: "Bút highlight pastel (bộ 6 màu)", category: "pens", price: 59000, stock: 45, pack: "6 màu / Bộ", image: "sp04.jpg" },
    { id: 12, code: "SP05", title: "Bút gel nhiều màu (bộ 12 màu)", category: "pens", price: 78000, oldPrice: 95000, stock: 60, pack: "12 màu / Bộ", image: "sp05.jpg" },
    { id: 13, code: "SP06", title: "Bút chì gỗ 2B (hộp 12 cây)", category: "pens", price: 36000, stock: 210, pack: "12 cây / Hộp", image: "sp06.jpg" },
    { id: 14, code: "SP07", title: "Bút bi mực đen nét mảnh", category: "pens", price: 18000, stock: 95, pack: "1 cây", image: "sp07.jpg" },
    { id: 15, code: "SP08", title: "Bút ký thân kim loại", category: "pens", price: 125000, oldPrice: 150000, stock: 18, pack: "1 cây", image: "sp08.jpg" },

    { id: 16, code: "VG01", title: "Vở học sinh 200 trang", category: "notebooks", price: 18000, oldPrice: 22000, stock: 150, pack: "200 trang", image: "vg01.jpg" },
    { id: 17, code: "VG02", title: "Vở ô ly học sinh 96 trang", category: "notebooks", price: 12000, stock: 180, pack: "96 trang", image: "vg02.jpg" },
    { id: 18, code: "VG03", title: "Sổ tay lò xo A5", category: "notebooks", price: 35000, oldPrice: 42000, stock: 75, pack: "Khổ A5", image: "vg03.jpg" },
    { id: 19, code: "VG04", title: "Giấy kiểm tra học sinh", category: "notebooks", price: 10000, stock: 200, pack: "1 tập", image: "vg04.jpg" },
    { id: 20, code: "VG05", title: "Giấy A4 80gsm (500 tờ)", category: "notebooks", price: 85000, oldPrice: 95000, stock: 65, pack: "500 tờ / Ram", image: "vg05.jpg" },
    { id: 21, code: "VG06", title: "Sổ ghi chép bìa cứng", category: "notebooks", price: 45000, stock: 55, pack: "1 quyển", image: "vg06.jpg" },
    { id: 22, code: "VG07", title: "Giấy note nhiều màu", category: "notebooks", price: 22000, stock: 90, pack: "1 bộ nhiều màu", image: "vg07.jpg" },
    { id: 23, code: "VG08", title: "Vở ghi chép đại học A4", category: "notebooks", price: 28000, oldPrice: 32000, stock: 110, pack: "Khổ A4", image: "vg08.jpg" },

    { id: 24, code: "CB01", title: "Balo học sinh chống thấm", category: "backpacks", price: 289000, oldPrice: 350000, stock: 45, pack: "1 balo", image: "cb01.jpg", hot: true },
    { id: 25, code: "CB02", title: "Balo laptop 15.6 inch", category: "backpacks", price: 459000, oldPrice: 520000, stock: 30, pack: "1 balo", image: "cb02.jpg" },
    { id: 26, code: "CB03", title: "Cặp sách học sinh tiểu học", category: "backpacks", price: 235000, stock: 60, pack: "1 cặp", image: "cb03.jpg" },
    { id: 27, code: "CB04", title: "Balo mini thời trang", category: "backpacks", price: 199000, stock: 38, pack: "1 balo", image: "cb04.jpg" },
    { id: 28, code: "CB05", title: "Balo nhiều ngăn đi học", category: "backpacks", price: 329000, oldPrice: 390000, stock: 42, pack: "1 balo", image: "cb05.jpg" },
    { id: 29, code: "CB06", title: "Túi tote đựng sách vở", category: "backpacks", price: 99000, stock: 80, pack: "1 túi", image: "cb06.jpg" },
    { id: 30, code: "CB07", title: "Balo thể thao đa năng", category: "backpacks", price: 279000, stock: 25, pack: "1 balo", image: "cb07.jpg" },
    { id: 31, code: "CB08", title: "Cặp đeo chéo đựng tài liệu", category: "backpacks", price: 159000, oldPrice: 189000, stock: 33, pack: "1 cặp", image: "cb08.jpg" },

    { id: 32, code: "MT01", title: "Bộ bút chì màu 48 màu cao cấp", category: "art", price: 145000, oldPrice: 180000, stock: 48, pack: "48 màu / Bộ", image: "sp03.jpg", description: "Bút chì màu ruột mềm, lên màu mịn, phù hợp tô màu và phác thảo." },
    { id: 33, code: "MT02", title: "Bộ cọ vẽ 12 cây lông tổng hợp", category: "art", price: 89000, oldPrice: 110000, stock: 52, pack: "12 cây / Bộ", image: "mt02.jpg", description: "Cọ đầu tròn, dẹt và đầu nhọn giữ màu tốt, thích hợp màu nước và acrylic." },
    { id: 34, code: "MT03", title: "Sổ sketch A4 giấy 160gsm", category: "art", price: 75000, stock: 65, pack: "Khổ A4", image: "mt03.jpg", description: "Giấy vẽ dày 160gsm chống thấm, bề mặt mịn dùng cho chì, màu nước và marker.", hot: true },
    { id: 35, code: "MT04", title: "Bộ màu acrylic 24 màu kèm cọ", category: "art", price: 165000, oldPrice: 195000, stock: 36, pack: "24 màu / Bộ", image: "mt04.jpg", description: "Màu acrylic độ phủ cao, nhanh khô, kèm cọ và hộp đựng tiện lợi." },
    { id: 36, code: "MT05", title: "Bảng pha màu gỗ 2 mặt", category: "art", price: 55000, stock: 70, pack: "1 bảng", image: "mt05.jpg", description: "Bảng pha màu gỗ ép 2 mặt, dễ vệ sinh, phù hợp màu nước và acrylic." },
    { id: 37, code: "MT06", title: "Giá vẽ gỗ A3 điều chỉnh độ cao", category: "art", price: 420000, oldPrice: 520000, stock: 15, pack: "1 giá", image: "mt06.jpg", description: "Giá vẽ gỗ chắc chắn, điều chỉnh được độ nghiêng và chiều cao khi đứng vẽ." },
    { id: 38, code: "MT07", title: "Bộ marker phác thảo 24 màu", category: "art", price: 225000, oldPrice: 280000, stock: 42, pack: "24 màu / Bộ", image: "sp08.jpg", description: "Marker hai đầu ngòi mảnh và ngòi lớn, màu lên đều, không lem khi phác thảo." },

    { id: 39, code: "TB01", title: "Máy tính khoa học Casio FX-580VN X", category: "computers", price: 685000, oldPrice: 750000, stock: 40, pack: "1 máy", image: "tb01.jpg", description: "Máy tính khoa học 580 chức năng, màn hình độ phân giải cao, phù hợp thi THPT." },
    { id: 40, code: "TB02", title: "Máy tính bảng học tập 10.1 inch", category: "computers", price: 3290000, oldPrice: 3790000, stock: 18, pack: "1 máy", image: "tb02.jpg", description: "Màn hình 10.1 inch, pin bền bỉ, hỗ trợ học trực tuyến và ghi chú bằng bút cảm ứng." },
    { id: 41, code: "TB03", title: "Laptop học tập 14 inch mỏng nhẹ", category: "computers", price: 11900000, oldPrice: 13500000, stock: 12, pack: "1 laptop", image: "tb03.jpg", description: "Laptop 14 inch mỏng nhẹ, cấu hình đáp ứng tốt nhu cầu học tập và làm việc văn phòng.", hot: true },
    { id: 42, code: "TB04", title: "Bàn phím cơ không dây cho học tập", category: "computers", price: 450000, oldPrice: 550000, stock: 26, pack: "1 bàn phím", image: "tb04.jpg", description: "Bàn phím cơ gõ êm, kết nối Bluetooth và USB, thiết kế gọn cho bàn học." },
    { id: 43, code: "TB05", title: "Chuột không dây im lặng", category: "computers", price: 189000, oldPrice: 250000, stock: 58, pack: "1 chuột", image: "tb05.jpg", description: "Chuột không dây cảm biến chính xác, nút bấm êm, phù hợp học online và làm việc." },
    { id: 44, code: "TB06", title: "Tai nghe học online chống ồn", category: "computers", price: 299000, oldPrice: 390000, stock: 34, pack: "1 tai nghe", image: "tb06.jpg", description: "Tai nghe có micro, đệm tai êm, giảm tiếng ồn cho các buổi học trực tuyến." },
    { id: 45, code: "TB07", title: "Đèn bàn LED chống cận điều chỉnh", category: "computers", price: 329000, oldPrice: 420000, stock: 29, pack: "1 đèn", image: "tb07.jpg", description: "Đèn LED chống chói, nhiều mức sáng, bảo vệ mắt khi học và đọc sách." },
    { id: 46, code: "TB08", title: "Giá đỡ laptop nhôm gấp gọn", category: "computers", price: 159000, oldPrice: 210000, stock: 47, pack: "1 giá đỡ", image: "tb08.jpg", description: "Giá đỡ laptop bằng nhôm, điều chỉnh độ cao, giúp tư thế ngồi học thoải mái." },

    { id: 47, code: "DC01", title: "Thước kẻ nhựa 20cm", category: "school-supplies", price: 8000, oldPrice: 10000, stock: 150, pack: "1 cây", image: "dc01.jpg", description: "Thước kẻ nhựa trong 20cm có vạch chia mm, bền nhẹ và dễ vệ sinh." },
    { id: 48, code: "DC02", title: "Hộp bút học sinh đa năng", category: "school-supplies", price: 45000, oldPrice: 55000, stock: 80, pack: "1 hộp", image: "dc02.jpg", description: "Hộp bút vải nhiều ngăn, đựng được bút, thước và các vật dụng nhỏ gọn." },
    { id: 49, code: "DC03", title: "Máy tính cầm tay học sinh", category: "school-supplies", price: 185000, oldPrice: 210000, stock: 35, pack: "1 máy", image: "tb01.jpg", description: "Máy tính cầm tay 12 chữ số, pin bền, thao tác nhanh và dễ sử dụng." },
    { id: 50, code: "DC04", title: "Gôm tẩy trắng sạch", category: "school-supplies", price: 5000, stock: 200, pack: "1 cục", image: "dc04.jpg", description: "Gôm tẩy trắng sạch, không làm rách giấy, phù hợp mọi loại bút chì." },
    { id: 51, code: "DC05", title: "Đồ chuốt bút chì", category: "school-supplies", price: 12000, stock: 100, pack: "1 cái", image: "dc05.jpg", description: "Đồ chuốt bút chì lưỡi thép, có ngăn gom phoi gọn gàng." },
    { id: 52, code: "DC06", title: "Compa học sinh kèm bút chì", category: "school-supplies", price: 25000, oldPrice: 30000, stock: 60, pack: "1 bộ", image: "dc06.jpg", description: "Compa đầu kim chắc chắn, vẽ đường tròn chính xác, kèm bút chì tiện lợi." },
    { id: 53, code: "DC07", title: "Kéo học sinh đầu tròn", category: "school-supplies", price: 18000, stock: 75, pack: "1 cái", image: "sp08.jpg", description: "Kéo học sinh đầu tròn an toàn, lưỡi thép sắc bén, phù hợp cắt giấy thủ công." },
    { id: 54, code: "DC08", title: "Keo dán giấy học sinh", category: "school-supplies", price: 15000, stock: 90, pack: "1 lọ", image: "mt06.jpg", description: "Keo dán giấy khô nhanh, an toàn cho học sinh khi học và làm thủ công." }
  ]
};

/* ===========================================================================*
   RESOLVER ANH NOI BO (Canh chay Offline khi cham do an):
   Cac anh san pham duoc luoi tru trong assets/img/products/. De image co the
   hoat dong dung tai moi trang con (page/products/, page/homepage/, ...)
   ta tinh duong dan tu vi tri chinh file product-data.js cho cac gia tri
   image la file noi bo (khong dua tien to http/https/data). */
(function () {
  var script = null;
  var nodes = document.getElementsByTagName("script");
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].src && nodes[i].src.indexOf("product-data.js") !== -1) { script = nodes[i]; break; }
  }
  if (!script) return;
  var base = script.src.replace(/product-data\.js.*$/, "") + "../../assets/img/products/";
  var products = (window.StoreCatalog && window.StoreCatalog.products) || [];
  products.forEach(function (product) {
    if (product.image && !/^(https?:|data:|blob:)/i.test(product.image)) {
      product.image = base + product.image.replace(/^\/\+/, "");
    }
  });
  window.StoreCatalog.imageBase = base;
})();
