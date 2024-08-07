<template>
  <div class="flex items-center gap-4 ml-auto relative">
    <div
      v-for="item in navigationItems"
      :key="item.slug"
      class="relative group"
      @mouseover="item.children?.length && toggleSubMenu(item.slug)"
      @mouseleave="item.children?.length && toggleSubMenu(null)"
    >
      <a
        :href="`/${item.slug}`"
        class="relative text-sm lg:text-lg text-ultra-primary-100 py-2 dark:text-white flex items-center underline-animation"
      >
        {{ item.title }}
        <span
          v-if="item.children?.length && activeSubMenu === item.slug"
          class="ml-1"
          >&uarr;</span
        >
        <span
          v-if="item.children?.length && activeSubMenu !== item.slug"
          class="ml-1"
          >&darr;</span
        >
      </a>
      <div
        v-if="activeSubMenu === item.slug && item.children?.length"
        class="absolute left-0 right-0 top-full pt-2 bg-white dark:bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
        style="width: 100vw; transform: translateX(-50%); left: 50%"
      >
        <div class="p-4 max-w-screen-xl mx-auto flex justify-start">
          <div v-for="child in item.children" :key="child.slug" class="w-1/3">
            <h3 class="text-lg font-semibold">
              <a
                :href="`/${child.slug}`"
                class="text-black dark:text-white underline-animation"
              >
                {{ child.title }}
              </a>
            </h3>
            <ul>
              <li v-for="grandchild in child.children" :key="grandchild.slug">
                <a
                  :href="`/${grandchild.slug}`"
                  class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white underline-animation"
                >
                  {{ grandchild.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- Theme Toggle Button -->
    <ThemeSwitcher />
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import MenuItem from "~/components/MenuItem.vue";

const props = defineProps({
  navigationItems: {
    type: Array,
    required: true,
  },
});

const activeSubMenu = ref(null);

const toggleSubMenu = (menu) => {
  activeSubMenu.value = menu;
};
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
.z-50 {
  z-index: 50;
}
.underline-animation {
  position: relative;
  transition: all 0.2s ease; /* Faster transition */
}
.underline-animation::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  bottom: 5px;
  left: 0;
  background: currentColor;
  transition: width 0.2s ease; /* Faster transition */
}
.underline-animation:hover::after {
  width: 100%;
}
</style>
