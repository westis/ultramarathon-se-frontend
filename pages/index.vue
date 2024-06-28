<template>
  <main
    class="flex-grow max-w-custom mx-auto mt-4 px-1 text-ultra-primary-900 dark:text-ultra-primary-100"
  >
    <HeroSection />
    <div class="flex flex-wrap mt-8">
      <div class="w-full lg:w-3/4 pr-0 lg:pr-4">
        <section class="mt-0">
          <header class="">
            <h2
              class="bg-ultra-secondary-200 dark:bg-ultra-secondary-800 text-ultra-secondary-800 dark:text-ultra-secondary-200 py-2 px-3 mb-4 text-2xl font-bold"
            >
              Senaste artiklar
            </h2>
          </header>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
        </section>
      </div>
      <aside class="w-full lg:w-1/4 pl-4">
        <!-- Sidebar content -->
        <div
          class="bg-ultra-primary-100 dark:bg-ultra-primary-900 shadow-lg p-4"
        >
          <h2
            class="text-xl font-bold text-ultra-primary-900 dark:text-ultra-primary-100"
          >
            Senaste poddavsnitt
          </h2>
          <PodcastEpisodeCard />
          <PodcastEpisodeCard />
          <PodcastEpisodeCard />
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import HeroSection from "@/components/HeroSection.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import PodcastEpisodeCard from "@/components/PodcastEpisodeCard.vue";
</script>

<style scoped>
/* Your styles here */
</style>
