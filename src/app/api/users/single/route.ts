import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response("You must login to access this", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (user) {
      const { password, ...noPassword } = user;

      return new Response(JSON.stringify(noPassword), { status: 200 });
    }
    return new Response("User Does not Exist", { status: 400 });
  } catch (error) {
    return new Response("Could not get User Details, please try again", {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const { agentBonus } = await req.json();

    const session = await getAuthSession();

    if (!session)
      return new Response("You must login to access this", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        accountBalance: user?.accountBalance + agentBonus,
        agentBonus: 0,
      },
    });

    const { password, ...noPassword } = updatedUser;

    return new Response(JSON.stringify(noPassword), { status: 200 });
  } catch (error) {
    return new Response("Could not Update Acconut Balance, please try again", {
      status: 500,
    });
  }
}
