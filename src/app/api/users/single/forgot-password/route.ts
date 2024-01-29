import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
// @ts-ignore
import nodemailer from "nodemailer";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    if (!user.password)
      return new Response(
        "Your Account was created using google Auth Provider",
        { status: 400 }
      );

    const secret = process.env.JWT_SECRET + user.password;

    const payload = { userId: user.id, type: user.type };

    const forgotPasswordToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("10m")
      .sign(new TextEncoder().encode(secret));

    const link = `http://localhost:3000/api/auth/resetPassword/?userId=${user.id}&token=${forgotPasswordToken}`;

    const output = `
        <div className="flex items-center justify-center">
          <h2 className=" text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Lilong International</h2>

          <div className="">
              <h3 className="text-3xl tracking-tight text-gray-900" >Hello ${user.name}!</h3>
              <p>You have requested to reset the password to your account on TSqure Cafe</p>
              <p>Please Note the link will only be active for 5 minutes</p>

              <p>Click the link below to reset password</p>
              <a target="_" href="${link}">Reset My Password</a>

              <br />
              <p>Cheers!!</p>
              <p>Lilong International Team</p>
          </div>
        
        </div>
      `;

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: "counselokpabijs@gmail.com",
        pass: process.env.GOOGLE_PASS,
      },
      secure: true,
    });

    let mailData = await transporter.sendMail({
      from: "counselokpabijs@gmail.com",
      to: user.email, // list of receivers
      subject: "Password reset notification ✔", // Subject line
      text: `Hello ${user.name} ! \n You have requested to reset the password to your account on Lilong International. Click the link below to get started.\n ${link}`, // plain text body
      html: output, // html body
    });
    // @ts-ignore
    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      else console.log("Email sent successfully");
    });

    return new Response("Email Sent", { status: 200 });
  } catch (error) {
    return new Response("Could not Update Password, please try again", {
      status: 500,
    });
  }
}
