import comp from "D:/dev/blog/backslash-site/vuepress/docs/.vuepress/.temp/pages/articles/about.html.vue"
const data = JSON.parse("{\"path\":\"/articles/about.html\",\"title\":\"About page\",\"lang\":\"en-US\",\"frontmatter\":{\"lang\":\"en-US\",\"title\":\"About page\",\"description\":\"About the backslash site blog\"},\"headers\":[{\"level\":2,\"title\":\"This a blog\",\"slug\":\"this-a-blog\",\"link\":\"#this-a-blog\",\"children\":[{\"level\":3,\"title\":\"Here I will write things that I feel is worth writing down.\",\"slug\":\"here-i-will-write-things-that-i-feel-is-worth-writing-down\",\"link\":\"#here-i-will-write-things-that-i-feel-is-worth-writing-down\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"articles/about.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
