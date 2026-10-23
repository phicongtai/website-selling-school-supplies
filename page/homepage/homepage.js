/**
 * VIBRANT ACADEMIC MINIMAL - FULL SPA ENGINE
 */
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
  // 1. DỮ LIỆU SẢN PHẨM MẪU (100 SẢN PHẨM VĂN PHÒNG PHẨM & ĐỒ DÙNG HỌC TẬP)
  const products = [
    // --- 1. BÚT VIẾT (PENS: 1 - 20) ---
    { id: 1, title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm", price: 65000, oldPrice: 85000, category: "pens", brand: "Morandi", image: "../../assets/img/product-1.jpg", description: "Bút gel màu Morandi thanh lịch, ngòi 0.5mm êm ái, mau khô không lem giấy." },
    { id: 2, title: "Bút Máy Pilot Kakuno Ngòi F Nhật Bản", price: 195000, oldPrice: 230000, category: "pens", brand: "Pilot", image: "../../assets/img/product-2.jpg", description: "Bút máy học sinh Nhật Bản ngòi thép định hình tay cầm chuẩn không lo lem mực." },
    { id: 3, title: "Bút Gel Xóa Được Frixion Ball Pilot 0.5mm", price: 42000, oldPrice: 55000, category: "pens", brand: "Pilot", image: "../../assets/img/product-1.jpg", description: "Mực nhiệt đặc biệt tẩy xóa sạch sẽ bằng đầu cao su mà không làm rách giấy." },
    { id: 4, title: "Bút Bi Thiên Long FlexOffice FO-GEL08 Mực Đậm", price: 15000, oldPrice: 20000, category: "pens", brand: "Thiên Long", image: "../../assets/img/product-2.jpg", description: "Mực gel cao cấp trơn đều, thiết kế kẹp cài tiện lợi cho học sinh và sinh viên." },
    { id: 5, title: "Bút Chì Kim Kỹ Thuật Pentel GraphGear 500 0.5mm", price: 115000, oldPrice: 145000, category: "pens", brand: "Pentel", image: "../../assets/img/product-1.jpg", description: "Thân kim loại cân bằng trọng lực tuyệt hảo, đệm tay vân nhám chống trơn trượt." },
    { id: 6, title: "Set 6 Bút Dạ Quang Highlight Pastel 2 Đầu Macaron", price: 45000, oldPrice: 60000, category: "pens", brand: "Macaron", image: "../../assets/img/product-2.jpg", description: "Tông màu pastel dịu mắt không gây chói, ngòi vát linh hoạt gạch chân và highlight." },
    { id: 7, title: "Bút Gel Uni-ball One Mực Siêu Đậm Kháng Nước 0.38mm", price: 38000, oldPrice: 48000, category: "pens", brand: "Uni-ball", image: "../../assets/img/product-1.jpg", description: "Công nghệ hạt sắc tố giữ mực đọng trên bề mặt giấy, sắc nét và khô tức thì." },
    { id: 8, title: "Bút Lông Kim Đi Nét Sakura Pigma Micron Kháng Nước", price: 32000, oldPrice: 42000, category: "pens", brand: "Sakura", image: "../../assets/img/product-2.jpg", description: "Mực lưu trữ archival không phai màu, chống cồn và nước chuyên dùng đi nét vẽ." },
    { id: 9, title: "Bút Gel Zebra Sarasa Clip 0.5mm Vintage Color", price: 28000, oldPrice: 35000, category: "pens", brand: "Zebra", image: "../../assets/img/product-1.jpg", description: "Mực gel gốc nước mượt mà với kẹp cài binder chắc chắn, màu sắc cổ điển tao nhã." },
    { id: 10, title: "Bút Máy Luyện Chữ Đẹp Bút Mài Thầy Ánh SH040", price: 85000, oldPrice: 110000, category: "pens", brand: "Thầy Ánh", image: "../../assets/img/product-2.jpg", description: "Ngòi mài thanh đậm êm trơn, rãnh cầm định hình chuẩn tư thế cầm bút cho bé." },
    { id: 11, title: "Bút Chì Định Vị Chống Mỏi Tay Cho Học Sinh Deli", price: 25000, oldPrice: 35000, category: "pens", brand: "Deli", image: "../../assets/img/product-1.jpg", description: "Thiết kế rãnh ngón tay công thái học giúp trẻ cầm bút đúng tư thế từ nhỏ." },
    { id: 12, title: "Hộp 12 Bút Bi Nước M&G R1 Ngòi 0.5mm Mực Đều", price: 58000, oldPrice: 75000, category: "pens", brand: "M&G", image: "../../assets/img/product-2.jpg", description: "Đầu bi tungsten carbide siêu bền bỉ, ra mực đều và êm đến giọt mực cuối cùng." },
    { id: 13, title: "Bút Dạ Bảng Trắng Xóa Được Kèm Nam Châm Deli", price: 18000, oldPrice: 25000, category: "pens", brand: "Deli", image: "../../assets/img/product-1.jpg", description: "Mực không mùi hôi độc hại, nắp bút tích hợp dạ xóa và nam châm dán bảng." },
    { id: 14, title: "Bút Lông Viết Chữ Calligraphy Tombow Fudenosuke Ngòi Đàn Hồi", price: 49000, oldPrice: 65000, category: "pens", brand: "Tombow", image: "../../assets/img/product-2.jpg", description: "Ngòi cọ sợi đàn hồi linh hoạt tạo nét thanh nét đậm chuẩn cho viết tựa bài và calligraphy." },
    { id: 15, title: "Set 5 Bút Gel Bấm Muji Style Tối Giản 0.5mm Mực Đen", price: 35000, oldPrice: 48000, category: "pens", brand: "Muji Style", image: "../../assets/img/product-1.jpg", description: "Thiết kế vỏ mờ tối giản phong cách Nhật Bản, ruột bút dung tích lớn gấp 2 lần." },
    { id: 16, title: "Hộp 12 Bút Chì Gỗ 2B Học Sinh Gstar Chuẩn Thi Trắc Nghiệm", price: 36000, oldPrice: 48000, category: "pens", brand: "Gstar", image: "../../assets/img/product-2.jpg", description: "Ruột chì 2B đậm nét, mềm mịn dễ tô tròn phiếu trả lời trắc nghiệm chuẩn xác." },
    { id: 17, title: "Bút Ký Kim Loại Khắc Tên Cao Cấp Vỏ Hợp Kim Titan", price: 145000, oldPrice: 195000, category: "pens", brand: "Senior", image: "../../assets/img/product-1.jpg", description: "Bút ký vỏ hợp kim sang trọng cầm đầm tay, kèm hộp nhung quà tặng tinh tế." },
    { id: 18, title: "Bút Dạ Quang Stabilo Boss Original Pastel Nổi Bật", price: 29000, oldPrice: 38000, category: "pens", brand: "Stabilo", image: "../../assets/img/product-2.jpg", description: "Công nghệ Anti-Dry-Out chống khô mực 4 giờ dù không đậy nắp, màu sắc nhẹ nhàng." },
    { id: 19, title: "Hộp Ruột Bút Chì Kim 2B Pentel Ain Stein Siêu Bền 0.5mm", price: 26000, oldPrice: 35000, category: "pens", brand: "Pentel", image: "../../assets/img/product-1.jpg", description: "Cấu trúc hạt gốm silica tăng độ cứng và dẻo dai, chống gãy ngòi vượt trội." },
    { id: 20, title: "Ống Mực Bút Máy Pilot IC-50 Hộp 6 Ống Tiêu Chuẩn Nhật", price: 42000, oldPrice: 55000, category: "pens", brand: "Pilot", image: "../../assets/img/product-2.jpg", description: "Mực cao cấp dòng chảy đều, nhanh khô, bảo vệ tối đa ngòi bút máy không bị tắc." },

    // --- 2. SỔ & VỞ (NOTEBOOKS: 21 - 40) ---
    { id: 21, title: "Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro", price: 89000, oldPrice: 120000, category: "notebooks", brand: "StudyStore", image: "../../assets/img/product-3.jpg", description: "Sổ còng 6 lỗ tháo lắp dễ dàng, giấy 100gsm chống thấm mực tuyệt đối." },
    { id: 22, title: "Vở Kẻ Ngang Campus Kẻ Ngang Có Chấm 120 Trang 70gsm", price: 16000, oldPrice: 22000, category: "notebooks", brand: "Campus", image: "../../assets/img/product-3.jpg", description: "Dòng kẻ ngang in chấm thông minh hỗ trợ vẽ hình học và căn lề ngay ngắn." },
    { id: 23, title: "Sổ Lò Xo Kép Klong B5 Giấy Caro Chống Thấm 80 Trang 100gsm", price: 34000, oldPrice: 45000, category: "notebooks", brand: "Klong", image: "../../assets/img/product-3.jpg", description: "Giấy dày dặn viết bút gel và màu nước nhẹ không bị hằn sang trang sau." },
    { id: 24, title: "Lốc 10 Vở Học Sinh 4 Ô Ly Hồng Hà Bác Hồ 96 Trang", price: 95000, oldPrice: 125000, category: "notebooks", brand: "Hồng Hà", image: "../../assets/img/product-3.jpg", description: "Độ trắng tự nhiên 82-84% ISO bảo vệ thị lực cho học sinh tiểu học luyện chữ." },
    { id: 25, title: "Sổ Tay Bìa Cứng Bullet Journal Dotted A5 160 Trang 120gsm", price: 110000, oldPrice: 145000, category: "notebooks", brand: "Crabit", image: "../../assets/img/product-3.jpg", description: "Ruột chấm dot grid chuẩn 5mm lý tưởng để lập kế hoạch, vẽ sơ đồ tư duy và ghi chép." },
    { id: 26, title: "Set 3 Tập Giấy Refill Sổ Còng A5 Klong Caro 100gsm 100 Tờ", price: 54000, oldPrice: 70000, category: "notebooks", brand: "Klong", image: "../../assets/img/product-3.jpg", description: "Giấy refill đục sẵn 6 lỗ tiêu chuẩn vừa vặn cho mọi dòng binder A5 hiện đại." },
    { id: 27, title: "Sổ Kế Hoạch Tuần & Tháng Daily Planner A5 Bìa Da PU Thanh Lịch", price: 125000, oldPrice: 165000, category: "notebooks", brand: "Mori", image: "../../assets/img/product-3.jpg", description: "Bố cục chia giờ khoa học theo dõi mục tiêu học tập và thói quen sinh hoạt mỗi ngày." },
    { id: 28, title: "Giấy Ghi Chú Sticky Notes Trong Suốt Chống Thấm Nước Tập 50 Tờ", price: 18000, oldPrice: 25000, category: "notebooks", brand: "Deli", image: "../../assets/img/product-3.jpg", description: "Chất liệu màng PET trong suốt dán đè lên sách ghi chú mà không che mất chữ in." },
    { id: 29, title: "Sổ Bỏ Túi Mini A7 Kèm Bút Ghi Chú Nhanh Bìa Nhựa Dẻo", price: 22000, oldPrice: 30000, category: "notebooks", brand: "Kokuyo", image: "../../assets/img/product-3.jpg", description: "Kích thước bỏ túi gọn gàng tiện lợi ghi lại từ vựng, ý tưởng sáng tạo bất chợt." },
    { id: 30, title: "Vở Ô Vuông Caro Klong B5 May Chỉ Mở Phẳng 180 Độ 120 Trang", price: 42000, oldPrice: 55000, category: "notebooks", brand: "Klong", image: "../../assets/img/product-3.jpg", description: "Gáy may chỉ bền chắc mở phẳng hoàn toàn giúp viết dễ dàng ở cả hai bên lề." },
    { id: 31, title: "Sổ Luyện Viết Calligraphy Nghiêng 55 Độ Chuyên Dụng B5", price: 48000, oldPrice: 65000, category: "notebooks", brand: "Artline", image: "../../assets/img/product-3.jpg", description: "Dòng kẻ nghiêng chuẩn mực giúp rèn nét chữ Copperplate và Spencerian hoàn mỹ." },
    { id: 32, title: "Tập 100 Tờ Giấy Nhớ Màu Dạ Quang Phân Loại Tài Liệu Deli", price: 15000, oldPrice: 22000, category: "notebooks", brand: "Deli", image: "../../assets/img/product-3.jpg", description: "Keo dính cao cấp bám dính tốt trên mọi bề mặt, tháo gỡ không để lại vệt bẩn." },
    { id: 33, title: "Sổ Tay Bìa Gỗ Khắc Họa Tiết Cổ Điển Kèm Quà Tặng Độc Đáo", price: 135000, oldPrice: 175000, category: "notebooks", brand: "VintageArt", image: "../../assets/img/product-3.jpg", description: "Bìa gỗ tự nhiên cắt laser tinh xảo, ruột giấy kraft vintage sang trọng cổ điển." },
    { id: 34, title: "Vở Vẽ Phác Thảo Sketchbook Bìa Kraft Ruột Trơn 160gsm A5", price: 55000, oldPrice: 72000, category: "notebooks", brand: "Potentate", image: "../../assets/img/product-3.jpg", description: "Giấy dày không vân phù hợp phác thảo chì, bút kim và bút cọ nghệ thuật." },
    { id: 35, title: "Hộp 50 Thẻ Flashcard Mini Kèm Vòng Khuyên Inox Học Từ Vựng", price: 24000, oldPrice: 32000, category: "notebooks", brand: "Campus", image: "../../assets/img/product-3.jpg", description: "Giấy bìa cứng cáp hỗ trợ học từ vựng tiếng Anh, Nhật, Hàn ghi nhớ siêu tốc." },
    { id: 36, title: "Sổ Còng Trong Suốt A6 Bìa Dẻo PVC Kèm Charm Trang Trí", price: 62000, oldPrice: 85000, category: "notebooks", brand: "StudyStore", image: "../../assets/img/product-3.jpg", description: "Bìa chống bám bụi bẩn kết hợp cúc bấm kim loại giữ ruột sổ an toàn gọn gàng." },
    { id: 37, title: "Vở Kẻ Ngang May Gáy Dán Lưng Campus Souvenir 200 Trang", price: 32000, oldPrice: 42000, category: "notebooks", brand: "Campus", image: "../../assets/img/product-3.jpg", description: "Gáy dán keo đa lớp ép nhiệt phẳng phiu, không bong gáy dù lật mở liên tục." },
    { id: 38, title: "Tập 50 Tờ Giấy Kiểm Tra Kẻ Ngang Campus Cấp 2-3 Giấy Trắng Mịn", price: 26000, oldPrice: 35000, category: "notebooks", brand: "Campus", image: "../../assets/img/product-3.jpg", description: "Định lượng 70gsm đạt chuẩn thi cử, kẻ sẵn ô ghi điểm và lời phê của giáo viên." },
    { id: 39, title: "Sổ Da Cao Cấp A4 Bìa Gấp Cài Bút Dành Cho Thuyết Trình", price: 155000, oldPrice: 195000, category: "notebooks", brand: "Senior", image: "../../assets/img/product-3.jpg", description: "Thiết kế lịch lãm kèm ngăn cài danh thiếp và tài liệu, ruột giấy kẻ ngang cao cấp." },
    { id: 40, title: "Set 10 Vỉ Giấy Phân Trang Index Tabs Trong Suốt Morandi 200 Miếng", price: 29000, oldPrice: 39000, category: "notebooks", brand: "Morandi", image: "../../assets/img/product-3.jpg", description: "Nhãn đánh dấu trang sách có thể viết lên bằng bút bi, màu pastel hiện đại." },

    // --- 3. BALO & CẶP SÁCH (BACKPACKS: 41 - 60) ---
    { id: 41, title: "Balo Chống Gù Lưng Học Sinh Công Thái Học", price: 360000, oldPrice: 480000, category: "backpacks", brand: "StudyStore", image: "../../assets/img/product-4.jpg", description: "Đệm lưng thoáng khí chống gù, vải Oxford trượt nước bền bỉ bảo vệ cột sống." },
    { id: 42, title: "Balo Học Sinh Cấp 2-3 Phong Cách Hàn Quốc Ulzzang Đa Ngăn", price: 245000, oldPrice: 320000, category: "backpacks", brand: "Ulzzang", image: "../../assets/img/product-4.jpg", description: "Kiểu dáng trẻ trung nhiều ngăn phụ kèm móc khóa bông xinh xắn dành cho học sinh." },
    { id: 43, title: "Balo Đi Học Phối Màu Pastel Kháng Nước Siêu Nhẹ 550g", price: 219000, oldPrice: 280000, category: "backpacks", brand: "Charming", image: "../../assets/img/product-4.jpg", description: "Trọng lượng siêu nhẹ giảm tải trọng đè lên vai, chất liệu polyester chống thấm." },
    { id: 44, title: "Cặp Đi Học Chống Gù Cho Bé Tiểu Học Khóa Tự Động Thông Minh", price: 420000, oldPrice: 550000, category: "backpacks", brand: "Delune", image: "../../assets/img/product-4.jpg", description: "Khóa xoay từ tính thông minh dễ sử dụng, dải phản quang an toàn khi trời tối." },
    { id: 45, title: "Balo Laptop Sinh Viên 15.6 Inch Đệm Khí Chống Sốc Chống Mưa", price: 340000, oldPrice: 450000, category: "backpacks", brand: "Tigernu", image: "../../assets/img/product-4.jpg", description: "Ngăn đựng laptop lót đệm hạt khí chống sốc 360 độ, quai đeo êm ái trợ lực." },
    { id: 46, title: "Túi Tote Vải Canvas Dày Dặn Có Khóa Kéo Và Túi Phụ Trong", price: 85000, oldPrice: 115000, category: "backpacks", brand: "EcoStyle", image: "../../assets/img/product-4.jpg", description: "Vải bố dệt sợi tự nhiên bền bỉ, chứa vừa tài liệu khổ A4 và máy tính bảng." },
    { id: 47, title: "Balo Thời Trang Dạ Quang Phản Quang Ban Đêm Chống Trộm", price: 275000, oldPrice: 350000, category: "backpacks", brand: "UrbanLook", image: "../../assets/img/product-4.jpg", description: "Ngăn khóa kéo ẩn phía sau lưng an toàn tuyệt đối nơi đông người hoặc bến xe buýt." },
    { id: 48, title: "Cặp Da Cán Bộ Giáo Viên Tài Liệu A4 Bìa Khóa Số Kim Loại", price: 490000, oldPrice: 650000, category: "backpacks", brand: "Leader", image: "../../assets/img/product-4.jpg", description: "Chất da tổng hợp cao cấp phủ bóng sang trọng, ngăn chia hồ sơ khoa học." },
    { id: 49, title: "Balo Mini Thời Trang Nữ Phối Da PU Đi Học Dạo Phố", price: 185000, oldPrice: 240000, category: "backpacks", brand: "Sweetie", image: "../../assets/img/product-4.jpg", description: "Nhỏ gọn năng động nhưng đủ sức chứa bình nước mini, ví và đồ dùng học tập nhỏ." },
    { id: 50, title: "Túi Đeo Chéo Học Sinh Vải Oxford Phong Cách Thể Thao Streetwear", price: 135000, oldPrice: 175000, category: "backpacks", brand: "Sporty", image: "../../assets/img/product-4.jpg", description: "Kháng bụi và nước tốt, dây đeo tùy chỉnh độ dài phù hợp đi học thêm và dã ngoại." },
    { id: 51, title: "Cặp Sách Cầm Tay Mở Rộng 3 Ngăn Học Thêm Tiện Ích Khổ A4", price: 95000, oldPrice: 130000, category: "backpacks", brand: "Deli", image: "../../assets/img/product-4.jpg", description: "Chất liệu nhựa PP dẻo đàn hồi, tay xách bọc đệm êm không cấn đau tay." },
    { id: 52, title: "Balo Du Học Sinh Dung Tích Lớn 28L Cổng Sạc USB Tích Hợp", price: 395000, oldPrice: 520000, category: "backpacks", brand: "TravelPro", image: "../../assets/img/product-4.jpg", description: "Tích hợp đầu cắm tai nghe và dây sạc điện thoại, ngăn chứa đồ rộng rãi 3-5 ngày." },
    { id: 53, title: "Balo Công Thái Học Học Đường Phối Khóa Kim Loại Tối Giản", price: 310000, oldPrice: 410000, category: "backpacks", brand: "Kankura", image: "../../assets/img/product-4.jpg", description: "Thiết kế đai ngực và đai hông cố định chống lắc lư balo khi trẻ chạy nhảy." },
    { id: 54, title: "Túi Đựng Bình Nước Giữ Nhiệt Treo Balo Dễ Thương Cho Học Sinh", price: 45000, oldPrice: 65000, category: "backpacks", brand: "CuteBag", image: "../../assets/img/product-4.jpg", description: "Lớp lót màng nhôm giữ nhiệt độ nước ấm hoặc lạnh nhiều giờ liền." },
    { id: 55, title: "Cặp Kéo Học Sinh Tiểu Học Bánh Xe 6 Bánh Vượt Cầu Thang Linh Hoạt", price: 480000, oldPrice: 620000, category: "backpacks", brand: "TopKid", image: "../../assets/img/product-4.jpg", description: "Cần kéo hợp kim nhôm cứng cáp, đế 6 bánh xoay leo bậc thang dễ dàng không tốn sức." },
    { id: 56, title: "Balo Họa Tiết Phi Hành Gia Vũ Trụ Kèm Túi Đựng Bút Đồng Bộ", price: 260000, oldPrice: 340000, category: "backpacks", brand: "GalaxyKid", image: "../../assets/img/product-4.jpg", description: "In nổi họa tiết vũ trụ không gian 3D sống động tạo hứng thú học tập mỗi ngày." },
    { id: 57, title: "Túi Xách Học Thêm Vải Canvas In Họa Tiết Hoạt Hình Pastel", price: 69000, oldPrice: 95000, category: "backpacks", brand: "Deli", image: "../../assets/img/product-4.jpg", description: "Gọn nhẹ đựng vừa tập vở bài tập và hộp bút khi tham gia các lớp học bổ trợ." },
    { id: 58, title: "Balo Thể Thao Học Đường Có Ngăn Đựng Giày Riêng Biệt", price: 299000, oldPrice: 390000, category: "backpacks", brand: "ActiveLife", image: "../../assets/img/product-4.jpg", description: "Ngăn đựng giày thông thoáng ở đáy balo ngăn cách hoàn toàn với sách vở." },
    { id: 59, title: "Balo Chống Nước Tuyệt Đối Chất Liệu TPU Trong Suốt Thời Thượng", price: 195000, oldPrice: 260000, category: "backpacks", brand: "ClearTrend", image: "../../assets/img/product-4.jpg", description: "Khả năng lau chùi kháng nước 100%, dễ dàng quan sát đồ dùng bên trong." },
    { id: 60, title: "Cặp Đựng Tài Liệu Đa Năng 13 Ngăn Xòe Xếp Gọn Khổ A4", price: 79000, oldPrice: 105000, category: "backpacks", brand: "Deli", image: "../../assets/img/product-4.jpg", description: "13 ngăn kèm chỉ mục nhiều màu phân loại tài liệu theo từng môn học ngăn nắp." },

    // --- 4. HỘP BÚT & BÀN HỌC (CASES: 61 - 80) ---
    { id: 61, title: "Hộp Bút Vải Canvas Mở Rộng 3 Tầng Ngăn Lớn", price: 68000, oldPrice: 85000, category: "cases", brand: "StudyStore", image: "../../assets/img/product-5.jpg", description: "Sức chứa hơn 40 cây bút cùng thước kẻ và máy tính bỏ túi tiện lợi." },
    { id: 62, title: "Bàn Học Sinh Công Thái Học Nâng Hạ Chiều Cao Chống Gù Cận", price: 780000, oldPrice: 990000, category: "cases", brand: "ErgoDesk", image: "../../assets/img/product-7.jpg", description: "Bàn học công thái học điều chỉnh độ nghiêng và chiều cao linh hoạt theo độ tuổi của trẻ." },
    { id: 63, title: "Hộp Bút Trong Suốt PVC Dễ Vệ Sinh Phong Cách Minimalist", price: 35000, oldPrice: 48000, category: "cases", brand: "Minimal", image: "../../assets/img/product-5.jpg", description: "Chất liệu PVC dày mềm kháng bẩn, nhìn rõ toàn bộ bút viết bên trong." },
    { id: 64, title: "Kệ Để Bàn Gỗ Mini 2 Tầng Tự Lắp Ghép Đa Năng Tiết Kiệm Không Gian", price: 125000, oldPrice: 165000, category: "cases", brand: "WoodDecor", image: "../../assets/img/product-7.jpg", description: "Gỗ MDF chống ẩm mốc giúp sắp xếp gọn gàng sách báo, đồng hồ và phụ kiện học tập." },
    { id: 65, title: "Ống Cắm Bút Xoay 360 Độ Đa Ngăn Để Bàn Nhựa ABS Cao Cấp", price: 49000, oldPrice: 65000, category: "cases", brand: "Deli", image: "../../assets/img/product-5.jpg", description: "Đế xoay bi êm ái với 5 ngăn phân loại bút, kéo, thước kẻ dễ dàng lấy dùng." },
    { id: 66, title: "Hộp Bút Kim Loại Hai Tầng Khóa Nam Châm Cho Học Sinh Tiểu Học", price: 42000, oldPrice: 58000, category: "cases", brand: "ClassMate", image: "../../assets/img/product-5.jpg", description: "Họa tiết bắt mắt kèm bảng cửu chương in sẵn mặt trong tiện lợi tra cứu." },
    { id: 67, title: "Ghế Học Sinh Chống Gù Nâng Hạ Đệm Cao Su Đúc Công Thái Học", price: 650000, oldPrice: 850000, category: "cases", brand: "ErgoSit", image: "../../assets/img/product-7.jpg", description: "Đệm lưng đôi ôm sát bảo vệ sống lưng, bánh xe tự khóa trọng lực khi ngồi." },
    { id: 68, title: "Đèn Học LED Chống Cận Thị Cảm Ứng 3 Chế Độ Sáng Kèm Đồng Hồ", price: 215000, oldPrice: 290000, category: "cases", brand: "Rạng Đông", image: "../../assets/img/product-7.jpg", description: "Ánh sáng đồng đều không nhấp nháy, màn hình hiển thị nhiệt độ và thời gian tiện dụng." },
    { id: 69, title: "Kệ Tủ Đựng Dụng Cụ Học Tập Để Bàn Kèm 4 Ngăn Kéo Trong Suốt", price: 89000, oldPrice: 120000, category: "cases", brand: "StudyStore", image: "../../assets/img/product-5.jpg", description: "Hộc kéo xếp tầng chứa ghim bấm, băng keo, sticker và phụ kiện gọn gàng." },
    { id: 70, title: "Giá Đỡ Sách Vở Đọc Sách Chống Cận Thị Chỉnh Đa Góc Độ", price: 75000, oldPrice: 98000, category: "cases", brand: "SmartKid", image: "../../assets/img/product-7.jpg", description: "Giữ cổ thẳng góc khi chép bài và đọc sách, kẹp giữ trang mở phẳng chắc chắn." },
    { id: 71, title: "Hộp Bút Lông Cừu Dễ Thương Sức Chứa Lớn Cho Học Sinh Nữ", price: 55000, oldPrice: 75000, category: "cases", brand: "Fluffy", image: "../../assets/img/product-5.jpg", description: "Chất lông mềm mịn sờ êm tay, dây kéo mượt mà tone màu kẹo ngọt ngào." },
    { id: 72, title: "Thảm Trải Bàn Học Da PU 2 Mặt Chống Thấm Nước 80x40cm", price: 85000, oldPrice: 115000, category: "cases", brand: "DeskMat", image: "../../assets/img/product-7.jpg", description: "Bề mặt êm ái hỗ trợ rê chuột mượt mà, chống trầy xước và bám bẩn mặt bàn." },
    { id: 73, title: "Khay Đựng Tài Liệu Giấy A4 Văn Phòng 3 Tầng Trượt Kim Loại", price: 110000, oldPrice: 145000, category: "cases", brand: "Deli", image: "../../assets/img/product-7.jpg", description: "Lưới kim loại sơn tĩnh điện không gỉ sét, trượt kéo tài liệu nhanh chóng." },
    { id: 74, title: "Kệ Đỡ Màn Hình Máy Tính Gỗ Kèm Khay Để Bút Và Bàn Phím", price: 135000, oldPrice: 180000, category: "cases", brand: "EcoDesk", image: "../../assets/img/product-7.jpg", description: "Nâng màn hình vừa tầm mắt giảm mỏi cổ, giải phóng không gian mặt bàn học." },
    { id: 75, title: "Hộp Bút Mật Mã 3 Số Khóa Bảo Mật Hoạt Hình Dễ Thương", price: 62000, oldPrice: 85000, category: "cases", brand: "KidSecret", image: "../../assets/img/product-5.jpg", description: "Khóa số bảo vệ đồ dùng cá nhân, chất liệu nhựa cứng cáp chịu va đập tốt." },
    { id: 76, title: "Bộ 5 Kẹp Giữ Cáp Dây Sạc Cố Định Bàn Học Silicon Dính 3M", price: 20000, oldPrice: 30000, category: "cases", brand: "Baseus", image: "../../assets/img/product-7.jpg", description: "Cố định đầu dây sạc điện thoại và đèn bàn không bị rơi rớt xuống sàn nhà." },
    { id: 77, title: "Tấm Bảng Ghim Nỉ Dán Tường Trang Trí Kế Hoạch 30x30cm Kèm Đinh", price: 45000, oldPrice: 60000, category: "cases", brand: "HomeArt", image: "../../assets/img/product-7.jpg", description: "Chất liệu nỉ ép dày ghim ảnh kỷ niệm, lịch thi và thời khóa biểu sinh động." },
    { id: 78, title: "Bàn Học Gấp Gọn Mini Để Giường Có Khe Cắm iPad & Chỗ Để Cốc", price: 99000, oldPrice: 140000, category: "cases", brand: "SmartTable", image: "../../assets/img/product-7.jpg", description: "Chân kim loại bọc mút chống trượt gấp gọn dễ dàng sau khi học tập." },
    { id: 79, title: "Giỏ Vải Treo Cạnh Bàn Học Đựng Sách Vở Tiện Lợi Nhiều Ngăn", price: 48000, oldPrice: 65000, category: "cases", brand: "OrganizeMe", image: "../../assets/img/product-5.jpg", description: "Móc treo chắc chắn tăng diện tích chứa sách vở học tập cho bàn học nhỏ." },
    { id: 80, title: "Hộp Đựng Bút Bằng Gỗ Tự Nhiên Khắc Tên Góc Học Tập Tinh Tế", price: 89000, oldPrice: 120000, category: "cases", brand: "Woody", image: "../../assets/img/product-7.jpg", description: "Gỗ dẻ gai nguyên khối mài nhẵn mịn tôn lên nét thanh nhã của bàn học." },

    // --- 5. DỤNG CỤ VẼ & MỸ THUẬT (ART: 81 - 100) ---
    { id: 81, title: "Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha Hộp Thiếc", price: 185000, oldPrice: 240000, category: "art", brand: "StudyStore", image: "../../assets/img/product-6.jpg", description: "Bột màu nén cao cấp hạt siêu mịn trong hộp thiếc cao cấp kèm cọ trữ nước." },
    { id: 82, title: "Bộ Bút Marker Touch Cool 48 Màu Chuyên Nghiệp Kèm Túi Đựng", price: 175000, oldPrice: 230000, category: "art", brand: "Touch Cool", image: "../../assets/img/product-6.jpg", description: "Bút màu gốc cồn 2 đầu nét thanh nét đậm vẽ truyện tranh anime sinh động." },
    { id: 83, title: "Hộp Bút Chì Màu Khô 48 Màu Hộp Sắt Cao Cấp Marco Raffine", price: 165000, oldPrice: 220000, category: "art", brand: "Marco", image: "../../assets/img/product-6.jpg", description: "Lõi chì mềm mịn sắc tố màu chuẩn xác, khả năng chồng màu mượt mà." },
    { id: 84, title: "Bộ Sáp Dầu Oil Pastel Paul Rubens 36 Màu Siêu Mịn Phủ Dày", price: 195000, oldPrice: 260000, category: "art", brand: "Paul Rubens", image: "../../assets/img/product-6.jpg", description: "Chất sáp dẻo mềm quánh vẽ đắp nổi tranh hoa sơn dầu ấn tượng." },
    { id: 85, title: "Bộ 12 Tuýp Màu Acrylic Marie's 75ml Vẽ Trên Mọi Chất Liệu", price: 145000, oldPrice: 190000, category: "art", brand: "Marie's", image: "../../assets/img/product-6.jpg", description: "Độ che phủ cao bám dính tốt trên toan vải, gỗ, kính, giày và áo thun." },
    { id: 86, title: "Bộ Cọ Vẽ Màu Nước Lông Chồn Tự Nhiên 7 Cây Đủ Cỡ Chuyên Nghiệp", price: 89000, oldPrice: 120000, category: "art", brand: "Superior", image: "../../assets/img/product-6.jpg", description: "Ngậm nước tuyệt vời, đầu cọ gom nhọn tạo nét vẽ từ chi tiết siêu nhỏ đến mảng lớn." },
    { id: 87, title: "Sổ Vẽ Màu Nước Happy Cold Pressed 300gsm 20 Tờ Vân Nổi", price: 79000, oldPrice: 105000, category: "art", brand: "Happy", image: "../../assets/img/product-6.jpg", description: "Định lượng 300gsm 100% cellulose không cong vênh khi vẽ nhiều lớp nước." },
    { id: 88, title: "Bảng Pha Màu Palette Gấp Gọn 24 Ngăn Có Gioăng Chống Tràn", price: 65000, oldPrice: 88000, category: "art", brand: "Mijello", image: "../../assets/img/product-6.jpg", description: "Khay pha có nắp đệm silicon kín khí bảo quản màu nước không bị khô cứng." },
    { id: 89, title: "Hộp Bút Chì Màu Nước 36 Màu Kèm Cọ Tán Faber-Castell Hộp Đỏ", price: 185000, oldPrice: 245000, category: "art", brand: "Faber-Castell", image: "../../assets/img/product-6.jpg", description: "Tô khô như chì thường, dùng cọ quét nước biến thành tranh màu nước sống động." },
    { id: 90, title: "Tẩy Đất Sét Kneaded Eraser Chuyên Dụng Tẩy Phác Thảo Nghệ Thuật", price: 22000, oldPrice: 30000, category: "art", brand: "Faber-Castell", image: "../../assets/img/product-6.jpg", description: "Nhào nặn thành mọi hình dáng lấy bớt than chì không để lại vụn tẩy." },
    { id: 91, title: "Bột Màu Nước Nén Cao Cấp Paul Rubens Hộp Kim Loại 24 Màu Kèm Bọt Biển", price: 240000, oldPrice: 310000, category: "art", brand: "Paul Rubens", image: "../../assets/img/product-6.jpg", description: "Hạt màu cao cấp độ trong trẻo cao và chống phai màu lưu giữ lâu dài." },
    { id: 92, title: "Dao Cắt Kỹ Thuật Trổ Giấy Kim Loại Kèm 10 Lưỡi Dao Thay Thế", price: 38000, oldPrice: 50000, category: "art", brand: "Deli", image: "../../assets/img/product-6.jpg", description: "Mũi dao nhọn 30 độ siêu sắc bén chuyên cắt trổ mô hình kiến trúc thủ công." },
    { id: 93, title: "Bộ Thước Kỹ Thuật Vẽ Đường Cong Parabol & Elip Đa Năng Deli", price: 35000, oldPrice: 48000, category: "art", brand: "Deli", image: "../../assets/img/product-6.jpg", description: "Chất liệu mica trong suốt khắc laser vạch đo chính xác cho môn hình học và mỹ thuật." },
    { id: 94, title: "Tập 10 Tờ Giấy Vẽ Canson Pháp A3 Định Lượng 250gsm Vân Hạt", price: 58000, oldPrice: 75000, category: "art", brand: "Canson", image: "../../assets/img/product-6.jpg", description: "Giấy mỹ thuật tiêu chuẩn quốc tế cho chì than, phấn màu và vẽ phác họa." },
    { id: 95, title: "Bộ Compa Kỹ Thuật Kim Loại Kèm Hộp Ruột Chì Deli Cao Cấp", price: 42000, oldPrice: 55000, category: "art", brand: "Deli", image: "../../assets/img/product-6.jpg", description: "Khớp xoay chắc chắn giữ khẩu độ chuẩn xác khi vẽ đường tròn đường kính lớn." },
    { id: 96, title: "Bút Trắng Đi Nét Highlight Gelly Roll Sakura 0.8mm Chống Nước", price: 28000, oldPrice: 38000, category: "art", brand: "Sakura", image: "../../assets/img/product-6.jpg", description: "Mực trắng đục bắt sáng tạo đốm lấp lánh cho tranh vẽ mắt, tóc và giọt nước." },
    { id: 97, title: "Bộ Đất Nặn Tự Khô 12 Màu Kèm Dao Tạo Hình Không Dính Tay", price: 52000, oldPrice: 70000, category: "art", brand: "Colokit", image: "../../assets/img/product-6.jpg", description: "Đất sét siêu nhẹ tự khô trong không khí sau 24h, an toàn tuyệt đối cho trẻ nhỏ." },
    { id: 98, title: "Set 6 Bút Chì Đen Từ 2B Đến 8B Chuyên Dụng Đánh Bóng Phác Thảo", price: 45000, oldPrice: 60000, category: "art", brand: "Staedtler", image: "../../assets/img/product-6.jpg", description: "Đầy đủ các cấp độ đậm nhạt từ vẽ phác thảo nét mờ đến nhấn đậm khối tranh." },
    { id: 99, title: "Giá Vẽ Tranh Gỗ Tự Nhiên Gấp Gọn Để Bàn 50cm Đa Năng", price: 119000, oldPrice: 160000, category: "art", brand: "ArtDesk", image: "../../assets/img/product-6.jpg", description: "Gỗ thông mộc mạc điều chỉnh góc nghiêng tự do, giữ khung toan vẽ tranh ổn định." },
    { id: 100, title: "Kéo Cắt Giấy An Toàn Có Nắp Đậy Cho Học Sinh Thủ Công Deli", price: 22000, oldPrice: 30000, category: "art", brand: "Deli", image: "../../assets/img/product-6.jpg", description: "Mũi kéo bo tròn an toàn bọc nhựa chống gỉ sét, kèm nắp đậy bảo vệ cặp sách." }
  ];
=======
  const products = window.StoreCatalog.products;
  const featuredProducts = products.filter(product => product.featured);
>>>>>>> 05d28c7f993fe36241e92cee783919574e70d452

  let cart = [{ id: 1, quantity: 1 }, { id: 3, quantity: 2 }];
  let wishlist = [1, 4];

  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';

  // 2. CHUYỂN ĐỔI MÀN HÌNH (SPA NAVIGATION)
  window.navigateToView = (viewId, param = null) => {
    const targetView = document.getElementById(viewId);
    if (!targetView) return;

    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeNavTarget = viewId === 'view-home' ? 'view-home' : 'view-category';
    document.querySelectorAll('.main-nav .nav-link[data-target]').forEach(link => {
      const isActive = link.dataset.target === activeNavTarget;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
        link.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (viewId === 'view-detail' && param) {
      renderProductDetail(param);
    } else if (viewId === 'view-category') {
      renderCategoryProducts();
    }
  };

  // 3. RENDER LIVE SEARCH (TÌM KIẾM CƠ BẢN)
  const headerSearchInput = document.getElementById('headerSearchInput');
  const liveSearchDropdown = document.getElementById('liveSearchDropdown');

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) {
        liveSearchDropdown.classList.remove('open');
        return;
      }

      const matches = products.filter(p =>
        `${p.code} ${p.title}`.toLowerCase().includes(term)
      ).slice(0, 4);
      if (matches.length > 0) {
        liveSearchDropdown.innerHTML = matches.map(p => `
          <a class="live-search-item" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">
            <img src="${p.image}" alt="${p.title}">
            <div>
              <div style="font-size:0.8rem; font-weight:600;">${p.title}</div>
              <div style="font-size:0.75rem; color:#8A3500; font-weight:700;">${formatMoney(p.price)}</div>
            </div>
          </a>
        `).join('');
        liveSearchDropdown.classList.add('open');
      } else {
        liveSearchDropdown.innerHTML = `<div style="padding:8px; font-size:0.8rem; color:#757575;">Không tìm thấy sản phẩm</div>`;
        liveSearchDropdown.classList.add('open');
      }
    });
  }

  // Lọc sản phẩm theo checkbox danh mục bên trái (chỉ hiện khi được tick)
  window.filterCategoryProducts = () => {
    const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
    const selectedCategories = [];
    
    // Ánh xạ tên hiển thị tiếng Việt sang mã category trong mảng products
    const categoryMap = {
      "Bút Viết": "pens",
      "Sổ Vở": "notebooks",
      "Balo & Cặp": "backpacks",
      "Hộp Bút": "cases",
      "Mỹ Thuật": "art",
      "Dụng cụ học tập": "school-supplies"
    };

    checkboxes.forEach(cb => {
      if (cb.checked) {
        const labelText = cb.parentElement.textContent.trim().split(' (')[0];
        if (categoryMap[labelText]) {
          selectedCategories.push(categoryMap[labelText]);
        }
      }
    });

    // Nếu không tick ô nào thì trả về mảng rỗng (không hiện sản phẩm nào)
    const filtered = products.filter(p => {
      if (selectedCategories.length === 0) return false;
      return selectedCategories.includes(p.category);
    });

    renderProductList('categoryProductsGrid', filtered);
  };

  window.showHomeCategory = category => {
    const categoryLabels = {
      pens: "Bút Viết",
      notebooks: "Sổ Vở",
      backpacks: "Balo & Cặp",
      cases: "Hộp Bút",
      "school-supplies": "Dụng cụ học tập",
      art: "Mỹ Thuật"
    };
    const selectedLabel = categoryLabels[category];
    if (!selectedLabel) return;

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(checkbox => {
      const label = checkbox.parentElement.textContent.trim().split(' (')[0];
      checkbox.checked = label === selectedLabel;
    });
    navigateToView('view-category');
    window.filterCategoryProducts();
  };
  // 4. BỘ LỌC TÌM KIẾM NÂNG CAO & CATEGORY
  window.applyAdvancedSearch = () => {
    const keyword = document.getElementById('advKeyword')?.value.toLowerCase().trim() || '';
    const category = document.getElementById('advCategory')?.value || 'all';
    const minPrice = parseInt(document.getElementById('advMinPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('advMaxPrice')?.value) || 1000000;

    const filtered = products.filter(p => {
      const matchKey = !keyword || p.title.toLowerCase().includes(keyword);
      const matchCat = category === 'all' || p.category === category;
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchKey && matchCat && matchPrice;
    });

    renderProductList('advResultGrid', filtered);
    navigateToView('view-advanced-search');
  };

  // 5. RENDER DETAIL PAGE
  const renderProductDetail = (productId) => {
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('detailContainer');
    if (!product || !container) return;

    container.innerHTML = `
      <div class="detail-layout">
        <div>
          <div class="detail-main-img"><img src="${product.image}" alt="${product.title}"></div>
          <div class="detail-thumbs">
            <img src="${product.image}">
            <img src="${product.image}">
          </div>
        </div>
        <div>
          <span class="tag-label" style="margin-bottom:8px;">${product.brand}</span>
          <h1 style="font-size:1.5rem; font-weight:800; margin-bottom:12px;">${product.title}</h1>
          <div style="font-size:1.5rem; font-weight:800; color:#8A3500; margin-bottom:12px;">${formatMoney(product.price)}</div>
          <p style="font-size:0.9rem; color:#4a4542; margin-bottom:20px;">${product.description}</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" style="flex:1;" onclick="addToCart(${product.id})">Thêm Vào Giỏ Hàng</button>
            <button class="btn btn-outlined" onclick="navigateToView('view-category')">Quay Lại</button>
          </div>
        </div>
      </div>
    `;
  };

  // 6. GIỎ HÀNG & MODAL XEM NHANH
  const updateBadges = () => {
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(b => b.textContent = count);
  };

  window.addToCart = (id) => {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, quantity: 1 });
    updateBadges();
    renderCartDrawer();
    showToast("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const renderCartDrawer = () => {
    const body = document.getElementById('cartDrawerBody');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!body) return;

    let total = 0;
    body.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      if (!p) return '';
      total += p.price * item.quantity;
      return `
        <div style="display:flex; gap:10px; margin-bottom:12px; align-items:center;">
          <img src="${p.image}" style="width:50px; height:50px; border-radius:6px; object-fit:cover;">
          <div style="flex:1;">
            <div style="font-size:0.8rem; font-weight:600;">${p.title}</div>
            <div style="font-size:0.8rem; color:#8A3500; font-weight:700;">${formatMoney(p.price)} x ${item.quantity}</div>
          </div>
        </div>
      `;
    }).join('');
    if (totalEl) totalEl.textContent = formatMoney(total);
  };

  window.openCartDrawer = () => {
    renderCartDrawer();
    document.getElementById('cartDrawerOverlay')?.classList.add('open');
  };
  window.closeCartDrawer = () => {
    document.getElementById('cartDrawerOverlay')?.classList.remove('open');
  };

  window.showToast = (msg) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };

  const renderProductList = (containerId, list) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = list.map(p => `
      <article class="store-product-card">
        <a class="store-product-image-link" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">
          <div class="store-product-visual">
            <span class="store-product-tag">${window.StoreCatalog.categories[p.category]}</span>
            ${p.hot ? '<span class="store-product-tag store-product-hot">Hot</span>' : ''}
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </div>
        </a>
        <div class="store-product-code">Mã: ${p.code}</div>
        <a class="store-product-name" href="../products/product-detail.html?id=${encodeURIComponent(p.code)}">${p.title}</a>
        <div class="store-product-meta">
          <strong class="store-product-price">${formatMoney(p.price)}</strong>
          ${p.oldPrice
            ? `<span class="store-product-old-price">${formatMoney(p.oldPrice)}</span>`
            : `<span class="store-product-stock">Kho: ${p.stock}</span>`}
        </div>
        <button class="store-product-cart" type="button" onclick="addToCart(${p.id})">🛒 Thêm vào giỏ</button>
      </article>
    `).join('');
  };

  const renderCategoryProducts = () => renderProductList('categoryProductsGrid', products);

  // Khởi tạo trang chủ và danh mục
  renderProductList('homeProductsGrid', featuredProducts);
  renderCategoryProducts();
  updateBadges();

  // Lắng nghe sự kiện thay đổi cho toàn bộ checkbox bộ lọc bên trái
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', filterCategoryProducts);
  });

  const pageParams = new URLSearchParams(window.location.search);
  const categoryParam = pageParams.get('category');
  const searchParam = pageParams.get('search');

  if (searchParam) {
    document.getElementById('advKeyword').value = searchParam;
    window.applyAdvancedSearch();
  } else if (categoryParam) {
    window.showHomeCategory(categoryParam);
  } else if (['#view-category', '#view-advanced-search'].includes(window.location.hash)) {
    window.navigateToView(window.location.hash.slice(1));
  }
});