import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import regularSlipTemplate from "@/lib/templates/regularSlipTemplate.json";
import { Font } from "@/types/pdfme";
import { ResponseTypeDirectVerify } from "@/types/service";
import { toast } from "@/hooks/use-toast";

const RegularSlip = async (res: ResponseTypeDirectVerify) => {
  const template: Template = regularSlipTemplate;

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
  } = data;

  const inputs = [
    {
      surname: `${lastName || ""}`.toUpperCase(),
      firstname: `${firstName || ""}`.toUpperCase(),
      middlename: `${middleName || ""}`.toUpperCase(),
      gender: `${gender}`.toUpperCase(),
      residenceAddress: `${addressLine || ""}`,
      residenceTown: `${town || ""}`,
      residenceState: `${state || ""}`,
      trackingId: `${""}`,
      nin: idNumber,
      photo: `data:image/${
        photo.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${photo}`,
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

export default RegularSlip;
