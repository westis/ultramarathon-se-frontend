<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Mittlopp Results Fetcher</h1>
    <div class="mb-4">
      <input
        v-model="raceUrl"
        placeholder="Enter Mittlopp race URL"
        class="border border-gray-300 p-2 rounded w-full"
      />
    </div>
    <div class="flex space-x-2">
      <button
        @click="fetchResults"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Results
      </button>
      <button
        @click="downloadExcel"
        :disabled="!raceData.racers.length"
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
    <div v-else-if="raceData.racers.length" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Race Results</h2>
      <ul>
        <li
          v-for="racer in raceData.racers"
          :key="racer.bib_number"
          class="border-b py-2"
        >
          {{ racer.full_name }} - Rank: {{ racer.place }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";
import * as XLSX from "xlsx";

const raceUrl = ref("");
const raceData = ref({ event_name: "", racers: [] });
const loading = ref(false);

const fetchResults = async () => {
  try {
    if (!raceUrl.value) {
      alert("Please enter a valid Mittlopp race URL");
      return;
    }

    loading.value = true;
    const { data } = await useFetch(`/api/mittlopp`, {
      params: { raceUrl: raceUrl.value },
    });
    console.log("Fetched Race Data:", data.value);
    raceData.value = data.value;
    alert("Results fetched successfully");
  } catch (error) {
    console.error("Error fetching results:", error);
    alert("Failed to fetch results");
  } finally {
    loading.value = false;
  }
};

const downloadExcel = () => {
  const worksheetData = raceData.value.racers.map((racer) => ({
    Rank: racer.place,
    Bib: racer.bib_number,
    Name: racer.full_name,
    Club: racer.club,
    Gender: racer.gender,
    Status: racer.status,
    Time: racer.time,
    YOB: racer.yob,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Add URL and event name as first two rows
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[`${raceUrl.value}`], [`${raceData.value.event_name}`]],
    { origin: "A1" }
  );

  // Add headers starting from the third row
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Rank", "Bib", "Name", "Club", "Gender", "Status", "Time", "YOB"]],
    { origin: "A3" }
  );

  // Add race data starting from the fourth row
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A4",
    skipHeader: true,
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Race Results");

  const fileName = `${
    raceData.value.event_name
  }-${new Date().toISOString()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
</script>

<style>
.spinner-border {
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>
