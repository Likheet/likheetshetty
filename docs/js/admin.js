document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const adminMessage = document.getElementById('admin-message');
    const postsList = document.getElementById('admin-posts-list');

    const showMessage = (message, type) => {
        adminMessage.textContent = message;
        adminMessage.className = `message ${type}`;
        adminMessage.style.display = 'block';
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 3000);
    };

    // If this site is served from a static host (GitHub Pages), disable admin POST functionality
    const isStaticHost = !/localhost|127\.0\.0\.1/.test(window.location.hostname);
    if (isStaticHost) {
        // Disable form and show a persistent notice
        const submitBtn = postForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        adminMessage.style.display = 'block';
        adminMessage.className = 'message warning';
        adminMessage.textContent = 'Admin functions are disabled on static hosting (GitHub Pages). To publish posts, run the server (server.js) on a host and use the API endpoints.';
        // Don't proceed with fetching or form handling that expects an API
        return;
    }

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            postsList.innerHTML = '';
            if (data.posts && data.posts.length > 0) {
                data.posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h2 class="post-title">${post.title}</h2>
                        <p class="post-excerpt">${post.excerpt}</p>
                    `;
                    postsList.appendChild(postElement);
                });
            } else {
                postsList.innerHTML = '<p>No posts found.</p>';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsList.innerHTML = '<p>Error fetching posts.</p>';
        }
    };

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value.trim();
        const excerpt = document.getElementById('post-excerpt').value.trim();
        const content = document.getElementById('post-content').value.trim();

        if (!title || !content) {
            showMessage('Title and content are required.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, excerpt, content }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage('Post created successfully!', 'success');
                postForm.reset();
                fetchPosts();
            } else {
                showMessage(data.error || 'An error occurred.', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showMessage('An error occurred.', 'error');
        }
    });

    fetchPosts();
});
