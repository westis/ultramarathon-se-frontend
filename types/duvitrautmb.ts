// types/duvitrautmb.ts

export interface Event {
  eventName: string;
  date: string;
  distance?: string;
  duration?: string;
  city: string;
  duv?: boolean;
  utmb?: boolean;
  itra?: boolean;
}

export interface DuvEvent {
  EventID: string;
  ParentID: string;
  PartOf: string;
  EventName: string;
  Edition: string;
  City: string;
  Country: string;
  EventType: string;
  Results: string;
  Length: string;
  Duration: string;
  IAULabel: string;
  Startdate: string;
  Enddate: string;
  Year: string;
  Month: string;
  Day: string;
  Cupname: string | null;
  CupYear: string | null;
}

export interface DuvResponse {
  Races: DuvEvent[];
}

export interface UtmbEvent {
  id: number;
  eventName: string;
  name: string;
  category: string;
  themeColor: string;
  themeColorIsDark: boolean;
  logoWs: string;
  url: string;
  distance: string;
  elevationGain: number;
  hasResults: boolean;
  uriResults: string;
  startDate: string;
  startCountry: string;
  startPlace: string;
  year: number;
  level: string;
  nbStones: number;
}

export interface UtmbResponse {
  nbHits: number;
  limit: number;
  offset: number;
  races: UtmbEvent[];
}
