export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  icon?: string;
};

export type DocsConfig = {
  mainNav: NavItem[];
  dashboardNav: NavItem[];
};

export type SiteConfig = {
  url: string;
  github: string;
  linkedin: string;
};

type Event = {
  id?: string;
  event_name: string;
  event_priority: "high" | "medium" | "low" | "flexible" | "none";
  event_date: string;
  description: string;
  img_url: string;
  created_at: string;
};

