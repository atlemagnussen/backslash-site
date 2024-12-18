import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    bundler: viteBundler(),
    theme: defaultTheme({
        logo: "/public/favicon.svg"
    }),
    head: [
        ['link', { rel: 'icon', href: '/public/favicon.svg' }]
    ],
    lang: 'en-US',
    title: 'Hello VuePress',
    description: 'Just playing around',
})