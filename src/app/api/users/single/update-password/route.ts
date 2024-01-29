import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  try {
    const { newPassword, currentPassword } = await req.json();

    const session = await getAuthSession();

    if (!session || !session.user)
      return new Response("You must login to access this", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
        email: session.user.email,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    if (!user.password)
      return new Response(
        "Your Account was created using google Auth Provider",
        { status: 400 }
      );

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!currentPasswordMatch)
      return new Response(
        "Your Current Password is Incorrect!, Try Reset Password",
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
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
