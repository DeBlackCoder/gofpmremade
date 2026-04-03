export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;       // ISO date string
  time: string;       // e.g. "10:30 AM"
  location: string;
  category: "service" | "prayer" | "youth" | "outreach" | "other";
}
