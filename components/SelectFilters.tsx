"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "./ui/LoadingButton";
import { Icons } from "./Icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SORT_BY = {
  // query params
  on: "Date: Old to new",
  no: "Date: New to old",
};

function SelectFilters() {
  const [selectedValue, setSelectedValue] = useState("");
  const router = useRouter();

  return (
    <form
      className="flex gap-2 items-center"
      action={(formData) => {
        const params = new URLSearchParams();
        params.set("sort_by", selectedValue);
        const queryString = params.toString();

        if (queryString.includes(selectedValue)) {
          return router.push(`/events?${queryString}`);
        }
      }}
    >
      <LoadingButton name="Filter" type="submit" size="mm" variant="primary">
        <Icons.flower />
      </LoadingButton>
      
      <select
        className="text-primary dark:text-white bg-gray-50 dark:bg-secondary border border-input dark:border-secondary rounded-lg focus:border-font block p-2.5 outline-none text-base font-medium"
        placeholder="value"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        <option value="DEFAULT">Sort by</option>
        {Object.entries(SORT_BY).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>

      <Link
        aria-label="new event"
        href="/dashboard/store/new"
        className={cn(
          "text-sm ml-4 min-h-[46px] flex items-center text-primary dark:text-white justify-end gap-2 px-3 border border-input dark:border-secondary rounded py-1 hover:bg-inputBg dark:hover:bg-slight/70 transition-colors duration-300"
        )}
      >
        <Icons.new className="w-4 " />
        <span>New</span>
      </Link>
    </form>
  );
}

export default SelectFilters;
