const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');
const previousDisplay = document.querySelector('.previous-operation');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let displayString = ''; 

keys.addEventListener('click', (event) => {
    const { target } = event;
    
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        clearCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

function inputDigit(digit) {
    const displayValue = display.value;

    if (waitingForSecondValue === true) {
        if (operator === null) { 
            displayString = ''; 
        }
        
        display.value = digit;
        waitingForSecondValue = false;
    } else {
        display.value = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (waitingForSecondValue === true) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }

    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function clearCalculator() {
    display.value = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    displayString = '';
}

function updateDisplay() {
    previousDisplay.textContent = displayString;
    display.value = display.value;
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);
    
    const currentOperationString = displayString; 

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstValue, inputValue);

        if (result !== 'Error') {
            display.value = String(result.toFixed(5).replace(/\.0+$/, ''));
            firstValue = result;
        } else {
            display.value = 'Error';
            clearCalculator();
            return; 
        }
    }

    if (nextOperator === '=') {
        let opSymbol = operator || ''; 
        
        // Se a conta for simples (ex: 5 =)
        if (currentOperationString === '') {
            displayString = `${inputValue} =`;
        } else {
             // Conta complexa (ex: 5 + 3 =)
            displayString = `${currentOperationString} ${inputValue} =`; 
        }
        
        operator = null; 
        waitingForSecondValue = true;
    } else {
        // Para operações (+, -, *, /)
        displayString = `${inputValue} ${nextOperator}`; 
        waitingForSecondValue = true;
        operator = nextOperator;
    }
}

const performCalculation = {
    '/': (firstNum, secondNum) => secondNum === 0 ? 'Error' : firstNum / secondNum,
    '*': (firstNum, secondNum) => firstNum * secondNum,
    '+': (firstNum, secondNum) => firstNum + secondNum,
    '-': (firstNum, secondNum) => firstNum - secondNum,
    '=': (firstNum, secondNum) => secondNum
};