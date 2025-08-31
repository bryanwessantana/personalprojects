document.addEventListener("DOMContentLoaded", () => {
    fetch("/static/data/services.json")
        .then(res => res.json())
        .then(services => {
            renderServices(services);
            populateSelect(services);

            // === Seleção automática do serviço ===
            const select = document.getElementById("service");
            if (select) {
                const selectedService = localStorage.getItem("selectedService");
                if (selectedService) {
                    select.value = selectedService;
                    localStorage.removeItem("selectedService");
                    select.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        })
        .catch(err => console.error("Erro ao carregar serviços:", err));
});


// === Renderiza os cards de serviços ===
function renderServices(services) {
    const container = document.querySelector(".services-list"); // mudou aqui
    if (!container) return;

    container.innerHTML = "";
    services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p>${service.duration} - R$ ${service.price}</p>
            <button onclick="selectService('${service.id}')">Agendar</button>
        `;

        container.appendChild(card);
    });
}

// === Preenche o select de serviços ===
function populateSelect(services) {
    const select = document.getElementById("service");
    if (!select) return;

    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = `${service.name} - R$ ${service.price}`;
        select.appendChild(option);
    });
}

// === Seleciona serviço e redireciona ===
function selectService(serviceId) {
    localStorage.setItem("selectedService", serviceId);
    window.location.href = "/agendamento"; // rota direta do Flask
}