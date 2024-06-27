<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">AnmälMigNu Start List Fetcher</h1>
    <div class="mb-4">
      <input
        v-model="eventUrl"
        placeholder="Enter AnmälMigNu participants URL"
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
      <button
        @click="checkDOBs"
        :disabled="!startListData.length"
        class="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Check DOBs
      </button>
      <button
        @click="downloadITRA"
        :disabled="!startListData.length"
        class="bg-purple-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Download ITRA
      </button>
      <button
        @click="checkDUV"
        :disabled="!startListData.length"
        class="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Check DUV
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
        <thead class="bg-gray-200 dark:bg-gray-900">
          <tr>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Firstname
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Lastname
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Year of Birth
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Gender
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Club or City
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              DOB
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="participant in startListData"
            :key="participant.PersonID"
            class="dark:bg-gray-700"
          >
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Firstname }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Lastname }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.YOB }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Gender === "Man" ? "M" : "F" }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.ClubCityCompany }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.DOB || "" }}
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
import Bottleneck from "bottleneck";

const eventUrl = ref("");
const startListData = ref([]);
const loading = ref(false);

const limiter = new Bottleneck({
  minTime: 6000, // 1 request every 6 seconds
  maxConcurrent: 1,
});

const splitName = (name) => {
  const parts = name.split(" ");
  const firstname = parts[0];
  const lastname = parts.slice(1).join(" ");
  return { firstname, lastname };
};

const getStartList = async () => {
  try {
    if (!eventUrl.value) {
      alert("Please enter a valid Anmäl Mig event URL");
      return;
    }

    const eventIdMatch = eventUrl.value.match(/\/anmalda\/([^/]+)/);
    if (!eventIdMatch) {
      alert("Invalid Anmäl Mig event URL");
      return;
    }

    const [_, eventId] = eventIdMatch;
    const apiUrl = `/api/anmalmignu?eventId=${eventId}`;
    console.log("Fetching from API URL:", apiUrl); // Log the API URL

    loading.value = true;

    const { data: startListResponse } = await useFetch(apiUrl);
    console.log("startListResponse:", startListResponse); // Log the response

    if (startListResponse.error) {
      alert(startListResponse.error);
    } else {
      const classes = startListResponse.value?.Startlist?.Classes;
      console.log("Classes:", classes);

      if (classes) {
        const participants = classes.flatMap((c) => c.Participants);
        startListData.value = participants.map((participant) => {
          const { firstname, lastname } = splitName(participant.Name);
          return {
            ...participant,
            Firstname: firstname,
            Lastname: lastname,
          };
        });
        console.log("startListData:", startListData.value); // Log the processed data
        alert("Start list fetched successfully");
      } else {
        alert("No classes found in response");
      }
    }
  } catch (error) {
    console.error("Error fetching start list:", error);
    alert("Failed to fetch start list");
  } finally {
    loading.value = false;
  }
};

const fetchDOBFromBirthdaySe = async (firstname, lastname, yob) => {
  const url = `/api/birthdayse?firstname=${encodeURIComponent(
    firstname
  )}&lastname=${encodeURIComponent(lastname)}&yob=${yob}`;
  console.log("Fetching DOB from URL:", url); // Log the URL

  const response = await fetch(url);
  const data = await response.json();
  console.log("Response from birthday.se:", data); // Log the response

  if (data.error) {
    console.error("Error fetching DOB:", data.error);
    return null;
  }

  return formatDate(data.dob);
};

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkDOBs = async () => {
  const fetchDOB = async (participant) => {
    if (
      participant.Firstname &&
      participant.Lastname &&
      participant.YOB &&
      !participant.DOB
    ) {
      const dob = await fetchDOBFromBirthdaySe(
        participant.Firstname,
        participant.Lastname,
        participant.YOB
      );
      if (dob) {
        participant.DOB = dob;
      }
    }
  };

  // Use the limiter to handle rate-limited requests
  for (const participant of startListData.value) {
    await limiter.schedule(() => fetchDOB(participant));
  }
  alert("DOB check completed");
};

const downloadExcel = () => {
  const worksheetData = startListData.value.map((participant) => ({
    Firstname: participant.Firstname,
    Lastname: participant.Lastname,
    "Year of Birth": participant.YOB,
    Gender: participant.Gender === "Man" ? "M" : "F",
    "Club or City": participant.ClubCityCompany,
    DOB: participant.DOB || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [[`${eventUrl.value}`]]);
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A2",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Start List");

  const fileName = `StartList-AnmalMig.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const downloadITRA = () => {
  const worksheetData = startListData.value.map((participant) => ({
    "Family name": participant.Lastname,
    "First Name": participant.Firstname,
    Birthdate: participant.DOB ? formatDate(participant.DOB) : participant.YOB,
    Gender: participant.Gender === "Man" ? "M" : "F",
    "ITRA ID (optional)": "",
    "Bib number (optional)": "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData, { cellText: true });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ITRA List");

  const fileName = `ITRA-List.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const checkDUV = async () => {
  if (!startListData.value.length) {
    alert("No start list data to check.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("delim[]", "1"); // Tab delimiter
  formData.append("lname", "1"); // Surname column
  formData.append("fname", "2"); // First name column
  formData.append("gender", "3"); // Gender column
  formData.append("yob", "4"); // Year of birth column
  formData.append("dob", "5"); // Date of birth column
  formData.append("mode", "pb");
  formData.append("dist", ""); // No specific distance selected

  const participantsData = startListData.value
    .map((participant) => {
      const { Firstname, Lastname, Gender, YOB, DOB } = participant;
      return `${Lastname}\t${Firstname}\t${
        Gender === "Man" ? "M" : "F"
      }\t${YOB}\t${DOB || ""}`;
    })
    .join("\n");

  formData.append("startlist", participantsData);

  try {
    const response = await fetch("/api/duv", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("DUV Response Data:", responseData);
      // Process the extracted data as needed
      alert("DUV check completed");
    } else {
      console.error("Error submitting to DUV:", response.statusText);
      alert("Failed to check DUV");
    }
  } catch (error) {
    console.error("Error submitting to DUV:", error);
    alert("Failed to check DUV");
  }
};
</script>
