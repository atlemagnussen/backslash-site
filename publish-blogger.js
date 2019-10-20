const bloggerApi = require('./blogger-api');
const blogId = "7734453256887931626";

const main = async () => {
    const post = await bloggerApi.updateBlogPost(blogId, "469412627985974644", 
        "Hello from the atles npm module!",
        "Updated from nodejs, script");
    console.log(post);
};

main().catch(console.error);