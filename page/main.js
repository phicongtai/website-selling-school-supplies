/**
 * ==========================================================================
 * VIBRANT ACADEMIC MINIMAL - HOMEPAGE INTERACTIVE ENGINE
 * File: page/main.js
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DỮ LIỆU 24 SẢN PHẨM TRÊN HOMEPAGE (6 HÀNG CHUẨN FIGMA)
  // ------------------------------------------------------------------------
  const products = [
    // HÀNG 1: BÚT VIẾT
    {
      id: 4,
      title: "Bút Chì Bấm Kim Công Thái Học Kèm Hộp Ruột 2B",
      price: 45000,
      oldPrice: 60000,
      image: "https://images.unsplash.com/photo-1595166297380-60b5ce3d6a9f?auto=format&fit=crop&w=500&q=80",
      description: "Bút chì bấm kim thân kim loại nhôm siêu nhẹ, đệm cao su êm ái chống mỏi tay khi học tập lâu. Kèm hộp 100 ruột chì 2B đậm nét."
    },
    {
      id: 1,
      title: "Set 10 Bút Gel Morandi Vintage Tone Pastel 0.5mm",
      price: 65000,
      oldPrice: 85000,
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80",
      description: "Set bút gel tone màu Morandi thanh lịch, ngòi 0.5mm viết trơn êm, mực đều mau khô không lem giấy vở học sinh."
    },
    {
      id: 2,
      title: "Bút Máy Pilot Kakuno Ngòi F Nhật Bản Chính Hãng",
      price: 195000,
      oldPrice: 230000,
      image: "https://images.unsplash.com/photo-1585336261026-77cc7c97f49c?auto=format&fit=crop&w=500&q=80",
      description: "Bút máy Pilot Kakuno nổi tiếng của Nhật Bản, ngòi thép không gỉ khắc hình mặt cười thân thiện, thân lục giác chống lăn rơi."
    },
    {
      id: 3,
      title: "Bộ Bút Dạ Quang Highlight Kaco Pastel 6 Màu",
      price: 52000,
      oldPrice: 70000,
      image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=500&q=80",
      description: "Bộ 6 cây bút dạ quang tone pastel êm dịu bảo vệ mắt, mực gốc nước cao cấp không thấm sang mặt sau của trang sách giáo khoa."
    },

    // HÀNG 2: SỔ TAY & GIẤY VỞ
    {
      id: 5,
      title: "Sổ Còng Binder A5 Bìa Da Pastel Kèm Ruột Caro",
      price: 89000,
      oldPrice: 120000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
      description: "Sổ còng 6 lỗ tiện lợi dễ dàng thay thế và thêm giấy. Giấy định lượng 100gsm dày dặn, kẻ ô vuông caro 5x5mm tiêu chuẩn."
    },
    {
      id: 6,
      title: "Tập 5 Vở Kẻ Ngang B5 Campus 200 Trang Chống Lóa",
      price: 75000,
      oldPrice: 90000,
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=500&q=80",
      description: "Vở Campus gáy dán thông minh mở phẳng 180 độ. Giấy viết trắng tự nhiên chống lóa, định lượng tiêu chuẩn bảo vệ mắt."
    },
    {
      id: 7,
      title: "Bộ Giấy Ghi Chú Sticky Notes Gradient 4 Xấp Sắc Màu",
      price: 28000,
      oldPrice: 40000,
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80",
      description: "Giấy ghi chú dán tường và tài liệu với tone chuyển sắc đẹp mắt, keo dán bám chắc và dễ bóc tách không làm rách sách vở."
    },
    {
      id: 8,
      title: "Sổ Tay Lập Kế Hoạch Weekly Planner Bìa Cứng",
      price: 115000,
      oldPrice: 145000,
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=500&q=80",
      description: "Sổ lập kế hoạch quản lý thời gian, theo dõi bài tập và mục tiêu học tập theo từng tuần, bìa cứng bọc vải bền đẹp."
    },

    // HÀNG 3: BALO & CẶP SÁCH
    {
      id: 9,
      title: "Balo Chống Gù Lưng Học Sinh Thiết Kế Công Thái Học",
      price: 360000,
      oldPrice: 480000,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
      description: "Đệm lưng thoáng khí dạng rãnh công thái học trợ lực cột sống, vải Oxford chống thấm nước và quai đeo êm ái."
    },
    {
      id: 10,
      title: "Balo Laptop Sinh Viên Dáng Vuông Phong Cách Tối Giản",
      price: 395000,
      oldPrice: 490000,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=500&q=80",
      description: "Balo phong cách Minimalist đựng vừa laptop 15.6 inch chống sốc dày, tích hợp nhiều ngăn phân chia vật dụng cá nhân."
    },
    {
      id: 11,
      title: "Túi Đeo Chéo Canvas Đựng Vừa Sách Vở A4 Phong Cách Hàn",
      price: 135000,
      oldPrice: 170000,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80",
      description: "Túi vải Canvas tự nhiên dày dặn, có khóa kéo chính và ngăn phụ đựng vừa sổ A4, bút viết và đồ dùng cá nhân."
    },
    {
      id: 12,
      title: "Cặp Tài Liệu Nhiều Ngăn Xếp Tầng Khóa Cài Chắc Chắn",
      price: 78000,
      oldPrice: 95000,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
      description: "Cặp phân loại đề cương và bài kiểm tra với 12 ngăn có nhãn ghi chú tiện lợi, chất liệu nhựa PP chống nước bền chắc."
    },

    // HÀNG 4: HỘP BÚT & PHỤ KIỆN
    {
      id: 13,
      title: "Hộp Bút Vải Canvas Đa Năng Mở Rộng 3 Tầng Ngăn Lớn",
      price: 68000,
      oldPrice: 85000,
      image: "https://images.unsplash.com/photo-1585336261026-77cc7c97f49c?auto=format&fit=crop&w=500&q=80",
      description: "Hộp bút sức chứa lớn chứa hơn 40 cây bút cùng thước kẻ 20cm và máy tính bỏ túi. Khóa kéo trơn tru dễ vệ sinh."
    },
    {
      id: 14,
      title: "Túi Đựng Bút Trong Suốt TPU Phong Cách Hàn Quốc",
      price: 38000,
      oldPrice: 50000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
      description: "Túi bút chất liệu TPU trong suốt mờ chống nước, phong cách tối giản thanh lịch giúp tìm kiếm bút viết nhanh chóng."
    },
    {
      id: 15,
      title: "Ống Cắm Bút Để Bàn Xoay 360 Độ Chia 5 Ngăn Trắng",
      price: 85000,
      oldPrice: 110000,
      image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=500&q=80",
      description: "Ống cắm bút xoay 360 độ tiện dụng để bàn học, chia 5 ngăn cao thấp giúp sắp xếp bút, thước, kéo gọn gàng."
    },
    {
      id: 16,
      title: "Túi Đựng Bút Vải Canvas Phong Cách Tối Giản Học Sinh",
      price: 42000,
      oldPrice: 50000,
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80",
      description: "Túi đựng bút nhỏ gọn tiện lợi mang theo, may từ vải bố canvas bền bỉ với khóa kéo kim loại cao cấp."
    },

    // HÀNG 5: MỸ THUẬT & SÁNG TẠO
    {
      id: 17,
      title: "Bộ Màu Nước 36 Màu Kèm Cọ Bút Nước & Khay Pha",
      price: 185000,
      oldPrice: 240000,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=80",
      description: "Bột màu nén cao cấp hạt siêu mịn, độ loang màu tự nhiên, kèm cọ vẽ chứa nước và khay pha màu trong hộp thiếc."
    },
    {
      id: 18,
      title: "Hộp Bút Chì Màu Gốc Dầu 36 Màu Cao Cấp Hộp Thiếc",
      price: 145000,
      oldPrice: 180000,
      image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=500&q=80",
      description: "Chì màu gốc dầu màu sắc tươi sáng, ruột chì mềm mượt dễ phối màu và không dễ gãy khi gọt chuốt."
    },
    {
      id: 19,
      title: "Bộ Gôm Tẩy Bút Bấm Không Bụi Kèm 2 Lõi Thay Thế",
      price: 22000,
      oldPrice: 30000,
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80",
      description: "Gôm tẩy dạng bút bấm tiện lợi, tẩy sạch êm ái không làm mòn rách giấy vở, không để lại bụi vụn khó chịu."
    },
    {
      id: 20,
      title: "Bảng Lót Cắt Kỹ Thuật Cutting Mat A4 & Thước Nhôm",
      price: 68000,
      oldPrice: 80000,
      image: "https://images.unsplash.com/photo-1595166297380-60b5ce3d6a9f?auto=format&fit=crop&w=500&q=80",
      description: "Tấm lót cắt tự phục hồi bề mặt 3 lớp PVC dày dặn, có vạch chia kích thước chuẩn xác bảo vệ mặt bàn học."
    },

    // HÀNG 6: GÓC BÀN HỌC & TIỆN ÍCH
    {
      id: 21,
      title: "Khay Đựng Tài Liệu Văn Phòng Phẩm 3 Tầng Lắp Ghép",
      price: 125000,
      oldPrice: 155000,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
      description: "Khay chứa tài liệu A4 3 tầng lưới kim loại sơn tĩnh điện chống rỉ sét, chịu lực tốt giúp bàn học ngăn nắp."
    },
    {
      id: 22,
      title: "Đèn Bàn Học LED Chống Cận Thị Cảm Ứng 3 Chế Độ",
      price: 275000,
      oldPrice: 350000,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80",
      description: "Ánh sáng tự nhiên bảo vệ thị lực, 3 nhiệt độ màu (trắng, vàng, trung tính) tùy chỉnh độ sáng mượt mà bằng cảm ứng."
    },
    {
      id: 23,
      title: "Máy Tính Khoa Học Bỏ Túi Học Sinh Sinh Viên",
      price: 450000,
      oldPrice: 520000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
      description: "Máy tính khoa học đầy đủ chức năng giải toán đại học và trung học, màn hình hiển thị trực quan, phím bấm nhạy."
    },
    {
      id: 24,
      title: "Đồng Hồ Bấm Giờ Học Tập Pomodoro Để Bàn Học",
      price: 95000,
      oldPrice: 115000,
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=500&q=80",
      description: "Hỗ trợ học tập tập trung theo phương pháp Pomodoro 25 phút, màn hình số lớn có chuông báo hoặc chế độ rung êm dịu."
    }
  ];

  // ------------------------------------------------------------------------
  // 2. GIỎ HÀNG (SHOPPING CART ENGINE)
  // ------------------------------------------------------------------------
  let cart = [
    { id: 1, quantity: 1 },
    { id: 4, quantity: 2 }
  ];

  let wishlist = [1, 9];

  const formatMoney = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const updateBadges = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count-badge').forEach(b => b.textContent = totalItems);
    document.querySelectorAll('.wishlist-count-badge').forEach(b => b.textContent = wishlist.length);
  };

  const renderCartDrawer = () => {
    const cartBody = document.getElementById('cartDrawerBody');
    const cartTotalEl = document.getElementById('cartDrawerTotal');
    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #cbd5e1; margin-bottom: 8px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p style="font-size: 0.85rem; color: #64748b;">Giỏ hàng của bạn đang trống</p>
          <button class="btn btn-primary btn-sm" onclick="closeCartDrawer()" style="margin-top: 10px;">Khám phá sản phẩm</button>
        </div>
      `;
      if (cartTotalEl) cartTotalEl.textContent = '0 ₫';
      return;
    }

    let totalPrice = 0;
    let html = '';

    cart.forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.id);
      if (!product) return;

      const itemTotal = product.price * cartItem.quantity;
      totalPrice += itemTotal;

      html += `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.title}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${product.title}</h4>
            <div class="cart-item-price">${formatMoney(product.price)}</div>
            <div class="cart-item-actions">
              <button class="qty-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
              <span class="qty-val">${cartItem.quantity}</span>
              <button class="qty-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
              <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Xóa">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    cartBody.innerHTML = html;
    if (cartTotalEl) cartTotalEl.textContent = formatMoney(totalPrice);
  };

  window.addToCart = (productId, qty = 1) => {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: productId, quantity: qty });
    }

    updateBadges();
    renderCartDrawer();
    const product = products.find(p => p.id === productId);
    showToast(`Đã thêm "${product ? product.title.slice(0, 25) + '...' : 'Sản phẩm'}" vào giỏ hàng!`);
  };

  window.changeQuantity = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    updateBadges();
    renderCartDrawer();
  };

  window.removeFromCart = (productId) => {
    cart = cart.filter(i => i.id !== productId);
    updateBadges();
    renderCartDrawer();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  window.openCartDrawer = () => {
    renderCartDrawer();
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeCartDrawer = () => {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCartDrawer();
    });
  }

  // ------------------------------------------------------------------------
  // 3. DANH SÁCH YÊU THÍCH (WISHLIST)
  // ------------------------------------------------------------------------
  window.toggleWishlist = (productId, btnEl) => {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
      if (btnEl) btnEl.classList.remove('active');
      showToast('Đã xóa khỏi danh sách yêu thích.');
    } else {
      wishlist.push(productId);
      if (btnEl) btnEl.classList.add('active');
      showToast('Đã lưu vào danh sách yêu thích!');
    }
    updateBadges();
  };

  // ------------------------------------------------------------------------
  // 4. QUICK VIEW MODAL
  // ------------------------------------------------------------------------
  const quickViewModal = document.getElementById('quickViewModal');
  const modalContainer = document.getElementById('quickViewContainer');

  window.openQuickView = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || !modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-content-grid">
        <div class="modal-image-box">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-info-box">
          <h2 style="font-size: 1.25rem; font-weight: 700; line-height: 1.35; color: #212121;">${product.title}</h2>
          
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #FBBF24;">
            <span>★★★★★</span>
            <span style="color: #6b7280; font-size: 0.75rem;">(Đánh giá chất lượng cao)</span>
          </div>

          <div style="margin: 4px 0;">
            <div style="font-size: 1.35rem; font-weight: 800; color: #FF6900;">${formatMoney(product.price)}</div>
            ${product.oldPrice ? `<div style="font-size: 0.8rem; color: #9ca3af; text-decoration: line-through;">Giá gốc: ${formatMoney(product.oldPrice)}</div>` : ''}
          </div>

          <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.6;">${product.description}</p>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="addToCart(${product.id}); closeQuickView();">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Thêm Vào Giỏ Hàng
            </button>
            <button class="btn btn-outlined" onclick="toggleWishlist(${product.id});">
              ♥ Lưu
            </button>
          </div>
        </div>
      </div>
    `;

    if (quickViewModal) quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeQuickView = () => {
    if (quickViewModal) quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  // ------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION
  // ------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');
  window.showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="#FF6900" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  };

  // ------------------------------------------------------------------------
  // 6. TÌM KIẾM SẢN PHẨM REAL-TIME
  // ------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const allCards = document.querySelectorAll('.product-card');

      allCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        if (!term || title.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Cuộn lên đầu trang
  window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeQuickView();
    }
  });

  updateBadges();
  renderCartDrawer();
});
