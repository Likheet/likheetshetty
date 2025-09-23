// Blog data storage (using localStorage for persistence)
class BlogStorage {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem('blogPosts')) {
            localStorage.setItem('blogPosts', JSON.stringify([]));
        }
        if (!localStorage.getItem('subscribers')) {
            localStorage.setItem('subscribers', JSON.stringify([]));
        }
    }

    getPosts() {
        return JSON.parse(localStorage.getItem('blogPosts') || '[]');
    }

    savePosts(posts) {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }

    addPost(post) {
        const posts = this.getPosts();
        post.id = Date.now().toString();
        post.date = new Date().toISOString();
        posts.unshift(post); // Add to beginning
        this.savePosts(posts);
        return post;
    }

    deletePost(id) {
        const posts = this.getPosts();
        const filteredPosts = posts.filter(post => post.id !== id);
        this.savePosts(filteredPosts);
    }

    getSubscribers() {
        return JSON.parse(localStorage.getItem('subscribers') || '[]');
    }

    saveSubscribers(subscribers) {
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }

    addSubscriber(email) {
        const subscribers = this.getSubscribers();
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            this.saveSubscribers(subscribers);
            return true;
        }
        return false;
    }
}

// Initialize storage
const blogStorage = new BlogStorage();

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Blog post rendering
function renderBlogPosts() {
    const posts = blogStorage.getPosts();
    const postsContainer = document.getElementById('postsContainer');
    const noPosts = document.getElementById('noPosts');

    if (!postsContainer) return;

    if (posts.length === 0) {
        postsContainer.style.display = 'none';
        if (noPosts) noPosts.style.display = 'block';
        return;
    }

    if (noPosts) noPosts.style.display = 'none';
    postsContainer.style.display = 'grid';

    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            ${post.image ? `<img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">` : ''}
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span>Published on ${formatDate(post.date)}</span>
                </div>
                <p class="post-excerpt">${truncateText(post.content, 150)}</p>
                <a href="post.html?id=${post.id}" class="post-link">Read more →</a>
            </div>
        </article>
    `).join('');
}

// Subscription handling
function handleSubscription(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('subscribeMessage', 'Please enter a valid email address.', 'error');
        return;
    }

    const added = blogStorage.addSubscriber(email);
    
    if (added) {
        showMessage('subscribeMessage', 'Successfully subscribed! You\'ll receive notifications about new blog posts.', 'success');
        emailInput.value = '';
    } else {
        showMessage('subscribeMessage', 'You are already subscribed to our newsletter.', 'error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Render blog posts on home page
    renderBlogPosts();

    // Setup subscription form
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscription);
    }

    // Check for individual post page
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId && window.location.pathname.includes('post.html')) {
        renderIndividualPost(postId);
    }
});

// Individual post rendering
function renderIndividualPost(postId) {
    const posts = blogStorage.getPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h1>Post Not Found</h1>
                <p>The blog post you're looking for doesn't exist.</p>
                <a href="index.html">← Back to Home</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${post.title} - Likheet Shetty's Blog`;

    // Render post content
    const mainContent = document.querySelector('.main .container');
    if (mainContent) {
        mainContent.innerHTML = `
            <article class="post-full">
                <header class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span>Published on ${formatDate(post.date)}</span>
                    </div>
                </header>
                
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
                
                <div class="post-content">
                    ${post.content.split('\n').map(paragraph => 
                        paragraph.trim() ? `<p>${paragraph}</p>` : ''
                    ).join('')}
                </div>
                
                <footer class="post-footer">
                    <a href="index.html" class="btn btn-primary">← Back to Home</a>
                </footer>
            </article>
        `;
    }
}

// Admin functionality
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminContent = document.getElementById('adminContent');
    const loginForm = document.getElementById('loginForm');

    if (isAdmin && adminContent) {
        adminContent.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
        loadAdminData();
    } else if (loginForm) {
        loginForm.style.display = 'block';
        if (adminContent) adminContent.style.display = 'none';
    }
}

function adminLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    // Simple password check (in real app, use proper authentication)
    if (password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        checkAdminAuth();
        showMessage('loginMessage', 'Login successful!', 'success');
    } else {
        showMessage('loginMessage', 'Invalid password.', 'error');
    }
}

function adminLogout() {
    localStorage.removeItem('isAdmin');
    checkAdminAuth();
}

function createPost(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImage').value.trim();
    
    if (!title || !content) {
        showMessage('postMessage', 'Please fill in all required fields.', 'error');
        return;
    }
    
    const post = {
        title,
        content,
        image: image || null
    };
    
    blogStorage.addPost(post);
    
    // Clear form
    document.getElementById('postForm').reset();
    
    // Show success message
    showMessage('postMessage', 'Blog post created successfully!', 'success');
    
    // Reload admin data
    loadAdminData();
    
    // Notify subscribers (simulate email notification)
    notifySubscribers(post);
}

function loadAdminData() {
    const posts = blogStorage.getPosts();
    const subscribers = blogStorage.getSubscribers();
    
    // Update stats
    const postsCount = document.getElementById('postsCount');
    const subscribersCount = document.getElementById('subscribersCount');
    
    if (postsCount) postsCount.textContent = posts.length;
    if (subscribersCount) subscribersCount.textContent = subscribers.length;
    
    // Load posts list
    const postsList = document.getElementById('postsList');
    if (postsList) {
        postsList.innerHTML = posts.map(post => `
            <div class="admin-post-item">
                <h4>${post.title}</h4>
                <p>Published: ${formatDate(post.date)}</p>
                <button onclick="deletePost('${post.id}')" class="btn btn-danger">Delete</button>
            </div>
        `).join('');
    }
    
    // Load subscribers list
    const subscribersList = document.getElementById('subscribersList');
    if (subscribersList) {
        subscribersList.innerHTML = subscribers.map(email => `
            <div class="subscriber-item">
                <span>${email}</span>
            </div>
        `).join('');
    }
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        blogStorage.deletePost(id);
        loadAdminData();
        showMessage('adminMessage', 'Post deleted successfully!', 'success');
    }
}

function notifySubscribers(post) {
    const subscribers = blogStorage.getSubscribers();
    
    // Simulate email notification
    console.log(`📧 Notification sent to ${subscribers.length} subscribers:`);
    console.log(`New blog post: "${post.title}"`);
    
    // In a real application, you would integrate with an email service
    // like SendGrid, Mailchimp, or similar
    
    showMessage('postMessage', 
        `Post created and ${subscribers.length} subscribers notified!`, 
        'success'
    );
}