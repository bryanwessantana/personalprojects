/* --- JAVASCRIPT LOGIC --- */
        

const CHARACTERS = {
    letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_+=[]{}|;:,.<>?/~`'
}

function displayResult(isError, message, password = null) {
    const outputDiv = document.getElementById('result-output');
    outputDiv.innerHTML = '';
    outputDiv.className = '';
    if (isError) {
        outputDiv.classList.add('result', 'error');
        outputDiv.innerHTML = `<p><strong>Error:</strong> ${message}</p>`;
    } else {
        outputDiv.classList.add('result', 'password-display');
        outputDiv.innerHTML = `
            <p style="font-weight: bold; font-size: 1.4em;">${password}</p>
            <button id="copyButton" onclick="copyToClipboard('${password}')">Copy to Clipboard</button>
        `;
    }
}

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'Copied!' : 'Failed to copy.';
        document.getElementById('copyButton').innerText = msg;
        setTimeout(() => {
            document.getElementById('copyButton').innerText = 'Copy to Clipboard';
        }, 2000);
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    } finally {
        document.body.removeChild(el);
    }
}

function generatePassword(event) {
    event.preventDefault(); 
    
    const lengthInput = document.getElementById('length').value;
    const useLetters = document.getElementById('letters').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked
    const length = parseInt(lengthInput)
    if (isNaN(length) || length < 4 || length > 128) {
        return displayResult(true, "Password length must be a number between 4 and 128.");
    }

    let allowedChars = "";
    if (useLetters) allowedChars += CHARACTERS.letters;
    if (useNumbers) allowedChars += CHARACTERS.numbers;
    if (useSymbols) allowedChars += CHARACTERS.symbols
    // 3. Validação de Tipo de Caractere
    if (!allowedChars) {
        return displayResult(true, "Please select at least one character type.");
    }

    // 4. Geração da Senha
    let password = "";
    for (let i = 0; i < length; i++) {
        // Seleciona um caractere aleatório do conjunto permitido
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars.charAt(randomIndex);
    }
    // 5. Exibe a senha
    displayResult(false, null, password);
}