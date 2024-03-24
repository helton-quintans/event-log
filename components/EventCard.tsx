"use client";

import Image from "next/image";
import { buttonVariants } from "./ui/Button";
import { Event } from "@/types";
import { cn, truncateText } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./Icons";
import moment from "moment";

function EventCard({ item }: { item: Event }) {

  return (
    <div className="border border-input dark:border-secondary rounded cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ease-in min-w-[260px] max-w-[260px] min-h-[440px] max-h-[440px]">
      <Link href={`event/${item.id}`}>
        {item.img_url ? (
          <div className="border-b border-input dark:border-secondary overflow-hidden rounded h-64 relative">
            <Image
              src={item.img_url}
              alt={item.event_name}
              priority
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t w-auto"
            />
          </div>
        ) : (
          <div className="border-b border-input overflow-hidden rounded h-[255px] bg-gray-100 flex justify-center items-center">
            <Icons.image width={40} height={40} className="text-gray-500" />
          </div>
        )}
      </Link>

      <Link href={`event/${item.id}`}>
        <div className="p-4">
          <h2 className="font-semibold text-lg pb-1 capitalize">
            {truncateText(item.event_name)}
          </h2>
          <span className="text-gray-600 dark:text-gray-400">
            {moment(item.event_date).format("MMMM D, YYYY")}
          </span>
        </div>
      </Link>

      <div className="p-4 flex justify-center gap-4">
        <Link
          href={`event/${item.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }) + "px-5 h-8 py-0 text-sm"
          )}
        >
          Preview
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
