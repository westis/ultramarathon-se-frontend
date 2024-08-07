// useDuvApi.ts
export function useDuvApi() {
  const fetchEvents = async (baseUrl: string, isFetching: any) => {
    let events: any[] = [];
    let page = 1;
    let morePages = true;

    while (morePages && isFetching.value) {
      const url = `${baseUrl}&page=${page}`;
      console.log(`Fetching events from: ${url}`);
      try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched events data:", data);
        if (!data.Races) {
          morePages = false;
          break;
        }
        data.Races.forEach((race: any) => {
          race.StartDate = race.Startdate;
        });
        events.push(...data.Races);
        console.log("Current events:", events.length);
        morePages = data.Pagination?.NextPageURL ? true : false;
        page++;
      } catch (err) {
        console.error("Failed to fetch events:", err);
        morePages = false;
      }
    }
    return events;
  };

  const fetchRunnersFromEvents = async (events: any[], isFetching: any) => {
    let runners: Record<string, any> = {};
    let processedEventIDs: string[] = [];

    for (const event of events) {
      if (!isFetching.value || processedEventIDs.includes(event.EventID))
        continue;
      const url = `https://statistik.d-u-v.org/json/mgetresultevent.php?event=${event.EventID}&plain=1`;
      console.log(`Fetching runners from event: ${url}`);
      try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch runners from event: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log(`Fetched runners for event ${event.EventID}:`, data);
        const filteredRunners = data.Resultlist.filter(
          (runner: any) => runner.Nationality === "SWE"
        ).map((runner: any) => ({
          PersonID: runner.PersonID,
          ParentID: runner.ParentID,
          FirstName: runner.FirstName,
          LastName: runner.LastName,
          DOB: runner.DOB,
          YOB: runner.YOB,
          NumberOfEvents: 1,
          YearsActive: `${new Date(event.StartDate).getFullYear()}`,
        }));
        console.log(
          `Filtered runners for event ${event.EventID}:`,
          filteredRunners.length
        );
        filteredRunners.forEach((newRunner: any) => {
          const unifiedID =
            newRunner.ParentID !== "0"
              ? newRunner.ParentID
              : newRunner.PersonID;
          if (runners[unifiedID]) {
            runners[unifiedID].NumberOfEvents++;
            const years = runners[unifiedID].YearsActive.split("-");
            const startYear = Math.min(
              parseInt(years[0]),
              new Date(event.StartDate).getFullYear()
            );
            const endYear = Math.max(
              parseInt(years[1]) || startYear,
              new Date(event.StartDate).getFullYear()
            );
            runners[unifiedID].YearsActive = `${startYear}-${endYear}`;
          } else {
            runners[unifiedID] = newRunner;
          }
        });
        console.log(
          `Total runners after event ${event.EventID}:`,
          Object.keys(runners).length
        );
        processedEventIDs.push(event.EventID);
      } catch (err) {
        console.error("Failed to fetch runner results:", err);
      }
    }
    return { runners, processedEventIDs };
  };

  const fetchTopRankAbroadRunners = async (isFetching: any) => {
    let runners: Record<string, any> = {};
    for (let year = 2000; year <= 2024; year++) {
      if (!isFetching.value) break;
      const url = `https://statistik.d-u-v.org/json/mtoprankabroad.php?country=SWE&cnt=1000&year=${year}`;
      console.log(`Fetching top rank abroad runners for year: ${url}`);
      try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch top rank abroad runners: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log(`Fetched top rank abroad runners for year ${year}:`, data);
        const filteredRunners = data.Resultlist.map((runner: any) => ({
          PersonID: runner.PersonID,
          ParentID: runner.ParentID,
          FirstName: runner.FirstName,
          LastName: runner.LastName,
          DOB: runner.DOB,
          YOB: runner.YOB,
          NumberOfEvents: 1,
          YearsActive: `${runner.Year}`,
        }));
        filteredRunners.forEach((newRunner: any) => {
          const unifiedID =
            newRunner.ParentID !== "0"
              ? newRunner.ParentID
              : newRunner.PersonID;
          if (runners[unifiedID]) {
            runners[unifiedID].NumberOfEvents++;
            const years = runners[unifiedID].YearsActive.split("-");
            const startYear = Math.min(parseInt(years[0]), newRunner.Year);
            const endYear = Math.max(
              parseInt(years[1]) || startYear,
              newRunner.Year
            );
            runners[unifiedID].YearsActive = `${startYear}-${endYear}`;
          } else {
            runners[unifiedID] = newRunner;
          }
        });
        console.log(
          `Total top rank abroad runners after year ${year}:`,
          Object.keys(runners).length
        );
      } catch (err) {
        console.error("Failed to fetch top rank abroad runners:", err);
      }
    }
    return runners;
  };

  return { fetchEvents, fetchRunnersFromEvents, fetchTopRankAbroadRunners };
}
