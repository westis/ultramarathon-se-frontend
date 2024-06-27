<template>
  <section class="mt-8 text-ultra-primary-900 dark:text-ultra-primary-100">
    <h2 class="text-2xl font-bold mb-4">Senaste poddavsitt & artiklar</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PodcastEpisodeCard />
      <PodcastEpisodeCard />
      <PodcastEpisodeCard />
    </div>
  </section>
</template>

<script setup>
import PodcastEpisodeCard from "@/components/PodcastEpisodeCard.vue";
</script>
