// file path: /frontend/server/api/anmalmignu.ts

import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const { eventId } = getQuery(event);

  if (!eventId) {
    return { error: "Event ID is required" };
  }

  const startListUrl = `https://anmalmig.nu/anmalda/${eventId}/startlist/`;
  console.log("Fetching start list from URL:", startListUrl); // Log the URL

  try {
    const startListResponse = await $fetch(startListUrl);
    console.log("Received start list response:", startListResponse); // Log the response
    return startListResponse;
  } catch (error) {
    console.error("Error fetching start list:", error);
    return { error: "Failed to fetch start list" };
  }
});
