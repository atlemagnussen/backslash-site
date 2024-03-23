import os from "os"
import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { readFile } from "fs/promises"

const filepath = path.join(process.cwd(), "public", "sitemap.xml");
const mainUrl = "https://www.backslash.site";


const pathToConfig = path.join(process.cwd(), "public", "articles", "articletree.json")

let fileContent = `<?xml version="1.0" encoding="UTF-8"?>`

function append (input) {
    fileContent = `${fileContent}${os.EOL}${input}`
}

function appendUrl (loc, lastMod, changeFreq, priority) {
    append("<url>")
    append(`<loc>${loc}</loc>`)
    if (lastMod)
        append(`<lastmod>${lastMod}</lastmod>`)
    if (changeFreq)
        append(`<changefreq>${changeFreq}</changefreq>`)
    if (priority)
        append(`<priority>${priority}</priority>`)

    append("</url>")
}

function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0)
}

function getYyyyMmDd(d) {
    const retval = d.getUTCFullYear() + "-" + leftFillNum(d.getUTCMonth() + 1, 2) + "-" + leftFillNum(d.getUTCDate(), 2)
    return retval
}

function getLastModifiedGit (filepath) {
    return new Promise((resolve, reject) => {
        const com = `git log -1 --pretty="format:%ci" ${filepath}`
        exec(com, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error} ${stderr}`)
                return ""
            }
            resolve(stdout)
        })
    })
}

async function getBlogs (nodes) {

    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            await getBlogs(node.children)

        } else {
            const filepath = `public/articles/${node.id}.md`
            let lastMod = await getLastModifiedGit(filepath)
            if (lastMod && lastMod.length > 10)
                lastMod = lastMod.substring(0,10)
            appendUrl(`${mainUrl}/blog/${node.id}`, lastMod, null, 0.8)
        }
    }
}

async function run() {
    append(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)

    appendUrl(mainUrl, getYyyyMmDd(new Date()), "monthly", 0.5)

    const config = await getJsonConfig(pathToConfig)

    if (config.nodes && config.nodes.length > 0) {
        await getBlogs(config.nodes)
    }

    append("</urlset>")
    const tw = fs.createWriteStream(filepath)

    tw.write(fileContent)
    tw.close()
    return "run done"
}

async function getJsonConfig(filepath) {
    const fileStr = await getFileRaw(filepath)
    return JSON.parse(fileStr)
}

async function getFileRaw(filepath) {
    console.log("get file", filepath)
    const fileStr = readFile(filepath, {encoding: "utf-8"})
    return fileStr
}

run().then(output => {
    console.log(output);
}).catch(err => {
    console.error(err);
})

