<template>
  <h1 class="mb-2 mt-0 text-xl font-medium leading-tight text-primary">
    Convert age records from DUV to Raceresult
  </h1>
  <div
    class="flex flex-col items-center justify-center p-4 space-y-4 dark:bg-gray-800"
  >
    <textarea
      v-model="inputWomen"
      placeholder="Enter women's records"
      class="form-textarea w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
    ></textarea>
    <textarea
      v-model="inputMen"
      placeholder="Enter men's records"
      class="form-textarea w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
    ></textarea>
    <UButton @click="convertRecords"> Convert </UButton>
    <div v-if="output.ConditionAR" class="w-full">
      <div
        class="p-4 shadow rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
      >
        <h3 class="font-semibold">ConditionAR</h3>
        <pre class="whitespace-pre-wrap text-sm">{{ output.ConditionAR }}</pre>
        <UButton @click="copyToClipboard(output.ConditionAR)"> Copy </UButton>
      </div>
    </div>
    <div v-if="output.OutputARDistance" class="w-full">
      <div
        class="p-4 shadow rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
      >
        <h3 class="font-semibold">OutputARDistance</h3>
        <pre class="whitespace-pre-wrap text-sm">{{
          output.OutputARDistance
        }}</pre>
        <UButton @click="copyToClipboard(output.OutputARDistance)">
          Copy
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useState } from "#app";

const inputWomen = useState("inputWomen", () => "");
const inputMen = useState("inputMen", () => "");
const output = useState("output", () => ({
  ConditionAR: "",
  OutputARDistance: "",
}));

const processInput = (input, genderPrefix) => {
  return input.value
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split("\t").filter((part) => part.trim() !== "");
      if (parts.length < 2) return null;

      const categoryCode = parts[0].trim();
      const distance = parseFloat(parts[1]);
      if (isNaN(distance)) return null;

      // Adjust categoryCode for Overall or direct mapping for other categories
      const ageGroup =
        categoryCode === "Overall"
          ? "Overall"
          : `${genderPrefix === "W" ? "K" : "M"}${categoryCode.substring(1)}`;
      return `[Åldersgrupp1.NamnKort]="${ageGroup}"; ${distance.toFixed(3)};`;
    })
    .filter(Boolean);
};

const convertRecords = () => {
  const womenConditions = processInput(inputWomen, "W");
  const menConditions = processInput(inputMen, "M");

  const allConditions = [...womenConditions, ...menConditions];
  if (allConditions.length === 0) {
    output.value.ConditionAR = `[Projected]*1.05-switch(); >0`;
    output.value.OutputARDistance = `switch()`;
    return;
  }

  output.value.ConditionAR = `[Projected]*1.05-switch(${allConditions.join(
    " "
  )}); >0`;
  output.value.OutputARDistance = `switch(${allConditions.join(" ")})`;
};

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      alert("Copied to clipboard"); // Provide user feedback (consider using NuxtUI's notification system for a more integrated approach)
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
}
</script>

<style scoped>
textarea {
  width: 100%;
  margin-bottom: 10px;
  height: 100px;
}
</style>
