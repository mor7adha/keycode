/* ----------------------------------------------------
   KeyCode Store - Application Logic
   Handles dynamic products, language translations, 
   shopping cart state, and order compilation.
   ---------------------------------------------------- */

// --- Global Translation Dictionary ---
const translations = {
    ar: {
        nav_home: "الرئيسية",
        nav_services: "الخدمات",
        nav_features: "مميزاتنا",
        nav_faqs: "الأسئلة الشائعة",
        nav_contact: "تواصل معنا",
        hero_badge: "✨ بوابتك للخدمات الرقمية الاحترافية",
        hero_title_1: "ارتقِ بأعمالك ودراستك مع",
        hero_description: "نقدم لك اشتراكات الذكاء الاصطناعي الرسمية، وتوثيق الحسابات، والخدمات الطلابية والأكاديمية، بالإضافة لتصميم وبرمجة المواقع الإلكترونية بأعلى دقة واحترافية.",
        hero_cta_browse: "تصفح الخدمات",
        hero_cta_whatsapp: "استشارة سريعة",
        stat_clients: "عميل سعيد",
        stat_satisfaction: "نسبة الرضا",
        stat_support: "دعم فني متواصل",
        why_subtitle: "لماذا متجرنا؟",
        why_title: "لماذا يختار العملاء متجر KeyCode؟",
        feat_speed_title: "سرعة فائقة في التنفيذ",
        feat_speed_desc: "نقوم بتفعيل اشتراكاتك وتسليم خدماتك خلال دقائق معدودة من إتمام عملية الدفع.",
        feat_guarantee_title: "ضمان كامل وأمان",
        feat_guarantee_desc: "جميع الاشتراكات والخدمات رسمية وقانونية 100% مع ضمان كامل طوال فترة الاشتراك.",
        feat_support_title: "دعم فني متميز",
        feat_support_desc: "فريق دعم متواجد على مدار الساعة عبر الواتساب والاتصال للإجابة على استفساراتك وحل مشاكلك.",
        services_subtitle: "خدماتنا المتميزة",
        services_title: "اختر الخدمة التي تناسب احتياجاتك",
        filter_all: "الكل",
        filter_ai: "اشتراكات الذكاء الاصطناعي",
        filter_design: "التصميم والمونتاج",
        filter_verify: "توثيق الحسابات",
        filter_academic: "الخدمات الطلابية",
        filter_web: "تطوير الويب",
        filter_entertainment: "ترفيه",
        filter_custom_services: "خدمات حسب الطلب",
        reviews_subtitle: "آراء العملاء",
        reviews_title: "ماذا يقولون عن خدمات KeyCode؟",
        review_1_text: `"خدمة سريعة جداً وموثوقة! قمت بشراء اشتراك ChatGPT Plus وتم التفعيل في أقل من 10 دقائق. الدعم الفني متعاون لأبعد الحدود."`,
        review_1_author: "أحمد عبدالله",
        review_1_title: "طالب ماجستير",
        review_2_text: `"طلبت تصميم موقع تعريفي لشركتي مع متجر بسيط. العمل كان غاية في الاحترافية وتصميم عصري يشد الانتباه وسرعة في التسليم."`,
        review_2_author: "خالد اليماني",
        review_2_title: "رائد أعمال",
        review_3_text: `"وفروا لي بحث تخرج متكامل ومنسق بشكل أكاديمي ممتاز مع المراجع والتنقيح. شكراً لجهودكم وتجاوبكم المستمر."`,
        review_3_author: "ريم سعيد",
        review_3_title: "خريجة تقنية معلومات",
        faq_subtitle: "الأسئلة الشائعة",
        faq_title: "لديك استفسار؟ ابحث عن الإجابة هنا",
        faq_q1: "كيف يتم تفعيل اشتراكات الذكاء الاصطناعي (مثل ChatGPT و Grok)؟",
        faq_a1: "بعد إتمام الدفع، نقوم بالتواصل معك عبر واتساب لتفعيل الاشتراك مباشرة على حسابك الشخصي أو تزويدك بحساب جاهز ومضمون وفقاً لنوع الخدمة التي اخترتها.",
        faq_q2: "هل خدمات توثيق حسابات منصة X رسمية؟",
        faq_a2: "نعم، نقدم خدمة مساعدة وإجراءات توثيق الحسابات بالكامل بطرق رسمية عبر إعداد الملف التعريفي والتحقق من الشروط وتقديم الطلب حتى الحصول على العلامة الزرقاء.",
        faq_q3: "ما هي طرق الدفع المتوفرة في المتجر؟",
        faq_a3: "نوفر عدة طرق دفع تناسب عملائنا الكرام، تشمل التحويلات البنكية المحلية (كريمي، يمن كور، النجم وغيرها) ومحفظات الجوال والعملات الرقمية. يتم التنسيق وتأكيد الدفع عبر الواتساب فور إرسال الطلب.",
        faq_q4: "كيف يمكنني متابعة سير العمل في المشاريع والخدمات الطلابية وتطوير المواقع؟",
        faq_a4: "يتم تخصيص مطور أو باحث أكاديمي للتواصل معك مباشرة عبر الواتساب لمشاركة التحديثات خطوة بخطوة والتأكد من تلبية جميع متطلباتك ودقة العمل المنجز.",
        cart_title: "سلة التسوق",
        cart_empty: "السلة فارغة حالياً. أضف بعض الخدمات!",
        cart_subtotal: "المجموع الفرعي:",
        cart_total: "الإجمالي الكلي:",
        form_name: "الاسم الكريم:",
        form_phone: "رقم الهاتف للتواصل:",
        form_payment: "طريقة الدفع المفضلة:",
        pay_kuraimi: "كريمي",
        pay_jeeb: "جيب",
        pay_jawaly: "جوالي",
        pay_qasimi: "القاسمي",
        pay_onecash: "ون كاش",
        pay_cash: "كاش",
        pay_binance: "بايننس",
        pay_bank_transfer: "حوالات مصرفية",
        pay_visa_mastercard: "فيزا / ماستركارد",
        btn_complete_order: "إرسال الطلب وتأكيده عبر الواتساب",
        btn_submit_order: "إرسال الطلب للواتساب",
        add_to_cart: "إضافة للسلة",
        request_service: "طلب الخدمة الآن",
        options_label: "اختر الباقة / المدة:",
        free_quote: "طلب تسعيرة / استفسار",
        contact_address: "اليمن، تقديم الخدمات عن بُعد لجميع الدول",
        footer_desc: "متجر KeyCode هو اختيارك الأول للخدمات الرقمية والحلول الطلابية والأكاديمية وتطوير المواقع بأحدث التقنيات وبأسعار مناسبة مع ضمان الخدمة.",
        footer_quick_links: "روابط سريعة",
        footer_contact_info: "معلومات الاتصال",
        footer_rights: "جميع الحقوق محفوظة."
    },
    en: {
        nav_home: "Home",
        nav_services: "Services",
        nav_features: "Features",
        nav_faqs: "FAQs",
        nav_contact: "Contact Us",
        hero_badge: "✨ Your Gateway to Professional Digital Services",
        hero_title_1: "Elevate your study & work with",
        hero_description: "We provide official AI subscriptions, social verification, student research solutions, and modern custom web design and development.",
        hero_cta_browse: "Browse Services",
        hero_cta_whatsapp: "Quick Consult",
        stat_clients: "Happy Clients",
        stat_satisfaction: "Satisfaction Rate",
        stat_support: "Continuous Support",
        why_subtitle: "Why Choose Us?",
        why_title: "Why clients trust KeyCode Store?",
        feat_speed_title: "Lightning Fast Delivery",
        feat_speed_desc: "We activate your subscriptions and deliver services within minutes of payment confirmation.",
        feat_guarantee_title: "Full Warranty & Secure",
        feat_guarantee_desc: "All subscriptions and services are 100% official and legal, with a full warranty covering the entire duration.",
        feat_support_title: "Premium 24/7 Support",
        feat_support_desc: "Our support team is available around the clock on WhatsApp and call to answer all questions.",
        services_subtitle: "Our Premium Services",
        services_title: "Select the Service that Fits Your Needs",
        filter_all: "All",
        filter_ai: "AI Subscriptions",
        filter_design: "Design & Editing",
        filter_verify: "Verification",
        filter_academic: "Student Services",
        filter_web: "Web Development",
        filter_entertainment: "Entertainment",
        filter_custom_services: "Custom Services",
        reviews_subtitle: "Client Reviews",
        reviews_title: "What do they say about KeyCode?",
        review_1_text: `"Super fast and reliable service! Bought ChatGPT Plus and got activated in under 10 minutes. The support team is incredibly helpful."`,
        review_1_author: "Ahmed Abdullah",
        review_1_title: "Master's Student",
        review_2_text: `"Ordered a landing page with a simple store. The execution was highly professional, modern design, fast loading, and quick delivery."`,
        review_2_author: "Khaled Al-Yamani",
        review_2_title: "Entrepreneur",
        review_3_text: `"They provided a complete and well-structured graduation project with all academic references. Extremely cooperative and responsive."`,
        review_3_author: "Reem Saeed",
        review_3_title: "IT Graduate",
        faq_subtitle: "FAQs",
        faq_title: "Have a Question? Find Answers Here",
        faq_q1: "How are AI subscriptions (like ChatGPT & Grok) activated?",
        faq_a1: "After payment, we contact you via WhatsApp to activate the subscription on your personal account or provide you with a pre-configured official account.",
        faq_q2: "Are X (Twitter) verification services official?",
        faq_a2: "Yes, we help set up your profile structure, verify criteria, and submit verification requests officially to get the Blue Checkmark badge.",
        faq_q3: "What payment methods are supported?",
        faq_a3: "We support local bank transfers (Kuraimi, Yemen Kur, Al-Najm), mobile e-wallets, and crypto (USDT). Payment validation is coordinated via WhatsApp after placing the order.",
        faq_q4: "How can I follow up on custom projects or web development?",
        faq_a4: "A dedicated academic writer or web developer is assigned to your project, communicating updates directly via WhatsApp at every milestone.",
        cart_title: "Shopping Cart",
        cart_empty: "Your cart is empty. Add some services!",
        cart_subtotal: "Subtotal:",
        cart_total: "Grand Total:",
        form_name: "Your Name:",
        form_phone: "Contact Phone:",
        form_payment: "Preferred Payment:",
        pay_kuraimi: "Kuraimi Bank",
        pay_jeeb: "Jeeb Wallet",
        pay_jawaly: "Jawaly Wallet",
        pay_qasimi: "Al-Qasimi Wallet",
        pay_onecash: "One Cash",
        pay_cash: "Cash",
        pay_binance: "Binance (USDT)",
        pay_bank_transfer: "Bank Transfer",
        pay_visa_mastercard: "Visa / Mastercard",
        btn_complete_order: "Send & Confirm Order via WhatsApp",
        btn_submit_order: "Send Request via WhatsApp",
        add_to_cart: "Add to Cart",
        request_service: "Order Service Now",
        options_label: "Select Package / Duration:",
        free_quote: "Request a Quote",
        contact_address: "Yemen, Remote services provided globally",
        footer_desc: "KeyCode Store is your premium choice for digital services, academic support, and web development using modern technologies at competitive rates.",
        footer_quick_links: "Quick Links",
        footer_contact_info: "Contact Info",
        footer_rights: "All rights reserved."
    }
};

// --- Product Database ---
const servicesDatabase = [
    {
        id: "chatgpt-plus",
        title_ar: "اشتراك ChatGPT Plus",
        title_en: "ChatGPT Plus",
        desc_ar: "اشتراك رسمي ومضمون للوصول إلى GPT-4o والإنتاجية اللامحدودة وسرعة الاستجابة.",
        desc_en: "Official guaranteed subscription to access GPT-4o with unlimited productivity and faster speed.",
        category: "ai-subscriptions",
        icon: "fa-robot",
        icon_class: "ai",
        badge_ar: "الأكثر طلباً 🔥",
        badge_en: "Best Seller 🔥",
        options: [
            { name_ar: "1 شهر - $8", name_en: "1 Month - $8", price: 8, original_price: 20, period_ar: "شهر", period_en: "month" }
        ]
    },
    {
        id: "gemini-pro",
        title_ar: "اشتراك Gemini Advanced (18 شهر)",
        title_en: "Gemini Advanced / Pro (18 Mos)",
        desc_ar: "استمتع بقوة أذكى نماذج جوجل للأعمال والتحليلات لمدة 18 شهراً بخصم خرافي.",
        desc_en: "Get Google's smartest AI model for business and data analytics for 18 months at a huge discount.",
        category: "ai-subscriptions",
        icon: "fa-brain",
        icon_class: "ai",
        badge_ar: "توفير ممتاز 🌟",
        badge_en: "Huge Saving 🌟",
        options: [
            { name_ar: "18 شهر - $20", name_en: "18 Months - $20", price: 20, original_price: 360, period_ar: "18 شهر", period_en: "18 mos" }
        ]
    },
    {
        id: "grok-super",
        title_ar: "اشتراك Grok Super",
        title_en: "Grok Super Premium",
        desc_ar: "وصول كامل للذكاء الاصطناعي من إيلون ماسك Grok على منصة X بدون إعلانات.",
        desc_en: "Full access to Elon Musk's Grok AI on the X platform with no ads.",
        category: "ai-subscriptions",
        icon: "fa-bolt",
        icon_class: "ai",
        badge_ar: "باقات مرنة",
        badge_en: "Flexible Plans",
        options: [
            { name_ar: "1 شهر - $6", name_en: "1 Month - $6", price: 6, original_price: 30, period_ar: "شهر", period_en: "month" },
            { name_ar: "3 أشهر - $15", name_en: "3 Months - $15", price: 15, original_price: 90, period_ar: "3 أشهر", period_en: "3 mos" },
            { name_ar: "6 أشهر - $22", name_en: "6 Months - $22", price: 22, original_price: 180, period_ar: "6 أشهر", period_en: "6 mos" },
            { name_ar: "1 سنة - $32", name_en: "1 Year - $32", price: 32, original_price: 360, period_ar: "سنة", period_en: "year" }
        ]
    },
    {
        id: "x-verification",
        title_ar: "توثيق حسابات منصة X (تويتر)",
        title_en: "X Verification & Blue Check",
        desc_ar: "الحصول على العلامة الزرقاء الرسمية وتهيئة حسابك للأمان والوصول الأوسع.",
        desc_en: "Acquire the official blue verification badge and optimize your account visibility.",
        category: "verification",
        icon: "fa-circle-check",
        icon_class: "verify",
        badge_ar: "رسمي ومضمون",
        badge_en: "Official Services",
        options: [
            { name_ar: "طلب مخصص وتفاصيل", name_en: "Custom details and quote", price: 0, is_quote: true }
        ]
    },
    {
        id: "canva-pro",
        title_ar: "اشتراك Canva Pro (سنتين)",
        title_en: "Canva Pro (2 Years)",
        desc_ar: "وصول كامل لجميع قوالب وعناصر وصور كانفا الاحترافية للتميز في تصميمك.",
        desc_en: "Complete access to all premium Canva templates, elements, and tools for 2 full years.",
        category: "design-edit",
        icon: "fa-palette",
        icon_class: "design",
        badge_ar: "سنتين كاملة",
        badge_en: "2 Full Years",
        options: [
            { name_ar: "سنتين - $3", name_en: "2 Years - $3", price: 3, original_price: 240, period_ar: "سنتين", period_en: "2 years" }
        ]
    },
    {
        id: "capcut-pro",
        title_ar: "اشتراك CapCut Pro",
        title_en: "CapCut Pro Premium",
        desc_ar: "أقوى برمجيات صناعة الفيديو على الجوال والكمبيوتر بجميع ميزاته المدفوعة وقوالبه.",
        desc_en: "Unlock the leading video editor on mobile & PC with premium filters, effects, and assets.",
        category: "design-edit",
        icon: "fa-video",
        icon_class: "design",
        badge_ar: "صناع المحتوى",
        badge_en: "Creator Choice",
        options: [
            { name_ar: "1 شهر - $5", name_en: "1 Month - $5", price: 5, original_price: 20, period_ar: "شهر", period_en: "month" }
        ]
    },
    {
        id: "chatgpt-go",
        title_ar: "اشتراك ChatGPT Go (3 أشهر)",
        title_en: "ChatGPT Go (3 Mos)",
        desc_ar: "اشتراك ChatGPT اقتصادي وسريع لمدة 3 أشهر مناسب للدراسة والتصفح اليومي.",
        desc_en: "Economic and fast ChatGPT subscription for 3 months, ideal for studying and daily lookups.",
        category: "ai-subscriptions",
        icon: "fa-paper-plane",
        icon_class: "ai",
        badge_ar: "باقة توفير",
        badge_en: "Budget AI",
        options: [
            { name_ar: "3 أشهر - $10", name_en: "3 Months - $10", price: 10, original_price: 15, period_ar: "3 أشهر", period_en: "3 mos" }
        ]
    },
    {
        id: "student-services",
        title_ar: "الخدمات الطلابية والأكاديمية",
        title_en: "Academic & Student Services",
        desc_ar: "كتابة الأبحاث والواجبات والمساعدة الأكاديمية ومشاريع التخرج بجودة وخلو من الذكاء الاصطناعي والسرقة.",
        desc_en: "Plagiarism-free research paper writing, assignments, essays, and graduation project assistance by experts.",
        category: "academic",
        icon: "fa-graduation-cap",
        icon_class: "academic",
        badge_ar: "خدمة جامعية",
        badge_en: "University Services",
        options: [
            { name_ar: "أبحاث وتكاليف ومشاريع تخرج", name_en: "Research, assignments & graduation projects", price: 0, is_quote: true }
        ]
    },
    {
        id: "web-dev",
        title_ar: "تطوير وتصميم المواقع",
        title_en: "Web Design & Development",
        desc_ar: "بناء مواقع فريدة، متاجر إلكترونية حديثة، بورتفوليو، وصفحات هبوط بأحدث التقنيات البصرية.",
        desc_en: "Creating professional websites, interactive e-commerce stores, and high-converting landing pages.",
        category: "web-dev",
        icon: "fa-code",
        icon_class: "web",
        badge_ar: "برمجة خاصة",
        badge_en: "Custom Coding",
        options: [
            { name_ar: "برمجة وتصميم المواقع", name_en: "Web designing and developing", price: 0, is_quote: true }
        ]
    }
];

// Keep a clean copy so the admin panel can recover from an accidentally empty saved list.
const defaultServicesDatabase = JSON.parse(JSON.stringify(servicesDatabase));

// Bridge data between index.html and admin.html even when the project is opened with file://.
// window.name survives navigation in the same tab, unlike file-scoped localStorage in some browsers.
function readProductsTransfer() {
    try {
        if (location.hash.startsWith("#products=")) {
            const products = JSON.parse(decodeURIComponent(location.hash.slice(10)));
            if (Array.isArray(products) && products.length) return products;
        }
        const transfer = JSON.parse(window.name || "null");
        return transfer?.keycode === "products-transfer" && Array.isArray(transfer.products) && transfer.products.length
            ? transfer.products
            : null;
    } catch (_) { return null; }
}

function writeProductsTransfer(products) {
    window.name = JSON.stringify({ keycode: "products-transfer", products, updatedAt: Date.now() });
}

function productsNavigationUrl(page, products) {
    return `${page}#products=${encodeURIComponent(JSON.stringify(products))}`;
}

// Apply product changes saved from the local admin panel.
try {
    const transferredServices = readProductsTransfer();
    if (transferredServices) {
        localStorage.setItem("keycode_products", JSON.stringify(transferredServices));
    }
    const managedServices = transferredServices || JSON.parse(localStorage.getItem("keycode_products") || "null");
    if (Array.isArray(managedServices)) {
        servicesDatabase.splice(0, servicesDatabase.length, ...managedServices);
    }
} catch (error) {
    console.warn("Could not load managed products", error);
}

// --- Contacts Data ---
const CONTACT_PHONE = "+967778150247";
const WHATSAPP_PHONE = "967784926052";

// --- State Variables ---
let currentLang = localStorage.getItem("keycode_lang") || "ar";
let cart = JSON.parse(localStorage.getItem("keycode_cart")) || [];
let activeCategory = "all";
let currentReviewIndex = 0;

// --- DOM Element References ---
const servicesGrid = document.getElementById("servicesGrid");
const cartBadgeCount = document.getElementById("cartBadgeCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const langToggle = document.getElementById("langToggle");
const langText = document.getElementById("langText");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const filterTabs = document.querySelectorAll(".filter-tab");
// Testimonials elements removed
const customServiceModal = document.getElementById("customServiceModal");
const closeModal = document.getElementById("closeModal");
const customServiceForm = document.getElementById("customServiceForm");
const modalTitle = document.getElementById("modalTitle");
const modalServiceType = document.getElementById("modalServiceType");
const customDetailsLabel = document.getElementById("customDetailsLabel");
const btnCheckout = document.getElementById("btnCheckout");
const userNameInput = document.getElementById("userName");
const paymentMethodSelect = document.getElementById("paymentMethod");

// --- Initialize Site ---
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
    renderServices();
    updateCartUI();
    initCounters();
    setupFAQAccordion();
    if (location.hash === "#admin-recovery") {
        const recoveryTarget = window.opener || (window.parent !== window ? window.parent : null);
        if (recoveryTarget) recoveryTarget.postMessage({ type: "keycode-products-recovery", products: defaultServicesDatabase }, "*");
    }
});

// --- Scroll Header Animation ---
window.addEventListener("scroll", () => {
    const header = document.querySelector(".main-header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// --- Language Toggle Logic ---
langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("keycode_lang", currentLang);
    applyLanguage(currentLang);
    renderServices();
    updateCartUI();
});

function applyLanguage(lang) {
    const isAr = lang === "ar";
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    
    // Update language switch button text
    langText.textContent = isAr ? "English" : "العربية";
    
    // Update all static i18n tags
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update placeholder texts
    if (isAr) {
        userNameInput.placeholder = "مثال: أحمد علي";
        document.getElementById("customName").placeholder = "الاسم الكامل";
        document.getElementById("customPhone").placeholder = "+967...";
        document.getElementById("customDetails").placeholder = "يرجى كتابة تفاصيل الخدمة، الموعد النهائي للتسليم، وأي مواصفات خاصة...";
    } else {
        userNameInput.placeholder = "e.g. John Doe";
        document.getElementById("customName").placeholder = "Full Name";
        document.getElementById("customPhone").placeholder = "+123...";
        document.getElementById("customDetails").placeholder = "Please write the task details, graduation subject, web page guidelines, deadline, etc.";
    }

    // Toggle stylesheet class helper
    if (isAr) {
        document.documentElement.classList.remove("lang-en");
        document.documentElement.classList.add("lang-ar");
    } else {
        document.documentElement.classList.remove("lang-ar");
        document.documentElement.classList.add("lang-en");
    }
}

// --- Dynamic Services Rendering ---
function renderServices() {
    servicesGrid.innerHTML = "";
    const isAr = currentLang === "ar";
    
    // Filter services
    const enabledServices = servicesDatabase.filter(service => service.active !== false);
    const filteredServices = activeCategory === "all"
        ? enabledServices
        : enabledServices.filter(service => service.category === activeCategory);
        
    filteredServices.forEach(service => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.setAttribute("data-id", service.id);
        
        const title = isAr ? service.title_ar : service.title_en;
        const desc = isAr ? service.desc_ar : service.desc_en;
        const isSoldOut = Number(service.stock) === 0;
        const badge = isSoldOut
            ? (isAr ? "نفد المخزون" : "Sold out")
            : (isAr ? service.badge_ar : service.badge_en);
        
        // Build Dropdown Option markup if there are multiple or if it's not a quote service
        const isQuote = service.options[0].is_quote;
        let pricingHTML = "";
        let actionButtonsHTML = "";
        let optionsHTML = "";

        if (isQuote) {
            pricingHTML = "";
            actionButtonsHTML = `
                <button class="btn btn-secondary" onclick="openQuoteModal('${service.id}')">
                    <i class="fa-solid fa-file-signature"></i>
                    <span>${isAr ? "طلب تسعيرة" : "Request Quote"}</span>
                </button>
            `;
        } else {
            const firstOpt = service.options[0];
            const hasMultipleOptions = service.options.length > 1;
            
            pricingHTML = `
                <div class="price-container" id="price-container-${service.id}">
                    <span class="price-main">$${firstOpt.price}</span>
                    <span class="price-original">$${firstOpt.original_price}</span>
                    <span class="price-period">/ ${isAr ? firstOpt.period_ar : firstOpt.period_en}</span>
                </div>
            `;
            
            if (hasMultipleOptions) {
                let optionsMarkup = "";
                service.options.forEach((opt, idx) => {
                    const optName = isAr ? opt.name_ar : opt.name_en;
                    optionsMarkup += `<option value="${idx}">${optName}</option>`;
                });
                optionsHTML = `
                    <div class="service-options">
                        <label class="options-label">${isAr ? "اختر الباقة / المدة:" : "Select Package / Duration:"}</label>
                        <select class="selector-dropdown" onchange="updateCardPrice('${service.id}', this.value)">
                            ${optionsMarkup}
                        </select>
                    </div>
                `;
            }

            actionButtonsHTML = `
                <button class="btn btn-primary" onclick="addToCart('${service.id}')" ${isSoldOut ? "disabled" : ""}>
                    <i class="fa-solid fa-shopping-cart"></i>
                    <span>${isSoldOut ? (isAr ? "نفد المخزون" : "Sold out") : (isAr ? "إضافة للسلة" : "Add to Cart")}</span>
                </button>
            `;
        }

        if (isSoldOut) card.classList.add("is-sold-out");
        card.innerHTML = `
            <div class="service-card-header">
                <div class="service-icon ${service.icon_class}"><i class="fa-solid ${service.icon}"></i></div>
                <span class="service-badge">${badge}</span>
            </div>
            <div class="service-card-body">
                <h3 class="service-title">${title}</h3>
                <p class="service-desc">${desc}</p>
                ${pricingHTML}
                ${optionsHTML}
            </div>
            <div class="service-card-footer">
                ${actionButtonsHTML}
            </div>
        `;
        
        servicesGrid.appendChild(card);
    });
}

// --- Update Price on Card Selection ---
window.updateCardPrice = function(serviceId, optionIndex) {
    const service = servicesDatabase.find(s => s.id === serviceId);
    if (!service) return;
    const option = service.options[optionIndex];
    const isAr = currentLang === "ar";
    
    const priceContainer = document.getElementById(`price-container-${serviceId}`);
    if (priceContainer) {
        priceContainer.innerHTML = `
            <span class="price-main">$${option.price}</span>
            <span class="price-original">$${option.original_price}</span>
            <span class="price-period">/ ${isAr ? option.period_ar : option.period_en}</span>
        `;
    }
};

// --- Category Filter Tabs Event ---
filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        filterTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeCategory = tab.getAttribute("data-filter");
        renderServices();
    });
});

// --- Modal Operations (Academic & Custom Dev) ---
window.openQuoteModal = function(serviceId) {
    const service = servicesDatabase.find(s => s.id === serviceId);
    if (!service) return;
    const isAr = currentLang === "ar";
    
    modalServiceType.value = serviceId;
    modalTitle.textContent = isAr ? service.title_ar : service.title_en;
    
    if (serviceId === "student-services") {
        customDetailsLabel.textContent = isAr 
            ? "اكتب تفاصيل البحث / التكليف / مشروع التخرج والموعد النهائي:" 
            : "Write project details, research topics, guidelines & final deadline:";
    } else if (serviceId === "web-dev") {
        customDetailsLabel.textContent = isAr 
            ? "صفحات موقعك المطلوبة ومواصفات البرمجة المفضلة:" 
            : "Describe pages, layout structure, functions & programming guidelines:";
    } else {
        customDetailsLabel.textContent = isAr 
            ? "اكتب تفاصيل طلبك بالتفصيل هنا:" 
            : "Enter your full request details:";
    }
    
    customServiceModal.classList.add("active");
};

closeModal.addEventListener("click", () => {
    customServiceModal.classList.remove("active");
    customServiceForm.reset();
});

// Submit Quote request directly to WhatsApp
customServiceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const serviceId = modalServiceType.value;
    const service = servicesDatabase.find(s => s.id === serviceId);
    const serviceName = service ? service.title_ar : "خدمة مخصصة";
    
    const clientName = document.getElementById("customName").value;
    const clientPhone = document.getElementById("customPhone").value;
    const details = document.getElementById("customDetails").value;
    
    const message = `*طلب خدمة جديدة مخصصة - KeyCode Store*\n` +
                    `---------------------------------------\n` +
                    `• *النوع:* ${serviceName}\n` +
                    `• *اسم العميل:* ${clientName}\n` +
                    `• *رقم الهاتف:* ${clientPhone}\n` +
                    `• *التفاصيل:* \n${details}\n` +
                    `---------------------------------------\n` +
                    `يرجى التواصل لتحديد التكلفة والموعد.`;
                    
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    customServiceModal.classList.remove("active");
    customServiceForm.reset();
});

// --- Shopping Cart Functions ---
window.addToCart = function(serviceId) {
    const service = servicesDatabase.find(s => s.id === serviceId);
    if (!service || Number(service.stock) === 0 || service.active === false) return;
    
    // Check if dropdown option selector exists in card UI to get chosen tier
    const cardEl = document.querySelector(`.service-card[data-id="${serviceId}"]`);
    let selectedOptionIdx = 0;
    if (cardEl) {
        const dropdown = cardEl.querySelector(".selector-dropdown");
        if (dropdown) selectedOptionIdx = parseInt(dropdown.value);
    }
    
    const selectedOption = service.options[selectedOptionIdx];
    
    // Check if item with this option already in cart
    const existingItemIdx = cart.findIndex(item => item.id === serviceId && item.optionIndex === selectedOptionIdx);
    
    const stockLimit = Number.isFinite(Number(service.stock)) ? Number(service.stock) : Infinity;
    const existingQuantity = existingItemIdx > -1 ? cart[existingItemIdx].quantity : 0;
    if (existingQuantity >= stockLimit) {
        alert(currentLang === "ar" ? "لا توجد كمية إضافية متاحة من هذا المنتج" : "No more stock is available for this product");
        return;
    }

    if (existingItemIdx > -1) {
        cart[existingItemIdx].quantity += 1;
    } else {
        cart.push({
            id: serviceId,
            optionIndex: selectedOptionIdx,
            quantity: 1,
            price: selectedOption.price,
            period_ar: selectedOption.period_ar,
            period_en: selectedOption.period_en,
            title_ar: service.title_ar,
            title_en: service.title_en,
            optionName_ar: selectedOption.name_ar,
            optionName_en: selectedOption.name_en
        });
    }
    
    saveCart();
    updateCartUI();
    openCartSidebar();
};

window.openAdminPanel = function() {
    let managedProducts = null;
    try { managedProducts = JSON.parse(localStorage.getItem("keycode_products") || "null"); } catch (_) {}
    if (!Array.isArray(managedProducts) || managedProducts.length === 0) {
        managedProducts = defaultServicesDatabase;
        localStorage.setItem("keycode_products", JSON.stringify(managedProducts));
    }
    writeProductsTransfer(managedProducts);
    const portal = document.getElementById("adminPortal");
    const frame = document.getElementById("adminPortalFrame");
    portal.hidden = false;
    document.body.style.overflow = "hidden";
    frame.onload = () => frame.contentWindow.postMessage({ type: "keycode-admin-products", products: managedProducts }, "*");
    if (!frame.getAttribute("src")) frame.src = "admin.html";
    else frame.contentWindow.postMessage({ type: "keycode-admin-products", products: managedProducts }, "*");
};

window.addEventListener("message", event => {
    if (event.data?.type === "keycode-products-update" && Array.isArray(event.data.products)) {
        servicesDatabase.splice(0, servicesDatabase.length, ...event.data.products);
        localStorage.setItem("keycode_products", JSON.stringify(event.data.products));
        writeProductsTransfer(event.data.products);
        renderServices();
        return;
    }
    if (event.data?.type === "keycode-close-admin") {
        document.getElementById("adminPortal").hidden = true;
        document.body.style.overflow = "";
        renderServices();
    }
});

window.addEventListener("pageshow", () => {
    const transferredServices = readProductsTransfer();
    if (!transferredServices) return;
    const currentSnapshot = JSON.stringify(servicesDatabase);
    const incomingSnapshot = JSON.stringify(transferredServices);
    if (currentSnapshot !== incomingSnapshot) {
        servicesDatabase.splice(0, servicesDatabase.length, ...transferredServices);
        localStorage.setItem("keycode_products", incomingSnapshot);
        renderServices();
    }
});

function saveCart() {
    localStorage.setItem("keycode_cart", JSON.stringify(cart));
}

function openCartSidebar() {
    document.body.classList.add("cart-active");
}

function closeCartSidebar() {
    document.body.classList.remove("cart-active");
}

cartToggle.addEventListener("click", openCartSidebar);
closeCart.addEventListener("click", closeCartSidebar);
cartOverlay.addEventListener("click", closeCartSidebar);

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

window.adjustQuantity = function(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
};

// --- Update Shopping Cart UI ---
function updateCartUI() {
    const isAr = currentLang === "ar";
    
    // Update badge count
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBadgeCount.textContent = totalQty;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-cart-plus"></i>
                <p>${isAr ? translations.ar.cart_empty : translations.en.cart_empty}</p>
            </div>
        `;
        cartSubtotal.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        document.getElementById("cartFooter").style.display = "none";
        return;
    }
    
    document.getElementById("cartFooter").style.display = "block";
    cartItemsContainer.innerHTML = "";
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const title = isAr ? item.title_ar : item.title_en;
        const optText = isAr ? item.optionName_ar : item.optionName_en;
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemHTML = `
            <div class="cart-item">
                <i class="fa-solid fa-trash remove-cart-item" onclick="removeFromCart(${index})"></i>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${title}</h4>
                    <span class="cart-item-option">${optText}</span>
                    <div class="cart-item-actions">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="adjustQuantity(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn" onclick="adjustQuantity(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHTML;
    });
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
}

// --- Submit Cart Checkout via WhatsApp ---
btnCheckout.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    const clientName = userNameInput.value.trim();
    if (!clientName) {
        alert(currentLang === "ar" ? "يرجى كتابة الاسم لإتمام الطلب" : "Please enter your name to complete the order");
        userNameInput.focus();
        return;
    }
    
    const isAr = currentLang === "ar";
    const paymentVal = paymentMethodSelect.value;
    
    let paymentMethodText = "";
    const paymentMethodsMap = {
        kuraimi: { ar: "كريمي", en: "Kuraimi Bank" },
        jeeb: { ar: "جيب", en: "Jeeb Wallet" },
        jawaly: { ar: "جوالي", en: "Jawaly Wallet" },
        qasimi: { ar: "القاسمي", en: "Al-Qasimi Wallet" },
        onecash: { ar: "ون كاش", en: "One Cash" },
        cash: { ar: "كاش", en: "Cash" },
        binance: { ar: "بايننس (Binance)", en: "Binance (USDT)" },
        bank_transfer: { ar: "حوالات مصرفية", en: "Bank Transfer" },
        visa_mastercard: { ar: "فيزا / ماستركارد", en: "Visa / Mastercard" }
    };
    
    if (paymentMethodsMap[paymentVal]) {
        paymentMethodText = isAr ? paymentMethodsMap[paymentVal].ar : paymentMethodsMap[paymentVal].en;
    } else {
        paymentMethodText = paymentVal;
    }
    
    let message = `*طلب شراء جديد - KeyCode Store*\n` +
                    `---------------------------------------\n` +
                    `• *الاسم الكـريم:* ${clientName}\n` +
                    `• *طريقة الدفع:* ${paymentMethodText}\n` +
                    `---------------------------------------\n` +
                    `*تفاصيل الخدمات المطلوبة:*\n\n`;
                    
    let cartTotalVal = 0;
    cart.forEach((item, idx) => {
        const title = isAr ? item.title_ar : item.title_en;
        const optText = isAr ? item.optionName_ar : item.optionName_en;
        const cost = item.price * item.quantity;
        cartTotalVal += cost;
        message += `${idx + 1}. *${title}*\n` +
                   `   • الفئة: ${optText}\n` +
                   `   • الكمية: ${item.quantity}\n` +
                   `   • السعر: $${cost.toFixed(2)}\n\n`;
    });
    
    message += `---------------------------------------\n` +
               `*الإجمالي الكلي:* $${cartTotalVal.toFixed(2)}\n` +
               `---------------------------------------\n` +
               `يرجى تأكيد الطلب وتزويدي ببيانات الدفع.`;
               
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Clear cart and redirect
    cart = [];
    saveCart();
    updateCartUI();
    closeCartSidebar();
    userNameInput.value = "";
    
    window.open(waUrl, "_blank");
});

// Testimonials slide controllers removed

// --- FAQ Accordion setup ---
function setupFAQAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(q => {
        q.addEventListener("click", () => {
            const item = q.parentElement;
            const answer = item.querySelector(".faq-answer");
            
            if (item.classList.contains("active")) {
                answer.style.maxHeight = null;
                item.classList.remove("active");
            } else {
                // Close other faqs
                document.querySelectorAll(".faq-item").forEach(otherItem => {
                    otherItem.classList.remove("active");
                    otherItem.querySelector(".faq-answer").style.maxHeight = null;
                });
                
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// --- Mobile Navigation Menu Trigger ---
mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
        icon.className = "fa-solid fa-xmark";
    } else {
        icon.className = "fa-solid fa-bars-staggered";
    }
});

// Close mobile nav when clicking a link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars-staggered";
        
        // Mark link as active
        document.querySelectorAll(".nav-link").forEach(nl => nl.classList.remove("active"));
        link.classList.add("active");
    });
});

// --- Statistics Counter Animation ---
function initCounters() {
    const stats = document.querySelectorAll(".stat-num");
    const speed = 150;
    
    const startCounting = (stat) => {
        const target = +stat.getAttribute("data-val");
        let count = 0;
        const increment = target / speed;
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.innerText = Math.ceil(count);
                setTimeout(updateCount, 10);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    };

    // Intersection Observer to run statistics counting once visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}
