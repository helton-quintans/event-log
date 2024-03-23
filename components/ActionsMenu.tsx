"use client";

import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import Link from "next/link";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function ActionsMenu({ itemId }: { itemId: string }) {
  const router = useRouter();

  const deleteEvent = async (id: string) => {
    await toast.promise(deleteDoc(doc(db, "events", id)), {
      loading: "Deleted...",
      success: <b>Successfully deleted!</b>,
      error: <b>Could not save.</b>,
    });

    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <Link
          aria-label="edit event"
          className={`${buttonVariants({ variant: "outline", size: "icon" })} hover:bg-green-300`}
          href={`/dashboard/store/event/${itemId}`}
        >
          <Icons.edit className="w-4 text-gray-500 dark:text-white" />
        </Link>

        <Link
          aria-label="view event"
          className={`${buttonVariants({ variant: "outline", size: "icon" })} hover:bg-gray-300`}
          href={`/event/${itemId}`}
        >
          <Icons.view className="w-4 text-gray-500 dark:text-white" />
        </Link>

        <button
          name="Delete"
          className={`${buttonVariants({ variant: "outline", size: "icon" })} hover:bg-red-300`}
          onClick={() => deleteEvent(itemId as string)}
        >
          <Icons.delete className="w-4 text-gray-500  dark:text-white" />
        </button>
      </div>
    </>
  );
}

export default ActionsMenu;
