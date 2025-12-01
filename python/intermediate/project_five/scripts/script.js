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
    let rssUrl = feedSelect.value;
    
    if (rssUrl === 'custom') {
        rssUrl = customUrlInput.value.trim();
    }

    if (!rssUrl) {
        showError("Por favor, selecione um feed ou digite uma URL válida.");
        return;
    }

    newsContainer.innerHTML = '';
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        // --- 3. Fazer a requisição para a API (rss2json) ---
        const url = RSS2JSON_API + encodeURIComponent(rssUrl);
        const response = await fetch(url);
        
        // 4. Se a resposta não for OK (ex: 404), ainda tentamos ler o JSON se possível
        if (!response.ok && response.status !== 0) { // status 0 é geralmente erro de CORS/rede no ambiente local
             throw new Error(`HTTP Error: ${response.status}. O recurso pode estar indisponível ou ser bloqueado pelo CORS.`);
        }
        
        const data = await response.json();
        
        // 5. Verificar resposta da API
        if (data.status === 'ok') {
            renderNews(data);
        } else {
            showError("Falha ao carregar o feed. A URL pode ser inválida ou o serviço proxy está fora do ar.");
        }

    } catch (error) {
        // Captura erros de rede (CORS) e o erro forçado acima
        console.error("Network or Fetch Error/CORS:", error);
        
        // MENSAGEM DE ERRO ESPECÍFICA PARA AMBIENTE LOCAL
        showError("Erro de Conexão. **Possível bloqueio CORS/Rede.** Por favor, hospede os arquivos em um servidor real (como GitHub Pages) ou use um ambiente de servidor local para contornar esta limitação do navegador.");
        
    } finally {
        loadingDiv.classList.add('hidden');
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