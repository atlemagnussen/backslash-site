const os = require('os');
const fs = require('fs');
const path = require('path');
const filepath = path.join(process.cwd(), 'src', 'sitemap.xml');
const mainUrl = "https://www.backslash.site";
const { exec } = require('child_process');

const config = require('./articles/articletree.json');
let fileContent = `<?xml version="1.0" encoding="UTF-8"?>`;

const append = (input) => {
    fileContent = `${fileContent}${os.EOL}${input}`;
};
const appendUrl = (loc, lastMod, changeFreq, priority) => {
    append("<url>");
    append(`<loc>${loc}</loc>`);
    if (lastMod)
        append(`<lastmod>${lastMod}</lastmod>`);
    if (changeFreq)
        append(`<changefreq>${changeFreq}</changefreq>`);
    if (priority)
        append(`<priority>${priority}</priority>`);

    append("</url>");
};

const leftFillNum = (num, targetLength) => {
    return num.toString().padStart(targetLength, 0);
};

const getYyyyMmDd = (d) => {
    const retval = d.getUTCFullYear() + "-" + leftFillNum(d.getUTCMonth() + 1, 2) + "-" + leftFillNum(d.getUTCDate(), 2);
    return retval;
};

const getLastModifiedGit = (filepath) => {
    return new Promise((resolve, reject) => {
        const com = `git log -1 --pretty="format:%ci" ${filepath}`;
        exec(com, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error} ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
};

const getBlogs = async (nodes) => {
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            await getBlogs(node.children);
        } else {
            const filepath = `articles/${node.id}.md`;
            let lastMod = await getLastModifiedGit(filepath);
            if (lastMod && lastMod.length > 10)
                lastMod = lastMod.substring(0,10);
            appendUrl(`${mainUrl}/blog/${node.id}`, lastMod, null, 0.8);
        }
    }
};

const run = async () => {
    append(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
    appendUrl(mainUrl, getYyyyMmDd(new Date()), "monthly", 0.5);

    if (config.nodes && config.nodes.length > 0) {
        await getBlogs(config.nodes);
    }

    append("</urlset>");
    const tw = fs.createWriteStream(filepath);

    tw.write(fileContent);
    tw.close();
    return "run done";
};

run().then(output => {
    console.log(output);
}).catch(err => {
    console.error(err);
});






