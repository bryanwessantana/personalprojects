// Taxas de conversão (baseadas em 1 BRL)
const exchangeRates = {
    "BRL": 1.00, 
    "USD": 0.20,
    "EUR": 0.18,
    "JPY": 30.00
};

// Referências aos elementos do DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const swapButton = document.getElementById('swap-button');
const resultOutput = document.getElementById('result-output');
const rateDisplay = document.getElementById('rate-display');

// 1. Inicializa os dropdowns
function populateCurrencies() {
    const currencies = Object.keys(exchangeRates);
    
    currencies.forEach(currency => {
        const optionFrom = new Option(currency, currency);
        const optionTo = new Option(currency, currency);
        
        fromCurrencySelect.add(optionFrom);
        toCurrencySelect.add(optionTo);
    });

    // Define valores iniciais
    fromCurrencySelect.value = 'BRL';
    toCurrencySelect.value = 'USD';
    
    updateRateDisplay();
}

// 2. Lógica de Conversão
function convertCurrency() {
    // Usamos parseFloat para garantir que o valor seja tratado como número,
    // mas o type="number" no HTML já ajuda a garantir a entrada numérica.
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultOutput.textContent = "Erro: Digite um valor válido.";
        rateDisplay.textContent = "";
        return;
    }

    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];

    // Fórmula de conversão
    const valueInBaseCurrency = amount / rateFrom;
    const convertedValue = valueInBaseCurrency * rateTo;

    // Exibe o resultado, arredondado para 2 casas decimais
    const formattedResult = convertedValue.toFixed(2);
    resultOutput.textContent = `Resultado: ${formattedResult} ${toCurrency}`;
    
    updateRateDisplay();
}

// 3. Atualiza o display da taxa atual
function updateRateDisplay() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    const rateFrom = exchangeRates[fromCurrency];
    const rateTo = exchangeRates[toCurrency];

    // Calcula a taxa de A para B
    const directRate = (rateTo / rateFrom).toFixed(4);
    
    rateDisplay.textContent = `1 ${fromCurrency} = ${directRate} ${toCurrency}`;
}

// 4. Inverte as moedas
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency(); // Converte imediatamente após a troca
}

// 5. Adiciona Event Listeners para CONVERSÃO EM TEMPO REAL
// 'input' dispara a cada alteração no valor do campo (tempo real)
amountInput.addEventListener('input', convertCurrency);
// 'change' dispara quando um novo item é selecionado no dropdown
fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);

// Listener para o botão de troca
swapButton.addEventListener('click', swapCurrencies);

// Inicializa a aplicação
populateCurrencies();
convertCurrency();