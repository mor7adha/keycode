import { loadProjects, projectText } from "./portfolio-data.js";

const grid = document.getElementById("workPreviewGrid");
let projects = [];

function placeholder(project, index) {
    const visual = document.createElement("div");
    visual.className = `work-card-visual work-card-visual-${index % 3}`;
    visual.setAttribute("aria-hidden", "true");
    visual.innerHTML = `<span>KEYCODE / ${String(index + 1).padStart(2, "0")}</span><strong>&lt;/&gt;</strong><i></i><i></i>`;
    return visual;
}

function render() {
    if (!grid) return;
    const language = document.documentElement.lang === "en" ? "en" : "ar";
    const selected = [...projects]
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
        .slice(0, 3);
    grid.replaceChildren();

    selected.forEach((project, index) => {
        const copy = projectText(project, language);
        const article = document.createElement("article");
        article.className = "work-preview-card";
        const media = document.createElement("div");
        media.className = "work-preview-media";
        if (project.image) {
            const image = document.createElement("img");
            image.src = project.image;
            image.alt = copy.title;
            image.loading = "lazy";
            image.width = 640;
            image.height = 400;
            media.append(image);
        } else {
            media.append(placeholder(project, index));
        }
        const body = document.createElement("div");
        body.className = "work-preview-body";
        const category = document.createElement("span");
        category.textContent = copy.category;
        const title = document.createElement("h3");
        title.textContent = copy.title;
        body.append(category, title);
        const link = document.createElement("a");
        link.className = "work-card-link";
        link.href = `works.html#${encodeURIComponent(project.id)}`;
        link.textContent = language === "ar" ? "تفاصيل المشروع" : "Project details";
        link.setAttribute("aria-label", `${link.textContent}: ${copy.title}`);
        body.append(link);
        article.append(media, body);
        grid.append(article);
    });
    grid.setAttribute("aria-busy", "false");
}

if (grid) {
    projects = await loadProjects();
    render();
    new MutationObserver(records => {
        if (records.some(record => record.attributeName === "lang")) render();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}
