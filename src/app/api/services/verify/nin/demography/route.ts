import axios, { AxiosPromise, AxiosResponse } from "axios";
// import { verificationResponseType } from "@/types/service";

const baseURL = "https://api.prembly.com";
const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.VERIFICATION_API_KEY,
  "app-id": process.env.VERIFICATION_APP_ID,
};

export async function POST(req: Request) {
  const { firstname, lastname, gender, dob } = await req.json();

  try {
    let res = await axios.post(
      `${baseURL}/identitypass/verification/`,
      {
        firstname,
        lastname,
        gender,
        dob,
      },
      { headers }
    );

    if (res.data.status) {
      const photoUrlStringNew = res.data.nin_data.photo.replace(/\n/g, "");
      const signatureUrlStringNew = res.data.nin_data.signature.replace(
        /\n/g,
        ""
      );

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.nin_data,
            photo: photoUrlStringNew,
            signature: signatureUrlStringNew,
          },
          reference: res.data.verification.reference,
          status: res.data.status,
        }),
        { status: 200 }
      );
    } else {
      return new Response("Something Went Wrong, Please try again latter", {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error, "Error");
    return new Response("Could not verify, please try again", {
      status: 500,
    });
  }
}
