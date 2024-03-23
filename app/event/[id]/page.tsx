import { Icons } from "@/components/Icons";
import { getEvent, getEvents } from "@/lib/events";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { capitalize, getBadgeColor, truncateText } from "@/lib/utils";
import EventDescription from "@/components/EventDescription";
import { Metadata } from "next";
import moment from "moment";
import { Calendar } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  
  const events = await getEvents();
  const event = events?.find((item) => item.id === id);

  return {
    title: capitalize(event?.event_name as string),
    description: event?.description,
  };
}

export default async function EventDetail({ params: { id } }: Props) {
  const event = await getEvent(id);

  if (!event) notFound();

  const date = event.event_date;

  return (
    <>
      {/* Location PATH */}
      <p className="dark:bg-secondary flex items-center gap-1 pt-6 px-4 sm:px-8 lg:px-20">
        <span className="text-gray-500">Home</span>
        <Icons.chevronRight className="text-gray-500 w-4 h-4" />
        <span className="text-gray-500">Events</span>
        <Icons.chevronRight className="text-gray-500 w-4 h-4" />
        <span className="text-primary capitalize dark:text-white">
          {truncateText(event.event_name)}
        </span>
      </p>

      <div className="dark:bg-secondary pt-10 pb-20 grid grid-cols-4 gap-5 px-4 sm:px-8 lg:px-20">
        {event.img_url ? (
          <div className="col-span-4 lg:col-span-2 flex justify-center lg:justify-start max-h-[500px]">
            <Image
              className="object-cover aspect-square"
              src={event.img_url}
              alt={event.event_name}
              priority
              width={570}
              height={400}
              quality={100}
            />
          </div>
        ) : (
          <div className="border-b border-input overflow-hidden rounded w-[570px] h-[635px] bg-gray-100 flex justify-center items-center col-span-4 lg:col-span-2 lg:justify-start">
            <div className="flex justify-center items-center w-full">
              <Icons.image width={40} height={40} className="text-gray-500" />
            </div>
          </div>
        )}

        <div className="col-span-4 lg:col-span-2 pt-2">
          <h2 className="text-primary dark:text-white text-2xl font-bold capitalize">
            {truncateText(event.event_name)}
          </h2>
          <Link
            aria-label="event category"
            href={`/events?categories=${event.event_priority}`}
            className={`border border-input dark:border-secondary rounded-3xl px-2 font-semibold ${getBadgeColor(event.event_priority)}`}
          >
            {event.event_priority}
          </Link>

          <div className="border-b border-input dark:border-secondary my-6" />

          <div className="flex flex-row gap-3">
            {<Calendar />}
            <p className="flex ">
            {moment(event.event_date).format("MMMM D, YYYY")}
            </p>
            
          </div>

          <div className="border-b border-input dark:border-secondary my-6" />

          {/* Description */}
          <div>
            <EventDescription {...event} />
          </div>
        </div>
      </div>
    </>
  );
}
