// Data for the right rail on post pages: outline (with source line numbers) and file stats.
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import type { MarkdownHeading } from "astro"
import type { Post } from "./posts"

export interface OutlineItem { depth: number; slug: string; text: string; line?: number }

/** ## and ### headings, with their line number in the markdown file (like `grep -n`). */
export function outline(post: Post, headings: MarkdownHeading[]): OutlineItem[] {
    const items = headings.filter(h => h.depth === 2 || h.depth === 3)
    const lines = post.filePath && existsSync(post.filePath) ? readFileSync(post.filePath, "utf8").split("\n") : []
    // heading lines outside code fences, in order
    const found: number[] = []
    let fence = false
    lines.forEach((l, i) => {
        if (/^\s*(```|~~~)/.test(l)) fence = !fence
        else if (!fence && /^#{2,3}\s/.test(l)) found.push(i + 1)
    })
    const numbered = found.length === items.length
    return items.map((h, i) => ({ depth: h.depth, slug: h.slug, text: h.text, line: numbered ? found[i] : undefined }))
}

/** Date of the last commit that touched the file. Undefined without full git history (e.g. a shallow CI clone). */
export function lastModified(post: Post): string | undefined {
    if (!post.filePath) return
    try {
        const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
        if (git("rev-parse", "--is-shallow-repository") !== "false") return
        return git("log", "-1", "--format=%as", "--", post.filePath) || undefined
    } catch {
        return
    }
}

export const wordCount = (post: Post) => (post.body ?? "").split(/\s+/).filter(Boolean).length
