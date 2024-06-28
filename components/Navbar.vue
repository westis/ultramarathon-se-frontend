<template>
  <nav class="bg-ultra-primary-900">
    <div class="max-w-custom max-w-custom mx-auto">
      <div
        class="flex justify-between items-center py-2 lg:py-3 px-4 sm:px-6 lg:px-8"
      >
        <a href="/" class="flex items-center font-bold">
          <img
            src="/images/logo.png"
            alt="Ultramarathon.se Logo"
            class="h-16 mr-2"
          />
        </a>
        <div class="flex items-center gap-4">
          <a
            href="/podd"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Podd</a
          >
          <a
            href="/blogg"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Blogg</a
          >
          <a
            href="/kalender"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Kalender</a
          >
          <a
            href="/statistik"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Statistik</a
          >
          <a
            href="/verktyg"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Verktyg</a
          >
          <a
            href="/arets-ultralopare"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Årets Ultralöpare</a
          >
          <a
            href="/om"
            class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >Om</a
          >
          <!-- Theme Toggle Button -->
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped></style>
