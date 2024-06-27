// file path: /frontend/server/api/birthdayse.ts

import { defineEventHandler, getQuery } from "h3";

const swedishMonths: { [key: string]: string } = {
  januari: "01",
  februari: "02",
  mars: "03",
  april: "04",
  maj: "05",
  juni: "06",
  juli: "07",
  augusti: "08",
  september: "09",
  oktober: "10",
  november: "11",
  december: "12",
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const firstname = query.firstname as string;
  const lastname = query.lastname as string;
  const yob = query.yob as string;

  if (!firstname || !lastname || !yob) {
    return { error: "Firstname, lastname, and year of birth are required" };
  }

  const url = `https://www.birthday.se/sok?who=${encodeURIComponent(
    firstname
  )}+${encodeURIComponent(lastname)}&y=${yob}`;

  try {
    const response = await $fetch(url);
    const html = response as string;

    // Check if exactly one person is found
    const singlePersonMatch = html.match(
      /Hittade <strong>1 personer<\/strong>/
    );
    if (!singlePersonMatch) {
      return { error: "Multiple or no results found" };
    }

    // Extract DOB if there is exactly one result
    const dobMatch = html.match(/född den (\d+) (\w+) (\d{4})/);
    if (dobMatch) {
      const day = dobMatch[1];
      const month = swedishMonths[dobMatch[2].toLowerCase()];
      const year = dobMatch[3];
      const dob = `${year}-${month}-${day}`;
      return { dob };
    }
    return { error: "DOB not found" };
  } catch (error) {
    console.error("Error fetching DOB:", error);
    return { error: "Failed to fetch DOB" };
  }
});
