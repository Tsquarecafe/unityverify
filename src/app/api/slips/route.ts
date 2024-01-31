import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/utils";
import { NextRequest } from "next/server";

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

export async function PATCH(req: NextRequest) {
  try {
    const { slipId, price } = await req.json();
    const session = await getAuthSession();

    if (!session || !session.user)
      return new Response("You must be logged In", {
        status: 401,
      });
    if (session.user.type != UserRole.ADMIN)
      return new Response("Only Admin can perform this action", {
        status: 403,
      });

    if (!slipId || (!price && price != 0))
      return new Response("Bad request, Ensure Complete Details", {
        status: 400,
      });

    await db.slipType.update({
      where: {
        id: slipId,
      },
      data: {
        price,
      },
    });

    return new Response("Slip Price Updated Successfully ", { status: 200 });
  } catch (error) {
    return new Response("Could not update slip Price , Please try again", {
      status: 500,
    });
  }
}
