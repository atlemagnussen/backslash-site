const bloggerApi = require("./blogger-api");
const blogId = "7734453256887931626";
const config = require("./public/articles/articletree.json");
const showdown  = require("showdown");
const converter = new showdown.Converter();
const fs = require("fs");

const getBlogs = async (nodes) => {
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            await getBlogs(node.children);
        } else {
            if (node.blogger && node.blogger.publish) {
                const filepath = `./public/articles/${node.id}.md`;
                const title = node.name;
                const tags = node.tags ? node.tags.sort() : null;
                let tagsString = null;
                if (tags) {
                    tagsString = tags.join(",").toLowerCase();
                }
                const md = fs.readFileSync(filepath, "utf8");
                const link = getLinkToBackSlash(node.id);
                const content = converter.makeHtml(md) + link;
                let res;
                if (node.blogger.id) {
                    const existing = await bloggerApi.getBlogPost(blogId, node.blogger.id);
                    const existingTagsString = existing.labels ? existing.labels.join(",").toLowerCase() : null;
                    if (existing.title !== title || existing.content !== content || tagsString !== existingTagsString) {
                        res = await bloggerApi.updateBlogPost(blogId, node.blogger.id, title, content, node.tags);
                    } else {
                        console.log(`No changes for blogpost ${node.blogger.id} - ${title}`);
                        res = null;
                    }
                } else {
                    console.log("New blogpost!!!");
                    res = await bloggerApi.insertBlog(blogId, title, content);
                }
                if (res) {
                    console.log(`${res.kind} ${res.id} updated now ${res.updated} url: ${res.url}`);
                }
            }
        }
    }
};

const getLinkToBackSlash = (id) => {
    return `<p><a href="https://www.backslash.site/blog/${id}">Read this blogpost with full syntax hightlighting on code snippets</a></p>`;
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
