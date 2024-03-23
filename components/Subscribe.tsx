"use client";

import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";

function Subscribe() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.error("This functionality doesn't work");
  };

  return (
    <div className="dark:bg-secondary pb-20">
      <div className="shadow-sm py-20 border-input dark:border-secondary border rounded flex flex-col items-center justify-center mx-4 sm:mx-8 lg:mx-20">
        <h2 className="text-2xl font-semibold text-primary dark:text-white text-center pb-5 px-6 sm:text-2xl lg:text-3xl">
          Join our newsletter to get the latest news and updates
        </h2>

        <form
          onClick={handleSubmit}
          className="flex items-center gap-5 relative"
        >
          <input
            className="outline-none text-primary dark:text-white rounded w-60 sm:w-80 px-2 pr-16 py-2 shadow-sm border border-input dark:border-secondary dark:bg-secondary placeholder:text-sm md:placeholder:text-base"
            name="email"
            type="email"
            placeholder="event.log@gmail.com"
          />

          <Button
            name="Send Email"
            variant="primary"
            size="mm"
            className="absolute right-2"
          >
            <Icons.send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Subscribe;
