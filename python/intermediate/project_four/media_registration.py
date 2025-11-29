# Book/Movie Registration System:

# Python/DB: Allows registering items with multiple fields 
# (title, year, author/director, etc.) and searching/filtering 
# these items.

# Front-end: Detailed forms for registration and a listing page 
# with filters (e.g., filter by year or author).

# ------------------------------------------------------------------------------------------- #
import sqlite3
import os

# Nome do arquivo do banco de dados
DB_NAME = "media_library.db"

def connect_db():
    """Conecta ao banco de dados SQLite e retorna a conexão."""
    return sqlite3.connect(DB_NAME)

def create_table():
    """Cria a tabela 'media' se ela não existir."""
    conn = connect_db()
    cursor = conn.cursor()
    
    # Criação da tabela com colunas para ID, título, criador, ano, categoria e nota
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            creator TEXT NOT NULL,
            year INTEGER,
            category TEXT,
            rating REAL
        )
    ''')
    
    conn.commit()
    conn.close()

def add_item(title, creator, year, category, rating):
    """Insere um novo registro no banco de dados."""
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO media (title, creator, year, category, rating)
            VALUES (?, ?, ?, ?, ?)
        ''', (title, creator, year, category, rating))
        conn.commit()
        print(f"\n✅ Sucesso: '{title}' adicionado à biblioteca.")
    except sqlite3.Error as e:
        print(f"\n❌ Erro ao adicionar: {e}")
    finally:
        conn.close()

def list_items(filter_col=None, filter_val=None):
    """Lista itens, opcionalmente filtrando por uma coluna específica."""
    conn = connect_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM media"
    params = []
    
    if filter_col and filter_val:
        # Nota: Em produção, validar filter_col para evitar SQL Injection é crucial.
        # Aqui, assumimos uso interno seguro.
        if filter_col == 'creator':
            query += " WHERE creator LIKE ?"
            params.append(f"%{filter_val}%")
        elif filter_col == 'year':
            query += " WHERE year = ?"
            params.append(filter_val)
        
    cursor.execute(query, params)
    items = cursor.fetchall()
    conn.close()
    
    if not items:
        print("\n📭 Nenhum item encontrado.")
        return

    print(f"\n--- BIBLIOTECA DE MÍDIA ({len(items)} itens) ---")
    # Formatação de colunas para tabela no terminal
    print(f"{'ID':<4} | {'Título':<30} | {'Autor/Diretor':<20} | {'Ano':<6} | {'Nota':<4}")
    print("-" * 80)
    
    for item in items:
        # item é uma tupla: (id, title, creator, year, category, rating)
        print(f"{item[0]:<4} | {item[1][:28]:<30} | {item[2][:18]:<20} | {item[3]:<6} | {item[5]}")
    print("-" * 80)

def delete_item(item_id):
    """Remove um item pelo seu ID único."""
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM media WHERE id = ?", (item_id,))
    
    if cursor.rowcount > 0:
        print(f"\n🗑️ Item ID {item_id} deletado.")
    else:
        print(f"\n⚠️ Item ID {item_id} não encontrado.")
        
    conn.commit()
    conn.close()

# --- Funções Auxiliares de Input ---

def get_valid_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Por favor, digite um número inteiro válido.")

def get_valid_float(prompt):
    while True:
        try:
            val = float(input(prompt))
            if 0 <= val <= 10:
                return val
            print("A nota deve ser entre 0 e 10.")
        except ValueError:
            print("Por favor, digite um número decimal (ex: 8.5).")

def run_cli():
    create_table() # Inicialização
    
    print("\n📚 SISTEMA DE CADASTRO DE MÍDIA (SQLite) 🎬")
    
    while True:
        print("\nMENU PRINCIPAL:")
        print("1. Listar Tudo")
        print("2. Adicionar Novo Item")
        print("3. Filtrar por Autor/Diretor")
        print("4. Filtrar por Ano")
        print("5. Deletar Item")
        print("0. Sair")
        
        choice = input("\nEscolha uma opção: ").strip()
        
        if choice == '1':
            list_items()
            
        elif choice == '2':
            print("\n--- Novo Registro ---")
            title = input("Título: ")
            creator = input("Autor ou Diretor: ")
            year = get_valid_int("Ano de Lançamento: ")
            category = input("Categoria (Livro, Filme, Série): ")
            rating = get_valid_float("Avaliação (0-10): ")
            add_item(title, creator, year, category, rating)
            
        elif choice == '3':
            author = input("Digite o nome (ou parte) para buscar: ")
            list_items(filter_col='creator', filter_val=author)
            
        elif choice == '4':
            year = get_valid_int("Digite o ano para filtrar: ")
            list_items(filter_col='year', filter_val=year)
            
        elif choice == '5':
            list_items() # Mostra a lista para facilitar a escolha do ID
            item_id = get_valid_int("Digite o ID do item para deletar: ")
            delete_item(item_id)
            
        elif choice == '0':
            print("Encerrando sistema...")
            break
        else:
            print("Opção inválida, tente novamente.")

if __name__ == '__main__':
    run_cli()