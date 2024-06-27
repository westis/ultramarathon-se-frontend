<template>
  <div class="flex flex-col items-center">
    <!-- Bind v-model to originalUrl instead of apiUrl -->
    <input
      v-model="originalUrl"
      type="text"
      placeholder="Enter original URL here"
      class="mt-5 p-2 border rounded"
    />

    <div class="mt-2 flex space-x-2">
      <button
        @click="fetchResults"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Results
      </button>
      <button
        v-if="formattedResults && formattedResults.length > 0"
        @click="saveAsExcel"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save as Excel
      </button>
    </div>
    <div v-if="formattedResults && formattedResults.length > 0" class="mt-5">
      <table class="table-auto shadow-lg bg-white">
        <thead class="bg-blue-100">
          <tr>
            <th class="border px-8 py-4">Rank</th>
            <th class="border px-8 py-4">Name</th>
            <th class="border px-8 py-4">Club</th>
            <th class="border px-8 py-4">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in formattedResults"
            :key="result.Name"
            class="bg-white"
          >
            <td class="border px-8 py-4">{{ result.Rank }}</td>
            <td class="border px-8 py-4">{{ result.Name }}</td>
            <td class="border px-8 py-4">{{ result.Club }}</td>
            <td class="border px-8 py-4">{{ result.Time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";

// Initializes states for storing the original and API URLs
const originalUrl = useState("originalUrl", () => "");
const apiUrl = useState("apiUrl", () => "");

// The function that converts the original URL to the API URL
function convertToApiUrl(inputUrl) {
  const url = new URL(inputUrl);
  const compId = url.searchParams.get("comp");
  // Extract the class name directly from the hash, removing the leading '#'
  let className = url.hash.substring(1);
  // Decode URI component in case it's already encoded, then encode it
  className = encodeURIComponent(decodeURIComponent(className));

  return `https://liveresultat.orientering.se/api.php?comp=${compId}&method=getclassresults&unformattedTimes=true&class=${className}`;
}

// Setup for lazy fetching, using the API URL
const { data, error, execute } = useFetch(() => apiUrl.value, {
  lazy: true,
  onResponse: (response) => {
    console.log("Data fetched successfully:", response);
  },
  onError: (err) => {
    console.error("Error fetching data:", err);
  },
});

// Fetch results using the converted API URL
const fetchResults = () => {
  apiUrl.value = convertToApiUrl(originalUrl.value); // Convert and update API URL
  execute(); // Trigger the fetch operation
};

// Convert centiseconds to H:MM:SS
function centisecondsToHMS(centiseconds) {
  const seconds = centiseconds / 100;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

// Process and format fetched data
const formattedResults = computed(() => {
  if (!data.value || !data.value.results) return [];
  return data.value.results.map(({ place, name, club, result, status }) => {
    const Rank = status === 0 ? place : status === 1 ? "DNS" : "DNF";
    const Time = status === 0 ? centisecondsToHMS(result) : ""; // Adjusted for centiseconds to H:MM:SS
    return { Rank, Name: name, Club: club, Time };
  });
});

// Function to save fetched results as Excel
const saveAsExcel = () => {
  const ws = XLSX.utils.json_to_sheet(formattedResults.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  XLSX.writeFile(wb, "results.xlsx");
};
</script>

<style scoped>
/* TailwindCSS is utility-first, so inline styles are often more appropriate. */
</style>
