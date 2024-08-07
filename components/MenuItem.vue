<template>
  <li>
    <a @click="toggleSubMenu" class="block px-4 py-2" :href="`/${item.slug}`">
      {{ item.title }}
      <span v-if="item.children?.length">▼</span>
    </a>
    <ul v-if="isOpen && item.children?.length" class="pl-4">
      <MenuItem
        v-for="child in item.children"
        :key="child.slug"
        :item="child"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MenuItem from "~/components/MenuItem.vue";

// Define props for the MenuItem component
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isOpen = ref(false);

const toggleSubMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* Add necessary styles */
</style>
