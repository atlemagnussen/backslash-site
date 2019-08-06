const http = require("http");
const fs = require("fs");
const path = require("path");
const DEFAULT_PORT = 3000;
const HTTP = {
    "OK": 200,
    "ERROR": 500
};
const port = process.argv[2] || DEFAULT_PORT;
const root = process.argv[3] || "dist";
const indexFilePath = "./index.html";
const fullIndexFilePath = path.join(root, indexFilePath);

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".svg": "application/image/svg+xml"
};

const getMimeType = (ext) => mimeTypes[ext] || "application/octet-stream";

http.createServer((request, response) => {
    console.log("request ", request.url);

    let filePath = `.${request.url}`;

    if (filePath === "./") {
        filePath = indexFilePath;
    }

    const extname = String(path.extname(filePath)).toLowerCase();

    const contentType = getMimeType(extname);
    const fullPath = path.join(root, filePath);

    console.log(`fullPath=${fullPath}`);
    fs.readFile(fullPath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                if (request.url.indexOf(".") > -1) {
                    console.log(`error file is not here: ${request.url}`);
                    response.writeHead(HTTP.ERROR);
                    response.end(`Sorry, man the file is not here: ${error.code} ..\n`);
                    response.end();
                } else {
                    fs.readFile(fullIndexFilePath, (err, con) => {
                        if (err) {
                            console.log(`error: ${err}`);
                            response.writeHead(HTTP.ERROR);
                            response.end(`Sorry, man the index is hone: ${error.code} ..\n`);
                            response.end();
                        } else {
                            console.log(`Defaulting to ${indexFilePath}`);
                            response.writeHead(HTTP.OK, {"Content-Type": getMimeType(".html")});
                            response.end(con, "utf-8");
                        }
                    });
                }
            } else {
                response.writeHead(HTTP.ERROR);
                response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
                response.end();
            }
        } else {
            response.writeHead(HTTP.OK, {"Content-Type": contentType});
            response.end(content, "utf-8");
        }
    });

}).listen(port);
console.log(`Server running at http://127.0.0.1:${port}`);
