document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('.nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fetch and display blog posts
    const postsContainer = document.getElementById('posts-container');

    if (postsContainer) {
        // Check if we're on a static host (GitHub Pages)
        const isStaticHost = !/localhost|127\.0\.0\.1/.test(window.location.hostname);
        
        if (isStaticHost) {
            // On static hosting, show a message about blog functionality
            postsContainer.innerHTML = `
                <div class="post">
                    <h3>Blog Coming Soon</h3>
                    <p>The blog functionality requires a backend server. This static site showcases my portfolio and projects.</p>
                    <p>To see the full blog with dynamic posts, run the local server using <code>node server.js</code></p>
                </div>
            `;
        } else {
            // On local server, fetch posts normally
            fetch('/api/posts')
                .then(response => response.json())
                .then(data => {
                    if (data.posts && data.posts.length > 0) {
                        data.posts.forEach(post => {
                            const postElement = document.createElement('div');
                            postElement.classList.add('post');

                            const titleElement = document.createElement('h3');
                            titleElement.textContent = post.title;

                            const excerptElement = document.createElement('p');
                            excerptElement.textContent = post.excerpt;

                            postElement.appendChild(titleElement);
                            postElement.appendChild(excerptElement);

                            const readMoreLink = document.createElement('a');
                            readMoreLink.classList.add('post-read-more');
                            readMoreLink.href = `/posts/${post.id}`;
                            readMoreLink.textContent = 'Read More';
                            postElement.appendChild(readMoreLink);

                            postsContainer.appendChild(postElement);
                        });
                    } else {
                        postsContainer.innerHTML = '<p>No posts found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    postsContainer.innerHTML = '<p>Error fetching posts.</p>';
                });
        }
    }
});
