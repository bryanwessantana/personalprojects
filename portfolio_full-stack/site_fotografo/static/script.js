// MENU MOBILE
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
}

// LINK ATIVO PELO PATH
const currentPath = window.location.pathname;
document.querySelectorAll(".nav-links li a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) link.classList.add("active");
});

// IIFE PRINCIPAL
(function () {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const THEME_KEY = "site_theme";
    const header = document.querySelector(".header");

    /* =========================
       DARK MODE
    ========================== */
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        const btn = $("#theme-toggle");
        if (btn) {
            btn.setAttribute("aria-pressed", theme === "dark");
            btn.title = theme === "dark" ? "Tema claro" : "Tema escuro";
        }
    }

    function getPreferredTheme() {
        return localStorage.getItem(THEME_KEY) ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    function initTheme() {
        applyTheme(getPreferredTheme());
        const toggle = $("#theme-toggle");
        if (!toggle) return;

        toggle.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme") || "light";
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            localStorage.setItem(THEME_KEY, next);
        });

        document.addEventListener("keydown", (e) => {
            const tag = (e.target.tagName || "").toLowerCase();
            if ((e.key === "t" || e.key === "T") && !/input|textarea|select/.test(tag)) toggle.click();
        });
    }

    /* =========================
       LAZY-LOAD DE IMAGENS
    ========================== */
    function initLazyImages() {
        const imgs = $$("img[data-src]");
        if (!imgs.length) return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src");
                        obs.unobserve(img);
                    }
                }
            });
        }, { rootMargin: "200px 0px" });
        imgs.forEach(img => observer.observe(img));
    }

    /* =========================
       PORTFOLIO FILTER
    ========================== */
    function initPortfolioFilters() {
        const container = document.querySelector(".filtros-btns");
        if (!container) return;

        const buttons = container.querySelectorAll(".btn");
        const items = document.querySelectorAll(".portfolio-grid img[data-category]");
        if (!items.length) return;

        container.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn");
            if (!btn) return;

            // Atualiza o estado ativo dos botões
            buttons.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");

            const filter = btn.dataset.filter;

            // Mostra/oculta imagens
            items.forEach(img => {
                if (filter === "todos" || img.dataset.category === filter) {
                    img.classList.remove("hidden");
                } else {
                    img.classList.add("hidden");
                }
            });
        });
    }

    /* =========================
       LIGHTBOX
    ========================== */
    function initLightbox() {
        const grid = $(".portfolio-grid");
        if (!grid) return;

        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay hidden";
        const img = document.createElement("img");
        const caption = document.createElement("div");
        caption.className = "lightbox-caption";
        overlay.append(img, caption);
        document.body.appendChild(overlay);

        let currentIndex = -1;
        const getVisibleImages = () =>
            $$("img", grid).filter(i => i.offsetParent && getComputedStyle(i).display !== "none");

        function open(index) {
            const imgs = getVisibleImages();
            if (!imgs.length) return;
            currentIndex = Math.max(0, Math.min(index, imgs.length - 1));
            img.src = imgs[currentIndex].src;
            caption.textContent = imgs[currentIndex].alt || "";
            overlay.classList.remove("hidden");
            document.body.classList.add("no-scroll");
        }

        function close() {
            overlay.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }

        grid.addEventListener("click", e => {
            const target = e.target.closest("img");
            if (!target) return;
            const idx = getVisibleImages().indexOf(target);
            open(idx);
        });

        overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
        document.addEventListener("keydown", e => {
            if (overlay.classList.contains("hidden")) return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") open((currentIndex - 1 + getVisibleImages().length) % getVisibleImages().length);
            if (e.key === "ArrowRight") open((currentIndex + 1) % getVisibleImages().length);
        });
    }

    /* =========================
       SCROLL REVEAL
    ========================== */
    function initScrollReveal() {
        const elements = $$("section, .ensaio-card, .card, .depoimento");
        elements.forEach(el => el.classList.add("reveal"));
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        elements.forEach(el => observer.observe(el));
    }

    /* =========================
       BACK TO TOP
    ========================== */
    function initBackToTop() {
        const btn = document.createElement("button");
        btn.id = "back-to-top";
        btn.ariaLabel = "Voltar ao topo";
        btn.textContent = "↑";
        btn.className = "back-to-top hidden";
        document.body.appendChild(btn);

        window.addEventListener("scroll", () => btn.classList.toggle("hidden", window.scrollY <= 600));
        btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* =========================
       SMOOTH ANCHORS
    ========================== */
    function initSmoothAnchors() {
        document.addEventListener("click", e => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const el = $(a.getAttribute("href"));
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    /* =========================
       FORM UX
    ========================== */
    function initForms() {
        $$("form").forEach(form => {
            let submitting = false;
            form.addEventListener("submit", e => {
                if (submitting) { e.preventDefault(); return; }

                const name = form.querySelector('input[name="nome"]');
                const email = form.querySelector('input[name="email"]');
                const message = form.querySelector('textarea[name="mensagem"]');

                if (name && !name.value.trim()) { e.preventDefault(); alert("Informe seu nome."); name.focus(); return; }
                if (email && !/^\S+@\S+\.\S+$/.test(email.value)) { e.preventDefault(); alert("Informe um e-mail válido."); email.focus(); return; }
                if (message && !message.value.trim()) { e.preventDefault(); alert("Escreva sua mensagem."); message.focus(); return; }

                submitting = true;
                const btn = form.querySelector('[type="submit"], button');
                if (btn) { btn.disabled = true; btn.dataset.originalText = btn.textContent; btn.textContent = "Enviando..."; }
            });
        });
    }

    /* =========================
       HEADER SHRINK
    ========================== */
    function initHeaderShrink() {
        if (!header) return;
        window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 10));
    }

    /* =========================
       HERO PARALLAX
    ========================== */
    function initHeroParallax() {
        const hero = $(".hero");
        if (!hero) return;
        window.addEventListener("scroll", () => hero.style.backgroundPosition = `center ${window.scrollY * 0.3}px`);
    }

    /* =========================
       INICIALIZAÇÃO
    ========================== */
    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initLazyImages();
        initPortfolioFilters(); // ✅ agora existe
        initLightbox();
        initScrollReveal();
        initBackToTop();
        initSmoothAnchors();
        initForms();
        initHeaderShrink();
        initHeroParallax();
    });

})();
