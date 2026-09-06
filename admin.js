"use strict";

const DEFAULT_ADMIN_USER = "admin";
const PRODUCTS_KEY = "keycode_products";
const TOKEN_KEY = "keycode_admin_password";
const USERNAME_KEY = "keycode_admin_username";

const $ = id => document.getElementById(id);
const loginScreen = $("loginScreen");
const dashboard = $("dashboard");
const modal = $("productModal");
const credentialsModal = $("credentialsModal");
let products = loadProducts();
let saveQueue = Promise.resolve();
let saveRevision = 0;

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
  normalizeProductOrder();
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  writeTransfer();
  if (window.parent !== window) window.parent.postMessage({ type:"keycode-products-update", products }, "*");
  $("saveStatus").textContent = "جارٍ الحفظ على Netlify...";
  renderProducts();
  const snapshot = JSON.stringify({ products });
  const revision = ++saveRevision;
  saveQueue = saveQueue.catch(() => {}).then(async () => {
    try {
      const response = await fetch("/api/products", {
        method:"PUT",
        headers:{
          "content-type":"application/json",
          "x-admin-username":sessionStorage.getItem(USERNAME_KEY) || DEFAULT_ADMIN_USER,
          "x-admin-password":sessionStorage.getItem(TOKEN_KEY) || ""
        },
        body:snapshot
      });
      if (!response.ok) throw new Error((await response.json()).error || "Save failed");
      if (revision === saveRevision) {
        $("saveStatus").textContent = "محفوظ على Netlify — " + new Date().toLocaleTimeString("ar", {hour:"2-digit", minute:"2-digit"});
        showToast(message);
      }
    } catch (error) {
      if (revision === saveRevision) {
        $("saveStatus").textContent = "تعذر الحفظ السحابي";
        showToast(location.protocol === "file:" ? "الحفظ السحابي يعمل على رابط Netlify فقط" : `خطأ: ${error.message}`);
      }
    }
  });
  return saveQueue;
}

async function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  renderProducts();
  await loadProductsFromServer();
}

async function loadProductsFromServer() {
  try {
    const response = await fetch("/api/products", { cache:"no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (Array.isArray(data.products)) {
      products = data.products;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      writeTransfer();
      renderProducts();
      if (window.parent !== window) window.parent.postMessage({ type:"keycode-products-update", products }, "*");
    } else if (products.length && sessionStorage.getItem(TOKEN_KEY)) {
      await saveProducts("تم إنشاء مخزن المنتجات على Netlify");
    }
  } catch (_) {}
}

function clearAdminSession() {
  sessionStorage.removeItem("keycode_admin_session");
  sessionStorage.removeItem(USERNAME_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

// Require explicit authentication every time the admin page is opened or refreshed.
clearAdminSession();

$("loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const username = $("loginUser").value.trim();
  const password = $("loginPassword").value;
  $("loginError").textContent = "جارٍ التحقق...";
  try {
    const response = await fetch("/api/products", { method:"POST", headers:{ "x-admin-username":username, "x-admin-password":password } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "invalid");
    sessionStorage.setItem(USERNAME_KEY, data.username || username);
    sessionStorage.setItem(TOKEN_KEY, password);
    $("loginError").textContent = "";
    $("loginForm").reset();
    showDashboard();
  } catch (_) {
    $("loginError").textContent = "اسم المستخدم أو كلمة المرور غير صحيحة";
  }
});

$("logoutBtn").addEventListener("click", () => {
  clearAdminSession();
  location.reload();
});

function openCredentialsModal() {
  $("credentialsForm").reset();
  $("newUsername").value = sessionStorage.getItem(USERNAME_KEY) || DEFAULT_ADMIN_USER;
  $("credentialsError").textContent = "";
  credentialsModal.hidden = false;
  requestAnimationFrame(() => $("currentPassword").focus());
}

function closeCredentialsModal() {
  credentialsModal.hidden = true;
  $("credentialsForm").reset();
  ["currentPassword", "newPassword", "confirmPassword"].forEach(id => { $(id).type = "password"; });
  $("credentialsError").textContent = "";
}

$("credentialsBtn").addEventListener("click", openCredentialsModal);
$("closeCredentialsModal").addEventListener("click", closeCredentialsModal);
$("cancelCredentialsModal").addEventListener("click", closeCredentialsModal);
credentialsModal.addEventListener("click", event => { if (event.target === credentialsModal) closeCredentialsModal(); });

$("showCredentialsPasswords").addEventListener("change", event => {
  const type = event.target.checked ? "text" : "password";
  ["currentPassword", "newPassword", "confirmPassword"].forEach(id => { $(id).type = type; });
});

$("currentPassword").addEventListener("input", () => $("currentPassword").removeAttribute("aria-invalid"));
$("confirmPassword").addEventListener("input", () => {
  if ($("confirmPassword").value === $("newPassword").value) {
    $("confirmPassword").removeAttribute("aria-invalid");
    if ($("credentialsError").textContent === "كلمتا المرور الجديدتان غير متطابقتين") $("credentialsError").textContent = "";
  }
});

$("credentialsForm").addEventListener("submit", async event => {
  event.preventDefault();
  const username = $("newUsername").value.trim();
  const currentPassword = $("currentPassword").value;
  const password = $("newPassword").value;
  const confirmPassword = $("confirmPassword").value;
  const error = $("credentialsError");
  const button = $("saveCredentialsBtn");
  let responseStatus = 0;

  error.textContent = "";
  $("currentPassword").removeAttribute("aria-invalid");
  if (password !== confirmPassword) {
    error.textContent = "كلمتا المرور الجديدتان غير متطابقتين";
    $("confirmPassword").setAttribute("aria-invalid", "true");
    $("confirmPassword").focus();
    return;
  }
  $("confirmPassword").removeAttribute("aria-invalid");
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>جارٍ الحفظ...</span>';

  try {
    const response = await fetch("/api/products", {
      method:"PATCH",
      headers:{
        "content-type":"application/json",
        "x-admin-username":sessionStorage.getItem(USERNAME_KEY) || DEFAULT_ADMIN_USER,
        "x-admin-password":currentPassword
      },
      body:JSON.stringify({ username, password })
    });
    responseStatus = response.status;
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "تعذر تغيير بيانات الدخول");
    sessionStorage.setItem(USERNAME_KEY, data.username || username);
    sessionStorage.setItem(TOKEN_KEY, password);
    closeCredentialsModal();
    showToast("تم تغيير اسم المستخدم وكلمة المرور بنجاح");
  } catch (requestError) {
    error.textContent = requestError.message;
    if (responseStatus === 401) {
      $("currentPassword").setAttribute("aria-invalid", "true");
      $("currentPassword").focus();
    }
  } finally {
    button.disabled = false;
    button.removeAttribute("aria-busy");
    button.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span>حفظ بيانات الدخول</span>';
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !credentialsModal.hidden) closeCredentialsModal();
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

function isUnavailable(product) {
  return Number(product.stock) === 0 || product.active === false;
}

function productOrderGroup(product) {
  if (isUnavailable(product)) return 2;
  return product.featured === true ? 0 : 1;
}

function orderedProducts(list = products) {
  return list
    .map((product, index) => ({ product, index }))
    .sort((a, b) => productOrderGroup(a.product) - productOrderGroup(b.product) || a.index - b.index)
    .map(item => item.product);
}

function normalizeProductOrder() {
  products = orderedProducts();
}

function renderProducts() {
  const query = $("searchInput").value.trim().toLowerCase();
  normalizeProductOrder();
  const visible = products.filter(p => `${p.title_ar} ${p.title_en}`.toLowerCase().includes(query));
  $("productsBody").innerHTML = visible.map(product => {
    const option = product.options?.[0] || {};
    const soldOut = isUnavailable(product);
    const stockText = Number.isFinite(Number(product.stock)) ? Number(product.stock) : "غير محدود";
    const sameGroup = products.filter(item => productOrderGroup(item) === productOrderGroup(product));
    const groupIndex = sameGroup.findIndex(item => item.id === product.id);
    const isFirst = groupIndex === 0;
    const isLast = groupIndex === sameGroup.length - 1;
    const featuredLabel = product.featured === true && !soldOut ? '<span class="status featured"><i class="fa-solid fa-star"></i> مميز</span>' : "";
    return `<tr>
      <td><div class="product-name"><span class="position-number">${products.findIndex(item => item.id === product.id) + 1}</span><span class="product-icon"><i class="fa-solid ${safeText(product.icon || "fa-box")}"></i></span><div><strong>${safeText(product.title_ar)}</strong><br><small>${safeText(product.title_en)}</small></div></div></td>
      <td>${safeText(categoryNames[product.category] || product.category)}</td><td>$${Number(option.price || 0).toFixed(2)}</td><td>${stockText}</td>
      <td><div class="status-list"><span class="status ${soldOut ? "sold" : ""}">${soldOut ? (product.active === false ? "مخفي" : "نفد") : "متوفر"}</span>${featuredLabel}</div></td>
      <td><div class="order-actions"><button class="icon-btn feature ${product.featured === true && !soldOut ? "active" : ""}" onclick="toggleFeatured('${safeText(product.id)}')" aria-label="${soldOut ? `لا يمكن تمييز ${safeText(product.title_ar)} لأنه غير متوفر` : product.featured === true ? `إلغاء تمييز ${safeText(product.title_ar)}` : `تمييز ${safeText(product.title_ar)} وإظهاره في البداية`}" title="${soldOut ? "غير متاح للمنتج النافد أو المخفي" : product.featured === true ? "إلغاء التمييز" : "تمييز وإظهار في البداية"}" ${soldOut ? "disabled" : ""}><i class="fa-solid fa-star"></i></button><button class="icon-btn" onclick="moveProduct('${safeText(product.id)}', -1)" aria-label="تحريك ${safeText(product.title_ar)} للأعلى" title="تحريك للأعلى" ${isFirst ? "disabled" : ""}><i class="fa-solid fa-arrow-up"></i></button><button class="icon-btn" onclick="moveProduct('${safeText(product.id)}', 1)" aria-label="تحريك ${safeText(product.title_ar)} للأسفل" title="تحريك للأسفل" ${isLast ? "disabled" : ""}><i class="fa-solid fa-arrow-down"></i></button></div></td>
      <td><div class="actions"><button class="icon-btn" onclick="editProduct('${safeText(product.id)}')" aria-label="تعديل ${safeText(product.title_ar)}" title="تعديل"><i class="fa-solid fa-pen"></i></button><button class="icon-btn delete" onclick="deleteProduct('${safeText(product.id)}')" aria-label="حذف ${safeText(product.title_ar)}" title="حذف"><i class="fa-solid fa-trash"></i></button></div></td>
    </tr>`;
  }).join("");
  $("emptyState").hidden = visible.length !== 0;
  $("totalProducts").textContent = products.length;
  $("availableProducts").textContent = products.filter(p => Number(p.stock) !== 0 && p.active !== false).length;
  $("soldOutProducts").textContent = products.filter(p => Number(p.stock) === 0 || p.active === false).length;
}

window.moveProduct = (id, direction) => {
  normalizeProductOrder();
  const index = products.findIndex(item => item.id === id);
  if (index < 0) return;
  const group = productOrderGroup(products[index]);
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= products.length || productOrderGroup(products[targetIndex]) !== group) return;
  [products[index], products[targetIndex]] = [products[targetIndex], products[index]];
  saveProducts(direction < 0 ? "تم تحريك المنتج للأعلى" : "تم تحريك المنتج للأسفل");
};

window.toggleFeatured = id => {
  normalizeProductOrder();
  const index = products.findIndex(item => item.id === id);
  if (index < 0 || isUnavailable(products[index])) return;
  const product = products[index];
  product.featured = product.featured !== true;
  if (product.featured) {
    products.splice(index, 1);
    products.unshift(product);
  }
  normalizeProductOrder();
  saveProducts(product.featured ? "تم تمييز العرض ونقله إلى البداية" : "تم إلغاء تمييز العرض");
};

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
  $("featured").checked = product?.featured === true;
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
    stock: Math.max(0, Number.parseInt($("stock").value, 10) || 0), active: $("active").checked, featured: $("featured").checked,
    options: [{ name_ar:isQuote ? "طلب مخصص وتفاصيل" : `${$("periodAr").value || "الباقة"} - $${price}`, name_en:isQuote ? "Custom details and quote" : `${$("periodEn").value || "Package"} - $${price}`, price:isQuote ? 0 : price, original_price:isQuote ? 0 : originalPrice, period_ar:$("periodAr").value || "الباقة", period_en:$("periodEn").value || "package", is_quote:isQuote }]
  };
  if (existing) products[products.findIndex(item => item.id === existingId)] = product; else products.unshift(product);
  normalizeProductOrder();
  saveProducts(existing ? "تم تعديل المنتج" : "تمت إضافة المنتج");
  closeProductModal();
});

function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
