document.addEventListener("DOMContentLoaded", () => {

    fetch("scripts/data/services.json")
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
        initConfirmacaoPage();
    }
});


function renderServices(services) {
    const container = document.querySelector(".services-list");
    if (!container) return;

    container.innerHTML = "";
    services.forEach(service => {
        const card = document.createElement("div");
        card.classList.add("card");

        let imagePath = service.image.replace(/^\/?static\//, '');

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
        e.preventDefault(); 
        
        const dateInput = agendamentoForm.querySelector('input[name="date"]');
        const timeInput = agendamentoForm.querySelector('input[name="time"]');
        
        if (dateInput && timeInput) {
            const nameInput = agendamentoForm.querySelector('input[name="name"]');
            const dateVal = dateInput.value;
            const timeVal = timeInput.value;
            
            if (!dateVal || !timeVal || !nameInput.value) return;

            const d = new Date(dateVal + 'T' + timeVal + ':00');
            const weekday = d.getDay();
            
            if (weekday === 0) {
                alert('Agendamentos permitidos apenas de segunda a sábado.');
                return;
            }
            
            const [h, m] = timeVal.split(':').map(Number);
            const totalMinutes = h * 60 + m;

            if (totalMinutes < 9 * 60 || totalMinutes > 19 * 60) {
                alert('Escolha um horário entre 09:00 e 19:00.');
                return;
            }

            localStorage.setItem('appt_name', nameInput.value);
            localStorage.setItem('appt_date', dateVal);
            localStorage.setItem('appt_time', timeVal);

            window.location.href = "confirmacao.html";
        }
    });
}


function formatDate(dateStr) {
    if (!dateStr || dateStr.length < 10) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function formatTime(timeStr) {
    if (!timeStr) return timeStr;
    return timeStr.substring(0, 5);
}

function initConfirmacaoPage() {
    const nameEl = document.getElementById('clientName');
    const dateEl = document.getElementById('clientDate');
    const timeEl = document.getElementById('clientTime');
    const okBtn = document.getElementById('okBtn');
    
    const name = localStorage.getItem('appt_name') || '[Nome não encontrado]';
    const date = localStorage.getItem('appt_date') || '[Data não encontrada]';
    const time = localStorage.getItem('appt_time') || '[Hora não encontrada]';

    if (nameEl) nameEl.textContent = name;
    if (dateEl) dateEl.textContent = formatDate(date);
    if (timeEl) timeEl.textContent = formatTime(time);

    const homeUrl = "home.html"; 
    
    const cleanup = () => {
        localStorage.removeItem('appt_name');
        localStorage.removeItem('appt_date');
        localStorage.removeItem('appt_time');
    };

    okBtn.addEventListener('click', () => {
        cleanup();
        window.location.href = homeUrl;
    });

    setTimeout(() => {
        cleanup();
        window.location.href = homeUrl;
    }, 5000);
}

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        alert("Obrigado! Seu feedback foi enviado com sucesso e será revisado.");
        
        feedbackForm.reset();
    });
}