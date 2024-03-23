import { getEvents } from "@/lib/events";
import SearchEvent from "./SearchEvents";
import { notFound } from "next/navigation";

async function GlobalSearch() {
  const events = await getEvents();

  if (!events) return notFound();

  return (
    <div>
      <SearchEvent events={events} />
    </div>
  );
}

export default GlobalSearch;
