# 📊 CSV File Data Viewer

# This project is excellent for learning file handling in Python and 
# how to structure simple, tabular data for the web. You'll use a 
# built-in Python library to process the file.

# Key Components

# - Python/Flask:
#     - Use the built-in csv library to easily read the contents of 
#     the file.
#     - The Python code reads the CSV file, extracting the header 
#     row (for table columns) and the data rows.
#     - The data is structured (e.g., as a list of dictionaries) 
#     so Flask can easily pass it to the template.
# - HTML: 
#     - A simple display page.
#     - The core element is an HTML table (<table>) to display 
#     the structured data, using a loop to iterate over the data rows.
# - A Sample .csv File: You will need a simple, static file (e.g., 
# data/countries.csv) with columns like Country, Capital, Population.

# Suggested Implementation Steps

# 1. Create Static Data: Place a small .csv file in a dedicated 
# folder (e.g., data/).

# 2. Define Route: Create a route (e.g., /csv_viewer) that triggers 
# the file reading.

# 3. Read and Process:
#     - Open the CSV file within the Python route.
#     - Use csv.reader or csv.DictReader to parse the file.
#     - Store the header names and the rows of data in variables.
    
# 4. Render Table: Render a template (viewer.html), passing the 
# headers and the data rows. The HTML template then uses a loop to 
# create the table structure: a <thead> for headers and a <tbody> with 
# nested loops for the rows and cells.

# ------------------------------------------------------------------------------------------- #
import csv
import sys
import os

FILE_NAME = "all_business_cards.csv"

def read_csv(filename):
    """Lê o arquivo CSV e retorna as linhas como uma lista de listas."""
    try:
        # Tenta abrir o arquivo no modo de leitura ('r')
        with open(filename, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            data = list(reader)
        return data, None
    except FileNotFoundError:
        return None, f"Error: The file '{filename}' was not found in the current directory."
    except Exception as e:
        return None, f"An error occurred while reading the file: {e}"

def display_data(data):
    """Exibe os dados tabulares em formato legível no terminal."""
    if not data:
        print("No data to display.")
        return

    headers = data[0]
    rows = data[1:]
    
    # 1. Determina a largura máxima de cada coluna
    column_widths = [len(header) for header in headers]
    for row in rows:
        for i, cell in enumerate(row):
            if i < len(column_widths):
                column_widths[i] = max(column_widths[i], len(cell))

    # 2. Cria a linha de separação
    separator = "+" + "+".join("-" * (width + 2) for width in column_widths) + "+"
    
    # 3. Função para formatar a linha
    def format_row(row):
        return "|" + "|".join(f" {cell:<{column_widths[i]}} " for i, cell in enumerate(row)) + "|"

    # Exibir cabeçalho
    print("\n" + separator)
    print(format_row(headers))
    print(separator)
    
    # Exibir linhas de dados
    for row in rows:
        print(format_row(row))
    
    print(separator + "\n")

def run_cli():
    """Função principal para rodar no terminal."""
    print("\n--- CSV FILE DATA VIEWER (CLI) ---")
    print(f"Attempting to read file: {FILE_NAME}")
    
    # Verifica se o arquivo existe
    if not os.path.exists(FILE_NAME):
        print(f"\nERROR: The file '{FILE_NAME}' does not exist.")
        print("Please create 'sample_data.csv' with data before running.")
        return

    data, error = read_csv(FILE_NAME)
    
    if error:
        print(error)
    elif data:
        display_data(data)
    else:
        print("The file was empty.")

if __name__ == '__main__':
    run_cli()