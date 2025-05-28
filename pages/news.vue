<script setup>
// Working implementation for Nuxt Content v3 to fetch all news items, order by date, and display the title and date.

const { data: news } = await useAsyncData("news", () => {
  return queryCollection("content")
    .where("path", "LIKE", "/news%")
    .order("date", "DESC")
    .all();
});
useSeoMeta({
  title: news.value?.title,
  description: news.value?.description,
});
</script>

<template>
  <div class="mt-12">
    <div v-if="news">
      <h1>News & Updates</h1>
      <ul>
        <li v-for="item in news" :key="item.path">{{ item.date }} - {{ item.title }}</li>
      </ul>
    </div>
  </div>
</template>
