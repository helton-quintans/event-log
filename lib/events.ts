import { Event } from "@/types";

export async function getEvents() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 0 },
    });

    const events: Event[] = await res.json();

    return events;
  } catch (err) {
    console.error(err);
  }
}

export async function getEvent(id: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) return undefined;

    const event: Event = await res.json();

    return event;
  } catch (err) {
    console.error(err);
  }
}

export async function getSearchEvents(query: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const searchResponse = await fetch(
    `${baseUrl}/api/events/search?q=${query}`,
    {
      next: { revalidate: 0 },
    }
  );

  if (!searchResponse.ok) return undefined;

  const searchEvents: Event[] = await searchResponse.json();

  return searchEvents;
}

export async function getFilteredEvents(query: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  
  const filterResponse = await fetch(
    `${baseUrl}/api/events/search?sort_by=${query}`,
    {
      next: { revalidate: 0 },
    }
  );

  if (!filterResponse.ok) return undefined;

  const filteredEvents: Event[] = await filterResponse.json();

  return filteredEvents;
}

export async function getCategoryEvents(query: string) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const categoryResponse = await fetch(
    `${baseUrl}/api/events/filter?category=${query}`,
    {
      next: { revalidate: 0 },
    }
  );

  if (!categoryResponse.ok) return undefined;

  const categoryEvents: Event[] = await categoryResponse.json();

  return categoryEvents;
}
