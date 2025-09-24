// Admin panel JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    setupAdminEventListeners();
    loadAdminPosts();
});

// Setup event listeners for admin panel
function setupAdminEventListeners() {
    // Post creation form
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmission);
    }
}

// Handle new post submission
async function handlePostSubmission(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value.trim();
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const messageDiv = document.getElementById('admin-message');
    
    if (!title || !content) {
        showAdminMessage(messageDiv, 'Title and content are required.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, excerpt, content })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAdminMessage(messageDiv, 'Post published successfully!', 'success');
            document.getElementById('post-form').reset();
            loadAdminPosts(); // Refresh posts list
        } else {
            showAdminMessage(messageDiv, data.error || 'Failed to publish post. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Post creation error:', error);
        showAdminMessage(messageDiv, 'Network error. Please check your connection and try again.', 'error');
    }
}

// Load posts for admin management
async function loadAdminPosts() {
    try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        const postsContainer = document.getElementById('admin-posts-list');
        
        if (!data.posts || data.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <p>No blog posts yet. Create your first post above!</p>
                </div>
            `;
            return;
        }
        
        const postsHTML = data.posts.map(post => `
            <div class="admin-post-item">
                <h4>${escapeHtml(post.title)}</h4>
                <p>${escapeHtml(post.excerpt || post.content.substring(0, 200) + '...')}</p>
                <div class="post-date">
                    Created: ${formatDate(post.created_at)}
                    ${post.updated_at !== post.created_at ? 
                        `• Updated: ${formatDate(post.updated_at)}` : ''}
                </div>
            </div>
        `).join('');
        
        postsContainer.innerHTML = postsHTML;
        
    } catch (error) {
        console.error('Error loading admin posts:', error);
        document.getElementById('admin-posts-list').innerHTML = `
            <div class="error-message">
                <p>Error loading posts. Please try again later.</p>
            </div>
        `;
    }
}

// Utility functions for admin
function showAdminMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Auto-resize textareas
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});

// Keyboard shortcuts for admin
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit post
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const postForm = document.getElementById('post-form');
        if (postForm && document.activeElement.tagName === 'TEXTAREA') {
            e.preventDefault();
            postForm.dispatchEvent(new Event('submit'));
        }
    }
});