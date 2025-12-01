# Kanban Board (Trello Style):

# Python/DB: Manages task "cards" and "columns" (To Do, In Progress, 
# Done). The key feature is allowing users to drag and drop the 
# cards between columns.

# Front-end: Intensive use of JavaScript to implement the Drag and 
# Drop functionality and send dynamic updates via AJAX or API to 
# the Python back-end.

# ------------------------------------------------------------------------------------------- #
import time

class KanbanBoard:
    def __init__(self):
        # Estrutura de dados: Dicionário de Listas
        self.board = {
            "1": [], # A Fazer (To Do)
            "2": [], # Em Progresso (Doing)
            "3": [], # Feito (Done)
        }
        self.colunas_nomes = {"1": "A FAZER", "2": "EM PROGRESSO", "3": "CONCLUÍDO"}

    def adicionar_tarefa(self, tarefa):
        # Tarefas novas sempre vão para a coluna 1
        self.board["1"].append(tarefa)
        print(f"📌 Tarefa '{tarefa}' adicionada em 'A FAZER'.")

    def mover_tarefa(self, nome_tarefa, origem_id, destino_id):
        # 1. Validação
        if origem_id not in self.board or destino_id not in self.board:
            print("❌ Coluna inválida.")
            return

        coluna_origem = self.board[origem_id]
        coluna_destino = self.board[destino_id]

        # 2. Verifica se a tarefa existe na origem
        if nome_tarefa in coluna_origem:
            # 3. A LÓGICA DO DRAG & DROP (Backend version)
            coluna_origem.remove(nome_tarefa) # Remove de onde estava
            coluna_destino.append(nome_tarefa) # Adiciona onde deve ir
            print(f"🚀 Movido: '{nome_tarefa}' -> {self.colunas_nomes[destino_id]}")
        else:
            print(f"❌ Tarefa '{nome_tarefa}' não encontrada na coluna de origem.")

    def mostrar_board(self):
        print("\n" + "="*40)
        for id_col, tarefas in self.board.items():
            nome = self.colunas_nomes[id_col]
            print(f"| {id_col}. {nome} ({len(tarefas)})")
            if not tarefas:
                print("|    (vazio)")
            for t in tarefas:
                print(f"|    ◻ {t}")
            print("-" * 40)
        print("="*40 + "\n")

# --- Interface ---
sistema = KanbanBoard()

while True:
    sistema.mostrar_board()
    print("1. Nova Tarefa")
    print("2. Mover Tarefa")
    print("3. Sair")
    opcao = input("Opção: ")

    if opcao == '1':
        t = input("Nome da tarefa: ")
        sistema.adicionar_tarefa(t)
    
    elif opcao == '2':
        # Simula o ato de "Pegar" e "Soltar"
        origem = input("Mover da coluna (1, 2, 3): ")
        tarefa = input("Qual o nome da tarefa? ")
        destino = input("Para qual coluna (1, 2, 3)? ")
        sistema.mover_tarefa(tarefa, origem, destino)

    elif opcao == '3':
        print('Saindo...')
        break