// Calculadora Simples: Implementa as quatro operações básicas($+$, $-$, $*$, $/$) e talvez a raiz quadrada.

// =============================================================================== //
using System;

public class CalculadoraSimples
{
    public static void Main(string[] args)
    {
        Console.WriteLine("======================================");
        Console.WriteLine("    Bem-vindo à Calculadora Simples   ");
        Console.WriteLine("======================================");

        // 1. Receber o primeiro número com validação
        double num1 = LerNumero("Digite o primeiro número: ");

        // 2. Receber o segundo número com validação
        double num2 = LerNumero("Digite o segundo número: ");

        // 3. Receber a operação com validação
        string operacao = LerOperacao("Escolha a operação (+, -, *, /): ");

        // 4. Executar o cálculo e exibir o resultado
        ExecutarCalculo(num1, num2, operacao);

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    /// <summary>
    /// Solicita um número ao usuário e garante que a entrada é válida.
    /// </summary>
    public static double LerNumero(string prompt)
    {
        double numero;
        bool entradaValida = false;

        // Repete o prompt até que o usuário digite um 'double' válido
        while (!entradaValida)
        {
            Console.Write(prompt);

            // Tenta converter a string lida para double
            if (double.TryParse(Console.ReadLine(), out numero))
            {
                entradaValida = true;
                return numero;
            }
            else
            {
                Console.WriteLine("❌ Erro: Entrada inválida. Por favor, digite um número.");
            }
        }
        return 0; // Código inalcançável, mas necessário para compilação
    }

    /// <summary>
    /// Solicita a operação ao usuário e garante que seja uma das 4 válidas.
    /// </summary>
    public static string LerOperacao(string prompt)
    {
        string operacao;
        while (true)
        {
            Console.Write(prompt);
            operacao = Console.ReadLine()?.Trim(); // Lê a entrada e remove espaços

            if (operacao == "+" || operacao == "-" || operacao == "*" || operacao == "/")
            {
                return operacao;
            }
            else
            {
                Console.WriteLine("❌ Erro: Operação inválida. Use apenas +, -, * ou /.");
            }
        }
    }

    /// <summary>
    /// Executa o cálculo com base na operação e exibe o resultado.
    /// </summary>
    public static void ExecutarCalculo(double num1, double num2, string operacao)
    {
        double resultado = 0;
        bool sucesso = true;

        switch (operacao)
        {
            case "+":
                resultado = num1 + num2;
                break;
            case "-":
                resultado = num1 - num2;
                break;
            case "*":
                resultado = num1 * num2;
                break;
            case "/":
                // Tratamento específico para divisão por zero
                if (num2 != 0)
                {
                    resultado = num1 / num2;
                }
                else
                {
                    Console.WriteLine("🚫 ERRO CRÍTICO: Divisão por zero não é permitida. Cálculo cancelado.");
                    sucesso = false;
                }
                break;
            default:
                // Caso alguma operação inesperada passe
                sucesso = false;
                break;
        }

        if (sucesso)
        {
            Console.WriteLine("--------------------------------------");
            // Interpolação de string para exibir o resultado formatado
            Console.WriteLine($"✅ Resultado: {num1} {operacao} {num2} = {resultado}");
            Console.WriteLine("--------------------------------------");
        }
    }
}