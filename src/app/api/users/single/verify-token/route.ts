import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
  const { token } = await req.json();
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: {
          gte: Date.now(),
        },
      },
    });

    if (!user)
      return new Response("Invalid Token or Token  has Expired", {
        status: 401,
      });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Could not get User Details, please try again", {
      status: 500,
    });
  }
};
