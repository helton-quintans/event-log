import { db } from "@/firebase/config";
import { Event } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const eventsRef = collection(db, "events");
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");

  if (!category) {
    new Response("Missing category", { status: 400 });
  }

  const queryRef = query(eventsRef, where("event_category", "==", category));

  try {
    const eventCategories = (await getDocs(queryRef)).docs.map((doc) => ({
      ...(doc.data() as Event),
      id: doc.id,
    }));

    return NextResponse.json(eventCategories);
  } catch (err) {
    return new Response(null, { status: 500 });
  }
}
