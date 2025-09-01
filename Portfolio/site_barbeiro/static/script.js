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

// Seleciona o botão pelo ID
const okBtn = document.getElementById('okBtn');

// Pega a URL da página inicial do atributo data
const homeUrl = document.getElementById('homeUrl').dataset.url;

// Redirecionamento ao clicar no botão
okBtn.addEventListener('click', () => {
    window.location.href = homeUrl;
});

// Redirecionamento automático após 5 segundos (5000 ms)
setTimeout(() => {
    window.location.href = homeUrl;
}, 5000);

// Client-side validation for agendamento: only Mon-Sat and between 09:00 and 19:00
const agendamentoForm = document.getElementById('agendamento-form');
if (agendamentoForm) {
    agendamentoForm.addEventListener('submit', (e) => {
        const dateInput = agendamentoForm.querySelector('input[name="date"]');
        const timeInput = agendamentoForm.querySelector('input[name="time"]');
        if (dateInput && timeInput) {
            const dateVal = dateInput.value;
            const timeVal = timeInput.value;
            if (!dateVal || !timeVal) return; // let backend handle required
            const d = new Date(dateVal + 'T' + timeVal);
            const weekday = d.getDay(); // 0=Sun,6=Sat
            // block Sundays (0) and allow Mon(1)-Sat(6) but not Sunday
            if (weekday === 0) {
                e.preventDefault();
                alert('Agendamentos permitidos apenas de segunda a sábado.');
                return;
            }
            // check time between 09:00 and 19:00 inclusive
            const [h, m] = timeVal.split(':').map(Number);
            const minutes = h * 60 + m;
            if (minutes < 9*60 || minutes > 19*60) {
                e.preventDefault();
                alert('Escolha um horário entre 09:00 e 19:00.');
                return;
            }
        }
    });
}
