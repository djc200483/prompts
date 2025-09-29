const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../utils/database');
const emailService = require('../services/emailService');

const router = express.Router();

// Test endpoint to check if API is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Subscribe API is working',
    timestamp: new Date().toISOString(),
    resendConfigured: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL
  });
});

// Test endpoint to send a test email
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('🧪 Test email request for:', email);
    const result = await emailService.sendWelcomeEmail(email);
    
    res.json({
      message: 'Test email sent',
      result: result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Email validation
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// POST /api/subscribe - Subscribe to blog updates
router.post('/', emailValidation, async (req, res) => {
  try {
    console.log('📧 Subscribe request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;
    console.log('📧 Processing email:', email);
    
    // Check if email already exists
    const existingSubscriber = await query(
      'SELECT id, active FROM subscribers WHERE email = $1', 
      [email]
    );
    
    if (existingSubscriber.rows.length > 0) {
      const subscriber = existingSubscriber.rows[0];
      
      if (subscriber.active) {
        return res.status(409).json({ 
          error: 'Email already subscribed',
          message: 'This email is already subscribed to updates'
        });
      } else {
        // Reactivate subscription
        await query(
          'UPDATE subscribers SET active = true, subscribed_at = NOW() WHERE id = $1',
          [subscriber.id]
        );
        
        // Send welcome email for reactivated subscription
        try {
          await emailService.sendWelcomeEmail(email);
        } catch (emailError) {
          console.error('Failed to send welcome email for reactivated subscription:', emailError);
          // Don't fail the request if email fails
        }
        
        return res.json({
          message: 'Subscription reactivated successfully',
          email: email
        });
      }
    }
    
    // Create new subscription
    const result = await query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING id, subscribed_at',
      [email]
    );
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({
      message: 'Successfully subscribed to blog updates',
      email: email,
      subscribedAt: result.rows[0].subscribed_at
    });
    
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// DELETE /api/subscribe - Unsubscribe from blog updates
router.delete('/', emailValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;
    
    const result = await query(
      'UPDATE subscribers SET active = false WHERE email = $1 AND active = true RETURNING id',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Subscription not found',
        message: 'Email not found in active subscriptions'
      });
    }
    
    res.json({
      message: 'Successfully unsubscribed',
      email: email
    });
    
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// GET /api/subscribe/count - Get subscriber count (public endpoint)
router.get('/count', async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM subscribers WHERE active = true'
    );
    
    res.json({
      subscriberCount: parseInt(result.rows[0].count)
    });
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    res.status(500).json({ error: 'Failed to get subscriber count' });
  }
});

// POST /api/subscribe/notify - Send blog post notification (requires API key)
router.post('/notify', async (req, res) => {
  try {
    const { postId } = req.body;
    
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }
    
    // Get the blog post
    const postResult = await query(
      'SELECT * FROM blog_posts WHERE id = $1 AND published = true',
      [postId]
    );
    
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Published post not found' });
    }
    
    const post = postResult.rows[0];
    
    // Get all active subscribers
    const subscribersResult = await query(
      'SELECT email FROM subscribers WHERE active = true'
    );
    
    if (subscribersResult.rows.length === 0) {
      return res.json({ 
        message: 'No active subscribers to notify',
        subscriberCount: 0
      });
    }
    
    // Send notification email
    const emailResult = await emailService.sendBlogPostNotification(post, subscribersResult.rows);
    
    if (emailResult.success) {
      res.json({
        message: 'Blog post notification sent successfully',
        subscriberCount: subscribersResult.rows.length,
        postTitle: post.title
      });
    } else {
      res.status(500).json({
        error: 'Failed to send notification email',
        details: emailResult.error
      });
    }
    
  } catch (error) {
    console.error('Error sending blog post notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
