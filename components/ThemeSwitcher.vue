<template>
  <div @click="toggleTheme" class="cursor-pointer">
    <Icon
      v-if="colorMode.value === 'dark'"
      name="heroicons-solid:sun"
      class="w-5 h-5"
    />
    <Icon v-else name="heroicons-solid:moon" class="w-5 h-5" />
  </div>
</template>

<script setup>
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};
</script>

<style scoped>
/* Your styles here */
</style>
