import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import crypto from "crypto";
import HTML_TEMPLATE from "@/lib/templates/emailTemp";
import nodemailer from "nodemailer";
import { User } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  let existingUser: User | null;
  try {
    const { email } = await req.json();

    existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (!existingUser || !existingUser.name)
      return new Response("Email Does not Exists", { status: 400 });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = Date.now() + 36000000;

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        resetToken: passwordResetToken,
        passwordResetExpires: passwordResetExpires,
      },
    });

    const resetUrl = `https://www.unityverify.com/reset-password/${resetToken}`;

    const { name } = existingUser;
    const transporter = nodemailer.createTransport({
      port: 465,
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "unityverifyenterprise@gmail.com",
        pass: process.env.GOOGLE_PASS,
      },
      secure: true,
    });

    let mailData = await transporter.sendMail({
      from: "unityverifyenterprise@gmail.com",
      to: email, // list of receivers
      subject: "Reset Password Confirmation ✔", // Subject line
      html: HTML_TEMPLATE({ name: name, url: resetUrl }), // html body
    });

    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      else console.log("Email sent successfully");
    });

    return new Response("Email Sent Sucess", {
      status: 200,
    });
  } catch (error) {
    // @ts-ignore
    if (existingUser) {
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          resetToken: null,
          passwordResetExpires: null,
        },
      });
    }

    return new Response("Could not get User Details, please try again", {
      status: 500,
    });
  }
};
