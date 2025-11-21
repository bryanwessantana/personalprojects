# 📝 In-Memory To-Do List

# This project is crucial for understanding how to manage state on the 
# server side without a database, and how to handle multiple actions 
# (Add, Delete) using forms that post data back to Python.

# Key Components

# - Python/Flask:
#     - Use a global Python list (e.g., tasks = []) to store the to-do items.
#     - The main route will handle both displaying the list and receiving new 
#     tasks (POST).
#     - Logic to append a new item to the list.
#     - Logic to remove an item (usually by its index/ID passed via the form).
# - HTML: 
#     - A form to input a new task.
#     - An unordered or ordered list (<ul> or <ol>) to display the current tasks.
#     - For each task, include a small form with a 'Delete' button that sends 
#     the task's ID/index back to the server.
# - CSS:
#     - Simple layout to make the tasks readable.

# Suggested Implementation Steps

# 1. Initialize List: Define an empty list tasks = [] in your app.py.

# 2. Display Logic: The main route renders the template, passing the tasks list. 
# The template iterates over this list, displaying each task and its 
# corresponding delete button/form.

# 3. Add Task: The POST request receives the new task text, appends it to the 
# global tasks list, and then redirects back to the main route to show 
# the updated list.

# 4. Delete Task: The POST request for deletion receives the index of the task 
# to be deleted. Use the Python list's pop() method to remove the item 
# at that index. Then, redirect back to the main route.

# ------------------------------------------------------------------------------------------- #
def add_task(todo_list, task):
    """Adiciona uma nova tarefa à lista."""
    task = task.strip()
    if task:
        todo_list.append({"id": len(todo_list) + 1, "task": task, "done": False})
        print(f"Task '{task}' added with ID {todo_list[-1]['id']}.")
    else:
        print("Task description cannot be empty.")

def view_tasks(todo_list):
    """Exibe todas as tarefas com seus status."""
    if not todo_list:
        print("\nYour to-do list is empty! Enjoy your free time.")
        return

    print("\n--- TO-DO LIST ---")
    for item in todo_list:
        status = "[X]" if item["done"] else "[ ]"
        print(f"{status} ID {item['id']}: {item['task']}")
    print("------------------")

def mark_done(todo_list, task_id):
    """Marca uma tarefa como concluída pelo ID."""
    try:
        task_id = int(task_id)
        for item in todo_list:
            if item["id"] == task_id:
                item["done"] = True
                print(f"Task ID {task_id} marked as done.")
                return
        print(f"Error: Task with ID {task_id} not found.")
    except ValueError:
        print("Error: Invalid ID. Please enter a number.")

def run_cli():
    """Função principal para rodar no terminal."""
    
    todo_list = [] 
    
    print("\n--- IN-MEMORY TO-DO LIST (CLI) ---")
    
    while True:
        print("\nCommands: add, view, done, quit")
        choice = input("Enter command: ").strip().lower()

        if choice == 'add':
            task = input("Enter task description: ")
            add_task(todo_list, task)
        
        elif choice == 'view':
            view_tasks(todo_list)
            
        elif choice == 'done':
            task_id = input("Enter the ID of the task to mark as done: ")
            mark_done(todo_list, task_id)
            
        elif choice == 'quit':
            print("Exiting application. All tasks are lost.")
            break
            
        else:
            print("Invalid command.")

if __name__ == '__main__':
    run_cli()