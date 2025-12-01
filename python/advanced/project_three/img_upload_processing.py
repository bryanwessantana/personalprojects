# Image Upload and Processing:

# Python: Allows the upload of an image (via an HTML form) and uses 
# a library like Pillow to process it (e.g., resize, apply a sepia 
# or black and white filter) before saving and displaying it.

# Front-end: File upload form and display of the processed image.

# ------------------------------------------------------------------------------------------- #
from PIL import Image, ImageOps

# --- Funções Existentes ---
def aplicar_escala_cinza(imagem):
    return imagem.convert("L")

def aplicar_sepia(imagem):
    # (Código do sépia anterior...)
    width, height = imagem.size
    pixels = imagem.load()
    for py in range(height):
        for px in range(width):
            r, g, b = imagem.getpixel((px, py))
            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)
            pixels[px, py] = (min(255, tr), min(255, tg), min(255, tb))
    return imagem

# --- NOVAS FUNÇÕES ---

def aplicar_negativo(imagem):
    # Inverter é subtrair o valor atual de 255
    width, height = imagem.size
    pixels = imagem.load()

    for py in range(height):
        for px in range(width):
            r, g, b = imagem.getpixel((px, py))
            # Ex: Se o vermelho é 0 (preto), vira 255 (branco). Se é 255, vira 0.
            pixels[px, py] = (255 - r, 255 - g, 255 - b)
    return imagem

def aumentar_brilho(imagem, fator=50):
    # Adiciona 'fator' a cada canal de cor
    width, height = imagem.size
    pixels = imagem.load()

    for py in range(height):
        for px in range(width):
            r, g, b = imagem.getpixel((px, py))
            # IMPORTANTE: Usamos min(255, ...) para o valor não estourar o limite
            r_novo = min(255, r + fator)
            g_novo = min(255, g + fator)
            b_novo = min(255, b + fator)
            pixels[px, py] = (r_novo, g_novo, b_novo)
    return imagem

def espelhar_imagem(imagem):
    # O Pillow tem um jeito super fácil de fazer isso sem loop for
    return imagem.transpose(Image.FLIP_LEFT_RIGHT)


# --- Simulação de uso atualizada ---
try:
    # caminho = input("Digite o nome da imagem (ex: foto.jpg): ") # Comentei para testar rápido
    caminho = "teste.jpg" # Use uma imagem sua aqui para testar
    img_original = Image.open(caminho)
    
    print("--- Menu de Edição ---")
    print("1. Preto e Branco")
    print("2. Sépia")
    print("3. Negativo (Inverter)")
    print("4. Aumentar Brilho")
    print("5. Espelhar")
    escolha = input("Escolha uma opção (1-5): ")

    # Usamos .copy() para sempre trabalhar sobre uma cópia da original
    if escolha == '1':
        resultado = aplicar_escala_cinza(img_original.copy())
    elif escolha == '2':
        resultado = aplicar_sepia(img_original.copy())
    elif escolha == '3':
        resultado = aplicar_negativo(img_original.copy())
    elif escolha == '4':
        resultado = aumentar_brilho(img_original.copy())
    elif escolha == '5':
        resultado = espelhar_imagem(img_original.copy())
    else:
        print("Opção inválida.")
        exit()

    resultado.save("resultado_editado.jpg")
    print("Imagem salva como 'resultado_editado.jpg'!")
    resultado.show() # Abre a imagem no visualizador padrão do seu PC
    
except FileNotFoundError:
    print(f"Erro: Não encontrei o arquivo '{caminho}'. Verifique o nome.")
except Exception as e:
    print(f"Ocorreu um erro: {e}")