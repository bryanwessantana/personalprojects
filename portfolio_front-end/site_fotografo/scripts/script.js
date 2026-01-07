async function loadComponents() {
    try {
        // Carregar Header
        const headerRes = await fetch('components/header.html');
        const headerHtml = await headerRes.text();
        const headerPlace = document.getElementById('header-placeholder');
        if(headerPlace) headerPlace.innerHTML = headerHtml;

        // Carregar Footer
        const footerRes = await fetch('components/footer.html');
        const footerHtml = await footerRes.text();
        const footerPlace = document.getElementById('footer-placeholder');
        if(footerPlace) footerPlace.innerHTML = footerHtml;

        // Re-inicializa funções que dependem do header (como o menu mobile)
        if (typeof initMobileMenu === "function") initMobileMenu();

    } catch (error) {
        console.error("Erro ao carregar os componentes:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    console.log("DOM carregado, iniciando loadPortfolio...");
    loadPortfolio(); 

    // Efeito do Header
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

            // Detecta se é vídeo ignorando maiúsculas/minúsculas
            const isVideo = imgData.src.toLowerCase().trim().endsWith('.mp4');

            if (isVideo) {
                // Adicionamos 'preload="auto"' para ajudar no carregamento
                item.innerHTML = `
                    <video autoplay loop muted playsinline preload="auto" class="portfolio-video">
                        <source src="${imgData.src}" type="video/mp4">
                        Seu navegador não suporta vídeos.
                    </video>`;
            } else {
                item.innerHTML = `<img src="${imgData.src}" alt="${imgData.alt}" loading="lazy">`;
            }

            grid.appendChild(item);
        });

        // Inicializa os filtros e força a exibição inicial
        setTimeout(() => {
            applyFilter("todos"); 
            initPortfolioFilters();
        }, 100);

    } catch (error) {
        console.error("Erro ao carregar o portfólio:", error);
    }
}

// Função isolada para aplicar filtros com animação
function applyFilter(filter) {
    const items = document.querySelectorAll(".masonry-item");

    items.forEach(item => {
        item.classList.remove("is-visible"); // Esconde para re-animar
        
        setTimeout(() => {
            const category = item.dataset.category;
            if (filter === "todos" || category === filter) {
                item.style.display = "block";
                setTimeout(() => item.classList.add("is-visible"), 50);
            } else {
                item.style.display = "none";
            }
        }, 300);
    });
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