import axios, { AxiosPromise, AxiosResponse } from "axios";
// import { verificationResponseType } from "@/types/service";

const baseURL = "https://api.prembly.com";
const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.VERIFICATION_API_KEY,
  "app-id": process.env.VERIFICATION_APP_ID,
};

export async function POST(req: Request) {
  const { phone } = await req.json();

  try {
    let res = await axios.post(
      `${baseURL}/identitypass/verification/phone_number/advance`,
      {
        number: phone,
      },
      { headers }
    );

    if (res.data.status) {
      const photoUrlStringNew = res.data.data.photo.replace(/\n/g, "");
      const signatureUrlStringNew = res.data.data.signature.replace(/\n/g, "");

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.data,
            photo: photoUrlStringNew,
            signature: signatureUrlStringNew,
          },
          reference: res.data.verification.reference,
          status: res.data.status,
        }),
        { status: 200 }
      );
    } else {
    
      return new Response(
        res.data?.message || "Something Went Wrong, Please try again latter",
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.log(error, "Error");
    return new Response("Could not verify, please try again", {
      status: 500,
    });
  }
}
