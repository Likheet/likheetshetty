# Likheet Shetty's Personal Blog

A simple, elegant blog website built with Node.js and Express, featuring user subscription functionality and email notifications.

## 🚀 Features

- **Simple Blog Interface**: Clean, responsive design for reading blog posts
- **Admin Panel**: Easy-to-use interface for creating and managing blog posts
- **Subscription System**: Users can subscribe to get email notifications for new posts
- **Email Notifications**: Automatic email notifications sent to subscribers when new posts are published
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **SQLite Database**: Lightweight database for storing posts and subscribers
- **Modal Post View**: Click on any post to read it in a beautiful modal overlay

## 📸 Screenshots

### Homepage
![Homepage](https://github.com/user-attachments/assets/947843bc-1395-4a3f-99b4-972dabc2e447)

### Admin Panel
![Admin Panel](https://github.com/user-attachments/assets/deba5a17-6069-4777-b56d-2f0fc9d4998c)

### Blog with Posts and Subscription
![Blog with Posts](https://github.com/user-attachments/assets/3c9b0211-b843-4aac-8bee-33f06ec561e4)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Likheet/likheetshetty.git
   cd likheetshetty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your email settings:
   ```env
   PORT=3000
   NODE_ENV=development
   SITE_URL=http://localhost:3000
   
   # Email Configuration (for notifications)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the blog**
   - Main blog: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## 📧 Email Configuration

For email notifications to work, you need to configure your email settings:

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use your Gmail address as `EMAIL_USER`
4. Use the app password as `EMAIL_PASS`

### Other Email Providers
You can modify the email transporter configuration in `server.js` to use other email services like SendGrid, Outlook, etc.

## 🎯 Usage

### For Blog Visitors
1. Visit the homepage to read blog posts
2. Click on any post to read the full content in a modal
3. Subscribe to get email notifications for new posts
4. Use the unsubscribe link if you want to stop receiving notifications

### For Blog Administrator (Likheet)
1. Visit `/admin` to access the admin panel
2. Create new blog posts with title, excerpt (optional), and content
3. View all published posts in the admin panel
4. New posts automatically trigger email notifications to subscribers

## 🗄️ Database Structure

The application uses SQLite with two main tables:

### Posts Table
- `id` - Auto-incrementing primary key
- `title` - Post title
- `content` - Post content
- `excerpt` - Optional post excerpt
- `author` - Author name (defaults to "Likheet Shetty")
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Subscribers Table
- `id` - Auto-incrementing primary key
- `email` - Subscriber email (unique)
- `name` - Subscriber name (optional)
- `subscribed_at` - Subscription timestamp
- `active` - Subscription status (1 for active, 0 for unsubscribed)

## 🎨 Customization

### Styling
- Main styles: `public/css/style.css`
- Admin styles: `public/css/admin.css`

### Frontend Logic
- Main functionality: `public/js/script.js`
- Admin functionality: `public/js/admin.js`

### Server Configuration
- Main server file: `server.js`
- Modify routes, email templates, or database structure as needed

## 🚀 Deployment

### Environment Variables for Production
Set the following environment variables:
- `NODE_ENV=production`
- `SITE_URL=https://your-domain.com`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-app-password`

### Database
The SQLite database (`blog.db`) will be created automatically on first run.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ About

Created by **Likheet Shetty** as a personal blog platform with subscription functionality.

---

**Happy Blogging! 📝✨**