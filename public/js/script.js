// Main JavaScript for blog functionality
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupEventListeners();
});

// Load and display blog posts
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        const postsContainer = document.getElementById('posts-container');
        
        if (!data.posts || data.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <p>No blog posts yet. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        const postsHTML = data.posts.map(post => `
            <article class="post-card" onclick="openPost(${post.id})">
                <div class="post-content">
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.excerpt || post.content.substring(0, 150) + '...')}</p>
                    <div class="post-meta">
                        <span class="author">By ${escapeHtml(post.author)}</span> • 
                        <span class="date">${formatDate(post.created_at)}</span>
                    </div>
                </div>
            </article>
        `).join('');
        
        postsContainer.innerHTML = postsHTML;
        
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-container').innerHTML = `
            <div class="error-message">
                <p>Error loading posts. Please try again later.</p>
            </div>
        `;
    }
}

// Open post in modal
async function openPost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();
        
        if (!data.post) {
            alert('Post not found');
            return;
        }
        
        const post = data.post;
        const modalContent = document.getElementById('modal-post-content');
        
        modalContent.innerHTML = `
            <h3>${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                <span class="author">By ${escapeHtml(post.author)}</span> • 
                <span class="date">${formatDate(post.created_at)}</span>
                ${post.updated_at !== post.created_at ? 
                    `• <span class="updated">Updated ${formatDate(post.updated_at)}</span>` : ''}
            </div>
            <div class="post-text">${formatPostContent(post.content)}</div>
        `;
        
        document.getElementById('post-modal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading post:', error);
        alert('Error loading post. Please try again.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Subscription form
    const subscriptionForm = document.getElementById('subscription-form');
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', handleSubscription);
    }
    
    // Modal close button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closePostModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('post-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePostModal();
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle subscription form submission
async function handleSubscription(e) {
    e.preventDefault();
    
    const name = document.getElementById('subscriber-name').value.trim();
    const email = document.getElementById('subscriber-email').value.trim();
    const messageDiv = document.getElementById('subscription-message');
    
    if (!email) {
        showMessage(messageDiv, 'Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageDiv, data.message, 'success');
            document.getElementById('subscription-form').reset();
        } else {
            showMessage(messageDiv, data.error || 'Subscription failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Subscription error:', error);
        showMessage(messageDiv, 'Network error. Please check your connection and try again.', 'error');
    }
}

// Unsubscribe function
async function unsubscribe() {
    const email = prompt('Enter your email address to unsubscribe:');
    if (!email) return;
    
    try {
        const response = await fetch('/api/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error || 'Unsubscribe failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Unsubscribe error:', error);
        alert('Network error. Please try again later.');
    }
}

// Scroll to subscribe section
function scrollToSubscribe() {
    document.getElementById('subscribe').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Close post modal
function closePostModal() {
    document.getElementById('post-modal').style.display = 'none';
}

// Utility functions
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
        day: 'numeric'
    });
}

function formatPostContent(content) {
    // Convert line breaks to paragraphs
    return content
        .split('\n\n')
        .map(paragraph => `<p>${escapeHtml(paragraph.trim())}</p>`)
        .join('');
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closePostModal();
    }
});