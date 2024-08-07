// file path: /server/api/utmb-index.ts

import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const { firstname, lastname } = getQuery(event);

  if (!firstname || !lastname) {
    return { error: "Firstname and lastname are required" };
  }

  const search = `${firstname} ${lastname}`;
  const apiUrl = `https://api.utmb.world/search/runners?category=general&sex=&ageGroup=&nationality=&limit=14&offset=0&search=${encodeURIComponent(
    search
  )}`;

  try {
    const response = await $fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching UTMB data:", error);
    return { error: "Failed to fetch UTMB data" };
  }
});
