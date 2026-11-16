import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts"> & {
    title: string
    category: string | null
    slug: string
    minutes: number
}

/** Frontmatter title, or the first `# heading` for posts without frontmatter. */
function titleOf(e: CollectionEntry<"posts">) {
    return e.data.title ?? e.body?.match(/^#\s+(.+)$/m)?.[1].trim() ?? e.id
}

export async function getPosts(): Promise<Post[]> {
    const all = await getCollection("posts")
    return all.map(e => {
        const parts = e.id.split("/")
        return {
            ...e,
            title: titleOf(e),
            category: parts.length > 1 ? parts[0] : null,
            slug: parts[parts.length - 1],
            minutes: Math.max(1, Math.round((e.body ?? "").split(/\s+/).length / 200)),
        }
    })
}

/** Posts grouped by category folder, both sorted by name. Root-level posts (links) are left out. */
export function tree(posts: Post[]) {
    const groups = new Map<string, Post[]>()
    for (const p of posts) {
        if (!p.category) continue
        groups.set(p.category, [...(groups.get(p.category) ?? []), p])
    }
    return [...groups.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, items]) => ({ category, items: items.sort((a, b) => a.slug.localeCompare(b.slug)) }))
}

export function byDate(posts: Post[]) {
    return [...posts].sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0))
}

export const fmtDate = (d?: Date) => d?.toISOString().slice(0, 10) ?? "----------"
export const url = (p: Post) => `/posts/${p.id}`
