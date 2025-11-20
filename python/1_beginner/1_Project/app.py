# BMI Calculator (Body Mass Index):

# Python: Receives weight and height (via an HTML form), calculates 
# the BMI, and determines the category (underweight, normal, etc.).

# Front-end: A simple form for data input and clear display of the 
# result and category.

# ================================================================ #

#🧑‍⚕️ BMI Calculator (Body Mass Index)

# This project focuses on the core process: receiving user input, 
# performing a simple calculation in Python, and displaying the result.

# Key Components
# - Python/Flask:
#     - One route (/) to display the initial form (GET request).
#     - Another route (/calculate_bmi or the same route accepting POST) 
#     to handle the form submission.
#     - The calculation logic: BMI = weight(kg)/(height(m))^2.
#     - Logic to categorize the result 
#     (e.g., <18.5 is underweight, 18.5-24.9 is normal).
# - HTML: A simple form with two input fields (weight and height) 
# and a submit button.
# - CSS: Basic styling for the form and result display.

# Suggested Implementation Steps
# 1. Set up Flask: Create your main application file (app.py).
# 2. Create Template: Design the index.html template with the input form.
# 3. Define Routes:
#     - Create the main route that just renders index.html.
#     - Create the route that receives the POST data from the form.
# 4. Implement Logic: Inside the POST route, grab the data, convert it 
# to numbers, calculate BMI, and pass both the BMI value and the 
# category to the template for display.

# ================================================================ #

from flask import Flask, render_template, request

# Initialize the Flask application
app = Flask(__name__)

# --- BMI Logic Helper Function (Cleaned) ---
def calculate_bmi(weight_kg, height_m):
    """Calculates the BMI and returns the value and its category, assuming height is already in meters."""
    
    # Check for non-positive height *after* unit conversion
    if height_m <= 0:
        return None, "Invalid Height (height cannot be zero or negative)"
    
    # BMI formula: weight(kg) / (height(m))^2
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

    # Round BMI to 2 decimal places
    return round(bmi, 2), category

# --- Flask Routes ---

@app.route('/', methods=['GET', 'POST'])
def index():
    bmi_result = None
    category = None
    error_message = None
    
    # Variables to hold user's input (for persistent display in the form)
    # We use these variables later to populate the form fields in index.html

    if request.method == 'POST':
        try:
            # 1. Get values from the form
            weight_str = request.form.get('weight')
            height_str = request.form.get('height')
            
            # 2. Data Cleaning: Comma handling and basic checks
            if weight_str:
                weight_str = weight_str.replace(',', '.')
            if height_str:
                height_str = height_str.replace(',', '.')

            if not weight_str or not height_str:
                error_message = "Missing weight or height data."
            else:
                # 3. Type Conversion
                weight = float(weight_str) # in kg
                height = float(height_str) # potentially in cm
            
                # 4. Data Preparation: Moving Unit Correction here (SRP)
                if height > 3: # If height is > 3 meters, assume it's in CM and convert to meters
                    height = height / 100
                
                # 5. Final Validation and Calculation
                if weight <= 0 or height <= 0:
                    error_message = "Weight and height must be positive numbers."
                else:
                    bmi_result, category = calculate_bmi(weight, height)

        except ValueError:
            error_message = "Please enter valid numbers. Use dot (.) for decimals."
        except Exception as e:
            # Catching unknown errors
            error_message = f"An unexpected error occurred: {e}"

    return render_template(
        'index.html',
        bmi_result=bmi_result,
        category=category,
        error_message=error_message,
        # We pass the original request form data to keep fields populated on error
        weight_input=request.form.get('weight', ''), 
        height_input=request.form.get('height', '')
    )

if __name__ == '__main__':
    app.run(debug=True)