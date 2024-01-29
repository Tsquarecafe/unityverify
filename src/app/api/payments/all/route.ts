import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

interface IQueryObj {
  where?: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    paymentReference?: string;
    createdAt?: {
      gte: Date; // Earliest date
    };
  };
  include: {
    createdBy: boolean;
  };
  orderBy: {
    createdAt: "asc" | "desc";
  };
  take?: number;
  skip?: number;
}
type Istatus = "INITIATED" | "PAID" | "CREDITED" | "FAILED" | "ALL";
type Imethod = "CARD" | "TRANSFER" | "ALL";

export async function GET(req: NextRequest) {
  let payments = [];
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "0");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "0");
  const status = req.nextUrl.searchParams.get("status") as Istatus;
  const method = req.nextUrl.searchParams.get("method") as Imethod;
  const search = req.nextUrl.searchParams.get("search");
  const duration = req.nextUrl.searchParams.get("duration");

  try {
    const session = await getAuthSession();

    if (!session || !session?.user) {
      return new Response("You Must be Logged in to access this", {
        status: 401,
      });
    }
    if (session.user.type != "ADMIN") {
      return new Response("Only Admins can access this resource", {
        status: 403,
      });
    }

    let queryObj: IQueryObj = {
      include: {
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    if (page && limit) {
      const skip = (page - 1) * limit;

      queryObj = { ...queryObj, take: limit, skip };
    }

    if (search) {
      queryObj = {
        where: {
          paymentReference: search,
        },
        ...queryObj,
      };
    }

    if (status && status != "ALL") {
      queryObj = {
        where: {
          status: status,
        },
        ...queryObj,
      };
    }
    if (method && method != "ALL") {
      queryObj = {
        where: {
          method: method,
        },
        ...queryObj,
      };
    }

    payments = await db.payment.findMany(queryObj);

    const totalNumberOfPayments = await db.payment.count();
    const numberOfPages = Math.ceil(totalNumberOfPayments / limit);

    return new Response(JSON.stringify({ payments, numberOfPages }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Could not get payments, Please try again", {
      status: 500,
    });
  }
}
