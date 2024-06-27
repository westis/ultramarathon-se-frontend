import puppeteer from "puppeteer";

interface Racer {
  place: number;
  bib_number: string;
  full_name: string;
  club: string;
  gender: string;
  time: string;
  status: string;
  yob: string;
  link: string;
}

interface RaceData {
  event_name: string;
  racers: Racer[];
}

export const scrapeRaceData = async (raceUrl: string): Promise<RaceData> => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(raceUrl, { waitUntil: "networkidle0" });

    const raceData = await page.evaluate(() => {
      const event_name =
        document
          .querySelector("h1")
          ?.textContent?.split("Liveresultat för ")[1]
          .trim() || "";

      const rows = Array.from(
        document.querySelectorAll("#resulttable tbody tr")
      );
      const racers = rows.map((row) => {
        const cells = row.querySelectorAll("td");
        const linkElement = cells[2].querySelector("a");
        return {
          place: parseInt(cells[0]?.textContent?.trim() || "0", 10),
          bib_number: cells[1]?.textContent?.trim() || "",
          full_name: cells[2]?.textContent?.trim() || "",
          club: cells[3]?.textContent?.trim() || "",
          gender: cells[4]?.textContent?.trim() || "",
          status: cells[5]?.textContent?.trim() || "",
          time: cells[6]?.textContent?.trim() || "",
          yob: "",
          link: linkElement ? linkElement.getAttribute("href") || "" : "",
        };
      });

      return { event_name, racers };
    });

    console.log("Initial Racers Data:", raceData.racers);

    // Fetch additional details for each racer
    for (const racer of raceData.racers) {
      if (racer.link) {
        await page.goto(`https://timing.mittlopp.se${racer.link}`, {
          waitUntil: "networkidle0",
        });
        const details = await page.evaluate(() => {
          const infoGroups = Array.from(
            document.querySelectorAll(".info-group")
          );
          let yob = "";
          let club = "";
          infoGroups.forEach((group) => {
            const label = group
              .querySelector(".info-label")
              ?.textContent?.trim();
            const value = group
              .querySelector(".info-value")
              ?.textContent?.trim();
            if (label === "Född") {
              yob = value || "";
            } else if (label === "Klubb") {
              club = value || "";
            }
          });
          return { yob, club };
        });
        racer.yob = details.yob;
        racer.club = details.club;
      }
    }

    await browser.close();

    console.log("Final Racers Data with Details:", raceData.racers);

    return raceData;
  } catch (error) {
    console.error("Error fetching race data:", error);
    throw new Error("Failed to fetch race data");
  }
};
