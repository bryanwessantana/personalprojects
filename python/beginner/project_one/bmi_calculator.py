# 🧑‍⚕️ BMI Calculator (Body Mass Index)

# This project focuses on the core process: receiving user input, performing a simple calculation in Python, and displaying the result.

# Key Components

# - Python/Flask:
    # - One route (/) to display the initial form (GET request).
    # - Another route (/calculate_bmi or the same route accepting POST) to handle the form submission.
    # - The calculation logic: $BMI = \frac{\text{weight (kg)}}{(\text{height (m)})^2}$.
    # - Logic to categorize the result (e.g., <18.5 is underweight, 18.5-24.9 is normal).

# - HTML: 
    # A simple form with two input fields (weight and height) and a submit button.
# - CSS: 
    # Basic styling for the form and result display.


# Suggested Implementation Steps

# 1. Set up Flask: Create your main application file (app.py).

# 2. Create Template: Design the index.html template with the input form.

# 3. Define Routes:
# Create the main route that just renders index.html.
# Create the route that receives the POST data from the form.

# 4. Implement Logic: Inside the POST route, grab the data, convert it to numbers, calculate BMI, and pass both the BMI value and the category to the template 
# for display.

# ------------------------------------------------------------------------------------------- #

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