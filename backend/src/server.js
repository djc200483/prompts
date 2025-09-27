const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const blogRoutes = require('./routes/posts');
const subscribeRoutes = require('./routes/subscribe');
const adminRoutes = require('./routes/admin');
const { initializeDatabase } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'https://prompts.oddesthistory.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic auth for admin routes
const adminAuth = basicAuth({
  users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
  challenge: true,
  realm: 'Admin Area'
});

// Routes
app.use('/api/posts', blogRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/admin', adminAuth, adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cyberpunk Blog API',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
      subscribe: '/api/subscribe',
      admin: '/admin',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Check if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    } else {
      console.warn('⚠️ DATABASE_URL not found, server starting without database');
      console.log('ℹ️ Database will be initialized when DATABASE_URL is available');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 Admin panel: http://localhost:${PORT}/admin`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (!process.env.DATABASE_URL) {
        console.log('🔧 To connect database, set DATABASE_URL environment variable');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startServer, 5000);
  }
}

startServer();
