import { generate } from "@pdfme/generator";
import { barcodes, image, text } from "@pdfme/schemas";
import { Font } from "@/types/pdfme";
import premiumSlipTemplate from "@/lib/templates/premiumSlipTemplate.json";
import type { Template } from "@pdfme/common";
import { format } from "date-fns";
import QRCode from "qrcode";
import { ResponseTypeDirectVerify } from "@/types/service";
import { toast } from "@/hooks/use-toast";

const generateQR = async (text: string) => {
  try {
    const res = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 0,
    });

    return res;
  } catch (err) {
    console.error(err);
  }
};

const PremiumSlip = async (res: ResponseTypeDirectVerify) => {
  // @ts-ignore
  const template: Template = premiumSlipTemplate;

  const { data } = res;

  const {
    lastName,
    firstName,
    middleName,
    idNumber,
    photo,
    gender,
    dateOfBirth,
  } = data;

  const fetchFont = async () => {
    const font: Font = {
      OCRBRegular: {
        data: await fetch("/fonts/OCRBRegular.ttf").then((res) =>
          res.arrayBuffer()
        ),
        fallback: true,
      },
      OCRBBold: {
        data: await fetch("/fonts/OCRBBold.ttf").then((res) =>
          res.arrayBuffer()
        ),
        fallback: false,
      },
      OCRBMedium: {
        data: await fetch("/fonts/OCRBMedium.ttf").then((res) =>
          res.arrayBuffer()
        ),
        fallback: false,
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

  const transformData = () => {
    if (dateOfBirth.includes("-")) {
      const [year, month, day] = dateOfBirth?.split("-");
      const formattedBirthdate = `${month}-${day}-${year}`;
      console.log(format(new Date(formattedBirthdate), "dd MMM yyyy")?.toUpperCase(), `format(new Date(formattedBirthdate), "dd MMM yyyy")?.toUpperCase()`)
      return format(new Date(formattedBirthdate), "dd MMM yyyy")?.toUpperCase();
    } else {
      return dateOfBirth;
    }
  };

  const generatePDF = async () => {
    try {
      const font = await fetchFont();

      const qrcode = (await generateQR(`{ surname: ${lastName},
            givenNames: ${firstName} ${middleName}, dob: ${dateOfBirth}}`)) as string;

      const inputs = [
        {
          surname: `${lastName || ""}`.toUpperCase(),
          givenNames: `${firstName || ""}, ${middleName || ""}`.toUpperCase(),
          dob: transformData(),
          gender: `${gender}`.toUpperCase(),
          NGA: "NGA",
          photo: `data:image/${
            photo.charAt(0) === "/" ? "jpeg" : "png"
          };base64,${photo}`,
          nin: `${idNumber?.slice(0, 4)} ${idNumber?.slice(
            4,
            7
          )} ${idNumber?.slice(7)}`,
          issuedDate: format(new Date(), "dd MMM yyyy")?.toUpperCase(),
          ninBackdrop1: idNumber,
          ninBackdrop2: idNumber,
          ninBackdrop3: idNumber,
          ninBackdrop4: idNumber,
          qrcode,
        },
      ];

      const pdf = await generate({
        template,
        inputs,
        plugins: {
          text,
          image,
          qrcode: barcodes.qrcode,
        },
        options: { font },
      });

      return new Blob([pdf.buffer], { type: "application/pdf" });
    } catch (error) {
      console.log(error);
      return toast({
        title: "Error Generating Premium NIN Card",
        description: "Unable to generate NIN slip type. Please try again later",
        variant: "destructive",
      });
    }
  };

  return await generatePDF();
};

export default PremiumSlip;
