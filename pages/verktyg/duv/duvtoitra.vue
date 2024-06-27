<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Convert DUV to ITRA</h1>
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
        :disabled="!raceData.length"
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
    <div v-else-if="raceData.length" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Race Results</h2>
      <ul>
        <li
          v-for="racer in raceData"
          :key="racer.PersonID"
          class="border-b py-2"
        >
          {{ racer.AthleteName }} - Rank: {{ racer.RankTotal }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

const eventUrl = ref("");
const raceData = ref([]);
const loading = ref(false);
let eventName = "";
let eventYear = "";

const getResults = async () => {
  if (!eventUrl.value) return;
  loading.value = true;
  raceData.value = []; // Reset race data before fetching new results
  try {
    const eventId = eventUrl.value.split("=")[1];
    const response = await fetch(
      `https://statistik.d-u-v.org/json/mgetresultevent.php?event=${eventId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetch result:", data);
    if (data && data.Resultlist) {
      raceData.value = data.Resultlist;
      if (data.EvtHeader) {
        eventName = data.EvtHeader.EventName;
        const evtDate = data.EvtHeader.EvtDate.split(".")[2]; // Extract year from date
        eventYear = evtDate;
      }
    } else {
      raceData.value = [];
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    raceData.value = [];
  } finally {
    loading.value = false;
  }
};

const downloadExcel = () => {
  const headers = [
    "Ranking",
    "Time",
    "Family Name",
    "First Name",
    "Gender",
    "Birthdate",
    "Nationality",
    "ITRA ID",
    "Bib no.",
    "City",
    "Team",
  ];
  const data = raceData.value.map((racer) => {
    let city = "";
    let team = "";
    if (racer.Club.startsWith("*")) {
      city = racer.Club.slice(1); // Remove the leading '*' and use the rest as City
    } else {
      team = racer.Club;
    }

    // Determine the birthdate
    let birthdate = racer.DOB;
    if (!birthdate || birthdate === "0000-00-00") {
      birthdate = racer.YOB;
    }

    return [
      racer.RankTotal,
      racer.PerformanceNumeric,
      racer.LastName,
      racer.FirstName,
      racer.Gender,
      birthdate, // Use the determined birthdate
      racer.Nationality,
      "",
      "",
      city,
      team,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Race Results");
  const fileName = `${eventName}-${eventYear}-ITRA.xlsx`;
  XLSX.writeFile(wb, fileName);
};
</script>

<style scoped>
/* Add your styles here */
</style>
