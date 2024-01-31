import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextRequest } from "next/server";

interface IQueryObj {
  where?: {
    OR: [{ name: { contains: string } }, { email: { contains: string } }];
  };
  include: {
    transactions: boolean;
    payments: boolean;
  };
  orderBy: {
    name: "asc" | "desc";
  };

  take?: number;
  skip?: number;
}

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "0");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "0");
  const search = req.nextUrl.searchParams.get("search");
  try {
    const session = await getAuthSession();

    if (!session)
      return new Response("You must login to access this", { status: 401 });

    if (session.user.type != "ADMIN")
      return new Response("You cannot Access this resource", { status: 403 });

    let queryObj: IQueryObj = {
      include: {
        transactions: true,
        payments: true,
      },
      orderBy: {
        name: "asc",
      },
    };

    if (search)
      queryObj = {
        ...queryObj,
        where: {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        },
      };

    if (page && limit) {
      const skip = (page - 1) * limit;

      queryObj = { ...queryObj, take: limit, skip };
    }

    const users = await db.user.findMany(queryObj);

    let usersNoPassword: Omit<User, "password">[];

    usersNoPassword = users.map((user) => {
      const { password, ...noPassword } = user;
      return noPassword;
    });
    const totalNumberOfUsers = await db.user.count();
    const numberOfPages = Math.ceil(totalNumberOfUsers / limit);

    return new Response(JSON.stringify({ usersNoPassword, numberOfPages }), {
      status: 200,
    });
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
