import { Event } from "@/types";
import EventCard from "./EventCard";

function Events({ data }: { data: Event[] | undefined }) {
  return (
    <>
      {data?.map((item) => {
        return <EventCard key={item.id} item={item} />;
      })}
    </>
  );
}

export default Events;
