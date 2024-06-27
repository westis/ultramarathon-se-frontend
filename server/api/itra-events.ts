import puppeteer from "puppeteer";
import { defineEventHandler } from "h3";

interface Event {
  title: string;
  date: string;
  location: string;
  distance?: string;
  elevation?: string;
}

export default defineEventHandler(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a User-Agent string to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
  );

  const url = "https://itra.run/Races/FindRaceResults";
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  console.log("Page loaded");

  try {
    // Open the country filter tab
    const countryTabSelector = 'a[href="#country"]';
    await page.waitForSelector(countryTabSelector, {
      visible: true,
      timeout: 60000,
    });
    await page.click(countryTabSelector);
    console.log("Country tab clicked");

    // Open the country filter dropdown
    const countryDropdownSelector = "#country .multiselect-dropdown";
    await page.waitForSelector(countryDropdownSelector, {
      visible: true,
      timeout: 60000,
    });
    await page.click(countryDropdownSelector);
    console.log("Country dropdown opened");

    // Wait for the dropdown list to be visible
    const dropdownListWrapperSelector = ".multiselect-dropdown-list-wrapper";
    await page.waitForSelector(dropdownListWrapperSelector, {
      visible: true,
      timeout: 60000,
    });
    console.log("Dropdown list wrapper is visible");

    // Select Sweden in the country filter
    await page.evaluate(() => {
      const countryLabels = Array.from(
        document.querySelectorAll(".multiselect-dropdown-list label")
      );
      const swedenLabel = countryLabels.find(
        (label) => label.textContent?.trim() === "Sweden"
      );
      if (swedenLabel) {
        const checkbox = swedenLabel.previousElementSibling as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
          (swedenLabel as HTMLElement).click();
        }
      }
    });
    console.log("Sweden selected");

    // Close the dropdown by clicking outside of it
    await page.click("body");
    console.log("Dropdown closed");

    // Set the minimum and maximum distance
    await page.evaluate(() => {
      const minDistanceInput = document.querySelector(
        "input#Input_MinDistance"
      ) as HTMLInputElement;
      if (minDistanceInput) minDistanceInput.value = "45";

      const maxDistanceInput = document.querySelector(
        "input#Input_MaxDistance"
      ) as HTMLInputElement;
      if (maxDistanceInput) maxDistanceInput.value = "500";
    });
    console.log("Distance filters set");

    // Apply filters
    const applyFiltersSelector = "div.submit_button a.btn.btn-primary";
    await page.waitForSelector(applyFiltersSelector, {
      visible: true,
      timeout: 60000,
    });
    await page.click(applyFiltersSelector);
    console.log("Filters applied");

    // Wait for the events to load
    await page.waitForSelector(".col-lg-12 .row", { timeout: 60000 });
    console.log("Events loaded");

    // Add an additional wait time to ensure filters are fully applied
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 5000))
    );

    // Extract events
    const events: Event[] = await page.evaluate(() => {
      const eventElements = document.querySelectorAll(".col-lg-12 .row");
      return Array.from(eventElements).map((el) => {
        const titleElement = el.querySelector(".event_name h4");
        const dateElement = el.querySelector(".date");
        const locationElement = el.querySelector(".location");
        const distanceElement = el.querySelector(".count");
        const elevationElement = el.querySelector(".distance");

        const title = titleElement
          ? titleElement.textContent?.trim() || "Unknown title"
          : "Unknown title";
        const date = dateElement
          ? dateElement.textContent?.trim() || "Unknown date"
          : "Unknown date";
        const location = locationElement
          ? locationElement.textContent?.trim() || "Unknown location"
          : "Unknown location";
        const distance = distanceElement
          ? distanceElement.textContent?.trim()
          : undefined;
        const elevation = elevationElement
          ? elevationElement.textContent?.trim()
          : undefined;

        return { title, date, location, distance, elevation };
      });
    });

    console.log("Events extracted:", events);

    await browser.close();
    return { events };
  } catch (error) {
    console.error("Error:", error);
    await page.screenshot({ path: "error.png" });
    await browser.close();
    return { error: (error as any).message };
  }
});
