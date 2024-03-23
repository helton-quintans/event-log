import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString(); // Convert to ISO 8601 format
}

// custom capitalize function for event names.
export function capitalize(name: string | undefined) {
  if (!name) return ""; // Trata o caso em que 'name' é undefined
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const truncateText = (text: string): string => {
  return text.length > 19 ? `${text.slice(0, 19)}...` : text;
};

export const getBadgeColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-300";
    case "medium":
      return "bg-yellow-300";
    case "low":
      return "bg-green-300";
    case "flexible":
      return "bg-blue-300";
    default:
      return "bg-gray-300";
  }
};
