"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { Icons } from "./Icons";

function Hero() {
  return (
    <section className="grid grid-cols-12 pt-20 items-center lg:pt-6 sm:px-8 dark:bg-secondary">
      <div className="hero-left-side col-span-12 xl:col-span-6 text-center pb-14 xl:text-left lg:pb-0">
        <h2 className="text-4xl font-bold py-2 xl:max-w-md text-primary dark:text-white capitalize lg:text-6xl">
          Event log.
        </h2>
        <p className="text-base text-gray-600 xl:max-w-md dark:text-gray-400 pt-2 pb-7 lg:text-lg">
        Track, create, edit or delete your events
        </p>
        <Link
          href="/events"
          className={buttonVariants({
            variant: "primary",
            size: "default",
            className: "group mx-auto xl:mx-0 w-24 xl:w-28",
          })}
        >
          Events
          <Icons.arrowRight className="w-5 ml-2 group-hover:translate-x-1 duration-500 transition-transform" />
        </Link>
      </div>

      <div className="hero-right-side hidden sm:flex col-span-12 justify-center xl:col-span-6 xl:inline-block pl-0 xl:pl-10">
        <Icons.logo className="" />
      </div>
    </section>
  );
}

export default Hero;
