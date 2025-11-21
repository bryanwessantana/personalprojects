# 🧑‍⚕️ 🔄 Basic Unit Converter

# This project focuses on logic branching (if/elif/else statements) 
# to handle different conversion types and data validation to ensure 
# the user inputs numbers.

# Key Components

# - Python/Flask:
#     - One route (/) to display the form.
#     - The conversion logic: The Python function will receive the 
#     input value, the source unit, and the target unit. It then uses 
#     conditional logic to perform the specific calculation 
#     (e.g., if converting "km" to "miles," multiply by $0.621371$).
# - HTML:
#     - An input field for the value to be converted.
#     - Two dropdown menus (<select>) for the user to choose the 
#     source unit and the target unit (e.g., km, miles, C, F).
# - CSS: Basic styling for clarity.

# Suggested Implementation Steps

# 1. Define Conversions: In your app.py, define the conversion factors. 
# A dictionary structure can be useful here to map units 
# (e.g., CONVERSIONS = {'km_to_mi': 0.621371, 'c_to_f_multiplier': 1.8, ...}).

# 2. Setup the Form: Create a template (converter.html) with the input 
# field and the unit selection dropdowns.

# 3. Handle POST: The route receiving the form data validates that the 
# value is a number and checks which conversion was selected 
# (e.g., if source_unit == 'km' and target_unit == 'miles':).

# 4. Calculate & Display: Perform the calculation and render the 
# template again, passing the original value, units, and the calculated 
# result to the page.

# ------------------------------------------------------------------------------------------- #
import sys

# Dicionário aninhado para armazenar as regras de conversão
# Estrutura: { tipo: { unidade_origem: { unidade_destino: fator_ou_funcao } } }
# Funções (lambda) são usadas para conversões não lineares (como Temperatura)
CONVERSIONS = {
    "distance": {
        "m": {"km": 0.001, "mi": 0.000621371, "ft": 3.28084},
        "km": {"m": 1000, "mi": 0.621371, "ft": 3280.84},
        "mi": {"m": 1609.34, "km": 1.60934, "ft": 5280},
        "ft": {"m": 0.3048, "km": 0.0003048, "mi": 0.000189394}
    },
    "temperature": {
        # Conversões de Temperatura (usam funções lambda)
        "C": {
            "F": lambda c: (c * 9/5) + 32, # Celsius para Fahrenheit
            "K": lambda c: c + 273.15     # Celsius para Kelvin
        },
        "F": {
            "C": lambda f: (f - 32) * 5/9, # Fahrenheit para Celsius
            "K": lambda f: ((f - 32) * 5/9) + 273.15
        },
        "K": {
            "C": lambda k: k - 273.15,     # Kelvin para Celsius
            "F": lambda k: ((k - 273.15) * 9/5) + 32
        }
    }
}

def perform_conversion(value, unit_from, unit_to, conv_type):
    """Executa a conversão baseada no tipo e nas unidades."""
    
    if conv_type not in CONVERSIONS:
        return None, "Error: Invalid conversion type."
    
    type_conversions = CONVERSIONS[conv_type]
    
    # 1. Conversão Linear (Distância)
    if conv_type == "distance":
        if unit_from in type_conversions and unit_to in type_conversions[unit_from]:
            factor = type_conversions[unit_from][unit_to]
            result = value * factor
            return round(result, 6), None
    
    # 2. Conversão Não Linear (Temperatura)
    elif conv_type == "temperature":
        if unit_from in type_conversions and unit_to in type_conversions[unit_from]:
            conversion_func = type_conversions[unit_from][unit_to]
            result = conversion_func(value)
            return round(result, 2), None

    return None, "Error: Invalid unit combination."

def get_clean_float(prompt):
    """Pede um valor numérico e trata erros."""
    while True:
        try:
            value_str = input(prompt).replace(',', '.')
            return float(value_str)
        except ValueError:
            print("Invalid input. Please enter a number.")

def run_cli():
    print("\n--- BASIC UNIT CONVERTER (CLI) ---")
    print("Available Types: distance, temperature")
    print("Distance Units: m, km, mi, ft")
    print("Temperature Units: C, F, K")
    
    while True:
        conv_type = input("\nEnter conversion type (or 'quit'): ").strip().lower()
        if conv_type == 'quit':
            sys.exit("Exiting converter.")
            
        if conv_type not in CONVERSIONS:
            print("Invalid type. Choose 'distance' or 'temperature'.")
            continue
            
        unit_from = input(f"Enter starting unit ({', '.join(CONVERSIONS[conv_type].keys())}): ").strip()
        unit_to = input(f"Enter target unit ({', '.join(CONVERSIONS[conv_type].keys())}): ").strip()
        value = get_clean_float("Enter value to convert: ")
        
        # A API de conversão é chamada
        result, error = perform_conversion(value, unit_from, unit_to, conv_type)
        
        if error:
            print(f"Conversion failed: {error}")
        else:
            print("\n--- RESULT ---")
            print(f"{value} {unit_from} is equal to {result} {unit_to}")
            print("----------------")

if __name__ == '__main__':
    run_cli()