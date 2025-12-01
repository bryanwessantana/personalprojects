// Conversor de Moedas Simples: Converte um valor em uma moeda (ex: USD) para outra (ex: EUR) com base em uma taxa de câmbio fixa.

// =============================================================================== //
using System;
using System.Collections.Generic; // Necessário para usar Dictionary

public class ConversorMoedas
{
    // Usamos 'decimal' em vez de 'double' para garantir precisão em cálculos monetários
    private static Dictionary<string, decimal> Taxas = new Dictionary<string, decimal>
    {
        // Taxas de conversão baseadas em 1 unidade de BRL (Real Brasileiro)
        // Por exemplo: 1 BRL = X USD; 1 BRL = Y EUR
        // Estas são taxas fictícias para demonstração:
        { "BRL", 1.00m },
        { "USD", 0.20m }, // 1 BRL vale 0.20 USD (ou 1 USD = 5 BRL)
        { "EUR", 0.18m }, // 1 BRL vale 0.18 EUR (ou 1 EUR = 5.55 BRL)
        { "JPY", 30.00m } // 1 BRL vale 30.00 JPY (ou 1 JPY = 0.033 BRL)
    };

    public static void Main(string[] args)
    {
        Console.WriteLine("======================================");
        Console.WriteLine("      Conversor de Moedas Simples     ");
        Console.WriteLine("======================================");

        // 1. Mostrar as moedas disponíveis
        ListarMoedasDisponiveis();

        // 2. Receber a entrada do usuário
        decimal valor = LerValor("Digite o valor a ser convertido: ");
        string moedaOrigem = LerMoeda("Digite a moeda de origem (ex: BRL): ");
        string moedaDestino = LerMoeda("Digite a moeda de destino (ex: USD): ");

        // 3. Executar o cálculo
        ExecutarConversao(valor, moedaOrigem, moedaDestino);

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    // Exibe as moedas disponíveis no dicionário
    public static void ListarMoedasDisponiveis()
    {
        Console.WriteLine("\nMoedas disponíveis:");
        foreach (var moeda in Taxas.Keys)
        {
            Console.Write($"[{moeda}] ");
        }
        Console.WriteLine("\n");
    }

    // Lê e valida se a entrada do usuário é um decimal válido
    public static decimal LerValor(string prompt)
    {
        decimal valor;
        while (true)
        {
            Console.Write(prompt);
            if (decimal.TryParse(Console.ReadLine(), out valor) && valor >= 0)
            {
                return valor;
            }
            Console.WriteLine("❌ Erro: Valor inválido. Digite um número positivo.");
        }
    }

    // Lê e valida se a moeda inserida está no dicionário (Taxas)
    public static string LerMoeda(string prompt)
    {
        string moeda;
        while (true)
        {
            Console.Write(prompt);
            moeda = Console.ReadLine()?.ToUpper().Trim();

            if (Taxas.ContainsKey(moeda))
            {
                return moeda;
            }
            Console.WriteLine("❌ Erro: Moeda não encontrada. Tente novamente.");
        }
    }

    // Lógica principal de conversão
    public static void ExecutarConversao(decimal valor, string origem, string destino)
    {
        // 1. Calcular o valor na moeda base (BRL, neste caso)
        // ValorBase = ValorOriginal / TaxaDaOrigem
        decimal taxaOrigem = Taxas[origem];
        decimal valorBase = valor / taxaOrigem;

        // 2. Converter o valor base para a moeda de destino
        // ValorFinal = ValorBase * TaxaDaDestino
        decimal taxaDestino = Taxas[destino];
        decimal valorConvertido = valorBase * taxaDestino;

        // 3. Exibir o resultado formatado
        Console.WriteLine("\n--------------------------------------");
        Console.WriteLine($"Conversão de {origem} para {destino}:");
        Console.WriteLine($"Valor Original: {valor:C} {origem}");
        // O ':N2' formata com duas casas decimais
        Console.WriteLine($"Valor Convertido: {valorConvertido:N2} {destino}");
        Console.WriteLine("--------------------------------------");
    }
}