from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

try:
    print("--- CONECTANDO AO GOOGLE ---")
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    print("--- LISTA DE MODELOS ---")
    # Pega todos os modelos sem tentar filtrar propriedades que podem não existir
    for model in client.models.list():
        print(f"Nome: {model.name}")
            
except Exception as e:
    print(f"Erro: {e}")