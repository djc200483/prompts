# Cyberpunk Blog Backend

A Node.js/Express backend API for the Cyberpunk Blog with PostgreSQL database integration.

## 🚀 Features

- **Blog Post Management**: CRUD operations for blog posts
- **Email Subscriptions**: Handle newsletter subscriptions
- **Admin Dashboard**: Secure admin interface with authentication
- **PostgreSQL Database**: Persistent data storage
- **API Security**: Rate limiting, CORS, and API key authentication
- **Railway Deployment**: Production-ready deployment configuration

## 📋 API Endpoints

### Blog Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create new post (requires API key)
- `PUT /api/posts/:id` - Update post (requires API key)
- `DELETE /api/posts/:id` - Delete post (requires API key)

### Subscriptions
- `POST /api/subscribe` - Subscribe to newsletter
- `DELETE /api/subscribe` - Unsubscribe from newsletter
- `GET /api/subscribe/count` - Get subscriber count

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/create` - Create new post form

### Health
- `GET /api/health` - Health check endpoint

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Admin Credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# API Security
API_KEY=your_random_api_key_here

# App Configuration
NODE_ENV=production
PORT=3000

# CORS Configuration
FRONTEND_DOMAIN=https://your-frontend-domain.com
```

## 🚂 Railway Deployment

### Prerequisites
1. Railway account
2. PostgreSQL database provisioned
3. Environment variables configured

### Deployment Steps
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Node.js project
3. Add environment variables in Railway dashboard
4. Deploy!

### Railway Configuration
- **Port**: 3000
- **Build Command**: `npm ci --only=production`
- **Start Command**: `npm start`
- **Database**: PostgreSQL (auto-provisioned)

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your local settings

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## 📊 Database Schema

### blog_posts
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR 255)
- `excerpt` (TEXT)
- `content` (TEXT)
- `category` (VARCHAR 100)
- `featured_image_url` (VARCHAR 500)
- `keywords` (TEXT)
- `slug` (VARCHAR 255 UNIQUE)
- `published` (BOOLEAN DEFAULT true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### subscribers
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR 255 UNIQUE)
- `subscribed_at` (TIMESTAMP)
- `active` (BOOLEAN DEFAULT true)

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific domains
- **Helmet.js**: Security headers
- **API Key Authentication**: Required for admin operations
- **Basic Auth**: Admin dashboard protection
- **Input Validation**: Express-validator for data validation

## 📝 Usage Examples

### Create a new blog post
```javascript
const response = await fetch('https://your-railway-url.railway.app/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    title: 'My New Post',
    content: 'Post content here...',
    category: 'AI Art',
    featured_image_url: 'https://example.com/image.jpg',
    keywords: 'ai, art, cyberpunk'
  })
});
```

### Subscribe to newsletter
```javascript
const response = await fetch('https://your-railway-url.railway.app/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure `DATABASE_URL` is correctly set
2. **CORS Errors**: Verify `FRONTEND_DOMAIN` matches your frontend URL
3. **API Key Issues**: Check that `API_KEY` is set and matches frontend
4. **Port Issues**: Railway uses `PORT` environment variable

### Logs
Check Railway logs for detailed error information:
```bash
railway logs
```

## 📞 Support

For issues or questions:
1. Check Railway deployment logs
2. Verify environment variables
3. Test API endpoints with curl or Postman
4. Check database connectivity

---

**Built with ❤️ for the Cyberpunk Blog**
