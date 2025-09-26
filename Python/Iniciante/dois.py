# Peça um número e diga se ele é par ou ímpar.
num = int(input("Digite um número: "))
resto = num % 2

if resto == 0:
    print(f"O número {num} é par.")
else:
    print(f"O número {num} é impar.")