// =================================================================
// scripts/script.js
// Lógica de Interação: Scroll, Reveal, Formulário, Abertura do Chat
// =================================================================

document.addEventListener('DOMContentLoaded', function() {

    const linksInternos = document.querySelectorAll('a[href^="#"]');
    
    // --- Smooth Scrolling ---
    // (Lógica inalterada)
    // ...
    linksInternos.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Scroll-Reveal (Intersection Observer) ---
    // (Lógica inalterada)
    // ...
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-up');
    
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('hero-content')) {
             observer.observe(el);
        }
    });

    const heroContent = document.querySelector('.hero-content.fade-in');
    if (heroContent) {
        heroContent.classList.add('visible');
    }

    // --- Lógica do Formulário de Contato ---
    // (Lógica inalterada)
    // ...
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isFormValid = validateForm(this);

            if (isFormValid) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                formMessage.classList.remove('show', 'success', 'error');

                // SIMULAÇÃO DE ENVIO REAL (Substituir por fetch/servidor)
                setTimeout(() => {
                    const success = Math.random() > 0.1; 

                    if (success) {
                        displayMessage('Mensagem enviada com sucesso! Em breve, entraremos em contato.', 'success');
                        contactForm.reset();
                    } else {
                        displayMessage('Erro ao enviar. Por favor, tente novamente.', 'error');
                    }
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensagem';
                }, 1500);
            } else {
                displayMessage('Por favor, preencha todos os campos corretamente.', 'error');
            }
        });
    }

    function displayMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.remove('success', 'error');
        formMessage.classList.add('show', type);
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show', 'success');
            }, 5000);
        }
    }

    function validateForm(form) {
        let valid = true;
        const emailInput = form.querySelector('input[type="email"]');
        
        form.querySelectorAll('input[required], textarea[required]').forEach(input => {
            if (!input.value.trim()) {
                valid = false;
            }
        });

        if (emailInput && emailInput.value.trim() && (!emailInput.value.includes('@') || !emailInput.value.includes('.'))) {
             valid = false;
        }

        return valid;
    }

    // --- Lógica de Interação da Janela de Chat ---
    
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatWindow = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('userInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    openChatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            // Mensagem de boas-vindas do bot.js
            appendMessage('bot', processUserMessage('olá')); 
            userInput.focus();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    sendMessageBtn.addEventListener('click', () => {
        handleUserInput();
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    function handleUserInput() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        userInput.disabled = true;
        sendMessageBtn.disabled = true;

        setTimeout(() => {
            // A função processUserMessage é definida em bot.js
            const botResponse = processUserMessage(message); 
            appendMessage('bot', botResponse);
            userInput.disabled = false;
            sendMessageBtn.disabled = false;
            userInput.focus();
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 800);
    }

    // Função de exibição de mensagem adaptada para links Markdown
    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        
        // Regex para encontrar links [texto](url)
        const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
        
        // Substitui a sintaxe Markdown por tags <a> HTML
        const htmlText = text.replace(linkRegex, (match, linkText, url) => {
            // Cria a tag <a> com target="_blank"
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        });
        
        msgDiv.innerHTML = htmlText;

        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});