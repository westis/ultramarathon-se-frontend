<template>
  <div class="p-8">
    <div class="container mx-auto flex flex-col items-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to Ultramarathon.se</h1>
      <p class="text-xl mb-8">
        Your source for ultramarathon podcasts, races, and results.
      </p>
      <!-- Dynamic elements like latest podcast and upcoming races go here -->
      <div class="flex gap-4">
        <a
          href="/latest-podcast"
          class="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >Listen to the Latest Podcast</a
        >
        <a
          href="/upcoming-races"
          class="bg-transparent hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-white rounded"
          >Upcoming Races</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
// You might inject dynamic data for the latest podcast and races here
</script>

<style scoped>
/* Add hero section-specific styles here */
</style>
