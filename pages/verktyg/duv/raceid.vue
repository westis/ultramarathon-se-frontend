<!-- file path: frontend/pages/verktyg/duv/raceid.vue -->

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">RaceID Results Fetcher</h1>
    <div class="mb-4">
      <input
        v-model="eventUrl"
        placeholder="Enter raceid event URL"
        class="border border-gray-300 p-2 rounded w-full"
      />
    </div>
    <div class="flex space-x-2">
      <button
        @click="getResults"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Results
      </button>
      <button
        @click="downloadExcel"
        :disabled="!raceData.results.length"
        class="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Download Excel
      </button>
    </div>
    <div v-if="loading" class="mt-4 flex justify-center">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="raceData.results.length" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Race Results</h2>
      <ul>
        <li
          v-for="racer in raceData.results"
          :key="racer.racer.id"
          class="border-b py-2"
        >
          {{ racer.racer.full_name }} - Rank: {{ racer.place }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";
import * as XLSX from "xlsx";

const eventUrl = ref("");
const raceData = ref({ name: "", race_date: "", results: [] });
const loading = ref(false);

const getResults = async () => {
  try {
    if (!eventUrl.value) {
      alert("Please enter a valid raceid event URL");
      return;
    }

    // Remove the part with currentCheckpointId if it exists
    const cleanUrl = eventUrl.value.replace(/currentCheckpointId=\d+&/, "");

    const eventIdMatch = cleanUrl.match(
      /\/races\/(\d+)\/result\?currentDistanceId=(\d+)/
    );
    if (!eventIdMatch) {
      alert("Invalid raceid event URL");
      return;
    }

    const [_, eventId, distanceId] = eventIdMatch;
    const apiUrl = `/api/raceid?distanceId=${distanceId}`;

    loading.value = true;

    const { data: raceResults } = await useFetch(apiUrl);
    raceData.value = raceResults.value;

    alert("Results fetched successfully");
  } catch (error) {
    console.error("Error fetching results:", error);
    alert("Failed to fetch results");
  } finally {
    loading.value = false;
  }
};

const msToHMS = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000); // Round up to next full second
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const downloadExcel = () => {
  const worksheetData = raceData.value.results.map((racer) => ({
    Rank: racer.place,
    Bib: racer.racer.bib_number,
    RacerID: racer.racer.id,
    Name: racer.racer.full_name,
    Gender: racer.racer.gender,
    Club: racer.racer.union,
    Brutto: msToHMS(racer.time_result_ms), // Ensure time_result_ms is correctly referenced
    DOB: racer.racer.details.birthday,
    City: racer.racer.details.city,
    Fname: racer.racer.details.firstname,
    Lname: racer.racer.details.lastname,
    Nat: racer.racer.details.nationality_id,
  }));

  // Add URL and race name as first two rows
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [
    [`${eventUrl.value}`],
    [`${raceData.value.name}`],
  ]);
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A3",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Race Results");

  // Create the file name
  const fileName = `${raceData.value.name}-${raceData.value.race_date}-DUV.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
</script>

<style>
.spinner-border {
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>
