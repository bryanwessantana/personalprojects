// Function to load HTML templates into specified elements
async function loadTemplate(id, file) {
    try {
        const el = document.getElementById(id);
        if (el) {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Erro ao carregar ${file}`);
            const html = await response.text();
            el.innerHTML = html;
        }
    } catch (err) {
        console.error(err);
    }
}

// Load templates from the folder "templates"
loadTemplate("header", "templates/header.html");
loadTemplate("footer", "templates/footer.html");

// Load products from JSON and populate a specific carousel
async function loadProducts(filterTag = null, carouselSelector) {
    const res = await fetch("js/data/products.json");
    const products = await res.json();

    // Filter products by tag if provided
    let filtered = products;
    if (filterTag) {
        filtered = products.filter(p => p.tags.includes(filterTag));
    }

    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return; // Exit if carousel not found

    carousel.innerHTML = ""; // Clear existing content

    // Populate carousel with products
    filtered.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("product")
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button>Add to Cart</button>
        `;
        carousel.appendChild(card);
    });
}

// Load bestsellers and promotions
loadProducts("bestsellers", ".bestsellers .carousel");
loadProducts("promotions", ".promotions .carousel");

// Initialize carousel navigation
function initCarouselNavigation() {
    // Select all carousel containers
    document.querySelectorAll('.carousel-container').forEach(container => {
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const carousel = container.querySelector('.carousel');

        const scrollAmount = 220; // Amount to scroll on each button click

        if (prevBtn && nextBtn && carousel) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    }); 
}

// Calls the function which the products are loaded
loadProducts("bestsellers", ".bestsellers .carousel").then(initCarouselNavigation);
loadProducts("promotions", ".promotions .carousel").then(initCarouselNavigation);