// Tabuada Interativa: Solicita um número ao usuário e exibe a tabuada completa desse número (de 1 a 10).

// =============================================================================== //
using System;

public class Tabuada
{
    public static void Main(string[] args)
    {
        Console.WriteLine("======================================");
        Console.WriteLine("        Gerador de Tabuada            ");
        Console.WriteLine("======================================");

        // 1. Receber e validar o número
        int numero = LerNumeroParaTabuada("Digite o número da tabuada (1 a 10): ");

        // 2. Executar e exibir a tabuada
        GerarTabuada(numero);

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    /// <summary>
    /// Lê e valida se a entrada do usuário é um inteiro entre 1 e 10.
    /// </summary>
    public static int LerNumeroParaTabuada(string prompt)
    {
        int numero;
        while (true)
        {
            Console.Write(prompt);

            // Tenta converter a entrada. Se for um número E estiver entre 1 e 10.
            if (int.TryParse(Console.ReadLine(), out numero) && numero >= 1 && numero <= 100) // Ampliado para 100 para flexibilidade
            {
                return numero;
            }
            Console.WriteLine("❌ Erro: Entrada inválida. Por favor, digite um número inteiro.");
        }
    }

    /// <summary>
    /// Gera e imprime a tabuada completa do número fornecido (de 1 a 10).
    /// </summary>
    public static void GerarTabuada(int numero)
    {
        Console.WriteLine($"\n--- Tabuada do {numero} ---");

        // Uso do laço 'for' para repetir a operação 10 vezes (i = 1 até i = 10)
        for (int i = 1; i <= 10; i++)
        {
            int resultado = numero * i;

            // Interpolação de string ($"...") para formatação clara
            Console.WriteLine($"| {numero,3} x {i,2} = {resultado,4} |");
        }

        Console.WriteLine("-------------------------");
    }
}