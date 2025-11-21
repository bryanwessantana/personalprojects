/* --- JAVASCRIPT LOGIC --- */

// Define as regras de conversão
const CONVERSIONS = {
    distance: {
        m: { km: 0.001, mi: 0.000621371, ft: 3.28084 },
        km: { m: 1000, mi: 0.621371, ft: 3280.84 },
        mi: { m: 1609.34, km: 1.60934, ft: 5280 },
        ft: { m: 0.3048, km: 0.0003048, mi: 0.000189394 }
    },
    temperature: {
        C: { 
            F: c => (c * 9/5) + 32, 
            K: c => c + 273.15 
        },
        F: { 
            C: f => (f - 32) * 5/9,
            K: f => ((f - 32) * 5/9) + 273.15
        },
        K: { 
            C: k => k - 273.15,
            F: k => ((k - 273.15) * 9/5) + 32
        }
    }
};

function updateUnitSelects() {
    const type = document.getElementById('type-select').value;
    const units = Object.keys(CONVERSIONS[type]);

    const selectFrom = document.getElementById('unit-from');
    const selectTo = document.getElementById('unit-to');

    // Limpa e preenche ambos os dropdowns
    selectFrom.innerHTML = '';
    selectTo.innerHTML = '';

    units.forEach(unit => {
        const optionFrom = document.createElement('option');
        optionFrom.value = unit;
        optionFrom.textContent = unit;
        selectFrom.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = unit;
        optionTo.textContent = unit;
        selectTo.appendChild(optionTo);
    });
}

function displayResult(isError, message, result = null, unitTo = null) {
    const outputDiv = document.getElementById('result-output');
    outputDiv.style.display = 'block';
    outputDiv.className = 'result'; 

    if (isError) {
        outputDiv.classList.add('error');
        outputDiv.innerHTML = `Error: ${message}`;
    } else {
        outputDiv.classList.add('success');
        // Formata o resultado para ter no máximo 4 casas decimais
        const formattedResult = (typeof result === 'number') ? result.toFixed(4).replace(/\.?0+$/, '') : result;
        outputDiv.innerHTML = `Result: ${formattedResult} ${unitTo}`;
    }
}

function handleConversion(event) {
    event.preventDefault(); 

    const type = document.getElementById('type-select').value;
    const valueStr = document.getElementById('value-input').value.replace(',', '.');
    const unitFrom = document.getElementById('unit-from').value;
    const unitTo = document.getElementById('unit-to').value;
            
    let value;
            
    // 1. Validação de Número
    if (isNaN(valueStr) || valueStr.trim() === '') {
        return displayResult(true, "Please enter a valid number.");
    }
    value = parseFloat(valueStr);
            
    if (unitFrom === unitTo) {
        return displayResult(false, null, value, unitTo);
    }

    const typeConversions = CONVERSIONS[type];
            
    if (!typeConversions || !typeConversions[unitFrom] || !typeConversions[unitFrom][unitTo]) {
        return displayResult(true, `Conversion from ${unitFrom} to ${unitTo} is not supported.`);
    }

    let result;
    const conversionRule = typeConversions[unitFrom][unitTo];
            
    if (typeof conversionRule === 'function') {
        // Conversão Não Linear (Temperatura)
        result = conversionRule(value);
    } else {
        // Conversão Linear (Distância)
        result = value * conversionRule;
    }
            
    displayResult(false, null, result, unitTo);
}

// Inicializa os dropdowns de unidades ao carregar a página
document.addEventListener('DOMContentLoaded', updateUnitSelects);