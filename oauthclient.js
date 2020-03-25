const {google} = require("googleapis");
const http = require("http");
const url = require("url");
const opn = require("open");
const destroyer = require("server-destroy");
const keysmanager = require("./keysmanager");


const invalidRedirectUri = `Invalid!:
"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]
`;

class OauthClient {
    constructor(options) {
        this.keys = keysmanager.getKeys();
        this._options = options || {scopes: []};

        // validate the redirectUri.  This is a frequent cause of confusion.
        if (!this.keys.redirect_uris || this.keys.redirect_uris.length === 0) {
            throw new Error(invalidRedirectUri);
        }
        const redirectUri = this.keys.redirect_uris[this.keys.redirect_uris.length - 1];
        const parts = new url.URL(redirectUri);
        if (redirectUri.length === 0 ||
            parts.port !== "3000" ||
            parts.hostname !== "localhost" ||
            parts.pathname !== "/oauth2callback") {
            throw new Error(invalidRedirectUri);
        }

        this.oAuth2Client = new google.auth.OAuth2(
            this.keys.client_id,
            this.keys.client_secret,
            redirectUri
        );
    }

    async authenticate(scopes) {
        return new Promise((resolve, reject) => {
        // grab the url that will be used for authorization
            this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: scopes.join(" "),
            });
            const server = http.createServer(async (req, res) => {
                try {
                    if (req.url.indexOf("/oauth2callback") > -1) {
                        const qs = new url.URL(req.url, "http://localhost:3000")
                            .searchParams;
                        res.end("Authentication successful! Please return to the console.");
                        server.destroy();
                        const {tokens} = await this.oAuth2Client.getToken(qs.get("code"));
                        this.oAuth2Client.credentials = tokens;
                        resolve(this.oAuth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            }).listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                opn(this.authorizeUrl, {wait: false}).then(cp => cp.unref());
            });
            destroyer(server);
        });
    }
}

module.exports = new OauthClient();
