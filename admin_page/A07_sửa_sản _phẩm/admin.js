const productForm = document.querySelector("#product-form");
const formMessage = document.querySelector("#form-message");
const imageUpload = document.querySelector("#image-upload");
const imagePreview = document.querySelector("#image-preview");
const fileName = document.querySelector("#file-name");
const fileSize = document.querySelector("#file-size");
const cancelButton = document.querySelector("#cancel-button");
const mobileMenu = document.querySelector(".mobile-menu");
const sidebar = document.querySelector(".admin-sidebar");
const originalFileName = fileName.textContent;
const originalFileSize = fileSize.textContent;

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files?.[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    formMessage.textContent = "Vui lòng chọn ảnh JPG, PNG hoặc WebP.";
    imageUpload.value = "";
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  const oldPreview = imagePreview.querySelector(".uploaded-preview");
  if (oldPreview) {
    URL.revokeObjectURL(oldPreview.src);
    oldPreview.remove();
  }

  const preview = document.createElement("img");
  preview.className = "uploaded-preview";
  preview.src = imageUrl;
  preview.alt = "Ảnh xem trước sản phẩm";
  imagePreview.querySelector(".backpack-illustration").hidden = true;
  imagePreview.append(preview);

  fileName.textContent = file.name;
  fileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  formMessage.textContent = "";
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!productForm.reportValidity()) return;

  formMessage.textContent = "Thông tin sản phẩm đã được lưu.";
});

cancelButton.addEventListener("click", () => {
  productForm.reset();
  const preview = imagePreview.querySelector(".uploaded-preview");
  if (preview) {
    URL.revokeObjectURL(preview.src);
    preview.remove();
  }
  imagePreview.querySelector(".backpack-illustration").hidden = false;
  fileName.textContent = originalFileName;
  fileSize.textContent = originalFileSize;
  formMessage.textContent = "Đã hủy các thay đổi trong biểu mẫu.";
});

mobileMenu.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (window.innerWidth <= 560
      && sidebar.classList.contains("is-open")
      && !sidebar.contains(event.target)
      && !mobileMenu.contains(event.target)) {
    sidebar.classList.remove("is-open");
    mobileMenu.setAttribute("aria-expanded", "false");
  }
});
