const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

const form = document.getElementById("form-contato");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const data = new FormData(form);
        const action = form.getAttribute("action");

        fetch(action, {
            method: "POST",
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                document.getElementById("mensagem-enviada").style.display = "block";
                form.reset();
            } else {
                alert("Erro ao enviar. Tente novamente mais tarde.");
            }
        }).catch(error => {
            alert("Erro de conexão. Verifique sua internet.");
        });
    });
}

const elementosAnimados = document.querySelectorAll("[data-anime]");

function animaScroll() {
    const windowTop = window.scrollY + window.innerHeight * 0.8;
    elementosAnimados.forEach(el => {
        if (windowTop > el.offsetTop) {
            el.classList.add("animar");
        } else {
            el.classList.remove("animar"); 
        }
    });
}

if (elementosAnimados.length) {
    window.addEventListener("scroll", animaScroll);
    animaScroll();
}