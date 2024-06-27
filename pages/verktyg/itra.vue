<template>
  <div>
    <Loader :loading="loading" :message="loadingMessage" />
    <h1>Events</h1>
    <ul v-if="!loading">
      <li v-for="(event, index) in events" :key="index">
        <p>
          <strong>{{ event.title }}</strong>
        </p>
        <p>{{ event.date }}</p>
        <p>{{ event.location }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Loader from "~/components/Loader.vue";

const events = ref([]);
const loading = ref(true);
const loadingMessage = ref("Fetching events, please wait...");

onMounted(async () => {
  try {
    const response = await fetch("/api/itra-events");
    const data = await response.json();
    events.value = data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    loading.value = false;
  }
});
</script>
