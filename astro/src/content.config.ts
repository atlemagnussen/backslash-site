import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// Content lives outside the generator, in ../content (see README).
// Keep ids as the raw path so URLs match the old site, e.g. linux/nix-pkg-manager.debian
const keepPath = ({ entry }: { entry: string }) => entry.replace(/\.md$/, "")

const posts = defineCollection({
    loader: glob({ pattern: ["**/*.md", "!index.md"], base: "../content/posts", generateId: keepPath }),
    schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        tag: z.array(z.string()).optional(),
    }),
})

const pages = defineCollection({
    loader: glob({ pattern: "*.md", base: "../content/pages", generateId: keepPath }),
    schema: z.object({ title: z.string().optional() }),
})

export const collections = { posts, pages }
