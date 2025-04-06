import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);

    // If each doc contains a `categories` array, flatten them
    let categories = snapshot.docs.flatMap(
      (doc) => doc.data().categories || []
    );

    return new Response(JSON.stringify({ categories }), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}
