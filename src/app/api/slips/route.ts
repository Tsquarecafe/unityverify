import { db } from "@/lib/db";

export async function GET() {
  try {
    const slips = await db.slipType.findMany();

    return new Response(JSON.stringify(slips), { status: 200 });
  } catch (error) {
    return new Response("Could not get slip types, Please try again", {
      status: 500,
    });
  }
}
