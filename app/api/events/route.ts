import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const eventCollectionRef = collection(db, "events");

  try {
    const data = getDocs(eventCollectionRef);

    const filteredData = (await data).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const path = request.nextUrl.searchParams.get("path") || "/";

    revalidatePath(path);

    return NextResponse.json(filteredData);
  } catch (err) {
    return new Response(null, { status: 500 });
  }
}
