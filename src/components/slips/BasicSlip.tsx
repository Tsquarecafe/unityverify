import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import basicSlipTemplate from "@/lib/templates/basicSlipTemplate.json";
import { Font } from "@/types/pdfme";
import { ResponseTypeDirectVerify } from "@/types/service";
import { toast } from "@/hooks/use-toast";

const BasicSlip = async (res: ResponseTypeDirectVerify) => {
  const template: Template = basicSlipTemplate;

  const { data } = res;

  const {
    lastName,
    firstName,
    middleName,
    town,
    state,
    addressLine,

    idNumber,
    photo,
    gender,
    dateOfBirth,
    birthLGA,
    birthState,
    mobile,
    signature,
  } = data;

  const inputs = [
    {
      lastname: `${lastName || ""}`.toUpperCase(),
      firstname: `${firstName || ""}`.toUpperCase(),
      middlename: `${middleName || ""}`.toUpperCase(),
      gender: `${gender || ""}`.toUpperCase(),
      residence_address: `${addressLine || ""}`.toUpperCase(),
      residence_town: `${town || ""}`.toUpperCase(),
      residence_state: `${state || ""}`,
      tracking_id: `${""}`,
      nin: `${idNumber?.slice(0, 4)}  ${idNumber?.slice(
        4,
        7
      )}  ${idNumber?.slice(7)}`,
      dob: `${dateOfBirth || ""}`.toUpperCase(),
      birth_state: `${birthState || ""}`,
      birth_lga: `${birthLGA || ""}`,
      phone: `${mobile || ""}`,
      photo: `data:image/${
        photo.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${photo}`,
      signature: `data:image/${
        signature.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${signature}`,
    },
  ];

  const fetchFont = async () => {
    const font: Font = {
      Calibri: {
        data: await fetch("/fonts/CalibriRegular.ttf").then((res) =>
          res.arrayBuffer()
        ),
        fallback: true,
      },
      CalibriBold: {
        data: await fetch("/fonts/CalibriBold.TTF").then((res) =>
          res.arrayBuffer()
        ),
        fallback: false,
      },
    };

    return font;
  };

  const generatePDF = async () => {
    try {
      const font = await fetchFont();

      const pdf = await generate({
        template,
        inputs,
        plugins: {
          text,
          image,
        },
        options: { font },
      });

      return new Blob([pdf.buffer], { type: "application/pdf" });
    } catch (error) {
      console.log(error);
      return toast({
        title: "Error Generating Basic NIN Slip",
        description: "Unable to generate NIN slip type. Plese try again later",
        variant: "destructive",
      });
    }
  };

  return await generatePDF();
};

export default BasicSlip;
