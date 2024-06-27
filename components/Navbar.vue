<template>
  <nav class="p-4">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="font-bold">Ultramarathon.se</a>
      <div class="flex items-center gap-4">
        <a href="/podd" class="hover:underline text-sm"">Podd</a>
        <a href="/blogg" class="hover:underline text-sm">Blogg</a>
        <a href="/kalender" class="hover:underline text-sm">Kalender</a>
        <a href="/statistik" class="hover:underline text-sm">Statistik</a>
        <a href="/verktyg" class="hover:underline text-sm">Verktyg</a>
        <a href="/arets-ultralopare" class="hover:underline text-sm"
          >Årets Ultralöpare</a
        >
        <a href="/om" class="hover:underline">Om</a>
        <!-- Theme Toggle Button -->
        <ThemeSwitcher />
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped></style>
