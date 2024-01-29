import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { firstName, lastName, email } = await req.json();

    const session = await getAuthSession();

    if (!session)
      return new Response("You must login to access this", { status: 401 });

    if (!firstName || !lastName || !email)
      return new Response("Please Enter all Fields", { status: 401 });

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: `${firstName} ${lastName}`,
        email,
      },
    });

    const { password, ...noPassword } = updatedUser;

    return new Response(JSON.stringify({ noPassword }), { status: 201 });
  } catch (error) {
    return new Response("Could not Update Profile, please try again", {
      status: 500,
    });
  }
}
