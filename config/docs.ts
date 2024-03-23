import { DocsConfig } from "@/types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "View Events",
      href: "/events",
    },
    {
      title: "Dashboard",
      href: "/dashboard/store",
    },
    {
      title: "Tech Stack",
      href: "/tech-stack",
    },
  ],
  dashboardNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "person",
      disabled: true,
    },
    {
      title: "Events ",
      href: "/dashboard/store",
      icon: "calendar",
    },
  ],
};
