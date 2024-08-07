<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold dark:text-white">Swedish Runners</h1>
      <div>
        <button
          @click="stopFetching"
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Stop
        </button>
        <button
          @click="fetchAllRunners"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
        >
          Fetch Runners
        </button>
        <button
          @click="clearStorage"
          class="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded ml-2"
        >
          Clear Storage
        </button>
        <button
          @click="downloadData"
          class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-2"
        >
          Download Data
        </button>
      </div>
    </div>
    <p class="mb-4 dark:text-gray-300">
      Runners in local storage: {{ storedRunnersCount }}
    </p>
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="Search runners"
      class="mb-4 p-2 border border-gray-300 rounded w-full"
    />
    <p class="dark:text-gray-300">{{ progress }}</p>
    <p class="mb-4 dark:text-gray-300">
      Total Runners Found: {{ filteredRunners.length }}
    </p>
    <table
      class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
    >
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-700">
          <th class="py-2 px-4 border-b dark:border-gray-600">PersonID</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">ParentID</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">LastName</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">FirstName</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">DOB</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">YOB</th>
          <th class="py-2 px-4 border-b dark:border-gray-600">
            Number of Events
          </th>
          <th class="py-2 px-4 border-b dark:border-gray-600">Years Active</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="runner in paginatedRunners"
          :key="runner.PersonID"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="py-2 px-4 border-b dark:border-gray-600">
            <a
              :href="`https://statistik.d-u-v.org/getresultperson.php?runner=${runner.PersonID}`"
              class="text-blue-500 hover:underline"
            >
              {{ runner.PersonID }}
            </a>
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.ParentID }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.LastName }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.FirstName }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.DOB === "0000-00-00" ? "" : runner.DOB }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.YOB === "&nbsp;" ? "" : runner.YOB }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.NumberOfEvents }}
          </td>
          <td class="py-2 px-4 border-b dark:border-gray-600">
            {{ runner.YearsActive }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-between mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="dark:text-gray-300"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <input
        type="number"
        v-model.number="inputPage"
        @keyup.enter="jumpToPage"
        class="border border-gray-300 rounded py-2 px-4 w-20"
      />
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFetch } from "#app";

const events = ref([]);
const runners = ref([]);
const processedEventIDs = ref([]);
const progress = ref("");
const currentPage = ref(1);
const pageSize = 50;
const inputPage = ref(1);
const searchQuery = ref("");
const isFetching = ref(false);

const storedRunnersCount = computed(() => runners.value.length);

const saveToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem("runners", JSON.stringify(runners.value));
    localStorage.setItem(
      "processedEventIDs",
      JSON.stringify(processedEventIDs.value)
    );
  }
};

const downloadData = () => {
  const dataStr = JSON.stringify(runners.value);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = "runners.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

if (process.client) {
  runners.value = JSON.parse(localStorage.getItem("runners") || "[]");
  processedEventIDs.value = JSON.parse(
    localStorage.getItem("processedEventIDs") || "[]"
  );
}

const clearStorage = () => {
  if (process.client) {
    localStorage.removeItem("runners");
    localStorage.removeItem("processedEventIDs");
    runners.value = [];
    processedEventIDs.value = [];
    progress.value = "Local storage cleared.";
  }
};

const fetchEvents = async (baseUrl) => {
  let page = 1;
  let morePages = true;

  while (morePages && isFetching.value) {
    const url = `${baseUrl}&page=${page}`;
    try {
      const { data, pending, error } = await useFetch(url);
      if (error.value) {
        console.error(error.value);
        break;
      }
      if (data.value) {
        if (!data.value.Races) {
          morePages = false;
          break;
        }
        data.value.Races.forEach((race) => {
          race.StartDate = race.Startdate;
        });
        events.value.push(...data.value.Races);
        progress.value = `Fetched ${events.value.length} events...`;
        morePages = data.value.Pagination?.NextPageURL ? true : false;
        page++;
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      morePages = false;
    }
  }
};

const fetchRunnersFromEvents = async () => {
  for (const [index, event] of events.value.entries()) {
    if (!isFetching.value || processedEventIDs.value.includes(event.EventID))
      continue;
    const url = `https://statistik.d-u-v.org/json/mgetresultevent.php?event=${event.EventID}&plain=1`;
    try {
      const { data, pending, error } = await useFetch(url);
      if (error.value) {
        console.error(error.value);
        continue;
      }
      if (data.value) {
        const filteredRunners = data.value.Resultlist.filter(
          (runner) => runner.Nationality === "SWE"
        ).map((runner) => ({
          ...runner,
          NumberOfEvents: 1,
          YearsActive: `${new Date(event.StartDate).getFullYear()}`,
        }));
        filteredRunners.forEach((newRunner) => {
          const existingRunner = runners.value.find(
            (runner) =>
              runner.PersonID === newRunner.PersonID ||
              runner.ParentID === newRunner.PersonID ||
              runner.PersonID === newRunner.ParentID
          );
          if (existingRunner) {
            existingRunner.NumberOfEvents++;
            const years = existingRunner.YearsActive.split("-");
            const startYear = Math.min(
              parseInt(years[0]),
              new Date(event.StartDate).getFullYear()
            );
            const endYear = Math.max(
              parseInt(years[1]) || startYear,
              new Date(event.StartDate).getFullYear()
            );
            existingRunner.YearsActive = `${startYear}-${endYear}`;
          } else {
            runners.value.push(newRunner);
          }
        });
        processedEventIDs.value.push(event.EventID);
        saveToLocalStorage();
        progress.value = `Fetched results for ${index + 1} of ${
          events.value.length
        } events, ${runners.value.length} runners found...`;
      }
    } catch (err) {
      console.error("Failed to fetch runner results:", err);
    }
  }
};

const fetchTopRankAbroadRunners = async () => {
  for (let year = 1980; year <= new Date().getFullYear(); year++) {
    if (!isFetching.value) break;
    const url = `https://statistik.d-u-v.org/json/mtoprankabroad.php?country=SWE&cnt=1000&year=${year}`;
    try {
      const { data, pending, error } = await useFetch(url);
      if (error.value) {
        console.error(error.value);
        continue;
      }
      if (data.value) {
        const filteredRunners = data.value.Resultlist.map((runner) => ({
          ...runner,
          NumberOfEvents: 1,
          YearsActive: `${runner.Year}`,
        }));
        filteredRunners.forEach((newRunner) => {
          const existingRunner = runners.value.find(
            (runner) =>
              runner.PersonID === newRunner.PersonID ||
              runner.ParentID === newRunner.PersonID ||
              runner.PersonID === newRunner.ParentID
          );
          if (existingRunner) {
            existingRunner.NumberOfEvents++;
            const years = existingRunner.YearsActive.split("-");
            const startYear = Math.min(parseInt(years[0]), newRunner.Year);
            const endYear = Math.max(
              parseInt(years[1]) || startYear,
              newRunner.Year
            );
            existingRunner.YearsActive = `${startYear}-${endYear}`;
          } else {
            runners.value.push(newRunner);
          }
        });
        saveToLocalStorage();
        progress.value = `Fetched top rank abroad for year ${year}...`;
      }
    } catch (err) {
      console.error("Failed to fetch top rank abroad runners:", err);
    }
  }
};

const fetchAllRunners = async () => {
  isFetching.value = true;
  const today = new Date().toISOString().split("T")[0];
  const baseUrl = `https://statistik.d-u-v.org/json/mcalendar.php?from=1980-01-01&to=${today}&country=SWE&plain=1&order=asc`;
  await fetchEvents(baseUrl);
  await fetchRunnersFromEvents();
  await fetchTopRankAbroadRunners();
  unifyRunners();
  progress.value = "Completed fetching all runners.";
  isFetching.value = false;
};

const unifyRunners = () => {
  const uniqueRunners = {};
  runners.value.forEach((runner) => {
    const unifiedID =
      runner.ParentID !== "0" ? runner.ParentID : runner.PersonID;
    if (!uniqueRunners[unifiedID]) {
      uniqueRunners[unifiedID] = { ...runner, UnifiedID: unifiedID };
    }
  });
  runners.value = Object.values(uniqueRunners);
  runners.value.sort((a, b) => a.LastName.localeCompare(b.LastName));
  saveToLocalStorage();
};

const handleSearch = () => {
  currentPage.value = 1;
};

const filteredRunners = computed(() => {
  return runners.value.filter(
    (runner) =>
      runner.FirstName.toLowerCase().includes(
        searchQuery.value.toLowerCase()
      ) ||
      runner.LastName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedRunners = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredRunners.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredRunners.value.length / pageSize)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const jumpToPage = () => {
  if (inputPage.value >= 1 && inputPage.value <= totalPages.value) {
    currentPage.value = inputPage.value;
  }
};

const stopFetching = () => {
  isFetching.value = false;
};

watch(currentPage, () => {
  inputPage.value = currentPage.value;
});

onMounted(() => {
  if (process.client) {
    runners.value = JSON.parse(localStorage.getItem("runners") || "[]");
    processedEventIDs.value = JSON.parse(
      localStorage.getItem("processedEventIDs") || "[]"
    );
  }
  handleSearch();
});
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
