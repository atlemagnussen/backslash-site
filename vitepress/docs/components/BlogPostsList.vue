<script setup lang="ts">
  import { data as posts } from '../.vitepress/theme/posts.data.js'
  import { useData } from 'vitepress'

  const { frontmatter } = useData()

</script>
<style scoped>
  article.article-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    section.time {
      flex: 30% 0 0;
    }
    section.content {
      flex: 70% 0 0;
    }
    h2 {
      margin: 0.5rem;
      padding: 0;
      border-top: 0;
    }
  }
  
  ul {
    list-style-type: none;
  }
  ul li {
    margin-bottom: 2rem;
  }
  
</style>
<template>
  <div>
    <div>
      <h1>
        {{ frontmatter.title }}
      </h1>
      <p>
        {{ frontmatter.subtext }}
      </p>
    </div>
    <ul>
      <li v-for="{ title, url, date, excerpt } of posts">
        <article class="article-list">
          <section class="time">
            <time :datetime="date.date">{{ date.string }}</time>
          </section>
          <section class="content">
            <div>
              <h2><a :href="url">{{title}}</a></h2>
              <div v-if="excerpt" v-html="excerpt"></div>
            </div>
            <!-- <div>
              <a class="link" aria-label="read more" :href="url">Read more →</a>
            </div> -->
          </section>
        </article>
      </li>
    </ul>
  </div>
</template>
