# Solicite um número e mostre a tabuada dele de 1 a 10.
num = int(input("Digite um número: "))

print(f"A tabuada do número {num} é:")
for i in range(1, 11):
    result = num * i
    print(f"{num} * {i} = {result}")