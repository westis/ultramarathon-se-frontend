<template>
  <nav class="bg-gray-800 py-2 lg:py-3">
    <div
      class="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8"
    >
      <a href="/" class="flex items-center font-bold">
        <img
          src="/images/logo.png"
          alt="Ultramarathon.se Logo"
          class="h-16 mr-2"
        />
      </a>
      <div class="flex items-center gap-4">
        <a href="/podd" class="hover:underline text-sm lg:text-lg text-white"
          >Podd</a
        >
        <a href="/blogg" class="hover:underline text-sm lg:text-lg text-white"
          >Blogg</a
        >
        <a
          href="/kalender"
          class="hover:underline text-sm lg:text-lg text-white"
          >Kalender</a
        >
        <a
          href="/statistik"
          class="hover:underline text-sm lg:text-lg text-white"
          >Statistik</a
        >
        <a href="/verktyg" class="hover:underline text-sm lg:text-lg text-white"
          >Verktyg</a
        >
        <a
          href="/arets-ultralopare"
          class="hover:underline text-sm lg:text-lg text-white"
          >Årets Ultralöpare</a
        >
        <a href="/om" class="hover:underline text-sm lg:text-lg text-white"
          >Om</a
        >
        <!-- Theme Toggle Button -->
        <ThemeSwitcher />
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped></style>
