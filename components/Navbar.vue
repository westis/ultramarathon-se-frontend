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
        <div class="flex items-center gap-4">
          <div
            v-for="item in navigationItems"
            :key="item._id"
            class="relative group"
          >
            <a
              :href="`/${item.slug.current}`"
              class="hover:underline text-sm lg:text-lg text-ultra-primary-100"
            >
              {{ item.title }}
            </a>
            <div
              v-if="item.children?.length"
              class="absolute left-0 hidden group-hover:block bg-ultra-primary-800"
            >
              <ul>
                <li v-for="child in item.children" :key="child._id">
                  <a
                    :href="`/${child.slug.current}`"
                    class="block px-4 py-2 hover:bg-ultra-primary-700"
                  >
                    {{ child.title }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ThemeSwitcher />
        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="lg:hidden">
          <!-- Hamburger icon here -->
        </button>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden">
      <ul>
        <li v-for="item in navigationItems" :key="item._id">
          <a @click="toggleSubMenu(item)" class="block px-4 py-2">
            {{ item.title }}
            <span v-if="item.children?.length">▼</span>
          </a>
          <ul v-if="item.open" class="pl-4">
            <li v-for="child in item.children" :key="child._id">
              <a :href="`/${child.slug.current}`" class="block px-4 py-2">
                {{ child.title }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useNavigation } from "~/composables/useNavigation";

const { navigationItems } = useNavigation();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleSubMenu = (item: any) => {
  item.open = !item.open;
};
</script>

<style scoped>
/* Add necessary styles for responsiveness and dropdowns */
</style>
