// file path: frontend/server/api/utmb-events.ts

import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
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

  const url = `https://api.utmb.world/search/races-qualifiers?lang=en&limit=200&countryCodes=SE&dateMin=${oneYearAgo}&dateMax=${oneYearFromNow}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Error fetching UTMB events: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching UTMB events:", error);
    return { error: "Failed to fetch UTMB events" };
  }
});
