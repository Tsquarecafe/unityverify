import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { paymentValidator } from "@/lib/validators/payment";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { UserRole, createUniqueId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  let paymentSummary = {};
  try {
    const session = await getAuthSession();

    if (!session || !session?.user) {
      return new Response("You Must be Logged in to access this", {
        status: 401,
      });
    }

    let result = await db.payment.groupBy({
      where: {
        userId: session.user.id,
      },
      by: "status",
      _count: true,
    });

    let creditedPayments = 0;
    let initiatedPayments = 0;
    let failedPayments = 0;
    let totalAmount = 0;

    result.forEach((item) => {
      if (item.status === "CREDITED") {
        creditedPayments = item._count;
      }
      if (item.status === "INITIATED") {
        initiatedPayments = item._count;
      }
      if (item.status === "FAILED") {
        failedPayments = item._count;
      }
    });

    const yourPayments = await db.payment.findMany({
      where: {
        userId: session?.user.id,
      },
      include: {
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    yourPayments.forEach((payment) => {
      if (payment.status === "CREDITED") {
        totalAmount += payment.amount;
      }
    });

    paymentSummary = {
      yourPayments,
      creditedPayments,
      initiatedPayments,
      failedPayments,
      totalAmount,
    };

    return new Response(JSON.stringify(paymentSummary), { status: 200 });
  } catch (error) {
    return new Response("Could not get payments, Please try again", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { amount, paymentMethod, status } = paymentValidator.parse(body);

    const session = await getAuthSession();
    if (!session || !session?.user) {
      return new Response("You Must be Logged in to access this", {
        status: 401,
      });
    }

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new Response("User Does not exist", {
        status: 400,
      });
    }

    // Create unique Transaction  ID
    const paymentReference = `${paymentMethod.slice(0, 4)}${amount}${user.name
      ?.slice(0, 5)
      .replace(/\s+/g, "")
      .trim()}-${createUniqueId()}`;

    const newPayment = await db.payment.create({
      data: {
        status,
        amount,
        paymentMethod,
        userId: session.user.id,
        paymentReference,
      },
    });

    return new Response(
      JSON.stringify({ id: newPayment.id, paymentReference }),
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not post to payment, Please try again", {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const { paymentId, status } = z
    .object({
      paymentId: z.string(),
      status: z.enum(["INITIATED", "PAID", "CREDITED", "FAILED"]),
    })
    .parse(body);
  try {
    const session = await getAuthSession();

    if (!session || !session?.user) {
      return new Response("You Must be Loged in to access this", {
        status: 401,
      });
    }

    if (session?.user.type != UserRole.ADMIN) {
      return new Response("you cannot perform this action", {
        status: 403,
      });
    }
    const currentPayment = await db.payment.findFirst({
      where: {
        id: paymentId,
      },
    });

    if (!currentPayment)
      return new Response("invalid payment record", { status: 400 });

    const user = await db.user.findFirst({
      where: {
        id: currentPayment.userId,
      },
    });

    if (!user)
      return new Response("Invalid User to be credited", {
        status: 401,
      });

    const newAccBal = user.accountBalance + currentPayment.amount;

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountBalance: newAccBal,
      },
    });

    await db.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: status,
      },
    });

    return new Response("OK", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("invalid Request Data", { status: 422 });
    }

    return new Response("Could not post to payment, Please try again", {
      status: 500,
    });
  }
}
