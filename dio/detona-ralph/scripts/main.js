const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        timerId: null,
        countDownTimerId: setInterval(countDown, 1000),
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        initialLives: 3, 
        lives: 3,        
    },
};

const audioHit = new Audio('./audios/hit.mp3'); 
const audioGameOver = new Audio('./audios/gameover.mp3');
const audioMiss = new Audio('./audios/miss.mp3'); 

audioHit.volume = 0.2;
audioGameOver.volume = 0.2;
audioMiss.volume = 0.2;

function endGame(message) {
    playSound("gameover");
    clearInterval(state.values.countDownTimerId);
    clearInterval(state.values.timerId);
    alert(message + state.values.result);
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame("Fim do Tempo! O seu resultado foi: ");
    }
}

function playSound(audioName) {
    if (audioName === "hit") {
        audioHit.currentTime = 0; 
        audioHit.play();
    } else if (audioName === "gameover") {
        audioGameOver.play();
    } else if (audioName === "miss") {
        audioMiss.currentTime = 0;
        audioMiss.play();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    const randomNumber = Math.floor(Math.random() * state.view.squares.length);
    const randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id
    
    // NOVO: Removemos a chamada checkGameOver() daqui
}

function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            
            // Se o jogo já acabou (tempo ou vida), ignora o clique
            if (state.values.lives <= 0 || state.values.currentTime <= 0) return; 

            if (square.id == state.values.hitPosition) {
                // ACERTOU
                state.values.result++;
                state.view.score.textContent = state.values.result;
                playSound("hit");
                
                square.classList.remove("enemy"); 
                state.values.hitPosition = null; 
            
            } else if (!square.classList.contains("enemy")) {
                // ERROU: Subtrai vida
                
                state.values.lives--;
                state.view.lives.textContent = state.values.lives; 
                playSound("miss"); 
                
                square.style.backgroundColor = 'red';
                setTimeout(() => {
                     square.style.backgroundColor = ''; 
                }, 100);
                
                // VERIFICA GAME OVER APÓS PERDER VIDA
                if (state.values.lives <= 0) {
                     endGame("Game Over! Suas vidas acabaram. O seu resultado foi: ");
                }
            }
        })
    });
}

function init() {
    // Inicializa o display de vidas com o valor inicial
    if (state.view.lives) {
        state.view.lives.textContent = state.values.initialLives;
    }
    
    randomSquare(); 
    moveEnemy();
    addListenerHitBox();
}

init();