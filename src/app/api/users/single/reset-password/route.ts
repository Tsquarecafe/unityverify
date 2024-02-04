import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, password } = await req.json();

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) return new Response("Email Does not Exists", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null,
      },
    });

    return new Response("Password Reset Successfull", {
      status: 200,
    });
  } catch (error) {
    return new Response("Could Reset Password, please try again", {
      status: 500,
    });
  }
};
