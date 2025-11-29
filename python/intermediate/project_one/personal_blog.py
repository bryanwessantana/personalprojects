# Simple Personal Blog (with CRUD):

# Python/DB: Implements CRUD operations 
# (Create, Read, Update, Delete) for blog posts using a database 
# (e.g., Flask-SQLAlchemy or Django ORM).

# Front-end: Pages to list posts, view a full post, and a 
# protected form to create/edit posts.

# ------------------------------------------------------------------------------------------- #
import sys
from datetime import datetime

# Simula o banco de dados como uma lista na memória
# Mock Database in memory as a list of dictionaries
POSTS = [
    {
        "id": 1,
        "title": "My First Post on Python",
        "content": "Python is a versatile language, perfect for starting web development.",
        "author": "Bryan",
        "date": "2025-01-01"
    },
    {
        "id": 2,
        "title": "Understanding CRUD Operations",
        "content": "Create, Read, Update, Delete are the fundamentals of any database application.",
        "author": "Bryan",
        "date": "2025-02-15"
    }
]

# Variável para rastrear o próximo ID disponível
next_id = len(POSTS) + 1

# --- Operações CRUD ---

def create_post(title, content, author="Guest"):
    """Cria um novo post e o adiciona ao nosso 'Mock DB'."""
    global next_id
    
    if not title or not content:
        print("ERROR: Title and content cannot be empty.")
        return

    new_post = {
        "id": next_id,
        "title": title.strip(),
        "content": content.strip(),
        "author": author.strip(),
        "date": datetime.now().strftime("%Y-%m-%d") # Formato AAAA-MM-DD
    }
    POSTS.append(new_post)
    next_id += 1
    print(f"\nSUCCESS: Post '{title}' created with ID {new_post['id']}.")

def read_posts():
    """Lê e exibe todos os posts de forma formatada."""
    if not POSTS:
        print("\n--- No Posts Yet ---")
        return
        
    print("\n--- ALL BLOG POSTS ---")
    # Exibe os mais recentes primeiro
    sorted_posts = sorted(POSTS, key=lambda p: p['id'], reverse=True)

    for post in sorted_posts:
        print(f"ID: {post['id']} | Title: {post['title']}")
        print(f"   Author: {post['author']} | Date: {post['date']}")
        # Exibe um snippet (os primeiros 80 caracteres)
        print(f"   Content Snippet: {post['content'][:80]}...")
        print("-" * 35)

def update_post(post_id, new_title=None, new_content=None):
    """Atualiza o título ou conteúdo de um post existente."""
    try:
        post_id = int(post_id)
        found = False
        
        for post in POSTS:
            if post['id'] == post_id:
                if new_title:
                    post['title'] = new_title.strip()
                if new_content:
                    post['content'] = new_content.strip()
                post['date'] = datetime.now().strftime("%Y-%m-%d") # Atualiza a data de modificação
                found = True
                break
        
        if found:
            print(f"\nSUCCESS: Post ID {post_id} updated.")
        else:
            print(f"ERROR: Post ID {post_id} not found.")
            
    except ValueError:
        print("ERROR: Invalid ID. Please enter a number.")

def delete_post(post_id):
    """Deleta um post pelo ID."""
    global POSTS
    initial_length = len(POSTS)
    
    try:
        post_id = int(post_id)
        # Filtra a lista, removendo o post com o ID correspondente
        POSTS = [post for post in POSTS if post['id'] != post_id]
        
        if len(POSTS) < initial_length:
            print(f"\nSUCCESS: Post ID {post_id} deleted.")
        else:
            print(f"ERROR: Post ID {post_id} not found.")
            
    except ValueError:
        print("ERROR: Invalid ID. Please enter a number.")

# --- Interface CLI ---

def run_cli():
    print("\n--- BLOG POST MANAGER (MOCK DB CLI) ---")
    
    while True:
        print("\nCommands: view, create, update, delete, quit")
        choice = input("Enter command: ").strip().lower()

        if choice == 'view':
            read_posts()
        
        elif choice == 'create':
            title = input("Enter new post title: ")
            content = input("Enter post content: ")
            author = input("Enter author name (optional): ") or "Bryan"
            create_post(title, content, author)
        
        elif choice == 'update':
            read_posts()
            post_id = input("Enter ID of post to update: ")
            new_title = input("Enter new title (or leave blank): ")
            new_content = input("Enter new content (or leave blank): ")
            if new_title or new_content:
                update_post(post_id, new_title, new_content)
            else:
                print("No changes specified.")
        
        elif choice == 'delete':
            read_posts()
            post_id = input("Enter ID of post to delete: ")
            # Confirmação antes de deletar
            if input(f"Confirm deletion of ID {post_id}? (y/n): ").lower() == 'y':
                delete_post(post_id)
            
        elif choice == 'quit':
            print("Exiting application. Mock data lost.")
            break
            
        else:
            print("Invalid command.")

if __name__ == '__main__':
    run_cli()