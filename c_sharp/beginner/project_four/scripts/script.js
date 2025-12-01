const inputNumber = document.getElementById('input-number');
const generateButton = document.getElementById('generate-button');
const tableTitle = document.getElementById('table-title');
const multiplicationList = document.getElementById('multiplication-list');

// Adiciona listener para o botão de geração
generateButton.addEventListener('click', generateMultiplicationTable);

// Opcional: Adiciona listener para a tecla Enter no campo de texto
inputNumber.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        generateMultiplicationTable();
    }
});


function generateMultiplicationTable() {
    const number = parseInt(inputNumber.value);

    // 1. Validação de Entrada (Similar à lógica C# LerNumero)
    if (isNaN(number) || number < 1 || number > 100) {
        tableTitle.textContent = "Erro de Entrada";
        multiplicationList.innerHTML = '<li class="placeholder">Por favor, insira um número inteiro válido (1 a 100).</li>';
        return;
    }

    // Limpa a lista anterior
    multiplicationList.innerHTML = '';
    
    // Atualiza o título
    tableTitle.textContent = `Tabuada do ${number} (1 a 10)`;

    // 2. Geração da Tabuada (O laço for do C#)
    for (let i = 1; i <= 10; i++) {
        const result = number * i;
        
        // Cria o elemento da lista
        const listItem = document.createElement('li');
        
        // Constrói o texto do item da lista
        listItem.innerHTML = `
            <span>${number} &times; ${i}</span>
            <span class="result-value">= ${result}</span>
        `;
        
        // 3. Injeta o item na lista HTML
        multiplicationList.appendChild(listItem);
    }
}