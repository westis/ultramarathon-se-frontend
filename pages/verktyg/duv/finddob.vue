<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Find Dates of Birth</h1>
    <div class="mb-4">
      <textarea
        v-model="spreadsheetData"
        placeholder="Paste spreadsheet data here"
        class="border border-gray-300 p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        rows="10"
      ></textarea>
    </div>
    <div class="flex space-x-2">
      <button
        @click="processData"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Process Data
      </button>
      <button
        @click="checkDUV"
        :disabled="!participants.length"
        class="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Check DUV
      </button>
      <button
        @click="checkBirthdaySe"
        :disabled="!participants.length"
        class="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Check birthday.se
      </button>
    </div>
    <div class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Participants</h2>
      <table
        class="min-w-full bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
      >
        <thead class="bg-gray-200 dark:bg-gray-900">
          <tr>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              Firstname
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              Lastname
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              Year of Birth
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              City
            </th>
            <th
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              DOB
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="participant in participants"
            :key="participant.id"
            :class="{ 'updated-row': participant.updated }"
            class="dark:bg-gray-700"
          >
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Fname }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.Lname }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.YOB }}
            </td>
            <td
              class="py-2 px-4 border-b dark:border-gray-600 dark:text-white whitespace-nowrap"
            >
              {{ participant.City }}
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
    <div v-if="loading" class="mt-4 flex justify-center">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Bottleneck from "bottleneck";

const spreadsheetData = ref("");
const participants = ref([]);
const loading = ref(false);

const limiter = new Bottleneck({
  minTime: 6000, // 1 request every 6 seconds
  maxConcurrent: 1,
});

const processData = () => {
  const lines = spreadsheetData.value.split("\n");
  const headers = lines[0].split("\t");

  const yobIndex = headers.indexOf("YOB");
  const fnameIndex =
    headers.indexOf("Fname") !== -1
      ? headers.indexOf("Fname")
      : headers.indexOf("Firstname");
  const lnameIndex =
    headers.indexOf("Lname") !== -1
      ? headers.indexOf("Lname")
      : headers.indexOf("Lastname");
  const cityIndex = headers.indexOf("City");
  const dobIndex = headers.indexOf("DOB");

  if (yobIndex === -1 || fnameIndex === -1 || lnameIndex === -1) {
    alert("YOB, Fname/Firstname, and Lname/Lastname headers are compulsory.");
    return;
  }

  participants.value = lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return {
      id: `${cells[fnameIndex]}_${cells[lnameIndex]}_${cells[yobIndex]}`,
      Fname: cells[fnameIndex],
      Lname: cells[lnameIndex],
      YOB: cells[yobIndex],
      City: cityIndex !== -1 ? cells[cityIndex] : "",
      DOB: dobIndex !== -1 ? cells[dobIndex] : "",
      updated: false,
    };
  });
};

const fetchDOBFromBirthdaySe = async (firstname, lastname, yob) => {
  const url = `/api/birthdayse?firstname=${encodeURIComponent(
    firstname
  )}&lastname=${encodeURIComponent(lastname)}&yob=${yob}`;
  console.log(
    `Fetching DOB from birthday.se for ${firstname} ${lastname} (YOB: ${yob})`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("Response from birthday.se:", data);
  return data.dob ? formatDOB(data.dob) : null;
};

const fetchDOBFromDUV = async (participant) => {
  const formData = new URLSearchParams();
  formData.append("lname", participant.Lname);
  formData.append("fname", participant.Fname);
  formData.append("yob", participant.YOB);
  formData.append("city", participant.City);

  console.log(
    `Fetching DOB from DUV for ${participant.Fname} ${participant.Lname} (YOB: ${participant.YOB})`
  );

  const response = await fetch("/api/duv", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Response from DUV:", data);
  return data.dob ? formatDOB(data.dob) : null;
};

const formatDOB = (dob) => {
  const [year, month, day] = dob.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const checkDUV = async () => {
  console.log("Checking DUV...");
  loading.value = true;

  const fetchDOB = async (participant) => {
    if (!participant.DOB) {
      console.log(
        `Checking participant: ${participant.Fname} ${participant.Lname} (YOB: ${participant.YOB})`
      );
      const dob = await fetchDOBFromDUV(participant);
      if (dob) {
        participant.DOB = dob;
        participant.updated = true;
        console.log(
          `Found DOB for ${participant.Fname} ${participant.Lname}: ${dob}`
        );
      } else {
        console.log(
          `No DOB found for ${participant.Fname} ${participant.Lname}`
        );
      }
    }
  };

  const participantsWithoutDOB = participants.value.filter((p) => !p.DOB);
  console.log(`Participants without DOB: ${participantsWithoutDOB.length}`);

  for (const participant of participantsWithoutDOB) {
    await limiter.schedule(() => fetchDOB(participant));
  }

  loading.value = false;
  alert("DUV check completed");
  console.log("DUV check completed");
};

const checkBirthdaySe = async () => {
  console.log("Checking birthday.se...");
  loading.value = true;

  const fetchDOB = async (participant) => {
    if (!participant.DOB) {
      console.log(
        `Checking participant: ${participant.Fname} ${participant.Lname} (YOB: ${participant.YOB})`
      );
      const dob = await fetchDOBFromBirthdaySe(
        participant.Fname,
        participant.Lname,
        participant.YOB
      );
      if (dob) {
        participant.DOB = dob;
        participant.updated = true;
        console.log(
          `Found DOB for ${participant.Fname} ${participant.Lname}: ${dob}`
        );
      } else {
        console.log(
          `No DOB found for ${participant.Fname} ${participant.Lname}`
        );
      }
    }
  };

  const participantsWithoutDOB = participants.value.filter((p) => !p.DOB);
  console.log(`Participants without DOB: ${participantsWithoutDOB.length}`);

  for (const participant of participantsWithoutDOB) {
    await limiter.schedule(() => fetchDOB(participant));
  }

  loading.value = false;
  alert("birthday.se check completed");
  console.log("birthday.se check completed");
};
</script>

<style scoped>
.updated-row {
  background-color: #d4edda; /* Light green */
  dark: bg-green-900; /* Dark green */
}
</style>
