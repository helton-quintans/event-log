import Hero from "@/components/Hero";
import { getEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";
import Subscribe from "@/components/Subscribe";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default async function Home() {
  const eventData = await getEvents();
  const slicedEvents = eventData?.slice(0, 4);

  return (
    <div>
      <Hero />
      {/* Featured Events */}
      <section className="py-28 px-4 sm:px-8 lg:px-20 dark:bg-secondary">
        <h2 className="capitalize text-primary dark:text-white text-3xl font-semibold text-center pb-4">
          Featured events
        </h2>

        <div className="flex justify-center lg:justify-end pr-0 lg:pr-3">
          <Link
            href="/events"
            className={buttonVariants({
              variant: "primary",
              size: "sm",
            })}
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-7">
          {slicedEvents?.map((item) => {
            return <EventCard key={item.id} item={item} />;
          })}
        </div>
      </section>
      {/* Subscribe Our Newsletter */}
      <Subscribe />
    </div>
  );
}
