# Likheet Shetty's Blog Website

A simple, elegant blog website built with vanilla HTML, CSS, and JavaScript. Features a clean design, subscription functionality, and an admin panel for managing blog posts.

## Features

### 🏠 Public Website
- **Clean, responsive design** with gradient hero section
- **Blog post listing** with card-based layout
- **Individual post pages** with full content display
- **Email subscription** system for blog notifications
- **Mobile-responsive** design that works on all devices

### 👤 Admin Panel
- **Secure login** system (password: `admin123`)
- **Dashboard** with subscriber and post statistics
- **Create new posts** with title, content, and optional featured images
- **Manage existing posts** with delete functionality
- **View all subscribers** who signed up for notifications
- **Automatic notifications** to subscribers when new posts are published

### 🔧 Technical Features
- **Client-side data storage** using localStorage
- **No backend required** - runs entirely in the browser
- **SEO-friendly** URLs with proper page titles
- **Error handling** for missing posts and invalid data
- **Image support** for featured post images

## Getting Started

### Running the Website

1. Clone or download this repository
2. Start a local web server in the project directory:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Admin Access

1. Navigate to `/admin.html` or click the "Admin" link in the header
2. Log in with password: `admin123`
3. Start creating and managing your blog posts!

## File Structure

```
├── index.html          # Homepage with blog posts and subscription
├── admin.html          # Admin panel for managing the blog
├── post.html           # Individual blog post page
├── styles.css          # All CSS styles for the website
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Usage Guide

### For Blog Visitors
- Visit the homepage to read the latest blog posts
- Subscribe with your email to get notified about new posts
- Click "Read more" on any post to view the full content
- Use the navigation to go back to the homepage

### For Blog Authors (Admin)
1. **Login**: Go to the admin page and enter the password
2. **Create Posts**: Fill out the form with:
   - Title (required)
   - Featured image URL (optional)
   - Content (required)
3. **Publish**: Click "Publish Post" to make it live
4. **Manage**: View, and delete posts from the admin dashboard
5. **Monitor**: Check subscriber count and manage your audience

## Customization

### Changing the Design
- Edit `styles.css` to modify colors, fonts, and layout
- Update the hero section in `index.html` with your own messaging
- Replace "Likheet Shetty" with your own name throughout the files

### Changing the Admin Password
- Open `script.js` and find the `adminLogin` function
- Change `'admin123'` to your desired password

### Adding Features
The modular structure makes it easy to add:
- More blog post fields (tags, categories, etc.)
- Comment systems
- Social media sharing
- Search functionality
- RSS feeds

## Browser Compatibility

This website works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Storage

The blog uses browser localStorage to store:
- Blog posts with title, content, image, date, and ID
- Email subscriber list
- Admin authentication status

**Note**: Data is stored locally in each browser. For production use, consider integrating with a backend service.

## Future Enhancements

Potential improvements for production use:
- Backend integration for persistent data storage
- Email service integration (SendGrid, Mailchimp, etc.)
- User authentication and multiple admin accounts
- Rich text editor for post creation
- Image upload functionality
- SEO optimizations and meta tags
- Analytics integration
- Comment system
- Social media sharing buttons

## License

This project is open source and available under the MIT License.