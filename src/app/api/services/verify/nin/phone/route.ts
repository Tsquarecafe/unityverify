import { noPhotoString } from "@/lib/imageBlob";
import { renameResponseobjKeys } from "@/lib/utils";
import axios from "axios";
import isBase64 from "is-base64";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.IDVERIFYTOKEN}`,
};

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone)
    return new Response("Please Provide a valid Phone registered with NIMC", {
      status: 400,
    });

  try {
    let res = await axios.post(
      "https://directverify.com.ng/api/pnv/index",
      {
        idNumber: phone,
        idType: "PNV",
        consent: true,
      },
      { headers }
    );

    if (res.data?.status) {
      // res.data = renameResponseobjKeys(res.data);

      const photoUrlStringNew = res.data.message?.photo?.replace(/\n/g, "");
      const signatureUrlStringNew = res.data.message?.signature?.replace(
        /\n/g,
        ""
      );

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.message,
            photo:
              isBase64(photoUrlStringNew) && photoUrlStringNew != ""
                ? photoUrlStringNew
                : noPhotoString,
            signature:
              isBase64(signatureUrlStringNew) && signatureUrlStringNew != ""
                ? signatureUrlStringNew
                : noPhotoString,
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
      } else {
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
