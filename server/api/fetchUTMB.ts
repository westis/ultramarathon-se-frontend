import { OAuth2Client } from "google-auth-library";
import { writeFileSync } from "fs";
import { parse } from "json2csv";
import { defineEventHandler } from "h3";
import dotenv from "dotenv";

dotenv.config();

interface Race {
  uriResults: string;
  hasResults: boolean;
  name: string;
}

interface Result {
  fullname: string;
  time: string;
  rank: number;
  nationality: string;
  ageGroup: string;
  gender: string;
}

const fetchAccessToken = async (): Promise<string> => {
  const client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  console.log("OAuth2 Client Setup:", {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  const authCode = process.env.AUTHORIZATION_CODE;

  if (!authCode) {
    throw new Error("Authorization code is missing");
  }

  console.log("Authorization Code:", authCode);

  try {
    const { tokens } = await client.getToken(authCode);
    console.log("Tokens:", tokens);
    client.setCredentials(tokens);
    return tokens.access_token!;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const fetchRaces = async (accessToken: string): Promise<Race[]> => {
  const racesResponse = await globalThis.$fetch<{ races: Race[] }>(
    "https://api.utmb.world/search/races-qualifiers",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        lang: "en",
        categories: ["50k", "100k", "100m"],
        countryCodes: "SE",
        dateMin: "2000-01-01",
        dateMax: "2025-12-31",
        limit: 500,
      },
    }
  );

  return racesResponse?.races || [];
};

const fetchResults = async (
  accessToken: string,
  uriResults: string
): Promise<Result[]> => {
  const resultsResponse = await globalThis.$fetch<{ results: Result[] }>(
    `https://api.utmb.world/races/${uriResults}/results`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { lang: "en", offset: 0 },
    }
  );

  return resultsResponse?.results || [];
};

const saveToCsv = (filename: string, data: any) => {
  const csv = parse(data);
  writeFileSync(filename, csv);
};

export default defineEventHandler(async (event) => {
  try {
    const accessToken = await fetchAccessToken();
    const races = await fetchRaces(accessToken);
    saveToCsv("races.csv", races);

    const allResults: Result[] = [];
    for (const race of races) {
      if (race.hasResults) {
        const results = await fetchResults(accessToken, race.uriResults);
        allResults.push(...results);
      }
    }

    saveToCsv("results.csv", allResults);
    return { message: "Data fetched and saved to CSV files successfully." };
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching data:", err);
    return { error: "Error fetching data: " + err };
  }
});
