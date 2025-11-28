/* --- LÓGICA DO LEITOR RSS --- */

// Usamos o serviço rss2json.com para converter XML em JSON
const RSS2JSON_API = "https://api.rss2json.com/v1/api.json?rss_url=";

// Elementos do DOM
const feedSelect = document.getElementById('feed-select');
const customUrlInput = document.getElementById('custom-url');
const newsContainer = document.getElementById('news-container');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-msg');
const loadBtn = document.getElementById('load-btn');

// Função para alternar a exibição do input personalizado
function toggleCustomInput() {
    if (feedSelect.value === 'custom') {
        customUrlInput.style.display = 'block';
        customUrlInput.focus();
    } else {
        customUrlInput.style.display = 'none';
    }
}

// Função para exibir erros na tela
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    // Esconde o erro após 5 segundos
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Função principal para carregar o feed
async function loadFeed() {
    // 1. Determinar qual URL usar
    let rssUrl = feedSelect.value;
    
    // Se for 'custom', pega do input de texto
    if (rssUrl === 'custom') {
        rssUrl = customUrlInput.value.trim();
    }

    // Validação básica
    if (!rssUrl) {
        showError("Por favor, selecione um feed ou digite uma URL válida.");
        return;
    }

    // 2. Preparar a interface (limpar anterior, mostrar loading)
    newsContainer.innerHTML = '';
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        // 3. Fazer a requisição para a API (rss2json)
        // encodeURIComponent é crucial para tratar caracteres especiais na URL
        const response = await fetch(RSS2JSON_API + encodeURIComponent(rssUrl));
        const data = await response.json();

        // 4. Esconder o loading
        loadingDiv.classList.add('hidden');

        // 5. Verificar resposta da API
        if (data.status === 'ok') {
            renderNews(data);
        } else {
            showError("Falha ao carregar o feed. A URL pode ser inválida ou restrita.");
        }

    } catch (error) {
        loadingDiv.classList.add('hidden');
        showError("Erro de conexão. Verifique sua internet.");
        console.error("Erro no fetch:", error);
    }
}

// Função para renderizar os artigos na tela
function renderNews(data) {
    // Verifica se há itens no feed
    if (!data.items || data.items.length === 0) {
        newsContainer.innerHTML = '<p style="text-align:center">Nenhum artigo encontrado neste feed.</p>';
        return;
    }

    // Itera sobre cada item do feed
    data.items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'article-card';

        // Limpeza básica da descrição (remove tags HTML para segurança/estética)
        // Se não houver descrição, usa um texto padrão
        let cleanDesc = 'Sem descrição disponível.';
        if (item.description) {
            // Remove tags HTML
            cleanDesc = item.description.replace(/<[^>]*>?/gm, '');
            // Limita a 200 caracteres
            if (cleanDesc.length > 200) {
                cleanDesc = cleanDesc.substring(0, 200) + '...';
            }
        }
        
        // Formatar a data (se disponível)
        let dateStr = 'Data desconhecida';
        if (item.pubDate) {
            const date = new Date(item.pubDate);
            dateStr = date.toLocaleDateString('pt-BR', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });
        }

        // Monta o HTML do card
        article.innerHTML = `
            <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
            <div class="meta">Publicado em ${dateStr} • Por ${item.author || 'Desconhecido'}</div>
            <div class="description">${cleanDesc}</div>
        `;

        newsContainer.appendChild(article);
    });
}

// --- Inicialização e Eventos ---

// 1. Evento para quando trocar o select (mostrar/esconder input custom)
if (feedSelect) {
    feedSelect.addEventListener('change', toggleCustomInput);
}

// 2. Evento de clique no botão "Carregar Feed"
if (loadBtn) {
    loadBtn.addEventListener('click', loadFeed);
}

// 3. Carregar um feed inicial automaticamente quando a página abrir
document.addEventListener('DOMContentLoaded', loadFeed);