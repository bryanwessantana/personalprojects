/* --- LÓGICA DO JOGO DA FORCA --- */

// Lista de palavras possíveis
const words = [
    "PYTHON", "JAVASCRIPT", "DESENVOLVEDOR", "INTERFACE", "ALGORITMO",
    "BANCODEDADOS", "INTERNET", "VARIAVEL", "FUNCAO", "NAVEGADOR",
    "PROGRAMACAO", "TECNOLOGIA", "COMPUTADOR", "SISTEMA", "CODIGO"
];

let selectedWord = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

// IDs das partes do corpo na ordem de desenho (cabeça, corpo, braços, pernas)
const bodyParts = ["head", "body", "arm-l", "arm-r", "leg-l", "leg-r"];

function initGame() {
    // 1. Resetar variáveis de estado
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    mistakes = 0;

    // 2. Limpar a interface
    document.getElementById('message').textContent = "";
    document.getElementById('message').style.color = "#ecf0f1";
    document.getElementById('reset-btn').style.display = "none";

    // 3. Resetar o desenho (esconder todas as partes do corpo)
    bodyParts.forEach(part => {
        const element = document.getElementById(part);
        if (element) element.style.display = "none";
    });

    // 4. Gerar teclado e display inicial
    renderWord();
    generateKeyboard();
}

function renderWord() {
    // Cria a string de exibição: letras adivinhadas aparecem, outras viram "_"
    const display = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : "_")
        .join(" ");
    
    document.getElementById('word-display').textContent = display;

    // Verificar Vitória: Se não houver mais "_", o jogador ganhou
    if (!display.includes("_")) {
        gameOver(true);
    }
}

function handleGuess(letter) {
    // Adiciona a letra à lista de tentativas
    guessedLetters.push(letter);
    
    // Desabilitar o botão clicado no teclado virtual
    const button = document.querySelector(`button[data-letter="${letter}"]`);
    if (button) {
        button.disabled = true;
    }

    if (selectedWord.includes(letter)) {
        // Se acertou, atualiza a palavra
        renderWord();
    } else {
        // Se errou, incrementa erros e desenha uma parte
        mistakes++;
        drawBodyPart();
        
        // Verificar Derrota
        if (mistakes === maxMistakes) {
            gameOver(false);
        }
    }
}

function drawBodyPart() {
    // Mostra a parte do corpo correspondente ao número de erros (índice - 1)
    const partId = bodyParts[mistakes - 1];
    const part = document.getElementById(partId);
    if (part) {
        part.style.display = "block";
    }
}

function generateKeyboard() {
    const keyboardDiv = document.getElementById('keyboard');
    keyboardDiv.innerHTML = "";
    
    // Gera botões para o Alfabeto A-Z (Códigos ASCII 65-90)
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'key';
        button.setAttribute('data-letter', letter); // Para fácil seleção depois
        button.onclick = () => handleGuess(letter);
        keyboardDiv.appendChild(button);
    }
}

function gameOver(won) {
    const messageDiv = document.getElementById('message');
    const keyboardDiv = document.getElementById('keyboard');
    const resetBtn = document.getElementById('reset-btn');

    // Desabilitar todos os botões do teclado para impedir mais jogadas
    const keys = keyboardDiv.querySelectorAll('button');
    keys.forEach(btn => btn.disabled = true);

    if (won) {
        messageDiv.textContent = "Parabéns! Você Venceu! 🎉";
        messageDiv.style.color = "#2ecc71"; // Verde
    } else {
        messageDiv.textContent = `Fim de Jogo! A palavra era: ${selectedWord}`;
        messageDiv.style.color = "#e74c3c"; // Vermelho
        
        // Preencher a palavra completa para mostrar o que era
        document.getElementById('word-display').textContent = selectedWord.split('').join(' ');
    }

    // Mostrar botão de reiniciar
    resetBtn.style.display = "inline-block";
}

// Iniciar o jogo assim que a página carregar
document.addEventListener('DOMContentLoaded', initGame);