document.addEventListener("DOMContentLoaded", () => {

    fetch("static/data/services.json") 
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(services => {
            renderServices(services);
            populateSelect(services);

            const select = document.getElementById("service");
            if (select) {
                const selectedService = localStorage.getItem("selectedService");
                if (selectedService) {
                    select.value = selectedService;
                    localStorage.removeItem("selectedService");
                    setTimeout(() => {
                        select.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                }
            }
        })
        .catch(err => console.error("Erro ao carregar serviços:", err));

    const okBtn = document.getElementById('okBtn');
    const homeUrlElement = document.getElementById('homeUrl');
    
    if (okBtn && homeUrlElement) {
        const homeUrl = homeUrlElement.dataset.url;

        okBtn.addEventListener('click', () => {
            window.location.href = homeUrl;
        });

        setTimeout(() => {
            window.location.href = homeUrl;
        }, 5000);
    }
});

function renderServices(services) {
    const container = document.querySelector(".services-list");
    if (!container) return;

    container.innerHTML = "";
    services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("card");

        const imagePath = service.image.startsWith('/') ? service.image.substring(1) : service.image;
        
        card.innerHTML = `
            <img src="${imagePath}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p>${service.duration} - R$ ${service.price}</p>
            <button onclick="selectService('${service.id}')">Agendar</button>
        `;

        container.appendChild(card);
    });
}

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

function selectService(serviceId) {
    localStorage.setItem("selectedService", serviceId);
    window.location.href = "agendamento.html"; 
}

const agendamentoForm = document.getElementById('agendamento-form');
if (agendamentoForm) {
    agendamentoForm.addEventListener('submit', (e) => {
        const dateInput = agendamentoForm.querySelector('input[name="date"]');
        const timeInput = agendamentoForm.querySelector('input[name="time"]');
        if (dateInput && timeInput) {
            const dateVal = dateInput.value;
            const timeVal = timeInput.value;
            if (!dateVal || !timeVal) return;
            
            const d = new Date(dateVal + 'T' + timeVal + ':00');
            
            const weekday = d.getDay();
            
            if (weekday === 0) {
                e.preventDefault();
                alert('Agendamentos permitidos apenas de segunda a sábado.');
                return;
            }
            
            const [h, m] = timeVal.split(':').map(Number);
            const totalMinutes = h * 60 + m;

            if (totalMinutes < 9 * 60 || totalMinutes > 19 * 60) {
                e.preventDefault();
                alert('Escolha um horário entre 09:00 e 19:00.');
                return;
            }
        }
    });
}