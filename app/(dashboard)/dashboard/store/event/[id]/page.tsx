import EditEventForm from "@/components/EditEventForm";
import { getEvent } from "@/lib/events";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
};

async function EditEvent({ params: { id } }: PageProps) {
  const event = await getEvent(id);

  if (!event) notFound();

  return (
    <>
      <div className="pb-2">
        <h1 className="text-primary dark:text-white text-3xl font-bold pb-1">
          Update event
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Update your event information
        </p>
      </div>

      <EditEventForm item={event} id={id} />
    </>
  );
}

export default EditEvent;
