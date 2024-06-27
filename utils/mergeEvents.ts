interface Event {
  name: string;
  date: string;
  distance: number;
  sources: {
    DUV?: boolean;
    ITRA?: boolean;
    UTMB?: boolean;
  };
  hasResults: {
    DUV?: boolean;
    ITRA?: boolean;
    UTMB?: boolean;
  };
  duvEventID?: string;
  utmbUriResults?: string;
}

const convertMilesToKilometers = (miles: number) => miles * 1.60934;

const parseDuvEvent = (event: any) => {
  let distance = parseFloat(event.Length.replace("km", "").replace("mi", ""));
  if (event.Length.includes("mi")) {
    distance = convertMilesToKilometers(distance);
  }
  return {
    name: event.EventName,
    date: event.Startdate,
    distance,
    sources: { DUV: true },
    hasResults: { DUV: event.Results === "C" },
    duvEventID: event.EventID,
  };
};

const parseUtmbEvent = (event: any) => {
  const eventName = event.eventName.trim();
  const raceName = event.name.trim();
  const normalizedEventName = eventName.toLowerCase();
  const normalizedRaceName = raceName.toLowerCase();
  let name;

  if (normalizedRaceName.includes(normalizedEventName)) {
    name = capitalizeEachWord(raceName);
  } else {
    name = `${capitalizeEachWord(eventName)} ${capitalizeEachWord(raceName)}`;
  }

  return {
    name: name,
    date: event.startDate,
    distance: parseFloat(event.distance),
    sources: { UTMB: true },
    hasResults: { UTMB: event.hasResults },
    utmbUriResults: event.uriResults,
  };
};

const parseItraEvent = (event: any) => ({
  name: event.name,
  date: event.date,
  distance: parseFloat(event.distance),
  sources: { ITRA: true },
  hasResults: { ITRA: event.hasResults },
});

const datesAreClose = (date1: string, date2: string, days: number) => {
  const dayInMillis = 24 * 60 * 60 * 1000;
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.abs(d1 - d2) <= days * dayInMillis;
};

const namesMatch = (name1: string, name2: string) => {
  const normalize = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const normalized1 = normalize(name1);
  const normalized2 = normalize(name2);

  // Check if there are at least 5 characters in a row that match
  for (let i = 0; i < normalized1.length - 4; i++) {
    const substr = normalized1.substring(i, i + 5);
    if (normalized2.includes(substr)) {
      return true;
    }
  }

  return false;
};

const distancesAreClose = (
  distance1: number,
  distance2: number,
  km: number
) => {
  return Math.abs(distance1 - distance2) <= km;
};

const capitalizeEachWord = (s: string) => {
  return s
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const mergeEvents = (
  duvEvents: any[],
  utmbEvents: any[],
  itraEvents: any[]
): Event[] => {
  const allEvents: Event[] = [];

  duvEvents.forEach((event) => allEvents.push(parseDuvEvent(event)));
  utmbEvents.forEach((event) => allEvents.push(parseUtmbEvent(event)));
  itraEvents.forEach((event) => allEvents.push(parseItraEvent(event)));

  const mergedEvents: Event[] = [];

  allEvents.forEach((event) => {
    const existingEvent = mergedEvents.find((e) => {
      const nameMatch = namesMatch(e.name, event.name);
      const dateMatch = datesAreClose(e.date, event.date, 7);
      const distanceMatch = distancesAreClose(e.distance, event.distance, 5);

      return nameMatch && dateMatch && distanceMatch;
    });

    if (existingEvent) {
      existingEvent.sources = { ...existingEvent.sources, ...event.sources };
      existingEvent.hasResults = {
        ...existingEvent.hasResults,
        ...event.hasResults,
      };
      existingEvent.duvEventID = existingEvent.duvEventID || event.duvEventID;
      existingEvent.utmbUriResults =
        existingEvent.utmbUriResults || event.utmbUriResults;
    } else {
      mergedEvents.push(event);
    }
  });

  mergedEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return mergedEvents;
};
