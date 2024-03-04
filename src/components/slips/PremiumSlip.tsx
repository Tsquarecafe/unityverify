import { generate } from "@pdfme/generator";
import { barcodes, image, text } from "@pdfme/schemas";
import { Font } from "@/types/pdfme";
import premiumSlipTemplate from "@/lib/templates/premiumSlipTemplate.json";
import type { Template } from "@pdfme/common";
import { format } from "date-fns";
import QRCode from "qrcode";
import { verificationResponseType } from "@/types/service";
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

const PremiumSlip = async (res: verificationResponseType) => {
  // @ts-ignore
  const template: Template = premiumSlipTemplate;

  const { data } = res;

  const { surname, firstname, middlename, birthdate, nin, photo, gender } =
    data;

  const fetchFont = async () => {
    const font: Font = {
      OCRBRegular: {
        data: await fetch("/fonts/OCRBRegular.ttf").then((res) =>
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

      const qrcode = (await generateQR(`{ surname: ${surname},
            givenNames: ${firstname} ${middlename}, dob: ${birthdate}}`)) as string;

      const [day, month, year] = birthdate?.split("-");
      const formattedBirthdate = `${month}-${day}-${year}`;

      const inputs = [
        {
          surname: `${surname || ""}`.toUpperCase(),
          givenNames: `${firstname || ""}, ${middlename || ""}`.toUpperCase(),
          dob: format(
            new Date(formattedBirthdate),
            "dd MMM yyyy"
          )?.toUpperCase(),
          gender: `${gender}`.toUpperCase(),
          NGA: "NGA",
          photo: `data:image/${
            photo.charAt(0) === "/" ? "jpeg" : "png"
          };base64,${photo}`,
          nin: `${nin?.slice(0, 4)} ${nin?.slice(4, 7)} ${nin?.slice(7)}`,
          issuedDate: format(new Date(), "dd MMM yyyy")?.toUpperCase(),
          ninBackdrop1: nin,
          ninBackdrop2: nin,
          ninBackdrop3: nin,
          ninBackdrop4: nin,
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
        title: "Error Generating Basic NIN Slip",
        description: "Unable to generate NIN slip type. Plese try again later",
        variant: "destructive",
      });
    }
  };

  return await generatePDF();
};

export default PremiumSlip;
