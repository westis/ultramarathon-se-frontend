<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main
      class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg"
    >
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
</script>
