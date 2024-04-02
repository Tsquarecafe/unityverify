import { noPhotoString } from "@/lib/imageBlob";
import { renameResponseobjKeys } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import isBase64 from "is-base64";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.VERIFICATION_API_KEY,
  app_id: process.env.VERIFICATION_APP_ID,
};

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone)
    return new Response("Please Provide a valid Phone registered with NIMC", {
      status: 400,
    });

  try {
    let res = await axios.post(
      "https://api.prembly.com/identitypass/verification/phone_number/advance",
      {
        number: phone,
      },
      { headers }
    );

    if (res.data?.status) {
      res.data = renameResponseobjKeys(res.data);

      const { residence_Town, residence_AdressLine1, photo, signature } =
        res.data?.data;

      const photoUrlStringNew = photo?.replace(/\n/g, "");
      const signatureUrlStringNew = signature?.replace(/\n/g, "");

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.data,
            photo:
              isBase64(photoUrlStringNew) && photoUrlStringNew != ""
                ? photoUrlStringNew
                : noPhotoString,
            signature:
              isBase64(signatureUrlStringNew) && signatureUrlStringNew != ""
                ? signatureUrlStringNew
                : noPhotoString,
            residence_address: residence_AdressLine1,
            residence_town: residence_Town,
          },
          status: res.data.status,
        }),
        { status: 200 }
      );
    } else {
      if (res?.data?.message) {
        return new Response(res.data.message, {
          status: 500,
        });
      } else if (!res?.data)
        return new Response("Record not Found!", {
          status: 400,
        });
      else {
        return new Response("Something Went Wrong, Please try again latter", {
          status: 500,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return new Response("Could not verify, please try again", {
      status: 500,
    });
  }
}
