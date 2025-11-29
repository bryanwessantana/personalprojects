// ==========================================================
// CHAT LOCAL COM IA GEMINI (Sem Servidor)
// ==========================================================
const GEMINI_API_KEY = "AIzaSyD_uNlhqCv7wzbkIK93TyI_gpZI4NwP6Bg"; 
// ==========================================================
const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const audioSound = document.getElementById('notification-sound');

const STORAGE_KEY = 'chat_super_v1';

marked.setOptions({ breaks: true });

function loadMessages() {
    const stored = localStorage.getItem(STORAGE_KEY);
    chatBox.innerHTML = '';
    
    const div = document.createElement('div');
    div.className = 'message system';
    div.style.textAlign = 'center'; div.style.fontSize = '12px'; div.style.color = '#888'; div.style.padding = '10px';
    div.innerHTML = 'Chat iniciado. Abra em outra aba para testar!';
    chatBox.appendChild(div);

    if (stored) {
        const messages = JSON.parse(stored);
        messages.forEach(msg => renderMessage(msg));
    }
}

function renderMessage(msg) {
    const myName = usernameInput.value || "Anônimo";
    const isMe = msg.user === myName;
    const isBot = msg.user === '🤖 Gemini';
    
    let containerClass = isMe ? 'my-container' : 'other-container';
    let bubbleClass = isBot ? 'message-bubble bot-message' : 'message-bubble';

    let seed = msg.user;
    let style = 'notionists';
    if (isBot) style = 'bottts';
    const avatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

    const htmlContent = marked.parse(msg.text);

    const div = document.createElement('div');
    div.className = `message-container ${containerClass}`;

    div.innerHTML = `
        <img src="${avatarUrl}" class="avatar" alt="Avatar">
        <div class="${bubbleClass}">
            <span class="username">${msg.user}</span>
            <div>${htmlContent}</div>
        </div>
    `;

    chatBox.appendChild(div);

    div.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
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

async function askGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const data = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        const answer = result.candidates[0].content.parts[0].text;
        
        saveAndSend("🤖 Gemini", answer);
        
    } catch (error) {
        console.error(error);
        saveAndSend("🤖 Gemini", "Erro na API ou Quota excedida.");
    }
}

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    const user = usernameInput.value.trim() || "Anônimo";
    
    if (!text) return;

    saveAndSend(user, text);
    messageInput.value = '';

    setTimeout(() => askGemini(text), 800);
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