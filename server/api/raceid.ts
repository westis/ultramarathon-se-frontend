// file path: /frontend/server/api/raceid.ts

import { defineEventHandler, getQuery } from "h3";

interface RacerDetails {
  birthday: string;
  city: string;
  firstname: string;
  lastname: string;
  nationality_id: string;
}

interface RacerResult {
  id: number;
  bib_number: string;
  full_name: string;
  gender: number; // Original type from API
  country_id: string;
  union: string;
  details?: RacerDetails;
}

interface RacerStartList {
  id: number;
  bib_number: string;
  full_name: string;
  gender: number;
  country_id: string;
  union: string;
  city: string;
  nationality_id: string;
  details?: RacerDetails;
}

interface RaceResult {
  place: number;
  racer: RacerResult;
  time_result: number;
}

interface Country {
  id: string;
  ioc_code: string | null;
}

interface RaceData {
  name: string;
  race_date: string;
  results?: RaceResult[];
  startlist?: RacerStartList[];
}

export default defineEventHandler(async (event) => {
  const { distanceId, type } = getQuery(event);

  const baseUrl = "https://raceid.com/api";
  const raceDetailsUrl = `${baseUrl}/v2/web/distances/${distanceId}`;
  const raceResultsUrl = `${baseUrl}/v2/web/distances/${distanceId}/results?searchJoin=AND&limit=1000&orderBy=place&page=1`;
  const startListUrl = `${baseUrl}/v2/web/distances/${distanceId}/racers?limit=300&page=1`;

  try {
    // Fetch race details
    const raceDetails = await $fetch<{
      data: { name: string; race_date: string };
    }>(raceDetailsUrl);

    // Fetch country data
    const countryDataUrl = `${baseUrl}/v1/web/countries?limit=300&page=1`;
    const countries = await $fetch<{ data: Country[] }>(countryDataUrl);

    // Create a mapping of id to ioc_code
    const nationalityToIOC: Record<string, string> = {};
    countries.data.forEach((country) => {
      if (country.ioc_code && country.ioc_code !== "Null") {
        nationalityToIOC[country.id] = country.ioc_code;
      }
    });

    if (type === "results") {
      // Fetch race results
      const raceResults = await $fetch<{ data: RaceResult[] }>(raceResultsUrl);

      // Fetch racer details and replace nationality_id with ioc_code
      const detailedResults = await Promise.all(
        raceResults.data.map(async (racer) => {
          const racerDetailsUrl = `${baseUrl}/v1/web/racers/${racer.racer.id}`;
          const racerDetails = await $fetch<{ data: RacerDetails }>(
            racerDetailsUrl
          );
          const mappedNatID =
            nationalityToIOC[racerDetails.data.nationality_id] ||
            racerDetails.data.nationality_id;
          const mappedCountryID =
            nationalityToIOC[racer.racer.country_id] || racer.racer.country_id;

          // Map gender
          const originalGender = racer.racer.gender;
          const mappedGender =
            originalGender === 1
              ? "M"
              : originalGender === 2
              ? "F"
              : originalGender;

          return {
            ...racer,
            racer: {
              ...racer.racer,
              gender: mappedGender,
              details: {
                ...racerDetails.data,
                nationality_id: mappedNatID,
              },
              country_id: mappedCountryID,
            },
          };
        })
      );

      return {
        name: raceDetails.data.name,
        race_date: raceDetails.data.race_date,
        results: detailedResults,
      };
    } else if (type === "startlist") {
      // Fetch start list
      const startList = await $fetch<{ data: RacerStartList[] }>(startListUrl);

      // Fetch racer details and replace nationality_id with ioc_code
      const detailedStartList = await Promise.all(
        startList.data.map(async (racer) => {
          const racerDetailsUrl = `${baseUrl}/v1/web/racers/${racer.id}`;
          const racerDetails = await $fetch<{ data: RacerDetails }>(
            racerDetailsUrl
          );
          const mappedNatID =
            nationalityToIOC[racerDetails.data.nationality_id] ||
            racerDetails.data.nationality_id;
          const mappedCountryID =
            nationalityToIOC[racer.country_id] || racer.country_id;

          // Map gender
          const originalGender = racer.gender;
          const mappedGender =
            originalGender === 1
              ? "M"
              : originalGender === 2
              ? "F"
              : originalGender;

          return {
            ...racer,
            gender: mappedGender,
            nationality_id: mappedNatID,
            country_id: mappedCountryID,
            details: {
              ...racerDetails.data,
              nationality_id: mappedNatID,
            },
          };
        })
      );

      return {
        name: raceDetails.data.name,
        race_date: raceDetails.data.race_date,
        startlist: detailedStartList,
      };
    } else {
      throw new Error("Invalid type parameter");
    }
  } catch (error) {
    console.error("Error fetching race data:", error);
    throw new Error("Failed to fetch race data");
  }
});
