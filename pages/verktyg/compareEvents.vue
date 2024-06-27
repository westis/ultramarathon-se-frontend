<template>
  <div class="p-6">
    <textarea
      v-model="itraData"
      class="w-full h-64 p-2 border border-gray-300 rounded mb-4"
      placeholder="Paste ITRA data here..."
    ></textarea>
    <button
      @click="fetchAndCompare"
      class="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Compare Events
    </button>

    <!-- New Buttons for Bookmarklet Functionalities -->
    <div class="mt-4">
      <button
        @click="openAndPrefillForm"
        class="px-4 py-2 bg-green-600 text-white rounded"
      >
        Open ITRA and Prefill Form
      </button>
      <button
        @click="copyRacePopupsHTML"
        class="px-4 py-2 bg-yellow-600 text-white rounded"
      >
        Copy Race Popups HTML
      </button>
    </div>

    <div v-if="loading" class="mt-4">Loading events...</div>

    <div v-if="!loading && mergedEvents.length">
      <h3 class="mt-6 text-xl">Source URLs</h3>
      <ul class="list-disc pl-6">
        <li>
          <a :href="duvUrl" target="_blank" class="text-blue-500 underline"
            >DUV Data Source</a
          >
        </li>
        <li>
          <a :href="utmbUrl" target="_blank" class="text-blue-500 underline"
            >UTMB Data Source</a
          >
        </li>
      </ul>

      <h3 class="mt-6 text-xl">Missing results at DUV</h3>
      <table class="mt-6 w-full border-collapse text-center">
        <thead>
          <tr>
            <th class="header-cell border p-2">Name</th>
            <th class="header-cell border p-2">Date</th>
            <th class="header-cell border p-2">Distance (km)</th>
            <th class="header-cell border p-2">DUV</th>
            <th class="header-cell border p-2">ITRA</th>
            <th class="header-cell border p-2">UTMB</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in missingResultsAtDuv"
            :key="event.name + event.date"
          >
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.name }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.date }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.distance }}
            </td>
            <td
              v-if="event.distance >= 45"
              :class="
                getResultColorClass(event.sources.DUV, event.hasResults?.DUV)
              "
              class="border p-2"
            >
              <template v-if="event.sources.DUV">
                <a
                  :href="`https://statistik.d-u-v.org/getresultevent.php?event=${event.duvEventID}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.DUV">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td v-else class="border p-2"></td>
            <td
              :class="
                getResultColorClass(event.sources.ITRA, event.hasResults?.ITRA)
              "
              class="border p-2"
            >
              <template v-if="event.sources.ITRA">
                <a
                  :href="`https://itra.run${event.itraUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.ITRA">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td
              :class="
                getResultColorClass(event.sources.UTMB, event.hasResults?.UTMB)
              "
              class="border p-2"
            >
              <template v-if="event.sources.UTMB">
                <a
                  :href="`https://utmb.world/utmb-index/races/${event.utmbUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.UTMB">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="mt-6 text-xl">Missing results at ITRA</h3>
      <table class="mt-6 w-full border-collapse text-center">
        <thead>
          <tr>
            <th class="header-cell border p-2">Name</th>
            <th class="header-cell border p-2">Date</th>
            <th class="header-cell border p-2">Distance (km)</th>
            <th class="header-cell border p-2">DUV</th>
            <th class="header-cell border p-2">ITRA</th>
            <th class="header-cell border p-2">UTMB</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in missingResultsAtItra"
            :key="event.name + event.date"
          >
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.name }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.date }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.distance }}
            </td>
            <td
              v-if="event.distance >= 45"
              :class="
                getResultColorClass(event.sources.DUV, event.hasResults?.DUV)
              "
              class="border p-2"
            >
              <template v-if="event.sources.DUV">
                <a
                  :href="`https://statistik.d-u-v.org/getresultevent.php?event=${event.duvEventID}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.DUV">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td v-else class="border p-2"></td>
            <td
              :class="
                getResultColorClass(event.sources.ITRA, event.hasResults?.ITRA)
              "
              class="border p-2"
            >
              <template v-if="event.sources.ITRA">
                <a
                  :href="`https://itra.run${event.itraUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.ITRA">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td
              :class="
                getResultColorClass(event.sources.UTMB, event.hasResults?.UTMB)
              "
              class="border p-2"
            >
              <template v-if="event.sources.UTMB">
                <a
                  :href="`https://utmb.world/utmb-index/races/${event.utmbUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.UTMB">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="mt-6 text-xl">Missing in DUV Calendar</h3>
      <table class="mt-6 w-full border-collapse text-center">
        <thead>
          <tr>
            <th class="header-cell border p-2">Name</th>
            <th class="header-cell border p-2">Date</th>
            <th class="header-cell border p-2">Distance (km)</th>
            <th class="header-cell border p-2">DUV</th>
            <th class="header-cell border p-2">ITRA</th>
            <th class="header-cell border p-2">UTMB</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in missingInDuvCalendar"
            :key="event.name + event.date"
          >
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.name }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.date }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.distance }}
            </td>
            <td
              v-if="event.distance >= 45"
              :class="
                getResultColorClass(event.sources.DUV, event.hasResults?.DUV)
              "
              class="border p-2"
            >
              <template v-if="event.sources.DUV">
                <a
                  :href="`https://statistik.d-u-v.org/getresultevent.php?event=${event.duvEventID}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.DUV">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td v-else class="border p-2"></td>
            <td
              :class="
                getResultColorClass(event.sources.ITRA, event.hasResults?.ITRA)
              "
              class="border p-2"
            >
              <template v-if="event.sources.ITRA">
                <a
                  :href="`https://itra.run${event.itraUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.ITRA">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td
              :class="
                getResultColorClass(event.sources.UTMB, event.hasResults?.UTMB)
              "
              class="border p-2"
            >
              <template v-if="event.sources.UTMB">
                <a
                  :href="`https://utmb.world/utmb-index/races/${event.utmbUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.UTMB">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="mt-6 text-xl">Missing in ITRA Calendar</h3>
      <table class="mt-6 w-full border-collapse text-center">
        <thead>
          <tr>
            <th class="header-cell border p-2">Name</th>
            <th class="header-cell border p-2">Date</th>
            <th class="header-cell border p-2">Distance (km)</th>
            <th class="header-cell border p-2">DUV</th>
            <th class="header-cell border p-2">ITRA</th>
            <th class="header-cell border p-2">UTMB</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in missingInItraCalendar"
            :key="event.name + event.date"
          >
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.name }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.date }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.distance }}
            </td>
            <td
              v-if="event.distance >= 45"
              :class="
                getResultColorClass(event.sources.DUV, event.hasResults?.DUV)
              "
              class="border p-2"
            >
              <template v-if="event.sources.DUV">
                <a
                  :href="`https://statistik.d-u-v.org/getresultevent.php?event=${event.duvEventID}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.DUV">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td v-else class="border p-2"></td>
            <td
              :class="
                getResultColorClass(event.sources.ITRA, event.hasResults?.ITRA)
              "
              class="border p-2"
            >
              <template v-if="event.sources.ITRA">
                <a
                  :href="`https://itra.run${event.itraUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.ITRA">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td
              :class="
                getResultColorClass(event.sources.UTMB, event.hasResults?.UTMB)
              "
              class="border p-2"
            >
              <template v-if="event.sources.UTMB">
                <a
                  :href="`https://utmb.world/utmb-index/races/${event.utmbUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.UTMB">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="mt-6 text-xl">UTMB Only</h3>
      <table class="mt-6 w-full border-collapse text-center">
        <thead>
          <tr>
            <th class="header-cell border p-2">Name</th>
            <th class="header-cell border p-2">Date</th>
            <th class="header-cell border p-2">Distance (km)</th>
            <th class="header-cell border p-2">DUV</th>
            <th class="header-cell border p-2">ITRA</th>
            <th class="header-cell border p-2">UTMB</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in utmbOnly" :key="event.name + event.date">
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.name }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.date }}
            </td>
            <td
              :class="getOverallColorClass(event.sources, event.hasResults)"
              class="border p-2"
            >
              {{ event.distance }}
            </td>
            <td
              v-if="event.distance >= 45"
              :class="
                getResultColorClass(event.sources.DUV, event.hasResults?.DUV)
              "
              class="border p-2"
            >
              <template v-if="event.sources.DUV">
                <a
                  :href="`https://statistik.d-u-v.org/getresultevent.php?event=${event.duvEventID}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.DUV">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td v-else class="border p-2"></td>
            <td
              :class="
                getResultColorClass(event.sources.ITRA, event.hasResults?.ITRA)
              "
              class="border p-2"
            >
              <template v-if="event.sources.ITRA">
                <a
                  :href="`https://itra.run${event.itraUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.ITRA">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
            <td
              :class="
                getResultColorClass(event.sources.UTMB, event.hasResults?.UTMB)
              "
              class="border p-2"
            >
              <template v-if="event.sources.UTMB">
                <a
                  :href="`https://utmb.world/utmb-index/races/${event.utmbUriResults}`"
                  class="text-black underline"
                  target="_blank"
                >
                  <span v-if="event.hasResults?.UTMB">OK</span>
                  <span v-else>Results Missing</span>
                </a>
              </template>
              <template v-else>Race Missing</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTrailEvents } from "@/composables/useTrailEvents";
import { mergeEvents } from "@/utils/mergeEvents";

const duvUrl = ref("");
const utmbUrl = ref("");

const {
  duvEvents,
  utmbEvents,
  itraEvents,
  fetchDuvEvents,
  fetchUtmbEvents,
  setItraEvents,
} = useTrailEvents();
const itraData = ref<string>("");
const mergedEvents = ref<any[]>([]);
const loading = ref<boolean>(false);

const fetchAndCompare = async () => {
  loading.value = true;
  const today = new Date();
  const oneYearAgo = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const oneYearFromNow = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const cacheBuster = new Date().getTime(); // Cache-busting parameter

  duvUrl.value = `https://statistik.d-u-v.org/json/mcalendar.php?&country=SWE&from=${oneYearAgo}&to=${oneYearFromNow}&order=asc&dist=Trail&_=${cacheBuster}`;
  utmbUrl.value = `https://api.utmb.world/search/races-qualifiers?lang=en&countryCodes=SE&limit=10&dateMin=${oneYearAgo}&dateMax=${oneYearFromNow}&_=${cacheBuster}`;

  console.log("Fetching DUV events...");
  console.log("DUV URL:", duvUrl.value);
  const duvResponse = await fetchDuvEvents();
  console.log("DUV Response:", duvResponse);
  console.log("DUV events:", duvEvents.value);

  console.log("Fetching UTMB events...");
  console.log("UTMB URL:", utmbUrl.value);
  const utmbResponse = await fetchUtmbEvents();
  console.log("UTMB Response:", utmbResponse);
  console.log("UTMB events:", utmbEvents.value);

  console.log("Parsing ITRA data...");
  const parsedItraEvents = parseItraData(itraData.value);
  console.log("Parsed ITRA events:", parsedItraEvents);
  setItraEvents(parsedItraEvents);

  mergedEvents.value = mergeEvents(
    duvEvents.value,
    utmbEvents.value,
    itraEvents.value
  );
  console.log("Merged events with hasResults:", mergedEvents.value);
  loading.value = false;
};

const parseItraData = (data: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  const events: any[] = [];

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split(/[\s-]+/);
    if (parts.length === 3) {
      return `${parts[2]}-${(
        "0" +
        ([
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(parts[1]) +
          1)
      ).slice(-2)}-${("0" + parts[0]).slice(-2)}`;
    } else if (parts.length === 4) {
      return `${parts[3]}-${(
        "0" +
        ([
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(parts[2]) +
          1)
      ).slice(-2)}-${("0" + parts[0]).slice(-2)}`;
    }
    return null;
  };

  doc.querySelectorAll(".row.row-result").forEach((row) => {
    const eventName =
      row.querySelector(".event_name h4")?.textContent?.trim() || "";
    const dateStr =
      row.querySelector(".date")?.textContent?.trim().replace(/\s+/g, " ") ||
      "";
    const date = parseDate(dateStr) || "";
    console.log("Event:", eventName, "Date:", dateStr, "Parsed Date:", date);
    row.querySelectorAll(".boxes a").forEach((race) => {
      const distance =
        race.querySelector(".count")?.textContent?.replace("k", "").trim() ||
        "";
      const hasResults = race.querySelector('img[src$="green.svg"]') !== null;
      const itraUriResults = race.getAttribute("href");
      if (eventName && date && distance && itraUriResults) {
        events.push({
          name: eventName,
          date,
          distance: parseFloat(distance),
          source: "ITRA",
          hasResults,
          itraUriResults,
        });
        console.log("Race:", {
          name: eventName,
          date,
          distance,
          hasResults,
          itraUriResults,
        });
      }
    });
  });

  console.log("Parsed ITRA events:", events);
  return events;
};

const getResultColorClass = (
  source: boolean | undefined,
  hasResults: boolean | undefined
) => {
  console.log(
    `getResultColorClass called with source: ${source}, hasResults: ${hasResults}`
  );
  if (!source) {
    return "bg-red-500 text-white";
  } else if (source && !hasResults) {
    return "bg-yellow-500 text-black";
  } else if (source && hasResults) {
    return "bg-green-500 text-white";
  }
  return "";
};

const getOverallColorClass = (
  sources: { DUV?: boolean; ITRA?: boolean; UTMB?: boolean },
  hasResults: { DUV?: boolean; ITRA?: boolean }
) => {
  const hasDuv = sources.DUV;
  const hasItra = sources.ITRA;
  const hasDuvResults = hasResults?.DUV;
  const hasItraResults = hasResults?.ITRA;

  console.log(
    `getOverallColorClass called with DUV: ${hasDuv}, ITRA: ${hasItra}, DUV Results: ${hasDuvResults}, ITRA Results: ${hasItraResults}`
  );

  if (hasDuv && hasItra) {
    if (hasDuvResults && hasItraResults) {
      return "bg-green-500 text-white";
    } else {
      return "bg-yellow-500 text-black";
    }
  } else if (hasDuv || hasItra) {
    return "bg-yellow-500 text-black";
  } else {
    return "bg-red-500 text-white";
  }
};

const isPastEvent = (event: any) => {
  const today = new Date();
  const eventDate = new Date(event.date);
  return eventDate < today;
};

const missingResultsAtDuv = computed(() => {
  return mergedEvents.value.filter(
    (event) => isPastEvent(event) && event.sources.DUV && !event.hasResults.DUV
  );
});

const missingResultsAtItra = computed(() => {
  return mergedEvents.value.filter(
    (event) =>
      isPastEvent(event) && event.sources.ITRA && !event.hasResults.ITRA
  );
});

const missingInDuvCalendar = computed(() => {
  return mergedEvents.value.filter(
    (event) => !event.sources.DUV && event.distance >= 45
  );
});

const missingInItraCalendar = computed(() => {
  return mergedEvents.value.filter((event) => !event.sources.ITRA);
});

const utmbOnly = computed(() => {
  return mergedEvents.value.filter(
    (event) => event.sources.UTMB && !event.sources.DUV && !event.sources.ITRA
  );
});

const openAndPrefillForm = () => {
  const newWindow = window.open(
    "https://itra.run/Races/RaceCalendar",
    "_blank"
  );
  if (newWindow) {
    const interval = setInterval(() => {
      if (newWindow.document.readyState === "complete") {
        clearInterval(interval);
        const scriptContent = `
          (function() {
            function waitForElement(selector, callback) {
              const element = document.querySelector(selector);
              if (element) {
                callback(element);
              } else {
                setTimeout(() => waitForElement(selector, callback), 100);
              }
            }

            function prefillForm() {
              var today = new Date();
              var oneYearAgo = new Date(today);
              var oneYearFromNow = new Date(today);
              oneYearAgo.setFullYear(today.getFullYear() - 1);
              oneYearFromNow.setFullYear(today.getFullYear() + 1);

              var formatDate = function(date) {
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
                var yyyy = date.getFullYear();
                return dd + '-' + mm + '-' + yyyy;
              };

              waitForElement("select[name='Input.Country']", function(countryFilter) {
                for (var i = 0; i < countryFilter.options.length; i++) {
                  if (countryFilter.options[i].value === "SE") {
                    countryFilter.options[i].selected = true;
                    break;
                  }
                }
                countryFilter.dispatchEvent(new Event('change'));
              });

              waitForElement("#Input_MinDistance", function(minDistance) {
                minDistance.value = 30;
              });

              waitForElement("#Input_MaxDistance", function(maxDistance) {
                maxDistance.value = 500;
              });

              waitForElement("#Input_DateStart", function(dateStart) {
                dateStart.value = formatDate(oneYearAgo);
              });

              waitForElement("#Input_DateEnd", function(dateEnd) {
                dateEnd.value = formatDate(oneYearFromNow);
              });

              function clickLoadMore() {
                var loadMoreButton = document.getElementById("loadmore");
                if (loadMoreButton) {
                  console.log("Clicking Load More button");
                  loadMoreButton.click();
                  setTimeout(clickLoadMore, 3000); // Wait 3 seconds before clicking again
                } else {
                  console.log("Load More button not found");
                }
              }

              setTimeout(clickLoadMore, 3000); // Initial delay before starting to click load more

              waitForElement("#searchForm", function(form) {
                form.submit();
              });
            }

            prefillForm();
          })();
        `;
        injectScriptInNewWindow(scriptContent, newWindow);
      }
    }, 100);
  } else {
    alert("Popup blocked! Please allow popups for this site.");
  }
};

const copyRacePopupsHTML = () => {
  const scriptContent = `
    (function() {
      function copyRacePopupsHTML() {
        var racePopupsDiv = document.getElementById("racepopus");
        if (racePopupsDiv) {
          var htmlContent = racePopupsDiv.innerHTML;
          var tempTextarea = document.createElement("textarea");
          tempTextarea.value = htmlContent;
          document.body.appendChild(tempTextarea);
          tempTextarea.select();
          document.execCommand("copy");
          document.body.removeChild(tempTextarea);
          alert("Race popups HTML copied to clipboard!");
        } else {
          alert("Race popups div not found.");
        }
      }
      
      copyRacePopupsHTML();
    })();
  `;
  injectScriptInNewWindow(scriptContent, window);
};

const injectScriptInNewWindow = (scriptContent: string, newWindow: Window) => {
  const script = newWindow.document.createElement("script");
  script.type = "text/javascript";
  script.text = scriptContent;
  newWindow.document.head.appendChild(script);
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
}
.bg-green-500 {
  background-color: #2f855a; /* Darker green */
}
.bg-yellow-500 {
  background-color: #ecc94b;
}
.bg-red-500 {
  background-color: #c53030; /* Darker red */
}
.text-white {
  color: #ffffff;
}
.text-black {
  color: #000000;
}
.header-cell {
  background-color: #f8f9fa; /* Light background */
  color: #343a40; /* Dark text */
}
</style>
