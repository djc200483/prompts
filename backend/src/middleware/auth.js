// API Key authentication middleware
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
}

// Validate request body for blog posts
function validateBlogPost(req, res, next) {
  const { title, content, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['title', 'content']
    });
  }
  
  if (title.length > 255) {
    return res.status(400).json({ error: 'Title too long (max 255 characters)' });
  }
  
  if (category && category.length > 100) {
    return res.status(400).json({ error: 'Category too long (max 100 characters)' });
  }
  
  next();
}

module.exports = {
  authenticateApiKey,
  validateBlogPost
};
