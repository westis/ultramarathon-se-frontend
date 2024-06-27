<template>
  <div class="container">
    <h1>Orienteering Results</h1>
    <FetchOrienteringSe />
  </div>
</template>

<script setup>
import FetchOrienteringSe from "../components/FetchResults/fetchOrienteringSe.vue";
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
