window.StoreCatalog = {
  categories: {
    pens: "Bút viết",
    notebooks: "Vở & giấy",
    backpacks: "Cặp & balo",
    cases: "Hộp bút",
    art: "Dụng cụ vẽ & mỹ thuật",
    "school-supplies": "Dụng cụ học tập"
  },
  products: [
    { id: 1, code: "HP01", title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm", category: "pens", price: 65000, oldPrice: 85000, stock: 120, pack: "10 cây / Bộ", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=85", description: "Bút gel màu Morandi thanh lịch, ngòi 0.5mm êm ái, mau khô không lem giấy.", featured: true },
    { id: 2, code: "HP02", title: "Bút Máy Pilot Kakuno Ngòi F Nhật Bản", category: "pens", price: 195000, oldPrice: 230000, stock: 35, pack: "1 cây", image: "https://down-vn.img.susercontent.com/file/e1d32d504e8bb3568ca14d404f30e82a", description: "Bút máy học sinh Nhật Bản ngòi thép định hình tay cầm chuẩn.", featured: true },
    { id: 3, code: "HP03", title: "Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro", category: "notebooks", price: 89000, oldPrice: 120000, stock: 75, pack: "Khổ A5", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=85", description: "Sổ còng 6 lỗ tháo lắp dễ dàng, giấy 100gsm chống thấm mực.", featured: true },
    { id: 4, code: "HP04", title: "Balo Chống Gù Lưng Học Sinh Công Thái Học", category: "backpacks", price: 360000, oldPrice: 480000, stock: 45, pack: "1 balo", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85", description: "Đệm lưng thoáng khí chống gù, vải Oxford trượt nước.", featured: true },
    { id: 5, code: "HP05", title: "Hộp Bút Vải Canvas Mở Rộng 3 Tầng Ngăn Lớn", category: "cases", price: 68000, oldPrice: 85000, stock: 60, pack: "1 hộp", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lr75wcf0547tad", description: "Sức chứa hơn 40 cây bút cùng thước kẻ và máy tính bỏ túi.", featured: true },
    { id: 6, code: "HP06", title: "Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha", category: "art", price: 185000, oldPrice: 240000, stock: 40, pack: "36 màu / Bộ", image: "https://tse2.mm.bing.net/th/id/OIP.VTjDllEC4wzo8Tdum9wjBAHaHa?r=0&pid=Api&h=220&P=0", description: "Bột màu nén cao cấp hạt siêu mịn trong hộp thiếc cao cấp.", featured: true },
    { id: 7, code: "HP07", title: "Bàn học công thái học", category: "school-supplies", price: 385000, oldPrice: 640000, stock: 20, pack: "1 bàn", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLeUM0p5TFnMOzgySTkFZ9i9kKTb8cR5cBnO3AaLFTSw&s=10", description: "Bàn học giúp bé điều chỉnh tư thế phù hợp.", featured: true },

    { id: 8, code: "SP01", title: "Bút gel đen 0.5mm (hộp 10 cây)", category: "pens", price: 45000, oldPrice: 55000, stock: 120, pack: "10 cây / Hộp", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=85" },
    { id: 9, code: "SP02", title: "Bút bi xanh êm tay (vỉ 5 cây)", category: "pens", price: 25000, stock: 120, pack: "5 cây / Vỉ", image: "https://down-vn.img.susercontent.com/file/e1d32d504e8bb3568ca14d404f30e82a" },
    { id: 10, code: "SP03", title: "Bút máy luyện chữ học sinh", category: "pens", price: 89000, oldPrice: 110000, stock: 35, pack: "1 cây", image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85", hot: true },
    { id: 11, code: "SP04", title: "Bút highlight pastel (bộ 6 màu)", category: "pens", price: 59000, stock: 45, pack: "6 màu / Bộ", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85" },
    { id: 12, code: "SP05", title: "Bút gel nhiều màu (bộ 12 màu)", category: "pens", price: 78000, oldPrice: 95000, stock: 60, pack: "12 màu / Bộ", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=85" },
    { id: 13, code: "SP06", title: "Bút chì gỗ 2B (hộp 12 cây)", category: "pens", price: 36000, stock: 210, pack: "12 cây / Hộp", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=85" },
    { id: 14, code: "SP07", title: "Bút bi mực đen nét mảnh", category: "pens", price: 18000, stock: 95, pack: "1 cây", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=85" },
    { id: 15, code: "SP08", title: "Bút ký thân kim loại", category: "pens", price: 125000, oldPrice: 150000, stock: 18, pack: "1 cây", image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85" },

    { id: 16, code: "VG01", title: "Vở học sinh 200 trang", category: "notebooks", price: 18000, oldPrice: 22000, stock: 150, pack: "200 trang", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85" },
    { id: 17, code: "VG02", title: "Vở ô ly học sinh 96 trang", category: "notebooks", price: 12000, stock: 180, pack: "96 trang", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=85" },
    { id: 18, code: "VG03", title: "Sổ tay lò xo A5", category: "notebooks", price: 35000, oldPrice: 42000, stock: 75, pack: "Khổ A5", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=85" },
    { id: 19, code: "VG04", title: "Giấy kiểm tra học sinh", category: "notebooks", price: 10000, stock: 200, pack: "1 tập", image: "https://images.unsplash.com/photo-1455390582262-044c48d58150?auto=format&fit=crop&w=600&q=85" },
    { id: 20, code: "VG05", title: "Giấy A4 80gsm (500 tờ)", category: "notebooks", price: 85000, oldPrice: 95000, stock: 65, pack: "500 tờ / Ram", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=85" },
    { id: 21, code: "VG06", title: "Sổ ghi chép bìa cứng", category: "notebooks", price: 45000, stock: 55, pack: "1 quyển", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=85" },
    { id: 22, code: "VG07", title: "Giấy note nhiều màu", category: "notebooks", price: 22000, stock: 90, pack: "1 bộ nhiều màu", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85" },
    { id: 23, code: "VG08", title: "Vở ghi chép đại học A4", category: "notebooks", price: 28000, oldPrice: 32000, stock: 110, pack: "Khổ A4", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=85" },

    { id: 24, code: "CB01", title: "Balo học sinh chống thấm", category: "backpacks", price: 289000, oldPrice: 350000, stock: 45, pack: "1 balo", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85", hot: true },
    { id: 25, code: "CB02", title: "Balo laptop 15.6 inch", category: "backpacks", price: 459000, oldPrice: 520000, stock: 30, pack: "1 balo", image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=600&q=85" },
    { id: 26, code: "CB03", title: "Cặp sách học sinh tiểu học", category: "backpacks", price: 235000, stock: 60, pack: "1 cặp", image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=600&q=85" },
    { id: 27, code: "CB04", title: "Balo mini thời trang", category: "backpacks", price: 199000, stock: 38, pack: "1 balo", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85" },
    { id: 28, code: "CB05", title: "Balo nhiều ngăn đi học", category: "backpacks", price: 329000, oldPrice: 390000, stock: 42, pack: "1 balo", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85" },
    { id: 29, code: "CB06", title: "Túi tote đựng sách vở", category: "backpacks", price: 99000, stock: 80, pack: "1 túi", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=85" },
    { id: 30, code: "CB07", title: "Balo thể thao đa năng", category: "backpacks", price: 279000, stock: 25, pack: "1 balo", image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=600&q=85" },
    { id: 31, code: "CB08", title: "Cặp đeo chéo đựng tài liệu", category: "backpacks", price: 159000, oldPrice: 189000, stock: 33, pack: "1 cặp", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=85" }
  ]
};
