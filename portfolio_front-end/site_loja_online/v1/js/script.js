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
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }); 
}

// Calls the function which the products are loaded
loadProducts("bestsellers", ".bestsellers .carousel").then(initCarouselNavigation);
loadProducts("promotions", ".promotions .carousel").then(initCarouselNavigation);

// ------ Check another way to do this ------ //
// Textos para cada botão da seção de dúvidas
const doubtTexts = {
    'trocas': [
        "Política de Troca e Devolução - Casa Biju",
        "Queremos que você se sinta feliz com sua compra! Por isso, confira abaixo nossa política de troca e devolução:",
        "Trocas por defeito de fabricação:",
        "Aceitamos trocas em até 7 dias corridos após o recebimento do produto.",
        "O item deve estar sem sinais de uso e com a etiqueta ou embalagem original. Produtos com mau uso não serão trocados.",
        "Trocas por escolha (cor, modelo, etc.):",
        "Você pode solicitar a troca em até 7 dias corridos após o recebimento, desde que o produto esteja sem uso, com a embalagem original e nota fiscal. Os custos de envio ficam por conta do cliente.",
        "Não realizamos trocas ou devoluções de peças usadas ou danificadas pelo uso.",
        "Como solicitar:",
        "Entre em contato conosco pelo WhatsApp ou e-mail com número do pedido, fotos do produto e motivo da troca/devolução. Vamos responder o mais rápido possível!"
    ],

    'atendimento': [
        "Central de Atendimento:",
        "Entre em contato conosco por nosso telefone: 41 99881-9356",
        "Fale conosco por nosso email: casabijucuritiba@gmail.com",
        "Horário de atendimento:",
        "Segunda a Sexta, das 9h às 18h.",
        "Sábados das 9h às 18h.",
    ]
};

// Seleciona elementos do modal
const overlay = document.getElementById('dialog-overlay');
const dialogText = document.getElementById('dialog-text');
const closeBtn = document.getElementById('close-dialog');

// Delegação de eventos para abrir/fechar o modal
document.addEventListener('click', function(e) {

    // Abrir modal ao clicar em um botão da seção .doubts
    if (e.target.matches('.doubts button')) {
        const key = e.target.getAttribute('data-dialog');

        // Criar HTML com parágrafos para cada item do array
        if (doubtTexts[key]) {
            dialogText.innerHTML = doubtTexts[key].map(line => `<p>${line}</p>`).join('');
        } else {
            dialogText.innerHTML = '';
        }

        overlay.classList.remove('hidden');
    }

    // Fechar modal ao clicar no botão "Fechar"
    if (e.target.matches('#close-dialog')) {
        overlay.classList.add('hidden');
    }
});