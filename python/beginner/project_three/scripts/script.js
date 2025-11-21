/* --- JAVASCRIPT LOGIC (State Management in memory) --- */
        
let tasks = []; // The "In-Memory" storage array
let nextId = 1;

function renderTasks() {
    const listElement = document.getElementById('todo-list');
    listElement.innerHTML = ''; // Clear existing list

    if (tasks.length === 0) {
        document.getElementById('empty-message').style.display = 'block';
        return;
    }
    document.getElementById('empty-message').style.display = 'none';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.id = `task-${task.id}`;
        listItem.classList.toggle('done', task.done);

    // Task Text (Clickable to mark as done/undone)
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    taskText.onclick = () => toggleDone(task.id);

    // Actions (Delete button)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
                
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;'; // 'x' symbol
    deleteButton.onclick = () => deleteTask(task.id);
                
    actionsDiv.appendChild(deleteButton);
    
    listItem.appendChild(taskText);
    listItem.appendChild(actionsDiv);
    listElement.appendChild(listItem);
    });
}
        
function addTask(event) {
    event.preventDefault();
    const inputElement = document.getElementById('task-input');
    const taskText = inputElement.value.trim();

    if (taskText) {
        tasks.push({
            id: nextId++,
            text: taskText,
            done: false
        });
        inputElement.value = ''; // Clear input field
        renderTasks();
    }
}
        
function toggleDone(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].done = !tasks[taskIndex].done;
        renderTasks();
    }
}

function deleteTask(id) {
    // Filter out the task with the matching id
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', renderTasks);