// Jogo "Adivinhe o Número": O programa escolhe um número aleatório entre 1 e 100, e o usuário tenta adivinhar o número com 
// dicas de "mais alto" ou "mais baixo".

// =============================================================================== //
using System;

public class AdivinheONumero
{
    public static void Main(string[] args)
    {
        Console.WriteLine("======================================");
        Console.WriteLine("       Adivinhe o Número Secreto      ");
        Console.WriteLine("======================================");

        const int MIN_RANGE = 1;
        const int MAX_RANGE = 100;
        const int MAX_TENTATIVAS = 7;

        // Cria um gerador de números aleatórios
        Random random = new Random();

        // Gera o número secreto dentro do intervalo (Next(min, max + 1) pois o limite superior é exclusivo)
        int numeroSecreto = random.Next(MIN_RANGE, MAX_RANGE + 1);

        int tentativasRestantes = MAX_TENTATIVAS;
        int chuteDoUsuario = 0;

        Console.WriteLine($"\nEu pensei em um número entre {MIN_RANGE} e {MAX_RANGE}.");
        Console.WriteLine($"Você tem {MAX_TENTATIVAS} tentativas para acertar!");

        // ----------------------------------------------------
        // Lógica do Jogo: Laço 'While'
        // ----------------------------------------------------

        // O laço continua enquanto o usuário tiver tentativas e não acertar
        while (tentativasRestantes > 0 && chuteDoUsuario != numeroSecreto)
        {
            Console.WriteLine($"\nTentativas restantes: {tentativasRestantes}");

            // Lê e valida o chute do usuário
            chuteDoUsuario = LerChuteValido($"Seu chute ({MIN_RANGE}-{MAX_RANGE}): ", MIN_RANGE, MAX_RANGE);

            // Reduz as tentativas
            tentativasRestantes--;

            // Estrutura 'if/else if/else' para dar feedback
            if (chuteDoUsuario < numeroSecreto)
            {
                Console.WriteLine("⬆️ Seu chute é muito BAIXO! Tente um número MAIOR.");
            }
            else if (chuteDoUsuario > numeroSecreto)
            {
                Console.WriteLine("⬇️ Seu chute é muito ALTO! Tente um número MENOR.");
            }
        }

        // ----------------------------------------------------
        // Lógica de Fim de Jogo
        // ----------------------------------------------------

        if (chuteDoUsuario == numeroSecreto)
        {
            Console.WriteLine("\n🎉 PARABÉNS! Você acertou o número secreto!");
            Console.WriteLine($"O número era {numeroSecreto}. Você usou {MAX_TENTATIVAS - tentativasRestantes} tentativas.");
        }
        else
        {
            Console.WriteLine("\nGame Over! 😭 Suas tentativas acabaram.");
            Console.WriteLine($"O número secreto era: {numeroSecreto}");
        }

        Console.WriteLine("\nPressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    /// <summary>
    /// Lê e valida se a entrada é um número inteiro dentro do intervalo.
    /// </summary>
    public static int LerChuteValido(string prompt, int min, int max)
    {
        int chute;
        while (true)
        {
            Console.Write(prompt);

            if (int.TryParse(Console.ReadLine(), out chute) && chute >= min && chute <= max)
            {
                return chute;
            }
            Console.WriteLine($"❌ Erro: Entrada inválida. Digite um número inteiro entre {min} e {max}.");
        }
    }
}