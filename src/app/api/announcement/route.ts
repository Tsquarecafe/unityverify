import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const announcement = await db.announcement.findMany();

    return new Response(JSON.stringify(announcement), { status: 200 });
  } catch (error) {
    return new Response("Could not get announcement, Please try again", {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { announcementId, title, text } = await req.json();

    const session = await getAuthSession();

    if (!session || !session.user)
      return new Response("You must be logged In", {
        status: 401,
      });
    if (session.user.type != UserRole.ADMIN)
      return new Response("Only Admin can perform this action", {
        status: 403,
      });

    if (!announcementId || !title || !text)
      return new Response("Bad request, Ensure Complete Details", {
        status: 400,
      });

    await db.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title,
        text,
      },
    });

    return new Response("Announcement Updated Successfully ", { status: 200 });
  } catch (error) {
    return new Response("Could not update Announcement , Please try again", {
      status: 500,
    });
  }
}
