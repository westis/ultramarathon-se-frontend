<template>
  <ul>
    <li v-for="event in events" :key="event.id" class="mt-2">
      <a :href="event.url" class="text-secondary hover:text-primary">{{
        event.name
      }}</a>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  events: {
    type: Array,
    required: true,
  },
});
</script>
