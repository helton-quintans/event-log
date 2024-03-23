import { z } from "zod";

const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

export const eventSchema = z.object({
  event_name: z
    .string()
    .min(2, { message: "Must be at least 2 character" })
    .max(30, { message: "Must be at most 30 characters" }),
  description: z
    .string()
    .max(200, { message: "Must be at most 200 characters" })
    .optional(),
  event_priority: z.string(),
  event_date: z.string().regex(dateFormatRegex, {
    message: "Invalid date format. Please use MM/DD/YYYY."
  }),
})
