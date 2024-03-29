import { noPhotoString } from "@/lib/imageBlob";
import isBase64 from "is-base64";
import axios, { AxiosResponse } from "axios";
import { extractAddressFromRes, renameResponseobjKeys } from "@/lib/utils";

const baseURL = "https://api.quickverify.com.ng/verification";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Token ${process.env.NIN_PRINT_API_KEY}`,
};

const ninVerify = async (nin: string) => {
  try {
    return await axios.post(
      `https://ninprint.com.ng/api/nin-search2/`,
      {
        nin,
      },
      { headers }
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

const vninVerify = async (vnin: string) => {
  try {
    return await axios.post(
      `${baseURL}/vnin`,
      {
        vnin,
      },
      { headers }
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

export async function POST(req: Request) {
  const { nin, vnin } = await req.json();

  try {
    let res: AxiosResponse;
    if (nin) {
      // @ts-ignore
      res = await ninVerify(nin);
    } else {
      return new Response("Service Currently Unavialable", {
        status: 500,
      });
      // @ts-ignore
      res = await vninVerify(vnin);
    }

    res.data = renameResponseobjKeys(res.data);

    let addressObj = extractAddressFromRes(res.data.data.address);
    res.data.data = { ...res.data.data, ...addressObj };

    if (res.data?.status) {
      const photoUrlStringNew = res.data.data?.photo.replace(/\n/g, "");
      const signatureUrlStringNew = res.data.data?.signature.replace(/\n/g, "");

      return new Response(
        JSON.stringify({
          data: {
            ...res.data?.data,
            photo:
              isBase64(photoUrlStringNew) && photoUrlStringNew != ""
                ? photoUrlStringNew
                : noPhotoString,
            signature:
              isBase64(signatureUrlStringNew) && signatureUrlStringNew != ""
                ? signatureUrlStringNew
                : noPhotoString,
          },
          status: res.data?.status,
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
