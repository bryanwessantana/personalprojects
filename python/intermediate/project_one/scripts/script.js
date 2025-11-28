/* --- JAVASCRIPT LOGIC (CRUD on browser memory) --- */
        
// Mock Database in JavaScript memory
let posts = [
    { id: 1, title: "Welcome to the Mock Blog", content: "This is the first post. You can edit or delete it!", author: "Admin", date: "2025-01-01" },
    { id: 2, title: "CRUD Operations", content: "Create, Read, Update, Delete are the fundamentals of any database app.", author: "Bryan", date: new Date().toISOString().substring(0, 10) }
];
// Determine the next available ID
let nextId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
let currentEditingId = null;

// --- RENDER FUNCTION (READ) ---
function renderPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // Clear existing posts

    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d;">No posts yet. Create one above!</p>';
        return;
    }

    // Sort posts by ID descending (newest first)
    posts.sort((a, b) => b.id - a.id);

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';
        
        card.innerHTML = `
            <h3>${post.title} (ID: ${post.id})</h3>
            <div class="post-meta">By ${post.author} on ${post.date}</div>
            <p>${post.content}</p>
            <div class="post-actions" style="text-align: right;">
                <button class="edit-btn" onclick="showEditForm(${post.id})">Edit</button>
                <button class="delete-btn" onclick="handleDeletePost(${post.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- CREATE OPERATION ---
function handleCreatePost() {
    const title = document.getElementById('title-input').value.trim();
    const content = document.getElementById('content-input').value.trim();
    const author = document.getElementById('author-input').value.trim() || "Guest";

    if (!title || !content) {
        // We use alert() here only because the scope is simple JS app in the browser
        alert("Title and content are required!"); 
        return;
    }

    const newPost = {
        id: nextId++,
        title: title,
        content: content,
        author: author,
        date: new Date().toISOString().substring(0, 10)
    };

    posts.push(newPost);
    renderPosts();

    // Clear form fields
    document.getElementById('title-input').value = '';
    document.getElementById('content-input').value = '';
    document.getElementById('author-input').value = '';
}

// --- UPDATE OPERATIONS ---
function showEditForm(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    // Populate and show edit form
    document.getElementById('editing-id').textContent = id;
    document.getElementById('edit-title-input').value = post.title;
    document.getElementById('edit-content-input').value = post.content;
    
    currentEditingId = id;
    document.getElementById('edit-form-container').style.display = 'block';
    document.getElementById('create-form').style.display = 'none'; // Hide create form
}

function hideEditForm() {
    currentEditingId = null;
    document.getElementById('edit-form-container').style.display = 'none';
    document.getElementById('create-form').style.display = 'block'; // Show create form
}

function handleUpdatePost() {
    if (currentEditingId === null) return;
    
    const newTitle = document.getElementById('edit-title-input').value.trim();
    const newContent = document.getElementById('edit-content-input').value.trim();

    if (!newTitle || !newContent) {
        alert("Title and content cannot be empty.");
        return;
    }

    const postIndex = posts.findIndex(p => p.id === currentEditingId);
    if (postIndex !== -1) {
        posts[postIndex].title = newTitle;
        posts[postIndex].content = newContent;
        posts[postIndex].date = new Date().toISOString().substring(0, 10); // Update modification date
    }

    hideEditForm();
    renderPosts();
}

// --- DELETE OPERATION ---
function handleDeletePost(id) {
    // We use confirm() here as a mock, though a custom modal is preferred in production
    if (confirm(`Are you sure you want to delete Post ID ${id}?`)) {
        // Filter the array to keep only posts whose ID does not match the target ID
        posts = posts.filter(post => post.id !== id);
        renderPosts();
    }
}

// Initialize the view on page load
document.addEventListener('DOMContentLoaded', renderPosts);