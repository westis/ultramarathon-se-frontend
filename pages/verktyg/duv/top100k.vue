<template>
  <div>
    <h1>Top 100km Results</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h2>Male Results</h2>
      <table class="min-w-full">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Performance</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Nat Rank</th>
            <th>Date of Birth</th>
            <th>Date</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in maleResults"
            :key="result.runnerId"
            :class="{ 'text-red-500': result.top3 }"
          >
            <td>{{ result.rank }}</td>
            <td>{{ result.performance }}</td>
            <td>{{ result.name }}</td>
            <td>{{ result.nat }}</td>
            <td>{{ result.natRank }}</td>
            <td>{{ result.dob }}</td>
            <td>{{ result.date }}</td>
            <td>{{ result.venue }}</td>
          </tr>
        </tbody>
      </table>
      <h2>Female Results</h2>
      <table class="min-w-full">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Performance</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Nat Rank</th>
            <th>Date of Birth</th>
            <th>Date</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in femaleResults"
            :key="result.runnerId"
            :class="{ 'text-red-500': result.top3 }"
          >
            <td>{{ result.rank }}</td>
            <td>{{ result.performance }}</td>
            <td>{{ result.name }}</td>
            <td>{{ result.nat }}</td>
            <td>{{ result.natRank }}</td>
            <td>{{ result.dob }}</td>
            <td>{{ result.date }}</td>
            <td>{{ result.venue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface RunnerResult {
  rank: number;
  performance: string;
  name: string;
  nat: string;
  dob: string;
  date: string;
  venue: string;
  runnerId: string;
  natRank?: number;
  top3?: boolean;
}

const maleResults = ref<RunnerResult[]>([]);
const femaleResults = ref<RunnerResult[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch("/api/scrapeDUV");
    const data = await response.json();
    maleResults.value = data.M;
    femaleResults.value = data.W;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.text-red-500 {
  color: #f56565;
}
</style>
