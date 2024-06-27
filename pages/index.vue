<template>
  <HeroSection />
  <section class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Latest Podcast Episodes</h2>
    <!-- PodcastEpisodesList component goes here -->
  </section>
  <section class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Upcoming Races</h2>
    <!-- UpcomingRacesList component goes here -->
  </section>
  <section class="mt-8 mb-10">
    <h2 class="text-2xl font-bold mb-4">Latest Results</h2>
    <!-- LatestResultsList component goes here -->
  </section>
</template>

<script setup>
import HeroSection from "@/components/HeroSection.vue";
</script>

<style>
/* Add page-specific styles here */
</style>
