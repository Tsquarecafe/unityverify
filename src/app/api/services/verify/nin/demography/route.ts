import { noPhotoString } from "@/lib/imageBlob";
import axios from "axios";
import isBase64 from "is-base64";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.QUICK_VERIFY_API_KEY,
};

export async function POST(req: Request) {
  const { firstname, lastname, gender, dob } = await req.json();

  if (!firstname || !lastname || !gender || !dob)
    return new Response("Please Provide all fields Registered with NIMC", {
      status: 400,
    });

  const [year, month, day] = dob?.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  try {
    let res = await axios.post(
      "https://api.quickverify.com.ng/verification/nin-demography",
      {
        firstname,
        lastname,
        gender,
        dob: formattedDate,
      },
      { headers }
    );

    if (res.data?.status) {
      const { photo, signature } = res.data?.data;

      const photoUrlStringNew = photo?.replace(/\n/g, "");
      const signatureUrlStringNew = signature?.replace(/\n/g, "");

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.data,
            photo: isBase64(photoUrlStringNew)
              ? photoUrlStringNew
              : noPhotoString,
            signature: isBase64(signatureUrlStringNew)
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
      }
      return new Response("Something Went Wrong, Please try again latter", {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Could not verify, please try again", {
      status: 500,
    });
  }
}
