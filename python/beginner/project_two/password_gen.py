# 🔐 Simple Password Generator

# This project teaches you how to use Python libraries for random generation and how to pass complex data (the generated password string) back to the user.

# Key Components

# - Python/Flask:
    # - Use the built-in Python library random to select characters.
    # - The logic should take the desired length from the user and generate a string containing a mix of letters, numbers, and symbols.
    # - One route to display the form and a results area.

# - HTML: 
    # An input field for the desired password length and a button to generate.
# - JavaScript (Optional but Recommended): 
    # A small script to add a "Copy to Clipboard" button next to the generated password.

# Suggested Implementation Steps

# 1. Setup the Form: Create a template with an input for length.

# 2. Define Characters: In Python, define strings for possible characters (e.g., lowercase = 'abcdefg...', digits = '0123...', etc.).

# 3. Generation Logic: Based on the user-provided length, randomly select characters from the combined character pool and join them to form the password string.

# 4. Display: Render the same template, passing the generated password string to be displayed clearly on the page.

# ------------------------------------------------------------------------------------------- #

import random
import string
import sys

# Define os conjuntos de caracteres possíveis
CHARACTERS = {
    'letters': string.ascii_letters,  # a-z e A-Z
    'numbers': string.digits,         # 0-9
    'symbols': string.punctuation     # !, @, #, $, etc.
}

def generate_password(length, use_letters, use_numbers, use_symbols):
    """Gera uma senha aleatória baseada nos critérios."""
    
    allowed_chars = ""
    
    # 1. Constrói o conjunto de caracteres permitido
    if use_letters:
        allowed_chars += CHARACTERS['letters']
    if use_numbers:
        allowed_chars += CHARACTERS['numbers']
    if use_symbols:
        allowed_chars += CHARACTERS['symbols']
        
    # Se nenhum tipo de caractere foi selecionado
    if not allowed_chars:
        return None, "Error: Select at least one character type (letters, numbers, or symbols)."
        
    # 2. Garante que a senha tenha o comprimento mínimo (4, por exemplo)
    actual_length = max(4, length) 
    
    # 3. Gera a senha: usa random.choice para selecionar um caractere de cada vez
    # random.choice é eficiente para selecionar aleatoriamente de uma sequência
    password = ''.join(random.choice(allowed_chars) for _ in range(actual_length))
    
    return password, None

def get_int_input(prompt, min_val=4, max_val=128):
    """Obtém entrada numérica validada do usuário."""
    while True:
        try:
            value = input(prompt).strip()
            if not value.replace(' ', '').isdigit():
                print("Invalid input. Please enter a whole number.")
                continue
            
            value = int(value)
            if min_val <= value <= max_val:
                return value
            else:
                print(f"Length must be between {min_val} and {max_val}.")
        except Exception:
            # Caso de erro inesperado
            print("An unknown error occurred during input.")
            
def get_yes_no_input(prompt):
    """Obtém entrada de sim/não ('y' ou 'n')."""
    while True:
        choice = input(prompt).strip().lower()
        if choice in ['y', 'yes']:
            return True
        elif choice in ['n', 'no']:
            return False
        else:
            print("Invalid choice. Enter 'y' for Yes or 'n' for No.")

def run_cli():
    """Função principal para rodar no terminal."""
    print("\n--- SIMPLE PASSWORD GENERATOR (CLI) ---")
    
    # 1. Configurar o comprimento
    length = get_int_input("Enter desired password length (4-128): ")
    
    # 2. Configurar tipos de caracteres
    print("\n--- CHARACTER SETS ---")
    use_letters = get_yes_no_input("Include letters (a-z, A-Z)? (y/n, default: y): ")
    use_numbers = get_yes_no_input("Include numbers (0-9)? (y/n, default: y): ")
    use_symbols = get_yes_no_input("Include symbols (!@#$...)? (y/n, default: n): ")
    
    # 3. Gerar senha
    password, error = generate_password(length, use_letters, use_numbers, use_symbols)
    
    # 4. Exibir resultado
    if error:
        print(f"\nError: {error}")
    else:
        print("\n--- GENERATED PASSWORD ---")
        print(f"Length: {len(password)}")
        print(f"Password: {password}")
        print("--------------------------\n")
        
    # Tenta copiar para o clipboard (compatível com alguns terminais, mas não todos)
    try:
        if sys.platform.startswith('linux') or sys.platform == 'darwin': # Linux or macOS
            import subprocess
            subprocess.run(['pbcopy'], input=password.encode('utf-8'))
            print(" (Copied to clipboard!)")
        # Para Windows, usar 'pyperclip' seria mais confiável, mas requer pip install
    except Exception:
        pass


if __name__ == '__main__':
    run_cli()