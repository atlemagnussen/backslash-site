const bloggerApi = require('./blogger-api');
const blogId = "7734453256887931626";
const config = require('./articles/articletree.json');
const showdown  = require('showdown');
const converter = new showdown.Converter();
const fs = require('fs');

const getBlogs = async (nodes) => {
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            await getBlogs(node.children);
        } else {
            if (node.blogger && node.blogger.publish) {
                const filepath = `articles/${node.id}.md`;
                const title = node.name;
                const md = fs.readFileSync(filepath, 'utf8');
                const content = converter.makeHtml(md);
                let res;
                if (node.blogger.id) {
                    const existing = await bloggerApi.getBlogPost(blogId, node.blogger.id);
                    if (existing.title !== title || existing.content !== content) {
                        res = await bloggerApi.updateBlogPost(blogId, node.blogger.id, title, content);
                    } else {
                        console.log(`No changes for blogpost ${node.blogger.id} - ${title}`);
                        res = null;
                    }
                } else {
                    res = await bloggerApi.insertBlog(blogId, title, content);
                }
                if (res) {
                    console.log(`${res.kind} ${res.id} updated now ${res.updated} url: ${res.url}`);
                    console.log("JSON:");
                    console.log(JSON.stringify(res));
                }
            }
        }
    }
};

const main = async () => {

    if (config.nodes && config.nodes.length > 0) {
        await getBlogs(config.nodes);
    }

    // const post = await bloggerApi.updateBlogPost(blogId, "469412627985974644", 
    //     "Hello from the atles npm module!",
    //     "Updated from nodejs, script");
    // console.log(post);
};

main().catch(console.error);