import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": process.env.QUICK_VERIFY_API_KEY,
};

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone)
    return new Response("Please Provide a valid Phone registered with NIMC", {
      status: 400,
    });

  try {
    let res = await axios.post(
      "https://api.quickverify.com.ng/verification/nin-phone",
      {
        phone,
      },
      { headers }
    );

    if (res.data?.status) {
      const { residence_Town, residence_AdressLine1, photo, signature } =
        res.data?.data;

      const photoUrlStringNew = photo?.replace(/\n/g, "");
      const signatureUrlStringNew = signature?.replace(/\n/g, "");

      return new Response(
        JSON.stringify({
          data: {
            ...res.data.data,
            photo: photoUrlStringNew,
            signature: signatureUrlStringNew,
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
