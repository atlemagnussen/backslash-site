const {google} = require('googleapis');
const oauthClient = require('./oauthclient');
const blogId = "7734453256887931626";
// const blogger = google.blogger({
//     version: 'v3',
//     auth: 'AIzaSyDb0bXTO50FbQIfGXo27t2OfhRYOWzpHsA'
// });
// const main = async () => {
//     const res = await blogger.blogs.get({blogId});
//     console.log(`${res.data.name} has ${res.data.posts.totalItems} posts! The blog url is ${res.data.url}`);
// };
// main().catch(console.error);




const blogger = google.blogger({
    version: 'v3',
    auth: oauthClient.oAuth2Client,
});

const insertBlog = async () => {
    const res = await blogger.posts.insert({
        blogId,
        requestBody: {
            title: 'Hello from the googleapis npm module!',
            content: 'Visit https://github.com/google/google-api-nodejs-client to learn more!',
        },
    });
    console.log(res.data);
    return res.data;
};

const main = async () => {
    const scopes = ['https://www.googleapis.com/auth/blogger'];
    oauthClient
        .authenticate(scopes)
        .then(insertBlog)
        .catch(console.error);
};

main().catch(console.error);