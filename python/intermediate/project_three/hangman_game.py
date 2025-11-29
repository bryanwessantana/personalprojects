# Hangman Game:

# Python: A classic word guessing game. The game randomly selects a word, 
# and the player must guess it letter by letter. The game tracks correct 
# and incorrect guesses, displaying a progressively drawn "hangman" figure 
# for each wrong attempt.

# Front-end (Web): A visual interface that displays the word with missing 
# letters (e.g., "_ _ _ _"), a virtual keyboard for input, and dynamically 
# draws the hangman figure using SVG/CSS as the player makes mistakes.

# ------------------------------------------------------------------------------------------- #
import random
import os

# Lista de palavras para o jogo
WORDS = [
    "PYTHON", "DEVELOPER", "JAVASCRIPT", "COMPUTER", "ALGORITHM",
    "DATABASE", "NETWORK", "VARIABLE", "FUNCTION", "INTERFACE"
]

# Desenhos do boneco da forca (ASCII Art)
HANGMAN_PICS = [
    """
      +---+
      |   |
          |
          |
          |
          |
    =========""",
    """
      +---+
      |   |
      O   |
          |
          |
          |
    =========""",
    """
      +---+
      |   |
      O   |
      |   |
          |
          |
    =========""",
    """
      +---+
      |   |
      O   |
     /|   |
          |
          |
    =========""",
    """
      +---+
      |   |
      O   |
     /|\  |
          |
          |
    =========""",
    """
      +---+
      |   |
      O   |
     /|\  |
     /    |
          |
    =========""",
    """
      +---+
      |   |
      O   |
     /|\  |
     / \  |
          |
    ========="""
]

def clear_screen():
    """Limpa a tela do terminal."""
    os.system('cls' if os.name == 'nt' else 'clear')

def get_word():
    """Retorna uma palavra aleatória em maiúsculas."""
    return random.choice(WORDS).upper()

def display_game(missed_letters, correct_letters, secret_word):
    """Exibe o estado atual do jogo."""
    clear_screen()
    print("\n--- HANGMAN GAME (CLI) ---\n")
    
    # Exibe o desenho correspondente ao número de erros
    print(HANGMAN_PICS[len(missed_letters)])
    print()

    # Exibe as letras erradas
    print("Missed letters:", end=" ")
    for letter in missed_letters:
        print(letter, end=" ")
    print("\n")

    # Exibe a palavra secreta com máscaras
    blanks = "_" * len(secret_word)
    for i in range(len(secret_word)):
        if secret_word[i] in correct_letters:
            blanks = blanks[:i] + secret_word[i] + blanks[i+1:]

    # Exibe a palavra com espaços entre as letras (ex: P _ T H _ N)
    for letter in blanks:
        print(letter, end=" ")
    print("\n")

def get_guess(already_guessed):
    """Obtém e valida o palpite do jogador."""
    while True:
        guess = input("Guess a letter: ").upper()
        if len(guess) != 1:
            print("Please enter a single letter.")
        elif guess in already_guessed:
            print("You have already guessed that letter. Choose again.")
        elif not guess.isalpha():
            print("Please enter a LETTER.")
        else:
            return guess

def play_again():
    """Pergunta se o jogador quer jogar novamente."""
    return input("\nDo you want to play again? (yes/no): ").lower().startswith('y')

def run_cli():
    print("Welcome to Hangman!")
    missed_letters = ""
    correct_letters = ""
    secret_word = get_word()
    game_is_done = False

    while True:
        display_game(missed_letters, correct_letters, secret_word)

        # Recebe o palpite
        guess = get_guess(missed_letters + correct_letters)

        if guess in secret_word:
            correct_letters = correct_letters + guess

            # Verifica vitória
            found_all_letters = True
            for i in range(len(secret_word)):
                if secret_word[i] not in correct_letters:
                    found_all_letters = False
                    break
            if found_all_letters:
                display_game(missed_letters, correct_letters, secret_word)
                print(f"\nYes! The secret word is '{secret_word}'! You have won!")
                game_is_done = True
        else:
            missed_letters = missed_letters + guess

            # Verifica derrota (limite de 6 erros para 7 desenhos - índice 0 a 6)
            if len(missed_letters) == len(HANGMAN_PICS) - 1:
                display_game(missed_letters, correct_letters, secret_word)
                print(f"You have run out of guesses!\nAfter {len(missed_letters)} missed guesses and {len(correct_letters)} correct guesses, the word was '{secret_word}'")
                game_is_done = True

        if game_is_done:
            if play_again():
                missed_letters = ""
                correct_letters = ""
                game_is_done = False
                secret_word = get_word()
            else:
                break

if __name__ == "__main__":
    run_cli()