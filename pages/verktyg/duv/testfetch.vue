<template>
  <div class="container mx-auto p-4">
    <button
      @click="testFetchEvents"
      class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    >
      Test Fetch Events
    </button>
    <pre>{{ events }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDuvApi } from "@/composables/useDuvApi";

const { fetchEvents } = useDuvApi();
const events = ref<any[]>([]);
const isFetching = ref(true);

const testFetchEvents = async () => {
  const baseUrl =
    "https://statistik.d-u-v.org/json/mcalendar.php?from=2000-01-01&to=2024-08-04&country=SWE&plain=1&order=asc";
  console.log("Testing fetchEvents...");
  events.value = await fetchEvents(baseUrl, isFetching);
  console.log("Events fetched:", events.value.length);
  isFetching.value = false;
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
