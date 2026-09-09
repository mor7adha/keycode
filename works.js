import { loadProjects, projectText } from "./portfolio-data.js";

const translations = {
    ar: {
        skip: "انتقل إلى الأعمال",
        nav_home: "الرئيسية",
        nav_services: "الخدمات",
        nav_works: "أعمالنا",
        nav_about: "عن KeyCode",
        nav_contact: "تواصل معنا",
        hero_eyebrow: "من الفكرة إلى تجربة تستحق العرض",
        hero_title: "نصنع الفرق.<br>وتحكي <span class=\"gradient-text\">أعمالنا</span><br>بقية القصة<span class=\"hero-dot\">.</span>",
        hero_description: "كل مشروع فرصة لصناعة شيء مختلف. اكتشف كيف نحوّل الأفكار إلى تجارب رقمية تجمع جمال التصميم وقوة الأداء.",
        hero_cta: "اكتشف أعمالنا",
        hero_contact: "عندك فكرة؟ خلّنا نتحدث",
        proof_title: "شغف بالتفاصيل. إتقان في التنفيذ.",
        proof_text: "من أول فكرة، إلى آخر سطر برمجي.",
        art_idea: "أفكار تتحول إلى واقع",
        art_result: "تصميم يلفت. تجربة تبقى.",
        discipline_ui: "تصميم واجهات",
        discipline_web: "تطوير مواقع",
        discipline_store: "متاجر إلكترونية",
        discipline_systems: "أنظمة ذكية",
        projects_eyebrow: "مختارات من شغلنا / SELECTED WORK",
        projects_title: "أفكار أخذت <span class=\"gradient-text\">شكلها الحقيقي.</span>",
        projects_count: "مشروع في المعرض",
        search_label: "ابحث عن مشروع",
        search_placeholder: "ابحث عن مشروع…",
        about_eyebrow: "الفكرة تستحق تنفيذًا متقنًا",
        about_title: "تفاصيل صغيرة.<br><span class=\"gradient-text\">أثر كبير.</span>",
        about_text: "في KeyCode، نؤمن أن المشروع الناجح يبدأ بفهم الفكرة. نجمع التصميم والتطوير لنصنع تجربة واضحة، جميلة، وسهلة الاستخدام.",
        value_identity: "تصميم بهوية",
        value_build: "تطوير بإتقان",
        value_experience: "تجربة تهمّك",
        contact_eyebrow: "مشروعك القادم يبدأ بمحادثة",
        contact_title: "عندك فكرة؟ <span class=\"gradient-text\">نعطيها حياة.</span>",
        contact_text: "حدثنا عن مشروعك، ولنصنع معًا شيئًا يستحق أن يكون هنا.",
        contact_cta: "خلّنا نبدأ على واتساب",
        footer_desc: "نصمم ونطوّر حلولًا رقمية تهتم بالفكرة والتفاصيل والنتيجة.",
        footer_links: "روابط سريعة",
        footer_contact: "معلومات الاتصال",
        footer_location: "اليمن، خدمات عن بُعد لجميع الدول",
        footer_rights: "جميع الحقوق محفوظة.",
        manage_work: "إدارة الأعمال",
        all: "كل الأعمال",
        featured: "عمل مميز",
        details: "تفاصيل المشروع",
        visit: "زيارة الموقع",
        empty_title: "لم نجد مشروعًا بهذا البحث",
        empty_text: "جرّب كلمة أخرى أو تصنيفًا مختلفًا.",
        clear: "عرض كل الأعمال",
        close: "إغلاق"
    },
    en: {
        skip: "Skip to projects",
        nav_home: "Home",
        nav_services: "Services",
        nav_works: "Our Work",
        nav_about: "About KeyCode",
        nav_contact: "Contact",
        hero_eyebrow: "From an idea to an experience worth showcasing",
        hero_title: "We make the difference.<br><span class=\"gradient-text\">Our work</span><br>tells the rest<span class=\"hero-dot\">.</span>",
        hero_description: "Every project is a chance to create something different. Discover how we turn ideas into digital experiences that balance polished design and powerful performance.",
        hero_cta: "Discover our work",
        hero_contact: "Have an idea? Let's talk",
        proof_title: "Passion for detail. Precision in delivery.",
        proof_text: "From the first idea to the final line of code.",
        art_idea: "Ideas turned into reality",
        art_result: "Design that stands out. Experiences that stay.",
        discipline_ui: "UI Design",
        discipline_web: "Web Development",
        discipline_store: "E-commerce",
        discipline_systems: "Smart Systems",
        projects_eyebrow: "SELECTED WORK / BUILT BY KEYCODE",
        projects_title: "Ideas brought to <span class=\"gradient-text\">life.</span>",
        projects_count: "projects in the showcase",
        search_label: "Search projects",
        search_placeholder: "Search projects…",
        about_eyebrow: "A good idea deserves precise execution",
        about_title: "Small details.<br><span class=\"gradient-text\">Real impact.</span>",
        about_text: "At KeyCode, we believe successful projects begin with understanding the idea. We combine design and development to create experiences that are clear, beautiful, and easy to use.",
        value_identity: "Distinctive design",
        value_build: "Precise development",
        value_experience: "Thoughtful experience",
        contact_eyebrow: "Your next project starts with a conversation",
        contact_title: "Have an idea? <span class=\"gradient-text\">We bring it to life.</span>",
        contact_text: "Tell us about your project, and let's create something worthy of this showcase.",
        contact_cta: "Start on WhatsApp",
        footer_desc: "We design and build digital solutions that care about the idea, the details, and the outcome.",
        footer_links: "Quick Links",
        footer_contact: "Contact Info",
        footer_location: "Yemen, serving clients remotely worldwide",
        footer_rights: "All rights reserved.",
        manage_work: "Manage projects",
        all: "All work",
        featured: "Featured",
        details: "Project details",
        visit: "Visit website",
        empty_title: "No projects match your search",
        empty_text: "Try another keyword or a different category.",
        clear: "Show all projects",
        close: "Close"
    }
};

const elements = {
    header: document.querySelector(".main-header"),
    menu: document.getElementById("navMenu"),
    menuButton: document.getElementById("mobileMenuBtn"),
    languageButton: document.getElementById("langToggle"),
    languageText: document.getElementById("langText"),
    filters: document.getElementById("projectFilters"),
    search: document.getElementById("projectSearch"),
    grid: document.getElementById("projectGrid"),
    count: document.getElementById("projectCount"),
    dialog: document.getElementById("projectDialog"),
    dialogContent: document.getElementById("dialogContent"),
    dialogClose: document.getElementById("dialogClose")
};

let language = localStorage.getItem("keycode_lang") === "en" ? "en" : "ar";
let projects = [];
let projectsLoaded = false;
let activeCategory = "all";
let lastDialogTrigger = null;

function text(key) { return translations[language][key]; }

function node(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
}

function safeExternalLink(url) {
    try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
    } catch { return ""; }
}

function projectPlaceholder(project, large = false) {
    const visual = node("div", `portfolio-card-placeholder${large ? " project-dialog-placeholder" : ""}`);
    visual.setAttribute("aria-hidden", "true");
    visual.append(node("span", "", "KEYCODE / WORK"), node("b", "", "</>"));
    return visual;
}

function projectMedia(project, copy, large = false) {
    if (!project.image) return projectPlaceholder(project, large);
    const image = node("img", large ? "project-dialog-image" : "");
    image.src = project.image;
    image.alt = copy.title;
    image.loading = large ? "eager" : "lazy";
    image.width = 720;
    image.height = 450;
    return image;
}

function openProject(project, trigger) {
    lastDialogTrigger = trigger || document.activeElement;
    const copy = projectText(project, language);
    elements.dialogContent.replaceChildren();
    elements.dialogContent.append(projectMedia(project, copy, true));

    const body = node("div", "project-dialog-body");
    body.append(node("span", "works-eyebrow", `${copy.category}${project.year ? ` / ${project.year}` : ""}`));
    const title = node("h2", "", copy.title);
    title.id = "dialogTitle";
    body.append(title, node("p", "", copy.description));

    const tags = node("div", "project-tags");
    copy.tags.split(/[,،]/).map(tag => tag.trim()).filter(Boolean).forEach(tag => tags.append(node("span", "", tag)));
    if (tags.children.length) body.append(tags);

    const url = safeExternalLink(project.url);
    if (url) {
        const link = node("a", "btn btn-primary", text("visit"));
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.append(node("i", "fa-solid fa-arrow-up-right-from-square"));
        body.append(link);
    }
    elements.dialogContent.append(body);
    elements.dialogClose.setAttribute("aria-label", text("close"));
    if (!elements.dialog.open) elements.dialog.showModal();
    elements.dialogContent.scrollTop = 0;
    history.replaceState(null, "", `#${encodeURIComponent(project.id)}`);
}

function closeProject() {
    elements.dialog.close();
    if (location.hash && projects.some(project => `#${encodeURIComponent(project.id)}` === location.hash)) {
        history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
    lastDialogTrigger?.focus?.();
}

function createProjectCard(project) {
    const copy = projectText(project, language);
    const article = node("article", "portfolio-project-card");
    const media = node("button", "portfolio-card-media");
    media.type = "button";
    media.setAttribute("aria-label", `${text("details")}: ${copy.title}`);
    media.append(projectMedia(project, copy));
    media.addEventListener("click", () => openProject(project, media));
    if (project.featured) media.append(node("span", "featured-tag", text("featured")));

    const body = node("div", "portfolio-card-body");
    const meta = node("div", "portfolio-card-meta");
    meta.append(node("span", "", copy.category), node("span", "", project.year || "KEYCODE"));
    body.append(meta, node("h3", "", copy.title), node("p", "", copy.description));

    const actions = node("div", "portfolio-card-actions");
    const details = node("button", "", text("details"));
    details.type = "button";
    details.setAttribute("aria-label", `${text("details")}: ${copy.title}`);
    details.addEventListener("click", () => openProject(project, details));
    actions.append(details);
    const url = safeExternalLink(project.url);
    if (url) {
        const visit = node("a", "", text("visit"));
        visit.href = url;
        visit.target = "_blank";
        visit.rel = "noopener noreferrer";
        visit.setAttribute("aria-label", `${text("visit")}: ${copy.title}`);
        actions.append(visit);
    }
    body.append(actions);
    article.append(media, body);
    return article;
}

function matchesProject(project, query) {
    return `${project.title || ""} ${project.title_en || ""} ${project.description || ""} ${project.description_en || ""} ${project.tags || ""} ${project.tags_en || ""}`
        .toLocaleLowerCase()
        .includes(query);
}

function renderProjects() {
    if (!projectsLoaded) return;
    const query = elements.search.value.trim().toLocaleLowerCase();
    const visible = projects
        .filter(project => (activeCategory === "all" || project.category === activeCategory) && matchesProject(project, query))
        .sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured)));
    elements.grid.replaceChildren();
    elements.count.textContent = projects.length.toLocaleString(language === "ar" ? "ar" : "en");

    if (!visible.length) {
        const empty = node("div", "portfolio-empty");
        const content = node("div", "portfolio-empty-inner");
        content.append(node("i", "fa-solid fa-folder-open"), node("h3", "", text("empty_title")), node("p", "", text("empty_text")));
        const reset = node("button", "btn btn-secondary", text("clear"));
        reset.type = "button";
        reset.addEventListener("click", () => {
            activeCategory = "all";
            elements.search.value = "";
            renderFilters();
            renderProjects();
        });
        content.append(reset);
        empty.append(content);
        elements.grid.append(empty);
    } else {
        visible.forEach(project => elements.grid.append(createProjectCard(project)));
    }
    elements.grid.setAttribute("aria-busy", "false");
}

function renderFilters() {
    if (!projectsLoaded) return;
    const categories = [...new Set(projects.map(project => project.category).filter(Boolean))];
    elements.filters.replaceChildren();
    ["all", ...categories].forEach(category => {
        const label = category === "all"
            ? text("all")
            : projectText(projects.find(project => project.category === category), language).category;
        const button = node("button", `portfolio-filter${activeCategory === category ? " active" : ""}`, label);
        button.type = "button";
        button.setAttribute("aria-pressed", String(activeCategory === category));
        button.addEventListener("click", () => {
            activeCategory = category;
            renderFilters();
            renderProjects();
        });
        elements.filters.append(button);
    });
}

function applyLanguage() {
    const arabic = language === "ar";
    document.documentElement.lang = language;
    document.documentElement.dir = arabic ? "rtl" : "ltr";
    document.title = arabic ? "أعمالنا | KeyCode" : "Our Work | KeyCode";
    elements.languageText.textContent = arabic ? "English" : "العربية";
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const value = translations[language][element.dataset.i18n];
        if (value) element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        element.placeholder = translations[language][element.dataset.i18nPlaceholder];
    });
    renderFilters();
    renderProjects();
    if (elements.dialog.open) {
        const current = projects.find(project => `#${encodeURIComponent(project.id)}` === location.hash);
        if (current) openProject(current, lastDialogTrigger);
    }
}

function closeMenu() {
    elements.menu.classList.remove("active");
    elements.menuButton.setAttribute("aria-expanded", "false");
    elements.menuButton.querySelector("i").className = "fa-solid fa-bars-staggered";
}

elements.languageButton.addEventListener("click", () => {
    language = language === "ar" ? "en" : "ar";
    localStorage.setItem("keycode_lang", language);
    applyLanguage();
});
elements.menuButton.addEventListener("click", () => {
    const open = elements.menu.classList.toggle("active");
    elements.menuButton.setAttribute("aria-expanded", String(open));
    elements.menuButton.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars-staggered";
});
elements.menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
elements.search.addEventListener("input", renderProjects);
elements.dialogClose.addEventListener("click", closeProject);
elements.dialog.addEventListener("click", event => {
    if (event.target !== elements.dialog) return;
    const bounds = elements.dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject();
});
elements.dialog.addEventListener("close", () => {
    if (location.hash && projects.some(project => `#${encodeURIComponent(project.id)}` === location.hash)) {
        history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
});
window.addEventListener("scroll", () => elements.header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();
applyLanguage();

function openRequestedProject() {
    const requestedProject = projects.find(project => `#${encodeURIComponent(project.id)}` === location.hash);
    if (requestedProject && !elements.dialog.open) openProject(requestedProject);
}
loadProjects().then(updated => {
    projects = updated;
    projectsLoaded = true;
    renderFilters();
    renderProjects();
    openRequestedProject();
});
