import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import basicSlipTemplate from "@/lib/templates/basicSlipTemplate.json";
import { Font } from "@/types/pdfme";
import { verificationResponseType } from "@/types/service";
import { toast } from "@/hooks/use-toast";

const BasicSlip = async (res: verificationResponseType) => {
  const template: Template = basicSlipTemplate;

  const { data } = res;

  const {
    surname,
    firstname,
    middlename,
    residence_town,
    residence_state,
    residence_address,
    trackingId,
    birthdate,
    birthstate,
    birthlga,
    telephoneno,
    nin,
    photo,
    signature,
    gender,
  } = data;


  const inputs = [
    {
      lastname: surname?.toUpperCase(),
      firstname: firstname?.toUpperCase(),
      middlename: middlename?.toUpperCase(),
      gender: gender?.toUpperCase(),
      residence_address: residence_address?.toUpperCase(),
      residence_town: residence_town?.toUpperCase(),
      residence_state,
      tracking_id: trackingId,
      nin: `${nin?.slice(0, 4)} ${nin?.slice(3, 6)} ${nin?.slice(5, -1)}`,
      dob: birthdate,
      birth_state: birthstate,
      birth_lga: birthlga,
      phone: telephoneno,
      photo: `data:image/jpeg;base64,${photo}`,
      signature: `data:image/jpeg;base64,${signature || photo}`,
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
