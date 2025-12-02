// ==========================================================
// CHAT LOCAL COM ROBÔ DE RESPOSTAS PRÉ-PROGRAMADAS (FAQ)
// Links abrem em nova aba (target="_blank")
// ==========================================================
const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const audioSound = document.getElementById('notification-sound');

const STORAGE_KEY = 'chat_super_v1';
// ----------------------------------------------------
// Caminho para a pasta 'static' (conforme sua correção)
// ----------------------------------------------------
const BOT_AVATAR_URL = '../static/barberbot.png'; 
// ----------------------------------------------------

// Garante que o marked.js e hljs.js estão carregados no seu HTML
marked.setOptions({ breaks: true });

// -----------------------------------------------------------------
// 🎯 BANCO DE DADOS DE PERGUNTAS E RESPOSTAS (FAQ)
// Links formatados com [Texto](URL) para ativar o target="_blank"
// -----------------------------------------------------------------
const FAQ_RESPONSES = {
    // Chave para a mensagem de boas-vindas
    "saudacao_inicial": "Olá! Eu sou o Barber Bot. Pergunte sobre o horário de funcionamento, agendamento, localização ou se tiver alguma dúvida aguarde até alguém entrar em contato.",
    
    // RESPOSTAS DE FAQ: Use palavras-chave centrais em minúsculas
    "horário de funcionamento": "Nosso horário de funcionamento é de Segunda a Sexta, das 9h às 18h.",
    "horario": "Nosso horário de funcionamento é de Segunda a Sexta, das 9h às 18h.",
    "funciona": "Nosso horário de funcionamento é de Segunda a Sexta, das 9h às 18h.",

    // 🎯 LINKS AGORA USAM SINTAXE MARKDOWN: [texto](url)
    "agendamento": "Para agendar um serviço, por favor visite nossa página de agendamentos [clicando aqui](https://www.trinks.com/thonbarbearia?fbclid=PAZXh0bgNhZW0CMTEAAaftmUU40J4MpGQhHl_HCWHCIKJ4EzqlXdsBTl-zLOLoyo_KxOZ9fYlmsqioLA_aem_KCouGvAp9VI-SQwJgsuXeg).",
    "agenda": "Para agendar um serviço, por favor visite nossa página de agendamentos [clicando aqui](https://www.trinks.com/thonbarbearia?fbclid=PAZXh0bgNhZW0CMTEAAaftmUU40J4MpGQhHl_HCWHCIKJ4EzqlXdsBTl-zLOLoyo_KxOZ9fYlmsqioLA_aem_KCouGvAp9VI-SQwJgsuXeg).",
    "cortar o cabelo": "Para agendar um serviço, por favor visite nossa página de agendamentos [clicando aqui](https://www.trinks.com/thonbarbearia?fbclid=PAZXh0bgNhZW0CMTEAAaftmUU40J4MpGQhHl_HCWHCIKJ4EzqlXdsBTl-zLOLoyo_KxOZ9fYlmsqioLA_aem_KCouGvAp9VI-SQwJgsuXeg).",

    "localização": "Estamos localizados na R. Francisco Derosso, 2065 - loja 4 - Xaxim, Curitiba - PR, 81720-000, Brasil",
    "endereço": "Estamos localizados na R. Francisco Derosso, 2065 - loja 4 - Xaxim, Curitiba - PR, 81720-000, Brasil",

    "quem é você": "Eu sou um robô de respostas pré-programadas. Minha inteligência é limitada ao que está escrito no meu código!",
    "resetar senha": "Para resetar sua senha, acesse a página de login [nesta página](https://www.trinks.com/Login) e clique em 'Esqueci minha senha'.",
    "senha": "Para resetar sua senha, acesse a página de login [nesta página](https://www.trinks.com/Login) e clique em 'Esqueci minha senha'.",
    "ajuda": "Claro, como posso te ajudar? Lembre-se, só posso responder o que está na minha lista de FAQ.",
    "valores": "Nossos preços variam conforme o serviço. Por favor, visite nossa página de preços para mais detalhes [aqui](https://www.trinks.com/thonbarbearia/precos).",
    "obrigado": "De nada! Estou aqui para ajudar.",
};

// Palavras-chave que disparam a saudação inicial
const SAUDACAO_KEYWORDS = ["ola", "olá", "oi", "e aí", "bom dia", "boa tarde", "boa noite"];

// Palavras irrelevantes que serão ignoradas na busca (Stop Words)
const STOP_WORDS = [
    "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "ou", "mas", "se", "nao", "não", 
    "um", "uma", "uns", "umas", "em", "no", "na", "nos", "nas", "para", "por", "que", "qual", "como",
    "me", "mim", "meu", "minha", "você", "teu", "sua", "o que", "onde", "quando", "quem", "por que",
    "é", "e", "estou", "eu", "queria", "gostaria", "saber"
];
// -----------------------------------------------------------------

function loadMessages() {
    const stored = localStorage.getItem(STORAGE_KEY);
    chatBox.innerHTML = '';
    
    const div = document.createElement('div');
    div.className = 'message system';
    div.style.textAlign = 'center'; div.style.fontSize = '12px'; div.style.color = '#888'; div.style.padding = '10px';
    div.innerHTML = 'Chat iniciado. Diga "Olá" para iniciar a conversa!';
    chatBox.appendChild(div);

    if (stored) {
        const messages = JSON.parse(stored);
        messages.forEach(msg => renderMessage(msg));
    }
}

function renderMessage(msg) {
    const myName = usernameInput.value || "Anônimo";
    const isMe = msg.user === myName;
    const isBot = msg.user === '🤖 Barber Bot'; 
    
    let containerClass = isMe ? 'my-container' : 'other-container';
    let bubbleClass = isBot ? 'message-bubble bot-message' : 'message-bubble';

    // Lógica do Avatar
    let avatarUrl;

    if (isBot) {
        avatarUrl = BOT_AVATAR_URL; 
    } else {
        let seed = msg.user;
        let style = 'notionists';
        avatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
    }

    // 1. Gera o HTML a partir do Markdown
    const htmlContent = marked.parse(msg.text);

    const div = document.createElement('div');
    div.className = `message-container ${containerClass}`;

    // 2. Insere o HTML gerado na mensagem
    div.innerHTML = `
        <img src="${avatarUrl}" class="avatar" alt="Avatar">
        <div class="${bubbleClass}">
            <span class="username">${msg.user}</span>
            <div>${htmlContent}</div>
        </div>
    `;

    // 3. 🎯 ADICIONA target="_blank" A TODOS OS LINKS NA MENSAGEM
    div.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // Boa prática de segurança
    });

    chatBox.appendChild(div);

    div.querySelectorAll('pre code').forEach((block) => {
        if (typeof hljs !== 'undefined') {
             hljs.highlightElement(block);
        }
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

function saveAndSend(user, text) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const messages = stored ? JSON.parse(stored) : [];
    
    const newMessage = { user, text, time: Date.now() };
    messages.push(newMessage);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    renderMessage(newMessage);
}

// -----------------------------------------------------------------
// FUNÇÃO askBot: LÓGICA DE BUSCA APRIMORADA COM STOP WORDS
// -----------------------------------------------------------------
function askBot(prompt) {
    const cleanPrompt = prompt.toLowerCase().trim();
    let answer;
    
    // Remove pontuação e filtra as Stop Words
    const rawWords = cleanPrompt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    const userWords = rawWords.filter(word => word.length > 0 && !STOP_WORDS.includes(word));
    
    // 1. VERIFICAÇÃO DE SAUDAÇÃO FLEXÍVEL
    const isGreeting = SAUDACAO_KEYWORDS.some(keyword => cleanPrompt.startsWith(keyword) || cleanPrompt === keyword);
    
    if (isGreeting) {
        answer = FAQ_RESPONSES["saudacao_inicial"];
    } else {
        // 2. Lógica de busca de palavras-chave (FAQ)
        let bestMatch = null;
        let highestWordOverlap = 0; 

        for (const key in FAQ_RESPONSES) {
             if (key === "saudacao_inicial") continue;
             
             // Divide a chave do FAQ em palavras
             const keyWords = key.split(/\s+/); 
             let currentOverlap = 0; 

             // Conta quantas palavras da chave estão presentes na pergunta do usuário (usando apenas palavras importantes)
             keyWords.forEach(kw => {
                 if (userWords.includes(kw)) {
                     currentOverlap++;
                 }
             });
             
             // Prioriza a chave que teve a maior sobreposição de palavras
             if (currentOverlap > 0 && currentOverlap > highestWordOverlap) {
                 highestWordOverlap = currentOverlap;
                 bestMatch = key;
             }
        }

        if (bestMatch) {
            answer = FAQ_RESPONSES[bestMatch];
        } else {
            // 3. Resposta padrão se nenhuma correspondência for encontrada
            answer = "Desculpe, eu sou um robô simples e não consigo responder a isso. Tente me perguntar algo como 'Horário de funcionamento' ou 'Resetar senha'.";
        }
    }

    // Tempo de delay para simular que o bot está "pensando"
    setTimeout(() => {
        saveAndSend("🤖 Barber Bot", answer);
    }, 800); 
}

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    const user = usernameInput.value.trim() || "Anônimo";
    
    if (!text) return;

    saveAndSend(user, text);
    messageInput.value = '';

    askBot(text);
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
});

window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        loadMessages(); 
        audioSound.volume = 0.5;
        audioSound.play().catch(err => console.log("Áudio bloqueado pelo navegador"));
    }
});

loadMessages();