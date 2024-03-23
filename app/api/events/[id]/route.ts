import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Props) {
  const id = params.id;

  try {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    return NextResponse.json(docSnap.data());
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}
