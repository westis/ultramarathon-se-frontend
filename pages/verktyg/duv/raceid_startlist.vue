<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Race Start List Fetcher</h1>
    <div class="mb-4">
      <input
        v-model="eventUrl"
        placeholder="Enter raceid event URL"
        class="border border-gray-300 p-2 rounded w-full dark:bg-gray-700 dark:text-white"
      />
    </div>
    <div class="flex space-x-2">
      <button
        @click="getStartList"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Start List
      </button>
      <button
        @click="downloadExcel"
        :disabled="!startListData.length"
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
    <div v-else-if="startListData.length" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Start List</h2>
      <table
        class="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
      >
        <thead class="dark:bg-gray-700">
          <tr>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Bib
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Name
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Gender
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              City
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Club
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Nat.
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              DOB
            </th>
            <th class="py-2 px-4 border-b dark:border-gray-600 dark:text-black">
              Age
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="racer in startListData"
            :key="racer.id"
            class="dark:bg-gray-700"
          >
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.bib_number }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.full_name }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.gender === "M" ? "Male" : "Female" }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.city }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.union }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{ racer.nationality_id }}
            </td>
            <td
              class="whitespace-nowrap py-2 px-4 border-b dark:border-gray-600 dark:text-white"
            >
              {{ racer.details?.birthday }}
            </td>
            <td class="py-2 px-4 border-b dark:border-gray-600 dark:text-white">
              {{
                racer.details
                  ? calculateAge(new Date(racer.details.birthday))
                  : "N/A"
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";
import * as XLSX from "xlsx";

const eventUrl = ref("");
const startListData = ref([]);
const loading = ref(false);

const getStartList = async () => {
  try {
    if (!eventUrl.value) {
      alert("Please enter a valid raceid event URL");
      return;
    }

    // Remove the part with currentCheckpointId if it exists
    const cleanUrl = eventUrl.value.replace(/currentCheckpointId=\d+&/, "");

    const eventIdMatch = cleanUrl.match(
      /\/races\/(\d+)\/startlist\?currentDistanceId=(\d+)/
    );
    if (!eventIdMatch) {
      alert("Invalid raceid event URL");
      return;
    }

    const [_, eventId, distanceId] = eventIdMatch;
    const apiUrl = `/api/raceid?distanceId=${distanceId}&type=startlist`;

    loading.value = true;

    const { data: startList } = await useFetch(apiUrl);
    startListData.value = startList.value.startlist;

    alert("Start list fetched successfully");
  } catch (error) {
    console.error("Error fetching start list:", error);
    alert("Failed to fetch start list");
  } finally {
    loading.value = false;
  }
};

const downloadExcel = () => {
  const worksheetData = startListData.value.map((racer) => ({
    Bib: racer.bib_number,
    Name: racer.full_name,
    Gender: racer.gender === 1 ? "M" : "F",
    City: racer.city,
    Union: racer.union,
    Nationality: racer.nationality_id,
    DOB: racer.details?.birthday,
    Age: racer.details
      ? calculateAge(new Date(racer.details.birthday))
      : undefined,
  }));

  // Add URL as the first row
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [[`${eventUrl.value}`]]);
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A2",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Start List");

  // Create the file name
  const fileName = `StartList-DUV.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
</script>

<style>
.spinner-border {
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>
