import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const { transactionId, slipId, status } = z
    .object({
      transactionId: z.string().optional(),
      slipId: z.string().optional(),
      status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
    })
    .parse(body);

  try {
    const session = await getAuthSession();

    if (!session || !session?.user) {
      return new Response("You Must be Loge din to access this", {
        status: 401,
      });
    }

    let updateObj = {};

    if (status) {
      updateObj = { status, ...updateObj };
    }

    if (slipId) {
      updateObj = { slipId, ...updateObj };
    }

    const slip = await db.slipType.findFirst({
      where: {
        id: slipId,
      },
    });

    if (!slip)
      return new Response("Invalid Slip", {
        status: 400,
      });

    await db.transaction.update({
      where: {
        id: transactionId,
      },
      data: updateObj,
    });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!user)
      return new Response("Invalid Login Credentials", {
        status: 401,
      });

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        accountBalance: user.accountBalance - slip.price,
      },
    });

    return new Response("OK", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not Update to transaction, Please try again", {
      status: 500,
    });
  }
}
