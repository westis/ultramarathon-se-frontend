<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 dark:text-white">Running Calculator</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label
          for="pace"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Pace (min/km)</label
        >
        <VueDatePicker
          v-model="pace"
          time-picker
          :enable-seconds="true"
          :hide-hours="true"
          :disable-time-range-validation="true"
          :start-time="startTime"
          :class="datepickerClass"
          format="mm:ss"
          placeholder="Select Pace"
          :disabled="isFieldDisabled('pace')"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
      </div>
      <div>
        <label
          for="distance"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Distance (km)</label
        >
        <input
          type="number"
          step="0.01"
          id="distance"
          v-model.number="distance"
          @input="onInput('distance')"
          :disabled="isFieldDisabled('distance')"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
      </div>
      <div>
        <label
          for="time"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Time (h:mm:ss)</label
        >
        <VueDatePicker
          v-model="time"
          time-picker
          :enable-seconds="true"
          :disable-time-range-validation="true"
          :start-time="startTime"
          :class="datepickerClass"
          format="HH:mm:ss"
          placeholder="Select Time"
          :disabled="isFieldDisabled('time')"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
      </div>
    </div>
    <div class="mt-4">
      <h2 class="text-xl font-semibold dark:text-white">Results</h2>
      <p class="dark:text-gray-300">Pace: {{ formattedPace }}</p>
      <p class="dark:text-gray-300">Distance: {{ distance }} km</p>
      <p class="dark:text-gray-300">Time: {{ formattedTime }}</p>
    </div>
    <button
      @click="resetForm"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded dark:bg-blue-700"
    >
      Reset Form
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useColorMode } from "@vueuse/core";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const pace = ref<string | null>(null);
const distance = ref<number | null>(null);
const time = ref<string | null>(null);
const startTime = ref({ hours: 0, minutes: 0, seconds: 0 });
const colorMode = useColorMode();

const filledFields = computed(() => {
  return [pace.value, distance.value, time.value].filter(
    (input) => input !== null && input !== ""
  ).length;
});

const isFieldDisabled = (field: string) => {
  if (filledFields.value < 2) return false;
  if (field === "pace" && pace.value === null) return true;
  if (field === "distance" && distance.value === null) return true;
  if (field === "time" && time.value === null) return true;
  return false;
};

const calculate = () => {
  if (filledFields.value === 2) {
    if (pace.value && distance.value !== null && !time.value) {
      // Calculate time
      const [min, sec] = pace.value.split(":").map(Number);
      const totalSeconds = (min * 60 + sec) * distance.value;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      time.value = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else if (distance.value !== null && time.value && !pace.value) {
      // Calculate pace
      const [h, m, s] = time.value.split(":").map(Number);
      const totalSeconds = h * 3600 + m * 60 + s;
      const paceInSeconds = totalSeconds / distance.value;
      const paceMin = Math.floor(paceInSeconds / 60);
      const paceSec = Math.floor(paceInSeconds % 60);
      pace.value = `${paceMin}:${paceSec.toString().padStart(2, "0")}`;
    } else if (pace.value && time.value && distance.value === null) {
      // Calculate distance
      const [min, sec] = pace.value.split(":").map(Number);
      const [h, m, s] = time.value.split(":").map(Number);
      const totalSeconds = h * 3600 + m * 60 + s;
      const paceInSeconds = min * 60 + sec;
      distance.value = totalSeconds / paceInSeconds;
    }
  }
};

watch([pace, distance, time], calculate);

const resetField = (field: string) => {
  if (field === "pace") pace.value = null;
  if (field === "distance") distance.value = null;
  if (field === "time") time.value = null;
};

const resetForm = () => {
  pace.value = null;
  distance.value = null;
  time.value = null;
};

const formattedPace = computed(() => {
  if (pace.value) {
    const [min, sec] = pace.value.split(":").map(Number);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }
  return "";
});

const formattedTime = computed(() => {
  if (time.value) {
    const [h, m, s] = time.value.split(":").map(Number);
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return "";
});

const datepickerClass = computed(() => {
  return colorMode.value === "dark" ? "dark-theme" : "";
});
</script>

<style scoped>
.container {
  max-width: 600px;
}

/* Custom dark theme for vue3-datepicker */
.dark-theme .vdp-datepicker__input,
.dark-theme .vdp-time-picker__header,
.dark-theme .vdp-time-picker__body {
  background-color: #2d3748;
  color: #e2e8f0;
  border-color: #4a5568;
}

.dark-theme .vdp-time-picker__button--selected {
  background-color: #4a5568;
  color: #e2e8f0;
}

.dark-theme .vdp-time-picker__button--disabled {
  background-color: #2d3748;
  color: #718096;
}
</style>
