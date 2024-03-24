import { db } from "@/firebase/config";
import { Event } from "@/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

enum SortingCondition {
  Ascending = "az",
  Descending = "za",
  Oldest = "on",
  Newest = "no",
  LowestPrice = "lh",
  HighestPrice = "hl",
}

export async function GET(request: Request) {
  const eventCollectionRef = collection(db, "events");
  const { searchParams } = new URL(request.url);

  const searchTerm = searchParams.get("q");
  const sortBy = searchParams.get("sort_by");
  //  /events?sort_by=

  if (!searchTerm) {
    new Response("Missing search Term", { status: 400 });
  }

  const lowerCaseSearchTerm = searchTerm?.toLowerCase();

  // Queries

  let sortQuery;
  switch (sortBy) {
    case SortingCondition.Ascending:
    case SortingCondition.Oldest:
      sortQuery = query(eventCollectionRef, orderBy("created_at", "asc"));
      break;
    case SortingCondition.Newest:
      sortQuery = query(eventCollectionRef, orderBy("created_at", "desc"));
      break;
    default:
      sortQuery = query(eventCollectionRef); // Default query
      break;
  }

  try {
    const defaultData = (await getDocs(sortQuery)).docs.map((doc) => ({
      ...(doc.data() as Event),
      id: doc.id,
    }));

    let searchDatas = defaultData;

    if (searchTerm) {
      const searchQuery = query(
        eventCollectionRef,
        where("event_name", ">=", lowerCaseSearchTerm),
        where("event_name", "<=", lowerCaseSearchTerm + "\uf8ff")
      );

      searchDatas = (await getDocs(searchQuery)).docs.map((doc) => ({
        ...(doc.data() as Event),
        id: doc.id,
      }));
    }

    return NextResponse.json(searchDatas);
  } catch (err) {
    return new Response(null, { status: 500 });
  }
}
