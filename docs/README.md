# GitHub Pages Site

This folder contains the GitHub Pages version of Likheet Shetty's portfolio and blog.

## What's Different from the Main Site

- **Static Hosting**: This version is designed for GitHub Pages (static hosting)
- **No Backend**: The blog functionality shows a "Coming Soon" message since there's no Node.js server
- **Admin Panel**: Disabled on static hosting with a helpful message

## Local Development

To test this static site locally:

```bash
cd docs
python -m http.server 8080
```

Then visit http://localhost:8080

## GitHub Pages Setup

1. Push changes to your `main` branch
2. Go to Repository Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select `main` branch and `/docs` folder
5. Save and wait for deployment

Your site will be available at: `https://likheet.github.io/likheetshetty/`

## Full Functionality

For the complete blog with posting capabilities, run the main server:

```bash
cd ..  # Go back to root directory
npm install
node server.js
```

Then visit http://localhost:3000 for the full-featured site.