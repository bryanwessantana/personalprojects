// Verificador de Palíndromo: Recebe uma palavra ou frase e determina se ela é lida da mesma forma de trás para 
// frente (ex: ovo, arara).

// =============================================================================== //
using System;
using System.Linq; // Necessário para usar a função Where, se for usar LINQ

public class PalindromoChecker
{
    public static void Main(string[] args)
    {
        Console.WriteLine("======================================");
        Console.WriteLine("    Verificador de Palíndromo         ");
        Console.WriteLine("======================================");

        string entrada = LerEntrada("Digite a palavra ou frase: ");

        bool ehPalindromo = VerificarPalindromo(entrada);

        if (ehPalindromo)
        {
            Console.WriteLine("\n✅ RESULTADO: A frase é um Palíndromo!");
        }
        else
        {
            Console.WriteLine("\n❌ RESULTADO: A frase NÃO é um Palíndromo.");
        }

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    // Simples função de leitura
    public static string LerEntrada(string prompt)
    {
        Console.Write(prompt);
        return Console.ReadLine();
    }

    // A função principal onde a lógica acontece
    public static bool VerificarPalindromo(string textoOriginal)
    {
        // 1. Normalização:
        //    a. Converte para minúsculas.
        //    b. Filtra (Remove) caracteres que não são letras ou dígitos.
        string textoNormalizado = new string(textoOriginal
                                            .ToLower()
                                            .Where(c => char.IsLetterOrDigit(c))
                                            .ToArray());

        // Verifica se a string está vazia após a limpeza (caso o usuário só digite espaços)
        if (string.IsNullOrEmpty(textoNormalizado))
        {
            return false; // Ou true, dependendo da regra, mas geralmente requer conteúdo.
        }

        // 2. Inversão (Usando Array.Reverse para maior eficiência em strings longas):
        //    a. Converte a string normalizada em um array de caracteres.
        char[] arrayDeChars = textoNormalizado.ToCharArray();

        // b. Inverte o array.
        Array.Reverse(arrayDeChars);

        // c. Cria uma nova string a partir do array invertido.
        string textoInvertido = new string(arrayDeChars);

        // 3. Comparação:
        //    Compara a string original limpa com a string invertida.
        return textoNormalizado.Equals(textoInvertido);
    }
}