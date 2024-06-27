import { defineEventHandler, getQuery } from "h3";
import { scrapeRaceData } from "@/services/scraper";

export default defineEventHandler(async (event) => {
  const { raceUrl } = getQuery(event);

  if (!raceUrl) {
    throw new Error("Race URL is required");
  }

  try {
    const raceData = await scrapeRaceData(raceUrl as string);
    console.log("Race Data from API:", raceData);
    return raceData;
  } catch (error) {
    console.error("Error in API:", error);
    throw error;
  }
});
