import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { newPassword } = await req.json();
    const userId = req.nextUrl.searchParams.get("userId");

    const session = await getAuthSession();

    if (!session || !session.user)
      return new Response("You must login to access this", { status: 401 });

    if (session.user.type != UserType.ADMIN)
      return new Response("only admins can Access this ", { status: 403 });

    if (!userId)
      return new Response("Please send the User Id", { status: 400 });

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    if (!user.password)
      return new Response(
        "Your Account was created using google Auth Provider",
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    const { password, ...noPassword } = updatedUser;

    return new Response(JSON.stringify(noPassword), { status: 200 });
  } catch (error) {
    return new Response("Could not Update Password, please try again", {
      status: 500,
    });
  }
}
