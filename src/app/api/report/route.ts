import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { monthNames } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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

    const numOfUsers = await db.user.count();
    const numOfPayments = await db.payment.count();
    const numOfTransaction = await db.transaction.count();
    const allTransactions = await db.transaction.findMany({
      include: {
        slipType: true,
      },
    });

    const totalIncome = allTransactions.reduce((total, transaction) => {
      return total + (transaction.price + (transaction.slipType?.price || 0));
    }, 0);

    let monthlySummary = {};

    const res = allTransactions.map((transaction) => {
      const date = new Date(`${transaction.createdAt}`);
      const newDuration = `${
        monthNames[date.getMonth()]
      } ${date.getFullYear()}`;

      if (newDuration in monthlySummary)
        monthlySummary = {
          ...monthlySummary,
          // @ts-ignore
          [newDuration]: monthlySummary[newDuration] + 1,
        };
      else monthlySummary = { ...monthlySummary, [newDuration]: 1 };
    });

    return new Response(
      JSON.stringify({
        totalIncome,
        numOfUsers,
        numOfPayments,
        numOfTransaction,
        monthlySummary,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response("Could not get User Details, please try again", {
      status: 500,
    });
  }
}
