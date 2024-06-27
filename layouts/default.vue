<template>
  <div class="flex flex-col min-h-screen">
    <div class="w-full">
      <Navbar />
    </div>
    <main
      class="flex-grow container mx-auto mt-4 px-4 sm:px-6 lg:px-8 text-ultra-primary-900 dark:text-ultra-primary-100"
    >
      <HeroSection />
      <div class="flex flex-wrap mt-8">
        <div class="w-full lg:w-3/4 pr-4">
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
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import HeroSection from "@/components/HeroSection.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import PodcastEpisodeCard from "@/components/PodcastEpisodeCard.vue";

// Mock data for demonstration purposes
const events = ref([
  { id: 1, title: "Kullamannen - 100 miles", date: "2024-06-26" },
  { id: 2, title: "Sätila Trail", date: "2024-06-26" },
  { id: 3, title: "Personliga Rekordens Backyard", date: "2024-06-27" },
  { id: 4, title: "Comrades Marathon (RSA)", date: "2024-06-27" },
  { id: 5, title: "Western States (USA)", date: "2024-06-27" },
]);

const results = ref([
  { id: 1, name: "Runner 1", time: "2:30:45", event: "Event 1" },
  { id: 2, name: "Runner 2", time: "2:45:30", event: "Event 2" },
  { id: 3, name: "Runner 3", time: "3:00:15", event: "Event 3" },
]);
</script>
