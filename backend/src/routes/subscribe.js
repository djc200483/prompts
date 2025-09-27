const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../utils/database');

const router = express.Router();

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;
    
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

module.exports = router;
