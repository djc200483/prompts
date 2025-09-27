const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database initialization
async function initializeDatabase() {
  try {
    console.log('🔗 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Create tables if they don't exist
    await createTables(client);
    
    client.release();
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createTables(client) {
  const createBlogPostsTable = `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category VARCHAR(100),
      featured_image_url VARCHAR(500),
      keywords TEXT,
      slug VARCHAR(255) UNIQUE NOT NULL,
      published BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const createSubscribersTable = `
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      subscribed_at TIMESTAMP DEFAULT NOW(),
      active BOOLEAN DEFAULT true
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
  `;

  await client.query(createBlogPostsTable);
  await client.query(createSubscribersTable);
  await client.query(createIndexes);
}

// Database query helper
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { text: text.substring(0, 100), duration: `${duration}ms` });
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  initializeDatabase
};
