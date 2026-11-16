import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getPosts, byDate, url } from "../lib/posts"

export async function GET(context: APIContext) {
    const posts = byDate(await getPosts()).filter(p => p.data.date)
    return rss({
        title: "backslash",
        description: "Personal blog and technical notes.",
        site: context.site!,
        items: posts.map(p => ({ title: p.title, description: p.data.description, pubDate: p.data.date, link: url(p) })),
    })
}
