// /services/scrapeDUVTopList.ts
import puppeteer from "puppeteer";

interface RunnerResult {
  performance: string;
  performanceInSeconds: number;
  name: string;
  nat: string;
  dob: string;
  date: string;
  venue: string;
  runnerId: string;
  rank?: number;
  natRank?: number;
  top3?: boolean;
}

const urls = [
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2024&gender=M",
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2024&gender=W",
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2023&gender=M",
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2023&gender=W",
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2022&gender=M",
  "https://statistik.d-u-v.org/getintbestlist.php?dist=100km&year=2022&gender=W",
];

const MAX_PERFORMANCE_TIME_SECONDS = 54_000; // 15 hours

function convertTimeToSeconds(time: string): number {
  let days = 0;
  if (time.includes("d")) {
    const [daysPart, timePart] = time.split("d");
    days = parseInt(daysPart.trim(), 10);
    time = timePart.trim();
  }
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

async function fetchData(url: string): Promise<RunnerResult[]> {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const results: RunnerResult[] = await page.evaluate(() => {
    function convertTimeToSeconds(time: string): number {
      let days = 0;
      if (time.includes("d")) {
        const [daysPart, timePart] = time.split("d");
        days = parseInt(daysPart.trim(), 10);
        time = timePart.trim();
      }
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return days * 86400 + hours * 3600 + minutes * 60 + seconds;
    }

    const rows = Array.from(document.querySelectorAll("#EvtRslt tr"));
    return rows.map((row) => {
      const columns = row.querySelectorAll("td");
      const performance =
        columns[1]?.textContent?.trim().replace(" h", "") || "";
      return {
        performance,
        performanceInSeconds: convertTimeToSeconds(performance),
        name: columns[5]?.textContent?.trim() || "",
        nat: columns[6]?.textContent?.trim() || "",
        dob: columns[7]?.textContent?.trim() || "",
        date: columns[10]?.textContent?.trim() || "",
        venue: columns[11]?.textContent?.trim() || "",
        runnerId:
          columns[5]?.querySelector("a")?.href.split("runner=")[1] || "",
      };
    });
  });

  await browser.close();
  return results;
}

export async function scrapeAllData() {
  let allResults = { M: [] as RunnerResult[], W: [] as RunnerResult[] };

  for (const url of urls) {
    const gender = url.includes("gender=M") ? "M" : "W";
    const data = await fetchData(url);
    allResults[gender] = allResults[gender].concat(data);
  }

  // Remove duplicates by runnerId and keep the best performance
  const filterBestPerformance = (results: RunnerResult[]) => {
    const map = new Map<string, RunnerResult>();
    results.forEach((result) => {
      if (
        !map.has(result.runnerId) ||
        result.performanceInSeconds <
          map.get(result.runnerId)!.performanceInSeconds
      ) {
        map.set(result.runnerId, result);
      }
    });
    return Array.from(map.values());
  };

  allResults.M = filterBestPerformance(allResults.M);
  allResults.W = filterBestPerformance(allResults.W);

  // Filter out unreasonable performance times
  const filterUnreasonableTimes = (results: RunnerResult[]) => {
    return results.filter(
      (result) => result.performanceInSeconds <= MAX_PERFORMANCE_TIME_SECONDS
    );
  };

  allResults.M = filterUnreasonableTimes(allResults.M);
  allResults.W = filterUnreasonableTimes(allResults.W);

  // Sort by performanceInSeconds
  allResults.M.sort((a, b) => a.performanceInSeconds - b.performanceInSeconds);
  allResults.W.sort((a, b) => a.performanceInSeconds - b.performanceInSeconds);

  // Select the top 100 results for each gender
  allResults.M = allResults.M.slice(0, 200);
  allResults.W = allResults.W.slice(0, 200);

  // Assign new ranks
  allResults.M.forEach((result, index) => {
    result.rank = index + 1;
  });
  allResults.W.forEach((result, index) => {
    result.rank = index + 1;
  });

  // Assign nationality ranks
  const assignNatRanks = (results: RunnerResult[]) => {
    const nationalityMap: { [key: string]: number } = {};
    results.forEach((result) => {
      if (!nationalityMap[result.nat]) {
        nationalityMap[result.nat] = 0;
      }
      nationalityMap[result.nat]++;
      result.natRank = nationalityMap[result.nat];
    });
  };

  assignNatRanks(allResults.M);
  assignNatRanks(allResults.W);

  // Mark the top 3 runners for each nationality
  const markTop3ByNationality = (results: RunnerResult[]) => {
    const nationalityMap: { [key: string]: RunnerResult[] } = {};
    results.forEach((result) => {
      if (!nationalityMap[result.nat]) {
        nationalityMap[result.nat] = [];
      }
      if (nationalityMap[result.nat].length < 3) {
        result.top3 = true;
      }
      nationalityMap[result.nat].push(result);
    });
    return results;
  };

  allResults.M = markTop3ByNationality(allResults.M);
  allResults.W = markTop3ByNationality(allResults.W);

  return allResults;
}
