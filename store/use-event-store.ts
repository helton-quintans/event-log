import { Event } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface EventStore {
  events: Event[];
  date: string | Date;
  formatDate: (date: Date) => string;
  addEvent: (payload: Event) => void;
  removeItem: (payload: Event) => void;
}

export const useEventStore = create(
  persist(
    immer<EventStore>((set) => ({
      events: [],
      date: "",

      formatDate: (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },

      addEvent: (payload: Event) =>
        set((state) => {
          state.events.push(payload);
        }),
     
      removeItem: (payload) =>
        set((state) => {
          const eventIndex = state.events.findIndex(
            (event) => event.id === payload.id
          );

          if (eventIndex !== -1) {
            state.events.splice(eventIndex, 1);
          }
        }),
    })),
    { name: "Events" }
  )
);
