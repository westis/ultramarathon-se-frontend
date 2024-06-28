<template>
  <div class="flex items-center gap-4">
    <div class="relative group">
      <a
        href="/statistik"
        class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
        >Statistik</a
      >
      <div
        class="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="p-4">
          <h3 class="text-lg font-semibold">Rekord</h3>
          <ul>
            <li>
              <a
                href="/rekord/svenska"
                class="block py-2 px-4 hover:bg-gray-100"
                >Svenska rekord & ultramarathonrekord</a
              >
            </li>
            <li>
              <a href="/rekord/alder" class="block py-2 px-4 hover:bg-gray-100"
                >Åldersrekord</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
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
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);
const activeSubMenu = ref(null);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleSubMenu = (menu) => {
  if (activeSubMenu.value === menu) {
    activeSubMenu.value = null;
  } else {
    activeSubMenu.value = menu;
  }
};
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
