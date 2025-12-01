// Constantes do Jogo
const MIN_RANGE = 1;
const MAX_RANGE = 100;
const MAX_TENTATIVAS = 7;

// Variáveis de Estado
let numeroSecreto = 0;
let tentativasRestantes = MAX_TENTATIVAS;
let chutesAnteriores = [];

// Referências ao DOM
const input = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const resetButton = document.getElementById('reset-button');
const feedbackMessage = document.getElementById('feedback-message');
const guessesList = document.getElementById('guesses-list');
const remainingGuessesSpan = document.getElementById('remaining-guesses');


// --- Funções de Lógica do Jogo ---

// Função de inicialização
function initializeGame() {
    // 1. Gera o número secreto (similar ao Random C#)
    numeroSecreto = Math.floor(Math.random() * (MAX_RANGE - MIN_RANGE + 1)) + MIN_RANGE;
    
    // 2. Reseta o estado
    tentativasRestantes = MAX_TENTATIVAS;
    chutesAnteriores = [];
    
    // 3. Atualiza o DOM para o estado inicial
    feedbackMessage.textContent = "Digite um número para começar.";
    feedbackMessage.className = '';
    guessesList.textContent = 'Nenhum';
    remainingGuessesSpan.textContent = MAX_TENTATIVAS;
    
    input.value = '';
    input.disabled = false;
    guessButton.disabled = false;
    resetButton.classList.add('hidden');
}

// Lógica principal do chute (similar ao laço while e if/else C#)
function checkGuess() {
    const chute = parseInt(input.value);
    
    // Validação de Entrada
    if (isNaN(chute) || chute < MIN_RANGE || chute > MAX_RANGE) {
        feedbackMessage.textContent = `Erro: Digite um número entre ${MIN_RANGE} e ${MAX_RANGE}.`;
        feedbackMessage.className = '';
        return;
    }
    
    if (tentativasRestantes <= 0) {
        return; // Jogo já terminou
    }
    
    // Adiciona o chute ao histórico
    chutesAnteriores.push(chute);
    tentativasRestantes--;

    // ----------------------------------------------------
    // Lógica de Feedback (if/else if/else)
    // ----------------------------------------------------
    
    if (chute === numeroSecreto) {
        feedbackMessage.textContent = `🎉 PARABÉNS! Você acertou o número secreto (${numeroSecreto})!`;
        feedbackMessage.className = 'win';
        endGame(true);
    } else if (tentativasRestantes === 0) {
        feedbackMessage.textContent = `Game Over! 😭 O número era ${numeroSecreto}.`;
        feedbackMessage.className = 'lose';
        endGame(false);
    } else if (chute < numeroSecreto) {
        feedbackMessage.textContent = `⬆️ Seu chute é muito BAIXO! Tente MAIOR.`;
        feedbackMessage.className = 'low';
    } else if (chute > numeroSecreto) {
        feedbackMessage.textContent = `⬇️ Seu chute é muito ALTO! Tente MENOR.`;
        feedbackMessage.className = 'high';
    }
    
    // Atualiza o display do histórico
    guessesList.textContent = chutesAnteriores.join(', ');
    remainingGuessesSpan.textContent = tentativasRestantes;
    
    // Limpa o input para o próximo chute
    input.value = '';
}

// Finaliza o jogo
function endGame(win) {
    input.disabled = true;
    guessButton.disabled = true;
    resetButton.classList.remove('hidden');
}


// --- Event Listeners ---
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);

// Permite chutar com a tecla Enter
input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && !guessButton.disabled) {
        checkGuess();
    }
});

// Inicia o jogo ao carregar a página
window.onload = initializeGame;