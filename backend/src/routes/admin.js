const express = require('express');
const { query } = require('../utils/database');

const router = express.Router();

// GET /admin - Admin dashboard
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cyberpunk Blog Admin</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Courier New', monospace; 
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #00ffff; 
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: rgba(0, 255, 255, 0.05);
                border: 1px solid #00ffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            }
            h1 { 
                text-align: center; 
                margin-bottom: 30px; 
                text-shadow: 0 0 10px #00ffff;
                font-size: 2.5em;
            }
            .stats { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 20px; 
                margin-bottom: 30px; 
            }
            .stat-card { 
                background: rgba(0, 255, 255, 0.1); 
                border: 1px solid #00ffff; 
                border-radius: 8px; 
                padding: 20px; 
                text-align: center;
                transition: all 0.3s ease;
            }
            .stat-card:hover { 
                transform: translateY(-5px); 
                box-shadow: 0 5px 20px rgba(0, 255, 255, 0.4);
            }
            .stat-number { 
                font-size: 2em; 
                font-weight: bold; 
                color: #00ff00; 
                text-shadow: 0 0 10px #00ff00;
            }
            .stat-label { 
                margin-top: 10px; 
                opacity: 0.8; 
            }
            .actions { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 20px; 
            }
            .action-card { 
                background: rgba(0, 255, 255, 0.05); 
                border: 1px solid #00ffff; 
                border-radius: 8px; 
                padding: 20px; 
                text-align: center;
                transition: all 0.3s ease;
            }
            .action-card:hover { 
                background: rgba(0, 255, 255, 0.1); 
                transform: translateY(-3px);
            }
            .action-title { 
                font-size: 1.2em; 
                margin-bottom: 10px; 
                color: #00ff00;
            }
            .action-description { 
                margin-bottom: 15px; 
                opacity: 0.8; 
                font-size: 0.9em;
            }
            .btn { 
                display: inline-block; 
                background: linear-gradient(45deg, #00ffff, #0080ff); 
                color: #000; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
            }
            .btn:hover { 
                background: linear-gradient(45deg, #00ff00, #00ffff); 
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            }
            .recent-posts { 
                margin-top: 30px; 
            }
            .post-item { 
                background: rgba(0, 255, 255, 0.05); 
                border: 1px solid #00ffff; 
                border-radius: 5px; 
                padding: 15px; 
                margin-bottom: 10px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
            }
            .post-title { 
                font-weight: bold; 
                color: #00ff00;
            }
            .post-date { 
                opacity: 0.7; 
                font-size: 0.9em;
            }
            .loading { 
                text-align: center; 
                padding: 20px; 
                opacity: 0.7;
            }
            .error { 
                color: #ff4444; 
                text-align: center; 
                padding: 20px;
            }
            @media (max-width: 768px) {
                .container { padding: 20px; }
                h1 { font-size: 2em; }
                .stats { grid-template-columns: 1fr; }
                .actions { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Cyberpunk Blog Admin</h1>
            
            <div class="stats" id="stats">
                <div class="stat-card">
                    <div class="stat-number" id="total-posts">-</div>
                    <div class="stat-label">Total Posts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="published-posts">-</div>
                    <div class="stat-label">Published Posts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="subscribers">-</div>
                    <div class="stat-label">Subscribers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="categories">-</div>
                    <div class="stat-label">Categories</div>
                </div>
            </div>
            
            <div class="actions">
                <div class="action-card">
                    <div class="action-title">📝 Create New Post</div>
                    <div class="action-description">Write and publish a new blog post</div>
                    <button class="btn" onclick="window.open('/admin/create', '_blank')">Create Post</button>
                </div>
                <div class="action-card">
                    <div class="action-title">📊 View Analytics</div>
                    <div class="action-description">Check blog performance and stats</div>
                    <button class="btn" onclick="alert('Analytics coming soon!')">View Analytics</button>
                </div>
                <div class="action-card">
                    <div class="action-title">👥 Manage Subscribers</div>
                    <div class="action-description">View and manage email subscribers</div>
                    <button class="btn" onclick="window.open('/admin/subscribers', '_blank')">Manage Subscribers</button>
                </div>
                <div class="action-card">
                    <div class="action-title">🔧 API Documentation</div>
                    <div class="action-description">View API endpoints and usage</div>
                    <button class="btn" onclick="window.open('/api', '_blank')">API Docs</button>
                </div>
            </div>
            
            <div class="recent-posts">
                <h2 style="margin-bottom: 20px; color: #00ff00;">📰 Recent Posts</h2>
                <div id="recent-posts-list">
                    <div class="loading">Loading recent posts...</div>
                </div>
            </div>
        </div>

        <script>
            async function loadStats() {
                try {
                    // Load posts stats
                    const postsResponse = await fetch('/api/posts?limit=1000');
                    const postsData = await postsResponse.json();
                    
                    const totalPosts = postsData.posts.length;
                    const publishedPosts = postsData.posts.filter(post => post.published).length;
                    const categories = new Set(postsData.posts.map(post => post.category).filter(Boolean)).size;
                    
                    // Load subscriber count
                    const subscribersResponse = await fetch('/api/subscribe/count');
                    const subscribersData = await subscribersResponse.json();
                    
                    // Update stats display
                    document.getElementById('total-posts').textContent = totalPosts;
                    document.getElementById('published-posts').textContent = publishedPosts;
                    document.getElementById('subscribers').textContent = subscribersData.subscriberCount;
                    document.getElementById('categories').textContent = categories;
                    
                    // Update recent posts
                    const recentPosts = postsData.posts.slice(0, 5);
                    const postsList = document.getElementById('recent-posts-list');
                    
                    if (recentPosts.length === 0) {
                        postsList.innerHTML = '<div class="loading">No posts found. <a href="/admin/create" style="color: #00ffff;">Create your first post!</a></div>';
                    } else {
                        postsList.innerHTML = recentPosts.map(post => \`
                            <div class="post-item">
                                <div>
                                    <div class="post-title">\${post.title}</div>
                                    <div class="post-date">\${new Date(post.created_at).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <button class="btn" onclick="window.open('/admin/edit/\${post.id}', '_blank')">Edit</button>
                                </div>
                            </div>
                        \`).join('');
                    }
                    
                } catch (error) {
                    console.error('Error loading stats:', error);
                    document.getElementById('recent-posts-list').innerHTML = '<div class="error">Failed to load recent posts</div>';
                }
            }
            
            // Load stats on page load
            loadStats();
            
            // Refresh stats every 30 seconds
            setInterval(loadStats, 30000);
        </script>
    </body>
    </html>
  `);
});

// GET /admin/create - Create new post page
router.get('/create', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create New Post - Cyberpunk Blog Admin</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Courier New', monospace; 
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #00ffff; 
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: rgba(0, 255, 255, 0.05);
                border: 1px solid #00ffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            }
            h1 { 
                text-align: center; 
                margin-bottom: 30px; 
                text-shadow: 0 0 10px #00ffff;
                font-size: 2em;
            }
            .form-group { 
                margin-bottom: 20px; 
            }
            label { 
                display: block; 
                margin-bottom: 5px; 
                color: #00ff00; 
                font-weight: bold;
            }
            input, textarea, select { 
                width: 100%; 
                padding: 10px; 
                background: rgba(0, 0, 0, 0.5); 
                border: 1px solid #00ffff; 
                border-radius: 5px; 
                color: #00ffff; 
                font-family: inherit;
            }
            input:focus, textarea:focus, select:focus { 
                outline: none; 
                border-color: #00ff00; 
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            .btn { 
                background: linear-gradient(45deg, #00ffff, #0080ff); 
                color: #000; 
                padding: 12px 24px; 
                border: none; 
                border-radius: 5px; 
                font-weight: bold; 
                cursor: pointer;
                transition: all 0.3s ease;
                margin-right: 10px;
            }
            .btn:hover { 
                background: linear-gradient(45deg, #00ff00, #00ffff); 
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
            }
            .btn-secondary { 
                background: linear-gradient(45deg, #666, #888); 
                color: #fff;
            }
            .btn-secondary:hover { 
                background: linear-gradient(45deg, #888, #aaa); 
            }
            .success { 
                color: #00ff00; 
                background: rgba(0, 255, 0, 0.1); 
                border: 1px solid #00ff00; 
                padding: 15px; 
                border-radius: 5px; 
                margin-bottom: 20px;
            }
            .error { 
                color: #ff4444; 
                background: rgba(255, 68, 68, 0.1); 
                border: 1px solid #ff4444; 
                padding: 15px; 
                border-radius: 5px; 
                margin-bottom: 20px;
            }
            .loading { 
                color: #00ffff; 
                text-align: center; 
                padding: 20px;
            }
            
            .editor-toolbar {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
                flex-wrap: wrap;
            }
            
            .editor-toolbar button {
                padding: 8px 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid #00ffff;
                border-radius: 4px;
                color: #00ffff;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .editor-toolbar button:hover {
                background: rgba(0, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .rich-editor {
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                background: rgba(255, 255, 255, 0.05) !important;
                color: #e5e7eb !important;
                min-height: 200px;
                padding: 15px;
                border-radius: 5px;
                line-height: 1.6;
            }
            
            .rich-editor:focus {
                outline: none;
                border-color: #00ff00 !important;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3) !important;
            }
            .back-link { 
                display: inline-block; 
                color: #00ffff; 
                text-decoration: none; 
                margin-bottom: 20px;
                padding: 8px 16px;
                border: 1px solid #00ffff;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            .back-link:hover { 
                background: rgba(0, 255, 255, 0.1); 
                color: #00ff00;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/admin" class="back-link">← Back to Admin</a>
            <h1>📝 Create New Post</h1>
            
            <div id="message"></div>
            
            <form id="post-form">
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="excerpt">Excerpt</label>
                    <textarea id="excerpt" name="excerpt" rows="3" placeholder="Brief description of the post..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="content">Content *</label>
                    <div class="editor-toolbar">
                        <button type="button" onclick="formatText('bold')" title="Bold">B</button>
                        <button type="button" onclick="formatText('italic')" title="Italic">I</button>
                        <button type="button" onclick="formatText('underline')" title="Underline">U</button>
                        <button type="button" onclick="formatText('insertUnorderedList')" title="Bullet List">•</button>
                        <button type="button" onclick="formatText('insertOrderedList')" title="Numbered List">1.</button>
                        <button type="button" onclick="formatText('formatBlock', 'h2')" title="Heading 2">H2</button>
                        <button type="button" onclick="formatText('formatBlock', 'h3')" title="Heading 3">H3</button>
                        <button type="button" onclick="formatText('formatBlock', 'blockquote')" title="Quote">"</button>
                        <button type="button" onclick="formatText('formatBlock', 'pre')" title="Code Block">&lt;/&gt;</button>
                    </div>
                    <div id="content" class="rich-editor" contenteditable="true" style="min-height: 200px; border: 1px solid #ccc; padding: 10px; background: white; color: black;" placeholder="Write your blog post content here..."></div>
                </div>
                
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" name="category">
                        <option value="">Select Category</option>
                        <option value="AI Art">AI Art</option>
                        <option value="Cyberpunk">Cyberpunk</option>
                        <option value="Technology">Technology</option>
                        <option value="Tutorials">Tutorials</option>
                        <option value="News">News</option>
                        <option value="Reviews">Reviews</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="featured_image_url">Featured Image URL</label>
                    <input type="url" id="featured_image_url" name="featured_image_url" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="form-group">
                    <label for="keywords">Keywords (comma-separated)</label>
                    <input type="text" id="keywords" name="keywords" placeholder="ai art, cyberpunk, technology">
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="published" name="published" checked> Publish immediately
                    </label>
                </div>
                
                <button type="submit" class="btn">🚀 Create Post</button>
                <button type="button" class="btn btn-secondary" onclick="window.location.href='/admin'">Cancel</button>
                <button type="button" class="btn" onclick="testForm()" style="background: #ff6600;">Test Form</button>
            </form>
        </div>

        <script>
            // Test function
            function testForm() {
                console.log('Test button clicked!');
                alert('Test button works! Check console for form data.');
                
                const title = document.getElementById('title').value;
                const content = document.getElementById('content').innerHTML;
                console.log('Current form data:', { title, content });
            }
            
            // Rich text editor functions
            function formatText(command, value = null) {
                document.execCommand(command, false, value);
                document.getElementById('content').focus();
            }
            
            // Update toolbar button states
            function updateToolbar() {
                const buttons = document.querySelectorAll('.editor-toolbar button');
                buttons.forEach(button => {
                    const command = button.getAttribute('onclick').match(/formatText\('([^']+)'/)[1];
                    if (document.queryCommandState(command)) {
                        button.style.background = 'rgba(0, 255, 0, 0.3)';
                        button.style.color = '#00ff00';
                    } else {
                        button.style.background = 'rgba(0, 255, 255, 0.1)';
                        button.style.color = '#00ffff';
                    }
                });
            }
            
            // Add event listeners for toolbar updates
            document.addEventListener('DOMContentLoaded', function() {
                const editor = document.getElementById('content');
                if (editor) {
                    editor.addEventListener('input', updateToolbar);
                    editor.addEventListener('selectionchange', updateToolbar);
                    
                    // Keyboard shortcuts
                    editor.addEventListener('keydown', function(e) {
                        if (e.ctrlKey || e.metaKey) {
                            switch(e.key) {
                                case 'b':
                                    e.preventDefault();
                                    formatText('bold');
                                    break;
                                case 'i':
                                    e.preventDefault();
                                    formatText('italic');
                                    break;
                                case 'u':
                                    e.preventDefault();
                                    formatText('underline');
                                    break;
                            }
                        }
                    });
                }
            });
            
            document.getElementById('post-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Form submitted!');
                
                const title = document.getElementById('title').value;
                const excerpt = document.getElementById('excerpt').value;
                const content = document.getElementById('content').innerHTML;
                const category = document.getElementById('category').value;
                const featured_image_url = document.getElementById('featured_image_url').value;
                const keywords = document.getElementById('keywords').value;
                const published = document.getElementById('published').checked;
                
                console.log('Form data:', { title, excerpt, content, category, featured_image_url, keywords, published });
                
                const data = {
                    title: title,
                    excerpt: excerpt,
                    content: content,
                    category: category,
                    featured_image_url: featured_image_url,
                    keywords: keywords,
                    published: published
                };
                
                const messageDiv = document.getElementById('message');
                messageDiv.innerHTML = '<div class="loading">Creating post...</div>';
                
                try {
                    const response = await fetch('/api/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Key': prompt('Enter API Key:')
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        messageDiv.innerHTML = \`
                            <div class="success">
                                ✅ Post created successfully!<br>
                                Title: \${result.post.title}<br>
                                Slug: \${result.post.slug}
                            </div>
                        \`;
                        e.target.reset();
                    } else {
                        messageDiv.innerHTML = \`
                            <div class="error">
                                ❌ Error: \${result.error || 'Failed to create post'}
                            </div>
                        \`;
                    }
                } catch (error) {
                    messageDiv.innerHTML = \`
                        <div class="error">
                            ❌ Network error: \${error.message}
                        </div>
                    \`;
                }
            });
        </script>
    </body>
    </html>
  `);
});

module.exports = router;
