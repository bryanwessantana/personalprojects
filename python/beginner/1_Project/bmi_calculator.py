import math

def calculate_bmi(weight_kg, height_m):
    """Calculates the BMI and returns the value and its category, assuming height is already in meters."""
    
    if height_m <= 0 or weight_kg <= 0:
        return 0.0, "Invalid Input"
    
    # BMI = weight (kg) / height (m)²
    bmi = weight_kg / (height_m ** 2)

    # Determine the category
    if bmi < 18.5:
        category = "Underweight"
    elif 18.5 <= bmi < 25.0:
        category = "Normal Weight"
    elif 25.0 <= bmi < 30.0:
        category = "Overweight"
    else:
        category = "Obesity"

    return round(bmi, 2), category

def clean_input(prompt):
    """Prompts the user for input, replaces commas, and attempts to convert to float."""
    while True:
        try:
            value_str = input(prompt).replace(',', '.')
            value = float(value_str)
            if value <= 0:
                print("The value must be positive. Please try again.")
                continue
            return value
        except ValueError:
            print("Invalid input. Please enter a number (use dot or comma for decimals).")

def run_cli():
    """Main function to run in the terminal."""
    print("\n--- BODY MASS INDEX (BMI) CALCULATOR ---")
    
    # 1. Get Weight
    weight = clean_input("Enter your weight in kilograms (kg): ")
    
    # 2. Get Height
    height = clean_input("Enter your height in meters (m). Ex: 1.75 or 175: ")
    
    # 3. Defensive Conversion (CM to M)
    # If the height is greater than 3 meters, assume CM was entered and convert to M.
    if height > 3:
        height_m = height / 100
        print(f"(Adjusting height from {height} cm to {height_m} m)")
    else:
        height_m = height

    # 4. Calculation
    bmi_result, category = calculate_bmi(weight, height_m)
    
    # 5. Display Result
    if category != "Invalid Input":
        print("\n--- RESULT ---")
        print(f"Calculated BMI: {bmi_result}")
        print(f"Category: {category}")
        print("----------------\n")

if __name__ == '__main__':
    run_cli()