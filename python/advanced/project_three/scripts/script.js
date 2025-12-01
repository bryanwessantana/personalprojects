const uploadInput = document.getElementById('uploadInput');
const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

let imgOriginal = new Image(); // Equivalente ao objeto Image do Python

// 1. Lógica do Negativo (Inverter)
function aplicarNegativo() {
    if (!imgOriginal.src) return;
    
    // Sempre desenha a original antes de aplicar um filtro novo
    ctx.drawImage(imgOriginal, 0, 0); 

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // A mesma lógica matemática do Python: 255 - valor
        data[i]     = 255 - data[i];     // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
    }
    ctx.putImageData(imageData, 0, 0);
}

// 2. Lógica do Brilho
function aumentarBrilho() {
    if (!imgOriginal.src) return;
    ctx.drawImage(imgOriginal, 0, 0); 

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const fator = 50; // Quanto de brilho vamos adicionar

    for (let i = 0; i < data.length; i += 4) {
        // Somamos o fator e usamos Math.min para travar em 255
        data[i]     = Math.min(255, data[i] + fator);
        data[i + 1] = Math.min(255, data[i + 1] + fator);
        data[i + 2] = Math.min(255, data[i + 2] + fator);
    }
    ctx.putImageData(imageData, 0, 0);
}

// 3. Lógica de Espelhar (Truque do Canvas!)
// Diferente dos outros, aqui não mexemos pixel por pixel.
// Nós transformamos o "contexto" do canvas.
function espelharCanvas() {
    if (!imgOriginal.src) return;

    // 1. Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Salva o estado atual do contexto (sem espelhamento)
    ctx.save();
    
    // 3. Move o ponto de origem (0,0) para o canto superior DIREITO
    ctx.translate(canvas.width, 0);
    
    // 4. Inverte a escala no eixo X (isso causa o espelhamento)
    ctx.scale(-1, 1);
    
    // 5. Desenha a imagem (agora ela será desenhada invertida por causa do scale)
    ctx.drawImage(imgOriginal, 0, 0);
    
    // 6. Restaura o estado original do contexto para não bugar os próximos filtros
    ctx.restore();
}

// 4. Carregar a imagem quando o usuário seleciona o arquivo
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        imgOriginal.src = event.target.result;
        imgOriginal.onload = function() {
            // Ajusta o tamanho do canvas para o tamanho da imagem
            canvas.width = imgOriginal.width;
            canvas.height = imgOriginal.height;
            // Desenha a imagem no canvas
            ctx.drawImage(imgOriginal, 0, 0);
        }
    }
    reader.readAsDataURL(file);
});

// Função para Resetar (Voltar ao original)
function resetar() {
    if (imgOriginal.src) ctx.drawImage(imgOriginal, 0, 0);
}

// 5. Lógica do Preto e Branco
function aplicarCinza() {
    if (!imgOriginal.src) return;

    // Pega os dados dos pixels (R, G, B, Alpha para cada pixel)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop pelos pixels. No JS, os dados são um array gigante [r, g, b, a, r, g, b, a...]
    // Por isso pulamos de 4 em 4
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Média simples para cinza
        const avg = (r + g + b) / 3;

        data[i] = avg;     // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
        // data[i+3] é o Alpha (transparência), não mexemos
    }
    
    // Devolve os dados modificados para o canvas
    ctx.putImageData(imageData, 0, 0);
}

// 6. Lógica do Sépia (Mesma matemática do Python!)
function aplicarSepia() {
    if (!imgOriginal.src) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Olha a fórmula aparecendo aqui de novo:
        let tr = (0.393 * r) + (0.769 * g) + (0.189 * b);
        let tg = (0.349 * r) + (0.686 * g) + (0.168 * b);
        let tb = (0.272 * r) + (0.534 * g) + (0.131 * b);

        // Min(255, valor) para não estourar o limite de cor
        data[i] = Math.min(255, tr);
        data[i + 1] = Math.min(255, tg);
        data[i + 2] = Math.min(255, tb);
    }

    ctx.putImageData(imageData, 0, 0);
}