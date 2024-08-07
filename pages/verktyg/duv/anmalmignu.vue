<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">AnmälMigNu Start List Fetcher</h1>
    <div v-if="classDistance" class="text-xl font-semibold mb-4">
      Class Distance: {{ classDistance }}
    </div>
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
      <button
        @click="checkUTMBIndex"
        :disabled="!startListData.length"
        class="bg-indigo-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Check UTMB Index
      </button>
      <button
        @click="openGoogleSheet"
        :disabled="!startListData.length"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Open as Google Sheet
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
    <div v-if="checkingDOBs" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Checking DOBs...</h2>
      <progress :value="progress" max="100" class="w-full"></progress>
      <p>{{ progress }}% completed</p>
      <p>Elapsed time: {{ elapsedTime }}</p>
      <p>Estimated remaining time: {{ estimatedTimeRemaining }}</p>
    </div>
    <div v-if="checkingUTMB" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Checking UTMB Index...</h2>
      <progress :value="progress" max="100" class="w-full"></progress>
      <p>{{ progress }}% completed</p>
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
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              UTMB Index
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              Nationality
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-black whitespace-nowrap"
            >
              First Search Result
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
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              <span v-if="typeof participant.UTMBIndex === 'number'">{{
                participant.UTMBIndex
              }}</span>
              <span v-else v-html="participant.UTMBIndex"></span>
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Nationality || "" }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.FirstSearchResult || "" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFetch } from "#app";
import * as XLSX from "xlsx";
import Bottleneck from "bottleneck";
import leven from "leven";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const eventUrl = ref("");
const startListData = ref([]);
const classDistance = ref("");
const loading = ref(false);
const checkingDOBs = ref(false);
const checkingUTMB = ref(false);
const progress = ref(0);
const elapsedTime = ref("0s");
const estimatedTimeRemaining = ref("Calculating...");

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

const initGoogleAPI = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: "YOUR_API_KEY", // replace with your actual API key
        clientId: "YOUR_CLIENT_ID", // replace with your actual client ID
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
        ],
        scope: "https://www.googleapis.com/auth/spreadsheets",
      })
      .then(() => {
        console.log("Google API initialized");
      })
      .catch((error) => {
        console.error("Error initializing Google API", error);
      });
  });
};

onMounted(() => {
  if (window.gapi) {
    initGoogleAPI();
  } else {
    console.error("Google API script not loaded");
  }
});

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
        classDistance.value = classes[0]?.ClassDistance || "Unknown Distance";
        const participants = classes.flatMap((c) => c.Participants);
        startListData.value = participants.map((participant) => {
          const { firstname, lastname } = splitName(participant.Name);
          return {
            ...participant,
            Firstname: firstname,
            Lastname: lastname,
            UTMBIndex: "N/A",
            Nationality: "N/A",
            FirstSearchResult: "",
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
  checkingDOBs.value = true;
  progress.value = 0;
  elapsedTime.value = "0s";
  estimatedTimeRemaining.value = "Calculating...";
  const startTime = Date.now();

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

  const totalParticipants = startListData.value.length;

  // Use the limiter to handle rate-limited requests
  for (let i = 0; i < totalParticipants; i++) {
    await limiter.schedule(() => fetchDOB(startListData.value[i]));
    progress.value = Math.round(((i + 1) / totalParticipants) * 100);

    // Update elapsed time
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    elapsedTime.value = `${elapsed}s`;

    // Estimate remaining time
    const remaining = Math.floor(
      (elapsed / (i + 1)) * (totalParticipants - (i + 1))
    );
    estimatedTimeRemaining.value = `${remaining}s`;
  }

  checkingDOBs.value = false;
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
    UTMBIndex:
      typeof participant.UTMBIndex === "number" ? participant.UTMBIndex : "",
    Nationality: participant.Nationality || "",
    "First Search Result": participant.FirstSearchResult || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [[`${eventUrl.value}`]]);
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A2",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Start List");

  const fileName = `StartList-${classDistance.value}.xlsx`;
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

  const fileName = `ITRA-List-${classDistance.value}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const openGoogleSheet = async () => {
  const worksheetData = startListData.value.map((participant) => ({
    Firstname: participant.Firstname,
    Lastname: participant.Lastname,
    "Year of Birth": participant.YOB,
    Gender: participant.Gender === "Man" ? "M" : "F",
    "Club or City": participant.ClubCityCompany,
    DOB: participant.DOB || "",
    UTMBIndex: participant.UTMBIndex || "",
    Nationality: participant.Nationality || "",
    "First Search Result": participant.FirstSearchResult || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [[`${eventUrl.value}`]]);
  XLSX.utils.sheet_add_json(worksheet, worksheetData, {
    origin: "A2",
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Start List");

  const fileName = `StartList-${classDistance.value}.xlsx`;
  const fileData = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

  const blob = new Blob([s2ab(fileData)], { type: "application/octet-stream" });
  const formData = new FormData();
  formData.append("file", blob, fileName);

  if (window.gapi) {
    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + window.gapi.auth.getToken().access_token,
        }),
        body: formData,
      }
    );

    const result = await response.json();
    const fileId = result.id;
    const url = `https://docs.google.com/spreadsheets/d/${fileId}`;
    window.open(url, "_blank");
  } else {
    alert("Google API not initialized.");
  }
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

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

import { remove as removeDiacritics } from "diacritics";

const checkUTMBIndex = async () => {
  checkingUTMB.value = true;
  progress.value = 0;

  const fetchUTMBIndex = async (participant) => {
    const url = `/api/utmb-index?firstname=${encodeURIComponent(
      participant.Firstname
    )}&lastname=${encodeURIComponent(participant.Lastname)}`;

    console.log("Fetching UTMB Index from URL:", url); // Log the URL

    const response = await fetch(url);
    const data = await response.json();
    console.log("Response from UTMB API:", data); // Log the response

    if (data.runners && data.runners.length > 0) {
      const normalizeName = (name) => {
        // Remove diacritics and handle specific replacements
        let normalized = removeDiacritics(name)
          .toLowerCase()
          .replace(/[\s\-]/g, "");
        normalized = normalized
          .replace(/ä/g, "a")
          .replace(/ö/g, "o")
          .replace(/å/g, "a");
        normalized = normalized
          .replace(/ae/g, "a")
          .replace(/oe/g, "o")
          .replace(/aa/g, "a");
        return normalized;
      };

      const participantFirstName = normalizeName(participant.Firstname);
      const participantLastName = normalizeName(participant.Lastname);
      const participantYOB = parseInt(participant.YOB, 10);
      const currentYear = new Date().getFullYear();
      const participantAge = currentYear - participantYOB;

      // Find the best match based on name and age group
      const bestMatch = data.runners.find((runner) => {
        const runnerName = normalizeName(runner.fullname);
        const nameMatch =
          runnerName.includes(participantFirstName) &&
          runnerName.includes(participantLastName);

        const ageGroup = runner.ageGroup.split("-");
        const ageMin = parseInt(ageGroup[0], 10);
        const ageMax = parseInt(ageGroup[1], 10);
        const ageMatch = participantAge >= ageMin && participantAge <= ageMax;

        return nameMatch && ageMatch;
      });

      // Add first search result for manual verification
      const firstRunner = data.runners[0];
      participant.FirstSearchResult = firstRunner.fullname;

      if (bestMatch) {
        participant.UTMBIndex = bestMatch.ip;
        participant.Nationality =
          countries.alpha2ToAlpha3(bestMatch.nationality) ||
          bestMatch.nationality;
      } else {
        participant.UTMBIndex = "N/A";
        participant.Nationality = "N/A";
      }
    } else {
      participant.UTMBIndex = "Not found";
      participant.Nationality = "N/A";
      participant.FirstSearchResult = "N/A";
    }
  };

  const totalParticipants = startListData.value.length;

  for (let i = 0; i < totalParticipants; i++) {
    await fetchUTMBIndex(startListData.value[i]);
    progress.value = Math.round(((i + 1) / totalParticipants) * 100);
  }

  checkingUTMB.value = false;
  alert("UTMB Index check completed");
};
</script>
