async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        const headerHtml = await headerRes.text();
        const headerPlace = document.getElementById('header-placeholder');
        if(headerPlace) {
            headerPlace.innerHTML = headerHtml;
            initMobileMenu(); 
        }

        const footerRes = await fetch('components/footer.html');
        const footerHtml = await footerRes.text();
        const footerPlace = document.getElementById('footer-placeholder');
        if(footerPlace) footerPlace.innerHTML = footerHtml;

    } catch (error) {
        console.error("Erro ao carregar os componentes:", error);
    }
}

function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.onclick = () => {
            navLinks.classList.toggle("active");
            menuToggle.innerHTML = navLinks.classList.contains("active") ? "✕" : "☰";
            body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";
        };

        navLinks.querySelectorAll("a").forEach(link => {
            link.onclick = () => {
                navLinks.classList.remove("active");
                menuToggle.innerHTML = "☰";
                body.style.overflow = "auto";
            };
        });
    }
}

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    loadPortfolio(); 
    initScrollReveal(); 

    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (header) {
            window.scrollY > 50 ? header.classList.add("is-scrolled") : header.classList.remove("is-scrolled");
        }
    });
});

async function loadPortfolio() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    try {
        const response = await fetch('scripts/data/images.json'); 
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        let images = await response.json();
        images = images.sort(() => Math.random() - 0.5);

        grid.innerHTML = "";

        images.forEach(imgData => {
            const item = document.createElement("div");
            item.className = "masonry-item";
            item.dataset.category = imgData.category;

            const isVideo = imgData.src.toLowerCase().trim().endsWith('.mp4');

            if (isVideo) {
                item.innerHTML = `
                    <video autoplay loop muted playsinline preload="auto" class="portfolio-video">
                        <source src="${imgData.src}" type="video/mp4">
                    </video>`;
            } else {
                item.innerHTML = `<img src="${imgData.src}" alt="${imgData.alt}" loading="lazy">`;
            }

            grid.appendChild(item);
        });

        setTimeout(() => {
            applyFilter("todos"); 
            initPortfolioFilters();
        }, 100);

    } catch (error) {
        console.error("Erro ao carregar o portfólio:", error);
    }
}

function applyFilter(filter) {
    const items = document.querySelectorAll(".masonry-item");
    const grid = document.getElementById("portfolio-grid");

    grid.style.opacity = "0";

    setTimeout(() => {
        items.forEach(item => {
            const category = item.dataset.category;

            if (filter === "todos" || category === filter) {
                item.style.display = "block";
                item.classList.remove("filtered-out");
                setTimeout(() => item.classList.add("is-visible"), 10);
            } else {
                item.style.display = "none";
                item.classList.add("filtered-out");
                item.classList.remove("is-visible");
            }
        });

        grid.style.opacity = "1";
        grid.style.transition = "opacity 0.5s ease";
    }, 300);
}

function initPortfolioFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
        btn.onclick = (e) => {
            buttons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            applyFilter(e.target.dataset.filter);
        };
    });
}

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalBtnText = btn.innerText;
        
        btn.innerText = "Enviando...";
        btn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const toast = document.getElementById('toast-message');
                
                toast.classList.add('show');
                
                contactForm.reset();

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);

            } else {
                alert("Erro ao enviar. Tente novamente.");
            }
        } catch (error) {
            alert("Erro de conexão. Verifique sua internet.");
        } finally {
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }
    });
}