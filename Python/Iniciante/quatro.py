# Peça uma palavra e conte quantas vogais ela tem.
palavra = input("Diga uma palavra: ")
vogais = "aeiou"
contador_vogais = 0

frase_minuscula = palavra.lower()

for letra in frase_minuscula:
    if letra in vogais:
        contador_vogais += 1

print(f"A palavra {palavra} tem {contador_vogais} vogais.")