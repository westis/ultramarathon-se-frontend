<template>
  <ul>
    <li v-for="result in results" :key="result.id" class="mt-2">
      <a :href="result.url" class="text-secondary hover:text-primary">{{
        result.title
      }}</a>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  results: {
    type: Array,
    required: true,
  },
});
</script>
