import { defineClientConfig } from 'vuepress/client'
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'

import FrontLogo from "./components/FrontLogo3d.vue"

export default defineClientConfig({
  enhance({ app }) {
    app.component("FrontLogo", FrontLogo)
  },
  layouts: {
    Article,
    Category,
    Tag,
    Timeline,
  },
})
