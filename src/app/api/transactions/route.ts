import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { transactionValidator } from "@/lib/validators/transaction";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { UserRole } from "@/lib/utils";
import { TransactionStatus } from "@prisma/client";

interface IQueryObj {
  where?: {
    userId?: string;
    status?: TransactionStatus;
    slipId?: string;
  };
  include: {
    slipType: boolean;
    createdBy?: boolean;
  };
  orderBy: {
    createdAt: "asc" | "desc";
  };
  take?: number;
  skip?: number;
}

interface IgroupQueryObj {
  where?: {
    userId: string;
  };
}

export async function GET(req: NextRequest) {
  const isFilter = req.nextUrl.searchParams.get("filter");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "0");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "0");
  const status = req.nextUrl.searchParams.get("status") as TransactionStatus;
  const slipyType = req.nextUrl.searchParams.get("slipyType");

  const session = await getAuthSession();

  let transactions = {};
  try {
    let groupQueryObj: IgroupQueryObj = {};

    if (session?.user.type === "AGENT")
      groupQueryObj = {
        where: {
          userId: session.user.id,
        },
        ...groupQueryObj,
      };
    if (isFilter) {
      let result = await db.transaction.groupBy({
        ...groupQueryObj,
        by: "status",
        _count: true,
      });

      let successTransactions = 0;
      let pendingsTransactions = 0;
      let failedTransactions = 0;

      result.forEach((item) => {
        if (item.status === "SUCCESS") {
          successTransactions = item._count;
        }
        if (item.status === "PENDING") {
          pendingsTransactions = item._count;
        }
        if (item.status === "FAILED") {
          failedTransactions = item._count;
        }
      });

      transactions = {
        totalTransactions:
          successTransactions + pendingsTransactions + failedTransactions,
        successTransactions,
        pendingsTransactions,
        failedTransactions,
      };
    } else {
      let queryObj: IQueryObj = {
        include: {
          slipType: true,
          createdBy: session?.user.type === UserRole.ADMIN ? true : false,
        },
        orderBy: {
          createdAt: "desc",
        },
      };

      if (session?.user.type === UserRole.AGENT)
        queryObj = {
          where: {
            userId: session.user.id,
          },
          ...queryObj,
        };

      // @ts-ignore
      if (status && status != "ALL") {
        queryObj = {
          where: {
            status: status,
          },
          ...queryObj,
        };
      }

      if (slipyType && slipyType != "ALL") {
        const filterSlip = await db.slipType.findFirst({
          where: {
            title: slipyType,
          },
        });

        if (!filterSlip)
          return new Response("Invalid Slip, Please try again", {
            status: 400,
          });

        queryObj = {
          where: {
            slipId: filterSlip.id,
          },
          ...queryObj,
        };
      }

      if (page && limit) {
        const skip = (page - 1) * limit;

        queryObj = { ...queryObj, take: limit, skip };
      }

      transactions = await db.transaction.findMany(queryObj);
    }
    let totalNumberOfTransactions = 0;

    if (session?.user.type === UserRole.AGENT) {
      totalNumberOfTransactions = await db.transaction.count({
        where: {
          userId: session.user.id,
        },
      });
    } else {
      totalNumberOfTransactions = await db.transaction.count();
    }

    const numberOfPages = Math.ceil(totalNumberOfTransactions / limit);

    return new Response(
      JSON.stringify({
        transactions,
        numberOfPages,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Could not get transactions, Please try again", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { type, slipType, status } = transactionValidator.parse(body);
  try {
    const session = await getAuthSession();
    if (!session || !session?.user) {
      return new Response("You Must be Logged in to access this", {
        status: 401,
      });
    }

    const slip = await db.slipType.findFirst({
      where: {
        title: slipType,
      },
    });

    if (!slip) {
      return new Response("Invalid slip type selected, Please try again", {
        status: 400,
      });
    }

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (user && user.accountBalance < slip.price + 170) {
      return new Response("Insufficient Balance, Please Credit your account ", {
        status: 401,
      });
    }

    const newTransaction = await db.transaction.create({
      data: {
        type,
        slipId: slip?.id,
        status,
        price: slip?.price,
        userId: session.user.id,
      },
    });

    return new Response(
      JSON.stringify({ id: newTransaction.id, slipId: newTransaction.slipId }),
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not post to transaction, Please try again", {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const failed = req.nextUrl.searchParams.get("failed");

  const { transactionId, slipId, reference, status } = z
    .object({
      transactionId: z.string().optional(),
      slipId: z.string().optional(),
      reference: z.string().optional(),
      status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
    })
    .parse(body);

  try {
    let updateObj = {};

    if (status) {
      updateObj = { status };
    }
    if (reference) {
      updateObj = { reference };
    }

    const session = await getAuthSession();

    if (!session || !session?.user) {
      return new Response("You Must be Loge din to access this", {
        status: 401,
      });
    }
    await db.transaction.update({
      where: {
        id: transactionId,
      },
      data: updateObj,
    });

    const slip = await db.slipType.findFirst({
      where: {
        id: slipId,
      },
    });

    if (!slip) {
      return new Response("Invalid Request, Please try again", {
        status: 400,
      });
    }

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
        accountBalance: user.accountBalance - (slip.price + 170),
        agentBonus: user.agentBonus + 20,
      },
    });

    return new Response("OK", {
      status: 200,
    });
  } catch (error) {
    console.log(error, "error");

    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not Update to transaction, Please try again", {
      status: 500,
    });
  }
}
