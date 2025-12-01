// Referências aos elementos do DOM
const inputText = document.getElementById('input-text');
const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');
const resultBox = document.querySelector('.result-box');

// Adiciona um listener para o clique do botão
checkButton.addEventListener('click', verificar);

// Opcional: Adiciona um listener para a tecla Enter no campo de texto
inputText.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        verificar();
    }
});

// Função principal que executa a verificação
function verificar() {
    const textoOriginal = inputText.value.trim();

    // 1. Validação de entrada
    if (textoOriginal.length === 0) {
        exibirResultado("Por favor, digite algum texto.", null);
        return;
    }

    // 2. Normalização (IDÊNTICA à lógica em C#):
    //    a. Converte para minúsculas.
    //    b. Remove caracteres não alfanuméricos (incluindo espaços e pontuações) usando regex.
    const textoNormalizado = textoOriginal
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    // 3. Inversão:
    //    a. Transforma a string em array de caracteres.
    //    b. Inverte a ordem do array.
    //    c. Junta o array de volta em uma string.
    const textoInvertido = textoNormalizado
        .split('')
        .reverse()
        .join('');

    // 4. Comparação
    const ehPalindromo = textoNormalizado === textoInvertido;

    // 5. Exibir resultado
    if (ehPalindromo) {
        exibirResultado("✅ É um Palíndromo!", true);
    } else {
        exibirResultado("❌ Não é um Palíndromo.", false);
    }
}


// Função para formatar e exibir a mensagem de resultado
function exibirResultado(mensagem, isPalindromo) {
    resultMessage.textContent = mensagem;
    
    // Remove classes anteriores
    resultBox.classList.remove('is-palindromo', 'not-palindromo');

    if (isPalindromo === true) {
        resultBox.classList.add('is-palindromo');
        resultMessage.style.color = 'inherit'; // Usa a cor definida na classe
    } else if (isPalindromo === false) {
        resultBox.classList.add('not-palindromo');
        resultMessage.style.color = 'inherit';
    } else {
        // Estado inicial ou entrada vazia
        resultMessage.style.color = '#666'; 
    }
}