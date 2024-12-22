import { createContentLoader } from 'vitepress'

interface PostDate {
  time: number,
  date: string
  string: string
}
interface Post {
  title: string
  url: string
  date: PostDate
  excerpt: string | undefined
}

export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .filter(b => b.frontmatter.date)
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        excerpt: excerpt ? excerpt : frontmatter.description,
        date: formatDate(frontmatter.date)
      }))
      .sort((a, b) => b.date!.time - a.date!.time)
  }
})

function formatDate(raw: string): PostDate {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    date: date.toISOString(),
    string: date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}