import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { creditValidatorViaEmail } from "@/lib/validators/payment";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import { UserRole, createUniqueId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { amount, paymentMethod, status, email } =
      creditValidatorViaEmail.parse(body);

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

    if (user.type !== UserRole.ADMIN) {
      return new Response("Only Admin can peform this Operation", {
        status: 403,
      });
    }

    const userToCredit = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!userToCredit)
      return new Response("This email is Incorrect", {
        status: 400,
      });

    // Create unique Transaction  ID
    const paymentReference = `${paymentMethod.slice(
      0,
      4
    )}${amount}${userToCredit.name
      ?.slice(0, 5)
      .replace(/\s+/g, "")
      .trim()}-${createUniqueId()}`;

    const newPayment = await db.payment.create({
      data: {
        status,
        amount,
        paymentMethod,
        userId: userToCredit.id,
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
