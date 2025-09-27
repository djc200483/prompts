const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../utils/database');
const { createSlug, ensureUniqueSlug } = require('../utils/slugify');
const { authenticateApiKey, validateBlogPost } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const postValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title must be 1-255 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('category').optional().trim().isLength({ max: 100 }).withMessage('Category max 100 characters'),
  body('featured_image_url').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('keywords').optional().trim().isLength({ max: 500 }).withMessage('Keywords max 500 characters'),
  body('published').optional().isBoolean().withMessage('Published must be boolean')
];

// GET /api/posts - Get all published posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE published = true';
    let params = [];
    
    if (category) {
      whereClause += ' AND category = $3';
      params = [limit, offset, category];
    } else {
      params = [limit, offset];
    }
    
    const sql = `
      SELECT id, title, excerpt, category, featured_image_url, keywords, slug, created_at
      FROM blog_posts 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await query(sql, params);
    
    // Get total count
    const countSql = `SELECT COUNT(*) FROM blog_posts ${whereClause}`;
    const countResult = await query(countSql, category ? [category] : []);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      posts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const sql = `
      SELECT id, title, excerpt, content, category, featured_image_url, keywords, slug, created_at, updated_at
      FROM blog_posts 
      WHERE slug = $1 AND published = true
    `;
    
    const result = await query(sql, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post (requires API key)
router.post('/', authenticateApiKey, postValidation, validateBlogPost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, excerpt, content, category, featured_image_url, keywords, published = true } = req.body;
    
    // Generate unique slug
    const baseSlug = createSlug(title);
    const existingSlugs = await query('SELECT slug FROM blog_posts WHERE slug LIKE $1', [`${baseSlug}%`]);
    const slugList = existingSlugs.rows.map(row => row.slug);
    const slug = ensureUniqueSlug(baseSlug, slugList);
    
    const sql = `
      INSERT INTO blog_posts (title, excerpt, content, category, featured_image_url, keywords, slug, published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, slug, created_at
    `;
    
    const result = await query(sql, [title, excerpt, content, category, featured_image_url, keywords, slug, published]);
    
    res.status(201).json({
      message: 'Post created successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id - Update post (requires API key)
router.put('/:id', authenticateApiKey, postValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { title, excerpt, content, category, featured_image_url, keywords, published } = req.body;
    
    // Check if post exists
    const existingPost = await query('SELECT slug FROM blog_posts WHERE id = $1', [id]);
    if (existingPost.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Generate new slug if title changed
    let slug = existingPost.rows[0].slug;
    if (title) {
      const baseSlug = createSlug(title);
      if (baseSlug !== slug) {
        const existingSlugs = await query('SELECT slug FROM blog_posts WHERE slug LIKE $1 AND id != $2', [`${baseSlug}%`, id]);
        const slugList = existingSlugs.rows.map(row => row.slug);
        slug = ensureUniqueSlug(baseSlug, slugList);
      }
    }
    
    const sql = `
      UPDATE blog_posts 
      SET title = COALESCE($2, title),
          excerpt = COALESCE($3, excerpt),
          content = COALESCE($4, content),
          category = COALESCE($5, category),
          featured_image_url = COALESCE($6, featured_image_url),
          keywords = COALESCE($7, keywords),
          slug = $8,
          published = COALESCE($9, published),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, title, slug, updated_at
    `;
    
    const result = await query(sql, [id, title, excerpt, content, category, featured_image_url, keywords, slug, published]);
    
    res.json({
      message: 'Post updated successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id - Delete post (requires API key)
router.delete('/:id', authenticateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING title', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({
      message: 'Post deleted successfully',
      title: result.rows[0].title
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
