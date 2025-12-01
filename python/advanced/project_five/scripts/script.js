document.addEventListener('DOMContentLoaded', () => {
    loadBoard();
    loadBackground(); // Carrega o fundo salvo
});

// --- LÓGICA DE FUNDO (BACKGROUND) ---

const bgUpload = document.getElementById('bgUpload');

// Quando o usuário seleciona um arquivo
bgUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Quando terminar de ler o arquivo
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        
        // Aplica ao body
        document.body.style.backgroundImage = `url(${imageUrl})`;
        
        // Salva no LocalStorage para não perder ao recarregar
        // Nota: Imagens muito grandes podem estourar o limite do LocalStorage (aprox 5MB)
        try {
            localStorage.setItem('kanbanBg', imageUrl);
        } catch (error) {
            alert("A imagem é muito grande para salvar no navegador, mas vai funcionar até você fechar a página!");
        }
    }

    // Lê o arquivo como URL de dados (Base64)
    reader.readAsDataURL(file);
});

function loadBackground() {
    const savedBg = localStorage.getItem('kanbanBg');
    if (savedBg) {
        document.body.style.backgroundImage = `url(${savedBg})`;
    }
}

function resetarFundo() {
    localStorage.removeItem('kanbanBg');
    document.body.style.backgroundImage = ''; // Volta ao gradiente do CSS
}

// --- FUNÇÕES DRAG & DROP (Mantidas e Otimizadas) ---

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.style.opacity = "0.5"; // Efeito visual ao arrastar
}

// Reseta a opacidade se soltar ou cancelar
function endDrag(ev) {
    ev.target.style.opacity = "1";
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var card = document.getElementById(data);
    card.style.opacity = "1"; // Volta ao normal

    let targetColumn = ev.target;
    while (!targetColumn.classList.contains('task-container')) {
        targetColumn = targetColumn.parentElement;
        if(!targetColumn) return; // Segurança
    }

    targetColumn.appendChild(card);
    saveBoard();
}

// --- GERENCIAMENTO DE TAREFAS ---

function adicionarTarefa() {
    const input = document.getElementById("inputNovaTarefa");
    const texto = input.value.trim();

    if (!texto) return;

    criarCardHTML(texto, 'col-todo');
    input.value = '';
    saveBoard();
}

function criarCardHTML(texto, colunaId, idUnico = null) {
    const id = idUnico || 'task-' + Math.random().toString(36).substr(2, 9);
    
    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;
    card.draggable = true;
    card.innerText = texto;
    
    card.ondragstart = drag;
    card.ondragend = endDrag; // Para resetar a opacidade

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerText = '×'; // Símbolo de multiplicação fica mais bonito que X
    closeBtn.onclick = function() { 
        // Animaçãozinha antes de remover
        card.style.transform = "scale(0.8)";
        card.style.opacity = "0";
        setTimeout(() => {
            card.remove(); 
            saveBoard(); 
        }, 200);
    };

    card.appendChild(closeBtn);
    document.getElementById(colunaId).appendChild(card);
}

// --- SALVAR E CARREGAR TAREFAS ---

function saveBoard() {
    const estado = {
        todo: getTextoDasColunas('col-todo'),
        doing: getTextoDasColunas('col-doing'),
        done: getTextoDasColunas('col-done')
    };
    localStorage.setItem('meuKanban', JSON.stringify(estado));
}

function getTextoDasColunas(colunaId) {
    const coluna = document.getElementById(colunaId);
    const cards = coluna.getElementsByClassName('card');
    let listaTarefas = [];
    for (let card of cards) {
        // Pega apenas o texto do primeiro nó (ignorando o botão X)
        listaTarefas.push(card.childNodes[0].nodeValue); 
    }
    return listaTarefas;
}

function loadBoard() {
    const dados = JSON.parse(localStorage.getItem('meuKanban'));
    if (!dados) return;

    dados.todo.forEach(txt => criarCardHTML(txt, 'col-todo'));
    dados.doing.forEach(txt => criarCardHTML(txt, 'col-doing'));
    dados.done.forEach(txt => criarCardHTML(txt, 'col-done'));
}