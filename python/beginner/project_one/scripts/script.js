/* --- JAVASCRIPT LOGIC (Faz o cálculo e a exibição) --- */
        
function getCategory(bmi) {
    // Returns the English category string
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi < 25.0) {
        return "Normal Weight";
    } else if (bmi < 30.0) {
        return "Overweight";
    } else {
        return "Obesity";
    }
}

function displayResult(isError, message, bmi = null, category = null) {
    const outputDiv = document.getElementById('result-output');
    outputDiv.style.display = 'block';
    outputDiv.className = 'result'; // Reset classe
    if (isError) {
        outputDiv.classList.add('error');
        outputDiv.innerHTML = `<p><strong>Error:</strong> ${message}</p>`;
    } else {
        outputDiv.classList.add('success');
        outputDiv.innerHTML = `
            <p>Your BMI is: <strong>${bmi.toFixed(2)}</strong></p>
            <p>Category: <strong>${category}</strong></p>
        `;
    }
}

function calculateBMI(event) {
    // Prevents the default form submission (page reload)
    event.preventDefault(); 
    
    // 1. Get inputs
    const weightInput = document.getElementById('weight').value;
    const heightInput = document.getElementById('height').value
    // Replace commas with dots for international compatibility
    let weightStr = weightInput.replace(',', '.');
    let heightStr = heightInput.replace(',', '.');
    
    let weight, height;
    
    // 2. Validate input is a number
    if (isNaN(weightStr) || isNaN(heightStr) || weightStr.trim() === '' || heightStr.trim() === '') {
        return displayResult(true, "Please enter valid numbers for weight and height.");
    }

    weight = parseFloat(weightStr);
    height = parseFloat(heightStr)

    // 3. Validate positive values
    if (weight <= 0 || height <= 0) {
        return displayResult(true, "Weight and height must be positive numbers.");
    }

    // 4. Unit Correction (CM to M)
    // If height > 3 meters, assume CM was entered and convert to M
    if (height > 3) {
        height = height / 100;
    }

    // 5. BMI Calculation
    const bmi = weight / (height * height)
    // 6. Get Category and Display
    const category = getCategory(bmi);
    displayResult(false, null, bmi, category);
}