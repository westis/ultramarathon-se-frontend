// stores/runnerStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useDuvApi } from "@/composables/useDuvApi";

export const useRunnerStore = defineStore("runnerStore", () => {
  const events = ref([]);
  const runners = ref({});
  const processedEventIDs = ref([]);
  const progress = ref("");
  const isFetching = ref(false);
  const totalPerformances = ref(0);

  const storedRunnersCount = computed(() => Object.keys(runners.value).length);

  const fetchAllRunners = async () => {
    console.log("Fetch Runners button clicked");
    isFetching.value = true;
    runners.value = {}; // Clear old data
    processedEventIDs.value = []; // Clear old processed event IDs
    totalPerformances.value = 0;
    if (process.client) {
      localStorage.removeItem("runners");
      localStorage.removeItem("processedEventIDs");
    }
    const baseUrl =
      "https://statistik.d-u-v.org/json/mcalendar.php?from=2000-01-01&to=2024-08-04&country=SWE&plain=1&order=asc";

    const { fetchEvents, fetchRunnersFromEvents, fetchTopRankAbroadRunners } =
      useDuvApi();

    // Fetch events
    const fetchedEvents = await fetchEvents(baseUrl, isFetching);
    console.log("Events fetched:", fetchedEvents.length);
    events.value = fetchedEvents;

    // Fetch runners from events
    const eventResults = await fetchRunnersFromEvents(events.value, isFetching);
    runners.value = eventResults.runnersData;
    processedEventIDs.value = eventResults.processedIDs;
    console.log(
      "Runners fetched from events:",
      Object.keys(runners.value).length
    );

    // Fetch top rank abroad runners
    const topRankRunners = await fetchTopRankAbroadRunners(isFetching);
    runners.value = { ...runners.value, ...topRankRunners };
    console.log(
      "Top rank abroad runners fetched:",
      Object.keys(topRankRunners).length
    );

    // Unify runners
    unifyRunners();
    console.log("Runners unified:", Object.keys(runners.value).length);

    progress.value = "Completed fetching all runners.";
    isFetching.value = false;

    // Save to local storage
    if (process.client) {
      localStorage.setItem("runners", JSON.stringify(runners.value));
      localStorage.setItem(
        "processedEventIDs",
        JSON.stringify(processedEventIDs.value)
      );
    }
  };

  const unifyRunners = () => {
    const uniqueRunners: Record<string, any> = {};
    Object.values(runners.value).forEach((runner: any) => {
      const unifiedID =
        runner.ParentID !== "0" ? runner.ParentID : runner.PersonID;
      if (!uniqueRunners[unifiedID]) {
        uniqueRunners[unifiedID] = { ...runner, UnifiedID: unifiedID };
      }
    });
    runners.value = uniqueRunners;
    const runnersArray = Object.values(runners.value);
    runnersArray.sort((a, b) => a.LastName.localeCompare(b.LastName));
  };

  return {
    events,
    runners,
    processedEventIDs,
    progress,
    isFetching,
    totalPerformances,
    storedRunnersCount,
    fetchAllRunners,
  };
});
