import { ref } from "vue";

interface DUVEvent {
  EventID: string;
  EventName: string;
  Length: string;
  Startdate: string;
  Results: string; // Assuming this property exists for results
}

interface UTMBEvent {
  id: number;
  eventName: string;
  name: string;
  distance: string;
  startDate: string;
  hasResults: boolean; // Assuming this property exists for results
}

export const useTrailEvents = () => {
  const duvEvents = ref<DUVEvent[]>([]);
  const utmbEvents = ref<UTMBEvent[]>([]);
  const itraEvents = ref<any[]>([]);

  const fetchDuvEvents = async () => {
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    const oneYearFromNow = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      `https://statistik.d-u-v.org/json/mcalendar.php?&country=SWE&from=${oneYearAgo}&to=${oneYearFromNow}&order=asc&dist=Trail`
    );
    if (response.ok) {
      const data = await response.json();
      duvEvents.value =
        data.Races.filter(
          (event: DUVEvent) => event.Results !== "Z" && event.Results !== "R"
        ).map((event: DUVEvent) => ({
          ...event,
          hasResults: event.Results === "C",
        })) || [];
      console.log("DUV Events with hasResults:", duvEvents.value);
    } else {
      console.error("Error fetching DUV events:", response.statusText);
    }
  };

  const fetchUtmbEvents = async () => {
    const response = await fetch("/api/utmb-events");
    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        utmbEvents.value =
          data.races
            .filter((event: UTMBEvent) => parseFloat(event.distance) >= 40)
            .map((event: UTMBEvent) => {
              const dateParts = event.startDate.split("-");
              const formattedDate = `${dateParts[0]}-${(
                "0" +
                ([
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].indexOf(dateParts[1]) +
                  1)
              ).slice(-2)}-${("0" + dateParts[2]).slice(-2)}`;

              // Ensure no duplication in names
              const eventName = event.eventName.trim();
              const raceName = event.name.trim();
              let fullName;

              if (raceName.toLowerCase().includes(eventName.toLowerCase())) {
                fullName = raceName;
              } else {
                fullName = `${eventName} ${raceName}`;
              }

              return {
                ...event,
                name: fullName,
                startDate: formattedDate,
                hasResults: event.hasResults,
              };
            }) || [];
        console.log("UTMB Events with hasResults:", utmbEvents.value);
      }
    } else {
      console.error("Error fetching UTMB events:", response.statusText);
    }
  };

  const setItraEvents = (events: any[]) => {
    itraEvents.value = events.map((event) => ({
      ...event,
      hasResults: event.hasResults,
    }));
    console.log("ITRA Events with hasResults:", itraEvents.value);
  };

  return {
    duvEvents,
    utmbEvents,
    itraEvents,
    fetchDuvEvents,
    fetchUtmbEvents,
    setItraEvents,
  };
};
