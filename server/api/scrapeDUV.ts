// /server/api/scrapeDUV.ts
import { defineEventHandler } from "h3";
import { scrapeAllData } from "~/services/scrapeDUVTopList";

export default defineEventHandler(async (event) => {
  try {
    const data = await scrapeAllData();
    return data;
  } catch (error) {
    return { error: "Failed to scrape data" };
  }
});
