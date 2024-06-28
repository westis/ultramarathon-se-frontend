<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main
      class="flex-grow max-w-custom mx-auto mt-4 px-1 text-ultra-primary-900 dark:text-ultra-primary-100"
    >
      <NuxtPage />
    </main>
    <Footer class="w-full custom-width mx-auto" />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
/* Your styles here */
</style>
