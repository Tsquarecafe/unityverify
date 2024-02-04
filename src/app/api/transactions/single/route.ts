import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const transactionId = req.nextUrl.searchParams.get("transactionId");

    if (!transactionId)
      return new Response("Please Send a Transaction ID", { status: 401 });

    const session = await getAuthSession();

    if (!session)
      return new Response("You must login to access this", { status: 401 });

    const transaction = await db.transaction.findFirst({
      where: {
        id: transactionId,
      },
    });

    if (transaction) {
      return new Response(JSON.stringify(transaction), { status: 200 });
    }
    return new Response("Transaction Does not Exist", { status: 400 });
  } catch (error) {
    return new Response("Could not get Transaction Details, please try again", {
      status: 500,
    });
  }
}
