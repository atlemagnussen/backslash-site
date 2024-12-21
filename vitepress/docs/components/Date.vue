<script setup lang="ts">
import type { Post } from './posts.data.js'

const props = defineProps<{ date: Post['date'] }>()

function getDateTime() {
  return new Date(props.date.time).toISOString()
}
</script>

<template>
  
</template>
