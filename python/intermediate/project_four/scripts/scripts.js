/* --- Lógica de Cadastro com LocalStorage --- */

// Chave para salvar no navegador
const STORAGE_KEY = "minha_biblioteca_media";

// Estado global (carrega do storage ou inicia vazio)
let mediaItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaItems));
}

function renderList(itemsToRender = mediaItems) {
    const listElement = document.getElementById('media-list');
    listElement.innerHTML = '';

    if (itemsToRender.length === 0) {
        listElement.innerHTML = '<p style="text-align:center;">Nenhum item encontrado.</p>';
        return;
    }

    // Ordenar por ID decrescente (mais recentes primeiro)
    const sortedItems = [...itemsToRender].sort((a, b) => b.id - a.id);

    sortedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        card.innerHTML = `
            <div class="media-info">
                <h4>${item.title}</h4>
                <div class="media-details">
                    <span class="badge ${item.category}">${item.category}</span>
                    <span>${item.creator} • ${item.year}</span>
                    <span class="rating">★ ${item.rating}</span>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteItem(${item.id})">Deletar</button>
        `;
        listElement.appendChild(card);
    });
}

function addItem(event) {
    event.preventDefault();

    // Obter valores
    const title = document.getElementById('title').value;
    const creator = document.getElementById('creator').value;
    const year = document.getElementById('year').value;
    const category = document.getElementById('category').value;
    const rating = document.getElementById('rating').value;

    const newItem = {
        id: Date.now(), // ID único baseado no tempo
        title,
        creator,
        year,
        category,
        rating
    };

    mediaItems.push(newItem);
    saveToStorage();
    renderList();

    // Limpar formulário (exceto categoria)
    document.getElementById('title').value = '';
    document.getElementById('creator').value = '';
    document.getElementById('year').value = '';
    document.getElementById('rating').value = '';
}

function deleteItem(id) {
    if(confirm("Tem certeza que deseja remover este item?")) {
        mediaItems = mediaItems.filter(item => item.id !== id);
        saveToStorage();
        renderList(); // Re-renderiza a lista atualizada
    }
}

function filterItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;

    const filtered = mediaItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                              item.creator.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    renderList(filtered);
}

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', () => renderList());