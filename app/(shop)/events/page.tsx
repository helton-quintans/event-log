import PaginationBar from "@/components/PaginationBar";
import Events from "@/components/Events";
import SelectFilters from "@/components/SelectFilters";
import {
  getCategoryEvents,
  getFilteredEvents,
  getEvents,
  getSearchEvents,
} from "@/lib/events";
import { Event } from "@/types";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: {
    q: string;
    sort_by: string;
    categories: string;
    page: string;
  };
};

async function EventsPage({
  searchParams: { page = "1", q, sort_by, categories },
}: PageProps) {

  const currentPage = parseInt(page);
  const pageSize = 6;

  const allEvents: Event[] | undefined = await getEvents();
  let filteredResults = allEvents;

  if (sort_by) {
    filteredResults = await getFilteredEvents(sort_by);
  } else if (categories) {
    filteredResults = await getCategoryEvents(categories);
  } else if (q) {
    filteredResults = await getSearchEvents(q);
  }

  const totalItemCount = filteredResults?.length || 0;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItemCount);
  const displayedEvents = filteredResults?.slice(startIndex, endIndex) || [];

  const eventIsNotFound = allEvents?.length === 0 || totalItemCount === 0;

  return (
    <div className="col-span-12 order-1 xl:col-span-9 xl:order-2">
      <div className="flex flex-col sm:flex-row justify-between items-center py-1">
        <h2 className="pb-3 sm:pb-0">
          Showing {filteredResults?.length} of {filteredResults?.length} results
        </h2>

        <SelectFilters />
      </div>

      {eventIsNotFound ? (
        <div className="flex flex-col items-center text-center justify-center gap-2 h-3/4 py-10">
          <h6 className="text-xl md:text-2xl font-semibold">
            No events found
          </h6>
          <p className="text-gray-600 text-sm md:text-base">
            Try changing your filters, check back later or create a new event
            <div className="w-full flex justify-center pb-4">
            <Link
              aria-label="new event"
              href="/dashboard/store/new"
              className={cn(
                "text-sm flex items-center mt-4 text-primary dark:text-white justify-end gap-2 px-3 border border-input dark:border-secondary rounded py-1 hover:bg-inputBg dark:hover:bg-slight/70 transition-colors duration-300"
              )}
            >
              <Icons.new className="w-4" />
              <span>New</span>
            </Link>
      </div>
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-7 place-items-center xl:place-items-start gap-5 xl:gap-x-0 xl:gap-y-6">
            <Events data={displayedEvents} />
          </div>

          <div className="flex justify-center mt-8">
            <PaginationBar currentPage={currentPage} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}

export default EventsPage;
