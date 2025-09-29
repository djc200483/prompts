const { Resend } = require('resend');

// Initialize Resend only if API key is available
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️ RESEND_API_KEY not found. Email functionality will be disabled.');
}

class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@prompts.oddesthistory.com';
  }

  // Send welcome email to new subscribers
  async sendWelcomeEmail(email) {
    console.log('📧 Attempting to send welcome email to:', email);
    
    if (!resend) {
      console.warn('⚠️ Resend not initialized. Skipping welcome email.');
      return { success: false, error: 'Email service not configured' };
    }
    
    console.log('✅ Resend initialized, proceeding with email send');

    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'Welcome to Cyber Blog! 🚀',
        html: this.getWelcomeEmailTemplate(email)
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
      }

      console.log('Welcome email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error);
      return { success: false, error: error.message };
    }
  }

  // Send blog post notification to all subscribers
  async sendBlogPostNotification(post, subscribers) {
    if (!resend) {
      console.warn('Resend not initialized. Skipping blog post notification.');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: subscribers.map(sub => sub.email),
        subject: `New Blog Post: ${post.title}`,
        html: this.getBlogPostNotificationTemplate(post)
      });

      if (error) {
        console.error('Error sending blog post notification:', error);
        return { success: false, error };
      }

      console.log('Blog post notification sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error in sendBlogPostNotification:', error);
      return { success: false, error: error.message };
    }
  }

  // Welcome email template
  getWelcomeEmailTemplate(email) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Cyber Blog</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #000;
          }
          .container {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 12px;
            padding: 40px;
            border: 1px solid #a855f7;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: #a855f7;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          .subtitle {
            color: #9ca3af;
            font-size: 1.1rem;
          }
          .content {
            color: #e5e7eb;
            margin-bottom: 30px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #a855f7, #ec4899);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
            color: #9ca3af;
            font-size: 0.9rem;
            text-align: center;
          }
          .unsubscribe {
            margin-top: 20px;
            font-size: 0.8rem;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CYBER BLOG</div>
            <div class="subtitle">AI Art & Tech Insights</div>
          </div>
          
          <div class="content">
            <h2>Welcome to the Future! 🚀</h2>
            <p>Thanks for subscribing to Cyber Blog! You're now part of our community of AI art enthusiasts and tech innovators.</p>
            
            <p>You'll receive:</p>
            <ul>
              <li>🎨 Latest AI art trends and techniques</li>
              <li>🤖 Cutting-edge tech insights</li>
              <li>💡 Exclusive prompt engineering tips</li>
              <li>📱 Updates on new blog posts</li>
            </ul>
            
            <p>Ready to dive in? Check out our latest content:</p>
            <a href="https://prompts.oddesthistory.com/blog" class="cta-button">Explore Blog</a>
          </div>
          
          <div class="footer">
            <p>© 2024 Prompt Generator created by OddestHistory_</p>
            <p>Follow us on <a href="https://x.com/OddestHistory_" style="color: #a855f7;">X</a></p>
            <div class="unsubscribe">
              <p>Don't want these emails? <a href="https://prompts.oddesthistory.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #666;">Unsubscribe here</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Blog post notification template
  getBlogPostNotificationTemplate(post) {
    const postUrl = `https://prompts.oddesthistory.com/blog/${post.slug}`;
    const featuredImage = post.featured_image_url ? 
      `<img src="${post.featured_image_url}" alt="${post.title}" style="width: 100%; max-width: 500px; height: 200px; object-fit: cover; border-radius: 8px; margin: 20px 0;">` : 
      `<div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 20px 0;">${post.category || 'Blog Post'}</div>`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Blog Post: ${post.title}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #000;
          }
          .container {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 12px;
            padding: 40px;
            border: 1px solid #a855f7;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #a855f7;
            margin-bottom: 10px;
          }
          .post-title {
            color: #e5e7eb;
            font-size: 1.8rem;
            margin: 20px 0;
            line-height: 1.3;
          }
          .post-excerpt {
            color: #9ca3af;
            font-size: 1.1rem;
            margin: 20px 0;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #a855f7, #ec4899);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
            color: #9ca3af;
            font-size: 0.9rem;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CYBER BLOG</div>
            <p style="color: #9ca3af;">New Blog Post Alert</p>
          </div>
          
          <h1 class="post-title">${post.title}</h1>
          
          ${featuredImage}
          
          <p class="post-excerpt">${post.excerpt || 'Check out this new blog post!'}</p>
          
          <a href="${postUrl}" class="cta-button">Read Full Post</a>
          
          <div class="footer">
            <p>© 2024 Prompt Generator created by OddestHistory_</p>
            <p>Follow us on <a href="https://x.com/OddestHistory_" style="color: #a855f7;">X</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
