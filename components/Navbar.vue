<template>
  <nav class="bg-ultra-primary-900">
    <div class="max-w-custom mx-auto">
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
        <!-- Pass the navigationItems to MegaMenu -->
        <MegaMenu :navigation-items="navigationItems" />
        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="lg:hidden">
          <!-- Hamburger icon here -->
        </button>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden">
      <ul>
        <MenuItem
          v-for="item in navigationItems"
          :key="item.slug"
          :item="item"
        />
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useNavigation } from "~/composables/useNavigation";
import MegaMenu from "~/components/MegaMenu.vue";
import MenuItem from "~/components/MenuItem.vue";

const { navigationItems } = useNavigation();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<style scoped>
/* Add necessary styles for responsiveness and dropdowns */
</style>
