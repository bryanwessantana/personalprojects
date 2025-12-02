// --- 1. SETUP INICIAL ---

// Referências aos elementos HTML
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');

// Propriedades do Contêiner e do Jogo
const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;

// Variáveis de Estado do Jogador
let playerX = 100;
let playerY = GAME_HEIGHT - PLAYER_HEIGHT; // Posição inicial Y (será ajustada pela gravidade)
let velocityX = 0;
let velocityY = 0;
let onGround = false;

// Constantes de Física e Movimento
const GRAVITY = 0.5;
const JUMP_POWER = -12;
const MOVE_SPEED = 5;
const FRICTION = 0.8;

// Estado das Teclas Pressionadas
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    Space: false
};

// Array de Plataformas (Obtém as dimensões do DOM e normaliza)
// Isso garante que a lógica de colisão use valores fixos.
const platformsData = [];
document.querySelectorAll('.platform').forEach(platformEl => {
    const rect = platformEl.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    
    // Converte as coordenadas do navegador para coordenadas do jogo (relativas ao game-container)
    platformsData.push({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
    });
});

// --- 2. MANIPULADORES DE EVENTOS DE TECLADO ---

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// --- 3. LOOP PRINCIPAL DO JOGO ---

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- 4. FUNÇÕES DE LÓGICA ---

function update() {
    // --- A. MOVIMENTO HORIZONTAL ---
    velocityX *= FRICTION;

    if (keys.ArrowRight) {
        velocityX = MOVE_SPEED;
    } else if (keys.ArrowLeft) {
        velocityX = -MOVE_SPEED;
    }

    // Aplica o movimento X
    playerX += velocityX;

    // Colisão com as bordas da tela
    if (playerX < 0) playerX = 0;
    if (playerX + PLAYER_WIDTH > GAME_WIDTH) playerX = GAME_WIDTH - PLAYER_WIDTH;

    // --- B. GRAVIDADE E PULSO ---
    
    // Aplica gravidade
    velocityY += GRAVITY;

    // Aplica pulo (SÓ PULA SE ESTIVER NO CHÃO)
    if (keys.Space && onGround) {
        velocityY = JUMP_POWER;
        onGround = false;
    }

    // Aplica o movimento Y
    playerY += velocityY;
    
    // --- C. DETECÇÃO DE COLISÃO ---
    let landed = false;
    
    // Itera sobre as plataformas
    platformsData.forEach(platform => {
        // Checagem de Colisão (simplesmente se os retângulos se sobrepõem)
        const colliding = (
            playerX < platform.x + platform.width && // esquerda do player < direita da plataforma
            playerX + PLAYER_WIDTH > platform.x &&   // direita do player > esquerda da plataforma
            playerY + PLAYER_HEIGHT > platform.y &&  // baixo do player > topo da plataforma
            playerY < platform.y + platform.height   // topo do player < baixo da plataforma
        );

        if (colliding && velocityY >= 0) {
            // Colisão Ocorreu: verifica se o jogador está caindo na plataforma
            
            // Corrige a posição: Fixa o jogador na superfície superior da plataforma
            playerY = platform.y - PLAYER_HEIGHT;
            
            // Zera a velocidade vertical e marca como "no chão"
            velocityY = 0;
            landed = true;
        }
    });

    onGround = landed;

    // Garante que o jogador não caia abaixo do limite do jogo (se por acaso sair da plataforma 'ground')
    if (playerY + PLAYER_HEIGHT > GAME_HEIGHT) {
        playerY = GAME_HEIGHT - PLAYER_HEIGHT;
        velocityY = 0;
        onGround = true;
    }
}

function draw() {
    // Atualiza a posição visual (CSS) do elemento 'player'
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
}

// Inicia o jogo
// Garante que a posição inicial Y seja calculada corretamente antes de iniciar o loop.
// O jogador deve cair imediatamente na plataforma "ground"
update(); 
gameLoop();