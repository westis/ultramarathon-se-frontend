<template>
  <div class="container mx-auto px-4 py-4">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-300">
      Tävlingar utan resultat
    </h1>
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
          >
            Datum
          </th>
          <th
            scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
          >
            Namn
          </th>
          <th
            scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
          >
            Typ
          </th>
          <th
            scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
          >
            Webbplats
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="race in races"
          :key="race.EventID"
          class="transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td
            class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
          >
            {{ race.Startdate }}
          </td>
          <td
            class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
          >
            {{ race.EventID }}
          </td>
          <td
            class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
          >
            <a
              target="_blank"
              :href="`https://statistik.d-u-v.org/getresultevent.php?event=${race.EventID}`"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
            >
              {{ race.EventName }}
            </a>
          </td>
          <td
            class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
          >
            {{ translateEventType(race.EventType) }}
          </td>
          <td
            class="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
          >
            <a
              v-if="race.url !== '#'"
              :href="race.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
              >Besök</a
            >
            <span v-else>N/A</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

const races = ref([]);
const eventTypesSwedish = [
  "väg",
  "trail",
  "väg på slinga",
  "etapplopp",
  "bana",
  "inomhus",
  "ej tävling",
  "inbjudningstävling",
  "elimineringslopp",
  "backyard ultra",
  "gång, väg",
  "gång, väg på slinga",
  "gång, bana",
  "gång,  inomhus",
];

async function fetchEventURL(eventID) {
  try {
    const response = await fetch(
      `https://statistik.d-u-v.org/json/mgetresultevent.php?event=${eventID}`
    );
    const eventData = await response.json();
    return eventData.EvtHeader.URL || "#"; // Return '#' or a placeholder if URL is not available
  } catch {
    return "#"; // In case of an error, return a placeholder
  }
}

onMounted(async () => {
  const response = await fetch(
    "https://statistik.d-u-v.org/json/mcalendar.php?year=past1&dist=all&country=SWE&cups=all&rproof=0&mode=list&radius=&norslt=1"
  );
  const data = await response.json();

  // Sequentially fetch URLs for each race (Consider optimizing for large datasets)
  for (const race of data.Races) {
    const url = await fetchEventURL(race.EventID);
    races.value.push({
      ...race,
      url, // Add fetched URL to each race
    });
  }
});

const translateEventType = (eventType) => {
  const index = parseInt(eventType, 10) - 1;
  return eventTypesSwedish[index] || "Okänd typ";
};
</script>
