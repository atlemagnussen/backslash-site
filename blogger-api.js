const {google} = require('googleapis');
const oauthClient = require('./oauthclient');
const keysmanager = require('./keysmanager');

// const blogId = "7734453256887931626";

class BloggerRestApi {
    constructor() {
        this.keys = keysmanager.getKeys();

        this.bloggerOAuth = google.blogger({
            version: 'v3',
            auth: oauthClient.oAuth2Client,
        });
        this.bloggerApiKey = google.blogger({
            version: 'v3',
            auth: this.keys.api_key
        });
    }
    async getBlogInfo(blogId) {
        const res = await this.blogger.blogs.get({blogId});
        // console.log(`${res.data.name} has ${res.data.posts.totalItems} posts! The blog url is ${res.data.url}`);
        return res.data;
    }
    async getBlogPost(blogId, postId) {
        const post = await this.bloggerApiKey.posts.get({blogId, postId});
        return post.data;
    }
    async updateBlogPost(blogId, postId, title, content) {
        const a = await this.auth();
        const post = await this.bloggerOAuth.posts.update({blogId, postId, 
            requestBody: {
                title,
                content,
            }});
        return post.data;
    }
    async insertBlog (blogId, title, content) {
        const a = await this.auth();
        const res = await this.bloggerOAuth.posts.insert({
            blogId,
            requestBody: {
                title,
                content,
            },
        });
        return res.data;
    }
    async auth() {
        const scopes = ['https://www.googleapis.com/auth/blogger'];
        const res = await oauthClient.authenticate(scopes);
        return res;
    }
}

module.exports = new BloggerRestApi();
