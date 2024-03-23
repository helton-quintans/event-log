"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { Event } from "@/types";
import { cn } from "@/lib/utils";

function EventDescription(event: Event) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="w-full text-primary dark:text-white font-semibold text-lg flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Description</span>
        <Icons.chevronDown
          className={cn(
            "w-5 duration-500 transition-transform",
            isOpen && "-rotate-180"
          )}
        />
      </button>

      <div className="flex flex-col h-20 max-h-[250px] overflow-x-auto">
        <p
          className={cn(
            "text-primary dark:text-white transition-all duration-300 ease-in-out h-auto invisible opacity-0 pt-2",
            isOpen && "visible opacity-100 h-auto"
          )}
        >
          {event.description
            ? event.description
            : "This event has no description"}
        </p>
      </div>

      {/* <div className="border-b border-input my-3" /> */}
    </div>
  );
}

export default EventDescription;
