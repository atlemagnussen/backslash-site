const os = require('os');
const fs = require('fs');
const path = require('path');
const filepath = path.join(process.cwd(), 'src', 'sitemap.xml');
const mainUrl = "https://www.backslash.site";

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


append(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
appendUrl(mainUrl, getYyyyMmDd(new Date()), "monthly", 0.5);
append("</urlset>");
const tw = fs.createWriteStream(filepath);

tw.write(fileContent);
tw.close();
