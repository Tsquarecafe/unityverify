// pages/api/upload.js
import { db } from "@/lib/db";
import { Binary } from "mongodb";

export const config = {
  api: {
    bodyParser: false, // Disable the default bodyParser
  },
};

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const blob = formData.get("blob") as Blob;
    const transactionId = formData.get("transactionId") as string;

    if (blob && transactionId) {
      await db.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          // slipBlob: blob,
        },
      });
    } else {
      return new Response("Bad request", {
        status: 400,
      });
    }

    return new Response("Slips Saved", {
      status: 200,
    });
  } catch (error) {}
}



// const updateTransactionSlip = async (blob: Blob) => {
//   const {
//     data: { firstname, surname },
//   } = response;
//   let formData = new FormData();
//   let fileName = `${firstname} ${surname}_slip.pdf}`;
//   formData.append("blob", blob, fileName);

//   try {
//     await axios.patch("/api/transactions/save-slip", formData, {
//       headers: {
//         "Content-Type": `multipart/form-data`,
//       },
//     });
//   } catch (error) {
//     return toast({
//       title: "Processing Incomplete",
//       description: "Process didnt complete, but you can access your slips",
//     });
//   }
// };

// if (slipBlob) {
//   updateTransactionSlip(slipBlob);
// }