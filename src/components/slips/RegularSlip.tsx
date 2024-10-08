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
    addressLine,
    idNumber,
    gender, 
    photo,
    town,
    state
  } = data;

  // Extract base64 data by removing the 'data:image/jpg;base64,' prefix
  // const base64Photo = images?.replace(/^data:image\/(jpg|jpeg|png);base64,/, '');
  //  console.log(base64Photo,"base64Photo")
  const inputs = [
    {
      surname: `${lastName || ""}`.toUpperCase(),
      firstname: `${firstName || ""}`.toUpperCase(),
      middlename: `${middleName || ""}`.toUpperCase(),
      gender: `${gender || ""}`.toUpperCase(),
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
      console.log(error ,"peace errror");
      return toast({
        title: "Error Generating Regular NIN Slip",
        description: "Unable to generate NIN slip type. Please try again later",
        variant: "destructive",
      });
    }
  };
  return await generatePDF();
};

export default RegularSlip;
