const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
const db = new sqlite3.Database('blog.db');

// Initialize database tables
db.serialize(() => {
    // Blog posts table
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author TEXT DEFAULT 'Likheet Shetty',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Subscribers table
    db.run(`CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        active INTEGER DEFAULT 1
    )`);
});

// Email configuration (you'll need to configure this with actual email credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Routes
// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all blog posts (latest first)
app.get('/api/posts', (req, res) => {
    db.all("SELECT * FROM posts ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// Get single blog post
app.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json({ post: row });
    });
});

// Create new blog post
app.post('/api/posts', (req, res) => {
    const { title, content, excerpt } = req.body;
    
    if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
    }
    
    // Generate excerpt if not provided
    const postExcerpt = excerpt || content.substring(0, 150) + '...';
    
    db.run("INSERT INTO posts (title, content, excerpt) VALUES (?, ?, ?)", 
           [title, content, postExcerpt], 
           function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const newPost = {
            id: this.lastID,
            title,
            content,
            excerpt: postExcerpt,
            author: 'Likheet Shetty',
            created_at: new Date().toISOString()
        };
        
        // Send notifications to subscribers
        notifySubscribers(newPost);
        
        res.json({ 
            message: 'Post created successfully', 
            post: newPost 
        });
    });
});

// Subscribe to newsletter
app.post('/api/subscribe', (req, res) => {
    const { email, name } = req.body;
    
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    
    db.run("INSERT INTO subscribers (email, name) VALUES (?, ?)", [email, name], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                res.status(400).json({ error: 'Email already subscribed' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        
        res.json({ message: 'Successfully subscribed to blog notifications!' });
        
        // Send welcome email
        sendWelcomeEmail(email, name);
    });
});

// Unsubscribe from newsletter
app.post('/api/unsubscribe', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    
    db.run("UPDATE subscribers SET active = 0 WHERE email = ?", [email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            res.status(404).json({ error: 'Email not found in subscribers' });
            return;
        }
        
        res.json({ message: 'Successfully unsubscribed from blog notifications' });
    });
});

// Admin route to serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Helper functions
async function notifySubscribers(post) {
    db.all("SELECT email, name FROM subscribers WHERE active = 1", async (err, subscribers) => {
        if (err || !subscribers.length) return;
        
        for (const subscriber of subscribers) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER || 'your-email@gmail.com',
                    to: subscriber.email,
                    subject: `New Blog Post: ${post.title}`,
                    html: `
                        <h2>New Blog Post from Likheet Shetty</h2>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}">Read the full post</a></p>
                        <hr>
                        <p><small>You're receiving this because you subscribed to Likheet's blog. 
                        <a href="${process.env.SITE_URL || 'http://localhost:3000'}">Unsubscribe</a></small></p>
                    `
                });
            } catch (error) {
                console.error('Error sending notification email:', error);
            }
        }
    });
}

async function sendWelcomeEmail(email, name) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: "Welcome to Likheet's Blog!",
            html: `
                <h2>Welcome to Likheet Shetty's Blog!</h2>
                <p>Hi ${name || 'there'}!</p>
                <p>Thank you for subscribing to my blog. You'll receive notifications whenever I publish new posts.</p>
                <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}">Visit the blog</a></p>
                <p>Best regards,<br>Likheet Shetty</p>
            `
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Blog server running on port ${PORT}`);
});