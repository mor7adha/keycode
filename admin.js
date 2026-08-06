"use strict";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "KeyCode@2026";
const PRODUCTS_KEY = "keycode_products";
const SESSION_KEY = "keycode_admin_session";

const $ = id => document.getElementById(id);
const loginScreen = $("loginScreen");
const dashboard = $("dashboard");
const modal = $("productModal");
let products = loadProducts();

function readTransfer() {
  try {
    if (location.hash.startsWith("#products=")) {
      const products = JSON.parse(decodeURIComponent(location.hash.slice(10)));
      if (Array.isArray(products) && products.length) return products;
    }
    const transfer = JSON.parse(window.name || "null");
    return transfer?.keycode === "products-transfer" && Array.isArray(transfer.products) && transfer.products.length ? transfer.products : null;
  } catch (_) { return null; }
}

function writeTransfer() {
  window.name = JSON.stringify({ keycode:"products-transfer", products, updatedAt:Date.now() });
}

function loadProducts() {
  try {
    const transferred = readTransfer();
    if (transferred) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(transferred));
    const value = transferred || JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) { return []; }
}

function saveProducts(message = "تم حفظ التغييرات") {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  writeTransfer();
  if (window.parent !== window) window.parent.postMessage({ type:"keycode-products-update", products }, "*");
  $("saveStatus").textContent = "تم الحفظ — " + new Date().toLocaleTimeString("ar", {hour:"2-digit", minute:"2-digit"});
  showToast(message);
  renderProducts();
}

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  renderProducts();
}

if (sessionStorage.getItem(SESSION_KEY) === "active") showDashboard();

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  if ($("loginUser").value.trim() === ADMIN_USER && $("loginPassword").value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "active");
    $("loginError").textContent = "";
    showDashboard();
  } else {
    $("loginError").textContent = "اسم المستخدم أو كلمة المرور غير صحيحة";
  }
});

$("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

function openStorePreview() {
  if (window.parent !== window) {
    window.parent.postMessage({ type:"keycode-close-admin" }, "*");
    return;
  }
  writeTransfer();
  $("storePreviewFrame").src = `index.html#products=${encodeURIComponent(JSON.stringify(products))}`;
  $("storePreview").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeStorePreview() {
  $("storePreview").hidden = true;
  $("storePreviewFrame").src = "about:blank";
  document.body.style.overflow = "";
}

$("previewStoreBtn").addEventListener("click", openStorePreview);
$("closePreview").addEventListener("click", closeStorePreview);

window.recoverFromStore = function() {
  $("storePreviewFrame").src = "index.html#admin-recovery";
  $("storePreview").hidden = false;
  showToast("جارٍ استعادة المنتجات الأصلية...");
};

window.addEventListener("message", event => {
  if (event.data?.type === "keycode-admin-products" && Array.isArray(event.data.products) && event.data.products.length) {
    products = event.data.products;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    writeTransfer();
    if (!dashboard.hidden) renderProducts();
    return;
  }
  if (event.data?.type !== "keycode-products-recovery" || !Array.isArray(event.data.products)) return;
  products = event.data.products;
  saveProducts("تمت استعادة المنتجات الأصلية");
  closeStorePreview();
});

window.addEventListener("pagehide", () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  writeTransfer();
});

function safeText(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
}

const categoryNames = {
  "ai-subscriptions":"ذكاء اصطناعي", "design-edit":"تصميم ومونتاج", verification:"توثيق",
  academic:"خدمات طلابية", "web-dev":"تطوير الويب", entertainment:"ترفيه", "custom-services":"خدمات حسب الطلب"
};

function renderProducts() {
  const query = $("searchInput").value.trim().toLowerCase();
  const visible = products.filter(p => `${p.title_ar} ${p.title_en}`.toLowerCase().includes(query));
  $("productsBody").innerHTML = visible.map(product => {
    const option = product.options?.[0] || {};
    const soldOut = Number(product.stock) === 0 || product.active === false;
    const stockText = Number.isFinite(Number(product.stock)) ? Number(product.stock) : "غير محدود";
    return `<tr>
      <td><div class="product-name"><span class="product-icon"><i class="fa-solid ${safeText(product.icon || "fa-box")}"></i></span><div><strong>${safeText(product.title_ar)}</strong><br><small>${safeText(product.title_en)}</small></div></div></td>
      <td>${safeText(categoryNames[product.category] || product.category)}</td><td>$${Number(option.price || 0).toFixed(2)}</td><td>${stockText}</td>
      <td><span class="status ${soldOut ? "sold" : ""}">${soldOut ? (product.active === false ? "مخفي" : "نفد") : "متوفر"}</span></td>
      <td><div class="actions"><button class="icon-btn" onclick="editProduct('${safeText(product.id)}')" title="تعديل"><i class="fa-solid fa-pen"></i></button><button class="icon-btn delete" onclick="deleteProduct('${safeText(product.id)}')" title="حذف"><i class="fa-solid fa-trash"></i></button></div></td>
    </tr>`;
  }).join("");
  $("emptyState").hidden = visible.length !== 0;
  $("totalProducts").textContent = products.length;
  $("availableProducts").textContent = products.filter(p => Number(p.stock) !== 0 && p.active !== false).length;
  $("soldOutProducts").textContent = products.filter(p => Number(p.stock) === 0 || p.active === false).length;
}

$("searchInput").addEventListener("input", renderProducts);
$("addProductBtn").addEventListener("click", () => openProductModal());
$("category").addEventListener("change", () => {
  if ($("category").value === "custom-services") $("saleType").value = "quote";
});
$("closeModal").addEventListener("click", closeProductModal);
$("cancelModal").addEventListener("click", closeProductModal);
modal.addEventListener("click", event => { if (event.target === modal) closeProductModal(); });

function openProductModal(product = null) {
  $("productForm").reset();
  $("modalHeading").textContent = product ? "تعديل المنتج" : "إضافة منتج";
  $("productId").value = product?.id || "";
  $("titleAr").value = product?.title_ar || ""; $("titleEn").value = product?.title_en || "";
  $("descAr").value = product?.desc_ar || ""; $("descEn").value = product?.desc_en || "";
  $("category").value = product?.category || "ai-subscriptions"; $("icon").value = product?.icon || "fa-box";
  const option = product?.options?.[0] || {};
  $("saleType").value = option.is_quote ? "quote" : "fixed";
  $("price").value = option.price ?? ""; $("originalPrice").value = option.original_price ?? "";
  $("stock").value = Number.isFinite(Number(product?.stock)) ? product.stock : 100;
  $("periodAr").value = option.period_ar || ""; $("periodEn").value = option.period_en || "";
  $("active").checked = product?.active !== false;
  modal.hidden = false;
}

function closeProductModal() { modal.hidden = true; }

window.editProduct = id => {
  const product = products.find(item => item.id === id);
  if (product) openProductModal(product);
};

window.deleteProduct = id => {
  const product = products.find(item => item.id === id);
  if (!product || !confirm(`هل تريد حذف "${product.title_ar}"؟`)) return;
  products = products.filter(item => item.id !== id);
  saveProducts("تم حذف المنتج");
};

$("productForm").addEventListener("submit", event => {
  event.preventDefault();
  const existingId = $("productId").value;
  const existing = products.find(item => item.id === existingId);
  const id = existingId || `product-${Date.now()}`;
  const price = Number($("price").value);
  const originalPrice = Number($("originalPrice").value || price);
  const isQuote = $("saleType").value === "quote";
  const product = {
    ...(existing || {}), id,
    title_ar: $("titleAr").value.trim(), title_en: $("titleEn").value.trim(),
    desc_ar: $("descAr").value.trim(), desc_en: $("descEn").value.trim(),
    category: $("category").value, icon: $("icon").value,
    icon_class: $("category").value === "design-edit" ? "design" : $("category").value === "verification" ? "verify" : $("category").value === "academic" ? "academic" : ["web-dev", "custom-services"].includes($("category").value) ? "web" : $("category").value === "entertainment" ? "design" : "ai",
    badge_ar: existing?.badge_ar || "منتج مميز", badge_en: existing?.badge_en || "Featured",
    stock: Math.max(0, Number.parseInt($("stock").value, 10) || 0), active: $("active").checked,
    options: [{ name_ar:isQuote ? "طلب مخصص وتفاصيل" : `${$("periodAr").value || "الباقة"} - $${price}`, name_en:isQuote ? "Custom details and quote" : `${$("periodEn").value || "Package"} - $${price}`, price:isQuote ? 0 : price, original_price:isQuote ? 0 : originalPrice, period_ar:$("periodAr").value || "الباقة", period_en:$("periodEn").value || "package", is_quote:isQuote }]
  };
  if (existing) products[products.findIndex(item => item.id === existingId)] = product; else products.unshift(product);
  saveProducts(existing ? "تم تعديل المنتج" : "تمت إضافة المنتج");
  closeProductModal();
});

function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
