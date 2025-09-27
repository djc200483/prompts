// Blog Manager - Simple utility to manage blog posts
// This file helps you manage your blog posts programmatically

class BlogManager {
    constructor() {
        this.blogPosts = [
            {
                id: 1,
                title: "The Future of AI Art: Beyond Simple Prompts",
                excerpt: "Explore how advanced prompt engineering techniques are revolutionizing digital art creation and what this means for artists.",
                date: "2024-01-15",
                category: "AI Art",
                image: "linear-gradient(135deg, #667eea, #764ba2)",
                filename: "the-future-of-ai-art"
            },
            {
                id: 2,
                title: "Cyberpunk Aesthetics in Modern Design",
                excerpt: "How the cyberpunk movement influences contemporary design trends and what makes this aesthetic so compelling.",
                date: "2024-01-12",
                category: "Design",
                image: "linear-gradient(135deg, #f093fb, #f5576c)",
                filename: "cyberpunk-aesthetics-modern-design"
            },
            {
                id: 3,
                title: "Mastering Midjourney: Advanced Prompt Techniques",
                excerpt: "Deep dive into professional prompt crafting techniques that will elevate your AI-generated artwork to the next level.",
                date: "2024-01-10",
                category: "Tutorial",
                image: "linear-gradient(135deg, #4facfe, #00f2fe)",
                filename: "mastering-midjourney-advanced-prompt-techniques"
            },
            {
                id: 4,
                title: "The Psychology of Neon: Why Cyberpunk Resonates",
                excerpt: "Understanding the psychological impact of neon aesthetics and how it shapes our perception of the future.",
                date: "2024-01-08",
                category: "Psychology",
                image: "linear-gradient(135deg, #43e97b, #38f9d7)",
                filename: "psychology-neon-cyberpunk-resonates"
            },
            {
                id: 5,
                title: "Building Your AI Art Portfolio",
                excerpt: "Practical tips for creating a compelling portfolio that showcases your AI-generated artwork effectively.",
                date: "2024-01-05",
                category: "Career",
                image: "linear-gradient(135deg, #fa709a, #fee140)",
                filename: "building-ai-art-portfolio"
            },
            {
                id: 6,
                title: "The Ethics of AI-Generated Art",
                excerpt: "Exploring the complex ethical landscape surrounding AI art creation and its implications for the creative industry.",
                date: "2024-01-03",
                category: "Ethics",
                image: "linear-gradient(135deg, #a8edea, #fed6e3)",
                filename: "ethics-ai-generated-art"
            }
        ];
    }

    // Add a new blog post
    addPost(postData) {
        const newPost = {
            id: Date.now(),
            title: postData.title,
            excerpt: postData.excerpt,
            date: postData.date,
            category: postData.category,
            image: postData.image || "linear-gradient(135deg, #667eea, #764ba2)",
            filename: this.generateFilename(postData.title)
        };
        
        this.blogPosts.unshift(newPost); // Add to beginning
        return newPost;
    }

    // Generate filename from title
    generateFilename(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Get all posts
    getAllPosts() {
        return this.blogPosts;
    }

    // Get posts for blog index (without filename)
    getPostsForIndex() {
        return this.blogPosts.map(post => {
            const { filename, ...postWithoutFilename } = post;
            return postWithoutFilename;
        });
    }

    // Generate blog index JavaScript code
    generateBlogIndexCode() {
        const posts = this.getPostsForIndex();
        return `// Blog posts array for blog/index.html
const blogPosts = ${JSON.stringify(posts, null, 4)};`;
    }

    // Generate new post HTML template
    generatePostHTML(postData, imageUrl = '') {
        const imageHTML = imageUrl ? `<img src="${imageUrl}" alt="${postData.title}" class="post-featured-image">` : '';
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title} | Cyberpunk Blog</title>
    <meta name="description" content="${postData.excerpt}">
    <meta name="keywords" content="${postData.keywords || ''}">
    <link rel="icon" type="image/png" href="../favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        /* CSS styles from blog-post-template.html */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Bebas Neue', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            color: #e5e7eb;
            line-height: 1.6;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }

        body::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 255, 255, 0.02) 2px,
                    rgba(255, 255, 255, 0.02) 4px
                );
            pointer-events: none;
            z-index: -1;
        }

        .top-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            padding: 0;
        }

        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
        }

        .logo {
            color: #00ff88;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.8rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-decoration: none;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        }

        .nav-links {
            display: flex;
            gap: 24px;
        }

        .nav-link {
            color: #e5e7eb;
            text-decoration: none;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.1rem;
            font-weight: 400;
            letter-spacing: 0.05em;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .nav-link:hover {
            color: #00ff88;
            background: rgba(0, 255, 136, 0.1);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .nav-link.active {
            color: #00ff88;
            background: rgba(0, 255, 136, 0.15);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 120px 20px 60px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #00ff88;
            text-decoration: none;
            margin-bottom: 30px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .back-link:hover {
            color: #00cc6a;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .post-header {
            margin-bottom: 40px;
        }

        .post-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 0.9rem;
            color: #9ca3af;
            flex-wrap: wrap;
            gap: 10px;
        }

        .post-date {
            color: #00ff88;
        }

        .post-category {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
        }

        .post-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 2.5rem;
            color: #e5e7eb;
            margin-bottom: 20px;
            letter-spacing: 0.02em;
            line-height: 1.2;
        }

        .post-excerpt {
            font-size: 1.2rem;
            color: #9ca3af;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .post-featured-image {
            width: 100%;
            max-width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 12px;
            margin: 40px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .post-content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #d1d5db;
        }

        .post-content h2 {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.8rem;
            color: #00ff88;
            margin: 40px 0 20px 0;
            letter-spacing: 0.05em;
        }

        .post-content h3 {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.4rem;
            color: #e5e7eb;
            margin: 30px 0 15px 0;
            letter-spacing: 0.03em;
        }

        .post-content p {
            margin-bottom: 20px;
        }

        .post-content ul, .post-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }

        .post-content li {
            margin-bottom: 10px;
        }

        .post-content blockquote {
            border-left: 4px solid #00ff88;
            padding-left: 20px;
            margin: 30px 0;
            font-style: italic;
            color: #9ca3af;
        }

        .post-content code {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }

        .post-content pre {
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
        }

        .post-content pre code {
            background: none;
            color: #e5e7eb;
            padding: 0;
        }

        .newsletter-cta {
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(0, 255, 136, 0.3);
            border-radius: 12px;
            padding: 40px;
            margin: 60px 0;
            text-align: center;
            backdrop-filter: blur(10px);
        }

        .newsletter-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.8rem;
            color: #00ff88;
            margin-bottom: 15px;
            letter-spacing: 0.05em;
        }

        .newsletter-text {
            color: #9ca3af;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }

        .email-form {
            display: flex;
            gap: 15px;
            max-width: 400px;
            margin: 0 auto;
            flex-wrap: wrap;
        }

        .email-input {
            flex: 1;
            min-width: 250px;
            padding: 15px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #e5e7eb;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .email-input:focus {
            outline: none;
            border-color: #00ff88;
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            background: rgba(255, 255, 255, 0.08);
        }

        .email-input::placeholder {
            color: #6b7280;
        }

        .subscribe-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            border: none;
            border-radius: 8px;
            color: #000;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.1rem;
            font-weight: 400;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
        }

        .subscribe-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 255, 136, 0.4);
        }

        .footer {
            background: rgba(10, 10, 15, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 40px 20px;
            text-align: center;
            margin-top: 80px;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #9ca3af;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-link:hover {
            color: #00ff88;
        }

        .footer-text {
            color: #6b7280;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .post-title {
                font-size: 2rem;
            }

            .nav-container {
                flex-direction: column;
                gap: 15px;
            }

            .nav-links {
                gap: 15px;
            }

            .email-form {
                flex-direction: column;
            }

            .email-input {
                min-width: auto;
            }

            .post-meta {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="/" class="logo">CYBERPROMPT</a>
            <div class="nav-links">
                <a href="/" class="nav-link">Home</a>
                <a href="/generator" class="nav-link">Generator</a>
                <a href="/blog" class="nav-link active">Blog</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <a href="/blog" class="back-link">
            ← Back to Blog
        </a>

        <header class="post-header">
            <div class="post-meta">
                <span class="post-date">${new Date(postData.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</span>
                <span class="post-category">${postData.category}</span>
            </div>
            <h1 class="post-title">${postData.title}</h1>
            <p class="post-excerpt">${postData.excerpt}</p>
        </header>

        ${imageHTML}

        <article class="post-content">
            ${postData.content}
        </article>

        <div class="newsletter-cta">
            <h2 class="newsletter-title">Enjoyed This Post?</h2>
            <p class="newsletter-text">
                Subscribe to get notified when we publish new insights on AI art and cyberpunk culture.
            </p>
            <form class="email-form" id="newsletter-form">
                <input 
                    type="email" 
                    class="email-input" 
                    placeholder="Enter your email address" 
                    required
                    id="email-input"
                >
                <button type="submit" class="subscribe-btn">Subscribe</button>
            </form>
        </div>
    </div>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-links">
                <a href="/" class="footer-link">Home</a>
                <a href="/blog" class="footer-link">Blog</a>
                <a href="/generator" class="footer-link">Advanced Generator</a>
            </div>
            <p class="footer-text">
                © 2024 CyberPrompt Generator. All rights reserved. | 
                <a href="#" class="footer-link">Privacy Policy</a> | 
                <a href="#" class="footer-link">Terms of Service</a>
            </p>
        </div>
    </footer>

    <script>
        // Newsletter subscription handling
        document.getElementById('newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email-input').value;
            const button = document.querySelector('.subscribe-btn');
            
            // Simulate subscription process
            button.textContent = 'Subscribing...';
            button.style.opacity = '0.7';
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = 'linear-gradient(135deg, #00cc6a, #00aa55)';
                document.getElementById('email-input').value = '';
                
                // Reset after 3 seconds
                setTimeout(() => {
                    button.textContent = 'Subscribe';
                    button.style.opacity = '1';
                    button.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
                }, 3000);
            }, 1500);
        });
    </script>
</body>
</html>`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}

// For browser use
if (typeof window !== 'undefined') {
    window.BlogManager = BlogManager;
}
