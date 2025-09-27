/**
 * Blog API Client - Connects to Railway backend
 * Handles blog post creation, retrieval, and subscription management
 */
class BlogAPI {
    constructor() {
        this.baseURL = 'https://prompts-production-7afc.up.railway.app/api';
        this.apiKey = null;
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    getHeaders(needsAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (needsAuth && this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }
        return headers;
    }

    async request(endpoint, options = {}, needsAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: { ...this.getHeaders(needsAuth), ...options.headers }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // ===== BLOG POST METHODS =====

    async getPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/posts?${queryString}` : '/posts';
        return await this.request(endpoint);
    }

    async getPost(slug) {
        return await this.request(`/posts/${slug}`);
    }

    async createPost(postData) {
        return await this.request('/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        }, true);
    }

    async updatePost(id, postData) {
        return await this.request(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        }, true);
    }

    async deletePost(id) {
        return await this.request(`/posts/${id}`, {
            method: 'DELETE'
        }, true);
    }

    // ===== SUBSCRIPTION METHODS =====

    async subscribe(email) {
        return await this.request('/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async unsubscribe(email) {
        return await this.request('/subscribe', {
            method: 'DELETE',
            body: JSON.stringify({ email })
        });
    }

    async getSubscriberCount() {
        return await this.request('/subscribe/count');
    }

    // ===== UTILITY METHODS =====

    async checkHealth() {
        try {
            await this.request('/health');
            return true;
        } catch (error) {
            console.error('Backend health check failed:', error);
            return false;
        }
    }

    generatePostHTML(post) {
        const featuredImage = post.featured_image_url ? 
            `<div class="featured-image">
                <img src="${post.featured_image_url}" alt="${post.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
            </div>` : '';

        return `
            <article class="blog-post">
                <header class="post-header">
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-date">${new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
                    </div>
                </header>
                
                ${featuredImage}
                
                <div class="post-content">
                    ${post.content}
                </div>
                
                ${post.keywords ? `
                    <div class="post-keywords">
                        <strong>Keywords:</strong> ${post.keywords}
                    </div>
                ` : ''}
            </article>
        `;
    }

    generateBlogIndex(posts) {
        if (posts.length === 0) {
            return `
                <div class="no-posts">
                    <h2>No blog posts yet</h2>
                    <p>Check back soon for new content!</p>
                </div>
            `;
        }

        return posts.map(post => {
            const featuredImage = post.featured_image_url ? 
                `<div class="post-image">
                    <img src="${post.featured_image_url}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                </div>` : '';

            const excerpt = post.excerpt || post.content.substring(0, 150) + '...';

            return `
                <div class="post-preview" onclick="window.location.href='./${post.slug}.html'">
                    ${featuredImage}
                    <div class="post-info">
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-excerpt">${excerpt}</p>
                        <div class="post-meta">
                            <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
                            ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
                        </div>
                        <button class="read-more">Read More →</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Create global instance
window.blogAPI = new BlogAPI();

// Auto-check backend health on load
document.addEventListener('DOMContentLoaded', async () => {
    const isHealthy = await window.blogAPI.checkHealth();
    if (!isHealthy) {
        console.warn('⚠️ Backend API is not available. Some features may not work.');
        const blogContainer = document.querySelector('.blog-container');
        if (blogContainer) {
            blogContainer.insertAdjacentHTML('afterbegin', `
                <div class="api-warning" style="background: rgba(255, 165, 0, 0.1); border: 1px solid orange; padding: 10px; border-radius: 5px; margin-bottom: 20px; color: orange;">
                    ⚠️ Backend API is currently unavailable. Some features may not work properly.
                </div>
            `);
        }
    } else {
        console.log('✅ Backend API is healthy and ready!');
    }
});
