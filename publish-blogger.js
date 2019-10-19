const {google} = require('googleapis');
const blogger = google.blogger({
    version: 'v3',
    auth: 'AIzaSyDb0bXTO50FbQIfGXo27t2OfhRYOWzpHsA'
});
const main = async () => {
    const res = await blogger.blogs.get({blogId: "7734453256887931626"});
    console.log(`${res.data.name} has ${res.data.posts.totalItems} posts! The blog url is ${res.data.url}`);
};
main().catch(console.error);
