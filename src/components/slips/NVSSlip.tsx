import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import nvsSlipTemplateSlip from "@/lib/templates/nvsSlipTemplateSlip.json";
import { Font } from "@/types/pdfme";
import { ResponseTypeDirectVerify } from "@/types/service";
import { toast } from "@/hooks/use-toast";

const NVSSlip = async (res: ResponseTypeDirectVerify) => {
  const template: Template = nvsSlipTemplateSlip;

  const { data } = res;

  const {
    lastName,
    firstName,
    middleName,
    town,
    state,
    addressLine,
    id,
    idNumber,

    dateOfBirth,
    birthLGA,
    birthState,
    mobile,
    email,

    gender,
    country,
    birthCountry,
    nokState,

    signature,
    religion,

    photo,
  } = data;

  const inputs = [
    {
      surname: `${lastName || ""}`.toUpperCase(),
      firstname: `${firstName || ""}`.toUpperCase(),
      middlename: `${middleName || ""}`.toUpperCase(),
      gender: `${gender || ""}`.toUpperCase(),
      residence_address: `${addressLine || ""}`.toUpperCase(),
      residence_town: `${town || ""}`.toUpperCase(),
      residence_state: `${state || ""}`,
      trackingId: `${id || ""}`,
      nin: `${idNumber?.slice(0, 4) || ""}  ${idNumber?.slice(4, 7) || ""}  ${
        idNumber?.slice(7) || ""
      }`,
      birthdate: `${dateOfBirth || ""}`.toUpperCase(),
      birthstate: `${birthState || ""}`,
      birthlga: `${birthLGA || ""}`,
      telephoneno: `${mobile || ""}`,
      photo: `data:image/${
        photo.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${photo}`,
      signature: `data:image/${
        signature.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${signature}`,
      self_origin_lga: `${""}`.toUpperCase(),
      heigth: `${""}`.toUpperCase(),
      religion: `${religion || ""}`.toUpperCase(),
      educationallevel: `${""}`.toUpperCase(),
      maritalstatus: `${""}`.toUpperCase(),
      self_origin_state: `${""}`,
      spoken_language: `${""}`.toUpperCase(),
      self_origin_place: `${""}`,
      nok_town: `${""}`.toUpperCase(),
      birthcountry: `${""}`.toUpperCase(),
      psurname: `${""}`.toUpperCase(),
      pfirstname: `${""}`.toUpperCase(),
      nok_lga: `${""}`.toUpperCase(),
      nok_address2: `${""}`.toUpperCase(),
      nok_state: `${nokState || ""}`.toUpperCase(),
      nok_surname: `${""}`.toUpperCase(),
      nok_firstname: `${""}`.toUpperCase(),
      nspokenlang: `${""}`.toUpperCase(),
      residencestatus: `${""}`.toUpperCase(),
      employmentstatus: `${""}`.toUpperCase(),
      pmiddlename: `${""}`.toUpperCase(),
      email: `${email || ""}`,
      nok_postalcode: `${""}`,
      residence_lga: `${""}`.toUpperCase(),
      title: `${""}`.toUpperCase(),
      profession: `${""}`.toUpperCase(),
      centralID: `${""}`.toUpperCase(),
      nok_address1: `${""}`.toUpperCase(),
      nok_middlename: `${""}`.toUpperCase(),
    },
  ];

  const fetchFont = async () => {
    const font: Font = {
      Roboto: {
        data: await fetch("/fonts/RobotoBold.ttf").then((res) =>
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

export default NVSSlip;
