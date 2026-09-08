const TOKEN_KEY = "keycode_admin_password";
const USERNAME_KEY = "keycode_admin_username";
const DEFAULT_USERNAME = "admin";

const byId = id => document.getElementById(id);
const ui = {
    loginScreen: byId("loginScreen"), dashboard: byId("dashboard"), loginForm: byId("loginForm"),
    loginUser: byId("loginUser"), loginPassword: byId("loginPassword"), loginError: byId("loginError"),
    projectsBody: byId("projectsBody"), emptyState: byId("emptyState"), search: byId("searchInput"),
    total: byId("totalProjects"), featured: byId("featuredProjects"), categories: byId("categoryCount"), status: byId("saveStatus"),
    modal: byId("projectModal"), form: byId("projectForm"), modalHeading: byId("modalHeading"), formError: byId("formError"),
    saveButton: byId("saveProjectBtn"), imageInput: byId("projectImage"), imagePreview: byId("imagePreview"), imageWrap: byId("imagePreviewWrap"),
    deleteModal: byId("deleteModal"), deleteMessage: byId("deleteMessage"), deleteError: byId("deleteError"), toast: byId("toast")
};

let projects = [];
let editingId = null;
let deletingId = null;
let imageValue = "";
let imageReading = false;
let busy = false;
let toastTimer = 0;

function credentials() {
    return {
        "x-admin-username": sessionStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME,
        "x-admin-password": sessionStorage.getItem(TOKEN_KEY) || ""
    };
}

async function api(method = "GET", body) {
    const response = await fetch("/api/projects", {
        method,
        cache: "no-store",
        headers: { accept: "application/json", "content-type": "application/json", ...credentials() },
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "تعذر إتمام الطلب. حاول مجددًا.");
    return data;
}

function showToast(message) {
    clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 3500);
}

function setBusy(value, label = "جارٍ الحفظ…") {
    busy = value;
    ui.saveButton.disabled = value;
    byId("addProjectBtn").disabled = value;
    ui.saveButton.textContent = value ? label : "حفظ ونشر المشروع";
}

function projectCover(project) {
    const cover = document.createElement("span");
    cover.className = "project-admin-cover";
    if (project.image) {
        const image = document.createElement("img");
        image.src = project.image;
        image.alt = "";
        cover.append(image);
    } else {
        cover.textContent = "</>";
    }
    return cover;
}

function iconButton(icon, label, action, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-btn ${className}`.trim();
    button.setAttribute("aria-label", label);
    const iconNode = document.createElement("i");
    iconNode.className = `fa-solid ${icon}`;
    iconNode.setAttribute("aria-hidden", "true");
    button.append(iconNode);
    button.addEventListener("click", action);
    return button;
}

function render() {
    const query = ui.search.value.trim().toLocaleLowerCase();
    const visible = projects.filter(project => `${project.title} ${project.title_en} ${project.category}`.toLocaleLowerCase().includes(query));
    ui.projectsBody.replaceChildren();
    ui.emptyState.hidden = visible.length > 0;
    ui.total.textContent = projects.length.toLocaleString("ar");
    ui.featured.textContent = projects.filter(project => project.featured).length.toLocaleString("ar");
    ui.categories.textContent = new Set(projects.map(project => project.category)).size.toLocaleString("ar");

    visible.forEach(project => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const name = document.createElement("div");
        name.className = "project-admin-name";
        const copy = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = project.title;
        const description = document.createElement("small");
        description.textContent = project.description;
        copy.append(title, description);
        name.append(projectCover(project), copy);
        nameCell.append(name);

        const category = document.createElement("td");
        category.textContent = project.category;
        const year = document.createElement("td");
        year.textContent = project.year || "—";
        const state = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = `status${project.featured ? " featured" : ""}`;
        badge.textContent = project.featured ? "مميز" : "منشور";
        state.append(badge);

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";
        actions.append(
            iconButton("fa-pen", `تعديل ${project.title}`, () => openEditor(project)),
            iconButton("fa-trash", `حذف ${project.title}`, () => openDelete(project), "delete")
        );
        actionsCell.append(actions);
        row.append(nameCell, category, year, state, actionsCell);
        ui.projectsBody.append(row);
    });
}

async function loadProjects() {
    ui.status.textContent = "جارٍ تحميل الأعمال…";
    const data = await api("GET");
    projects = Array.isArray(data.projects) ? data.projects : [];
    ui.status.textContent = "الأعمال متزامنة مع المعرض";
    render();
}

async function saveProjects(nextProjects, successMessage) {
    if (busy) return false;
    setBusy(true);
    ui.status.textContent = "جارٍ النشر…";
    try {
        await api("PUT", { projects: nextProjects });
        projects = nextProjects;
        ui.status.textContent = "تم الحفظ والنشر";
        render();
        showToast(successMessage);
        return true;
    } catch (error) {
        ui.status.textContent = "تعذر حفظ آخر تغيير";
        throw error;
    } finally {
        setBusy(false);
    }
}

function fill(id, value = "") { byId(id).value = value; }

function updateImagePreview() {
    ui.imageWrap.hidden = !imageValue;
    if (imageValue) ui.imagePreview.src = imageValue;
    else ui.imagePreview.removeAttribute("src");
}

function openEditor(project = null) {
    editingId = project?.id || null;
    imageValue = project?.image || "";
    ui.form.reset();
    ui.formError.textContent = "";
    ui.modalHeading.textContent = project ? "تعديل المشروع" : "إضافة مشروع";
    fill("titleAr", project?.title);
    fill("titleEn", project?.title_en);
    fill("descriptionAr", project?.description);
    fill("descriptionEn", project?.description_en);
    fill("categoryAr", project?.category);
    fill("categoryEn", project?.category_en);
    fill("projectUrl", project?.url);
    fill("projectYear", project?.year);
    fill("tagsAr", project?.tags);
    fill("tagsEn", project?.tags_en);
    byId("projectFeatured").checked = Boolean(project?.featured);
    updateImagePreview();
    ui.modal.hidden = false;
    byId("titleAr").focus();
}

function closeEditor() {
    if (busy || imageReading) return;
    ui.modal.hidden = true;
    editingId = null;
    imageValue = "";
    ui.imageInput.value = "";
    byId("addProjectBtn").focus();
}

function openDelete(project) {
    deletingId = project.id;
    ui.deleteMessage.textContent = `سيُحذف «${project.title}» من الموقع نهائيًا.`;
    ui.deleteError.textContent = "";
    ui.deleteModal.hidden = false;
    byId("cancelDelete").focus();
}

function closeDelete() {
    if (busy) return;
    ui.deleteModal.hidden = true;
    deletingId = null;
}

ui.loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    ui.loginError.textContent = "جارٍ التحقق…";
    sessionStorage.setItem(USERNAME_KEY, ui.loginUser.value.trim() || DEFAULT_USERNAME);
    sessionStorage.setItem(TOKEN_KEY, ui.loginPassword.value);
    try {
        await api("POST");
        ui.loginForm.reset();
        ui.loginScreen.hidden = true;
        ui.dashboard.hidden = false;
        await loadProjects();
    } catch (error) {
        sessionStorage.removeItem(TOKEN_KEY);
        ui.loginError.textContent = error.message;
    } finally { button.disabled = false; }
});

byId("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    ui.dashboard.hidden = true;
    ui.loginScreen.hidden = false;
    ui.loginUser.value = DEFAULT_USERNAME;
    ui.loginPassword.focus();
});
byId("addProjectBtn").addEventListener("click", () => openEditor());
byId("closeModal").addEventListener("click", closeEditor);
byId("cancelModal").addEventListener("click", closeEditor);
byId("removeImage").addEventListener("click", () => { imageValue = ""; ui.imageInput.value = ""; updateImagePreview(); });
ui.search.addEventListener("input", render);

ui.imageInput.addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    ui.formError.textContent = "";
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
        ui.formError.textContent = "اختر صورة PNG أو JPG أو WebP لا تتجاوز 2 ميجابايت.";
        event.target.value = "";
        return;
    }
    imageReading = true;
    ui.saveButton.disabled = true;
    try {
        imageValue = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = imageValue;
        await image.decode();
        updateImagePreview();
    } catch {
        imageValue = "";
        event.target.value = "";
        ui.formError.textContent = "تعذر قراءة الصورة. اختر ملف صورة صالحًا.";
    } finally {
        imageReading = false;
        ui.saveButton.disabled = false;
    }
});

ui.form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy || imageReading) return;
    ui.formError.textContent = "";
    const existing = projects.find(project => project.id === editingId);
    const id = existing?.id || (crypto.randomUUID?.() || `project-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const project = {
        id,
        title: byId("titleAr").value.trim(),
        title_en: byId("titleEn").value.trim(),
        description: byId("descriptionAr").value.trim(),
        description_en: byId("descriptionEn").value.trim(),
        category: byId("categoryAr").value.trim(),
        category_en: byId("categoryEn").value.trim(),
        url: byId("projectUrl").value.trim(),
        year: byId("projectYear").value.trim(),
        tags: byId("tagsAr").value.trim(),
        tags_en: byId("tagsEn").value.trim(),
        image: imageValue,
        featured: byId("projectFeatured").checked
    };
    const next = existing ? projects.map(item => item.id === id ? project : item) : [project, ...projects];
    try {
        if (await saveProjects(next, existing ? "تم تحديث المشروع ونشره." : "تمت إضافة المشروع ونشره.")) closeEditor();
    } catch (error) { ui.formError.textContent = error.message; }
});

byId("cancelDelete").addEventListener("click", closeDelete);
byId("confirmDelete").addEventListener("click", async () => {
    ui.deleteError.textContent = "";
    try {
        if (await saveProjects(projects.filter(project => project.id !== deletingId), "تم حذف المشروع.")) closeDelete();
    } catch (error) { ui.deleteError.textContent = error.message; }
});

async function initialize() {
    ui.loginUser.value = sessionStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME;
    if (!sessionStorage.getItem(TOKEN_KEY)) return;
    try {
        await api("POST");
        ui.loginScreen.hidden = true;
        ui.dashboard.hidden = false;
        await loadProjects();
    } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        ui.loginError.textContent = "انتهت جلسة الإدارة. سجّل الدخول مجددًا.";
    }
}

initialize();
