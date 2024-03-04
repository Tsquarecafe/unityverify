import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import { image, text } from "@pdfme/schemas";
import nvsSlipTemplateSlip from "@/lib/templates/nvsSlipTemplateSlip.json";
import { Font } from "@/types/pdfme";
import { verificationResponseType } from "@/types/service";
import { toast } from "@/hooks/use-toast";
import { noPhotoString } from "@/lib/imageBlob";

const NVSSlip = async (res: verificationResponseType) => {
  const template: Template = nvsSlipTemplateSlip;

  const { data } = res;

  const {
    firstname,
    surname,
    middlename,
    birthdate,
    gender,
    telephoneno,
    heigth,
    birthstate,
    signature,
    religion,
    educationallevel,
    maritalstatus,
    nspokenlang,
    trackingId,
    residence_Town,
    nok_town,
    residence_state,
    residence_AdressLine1,
    birthcountry,
    nok_lga,
    nok_address1,
    nok_state,
    nok_surname,
    nok_firstname,
    residencestatus,
    nin,
    emplymentstatus,
    birthlga,
    residence_lga,
    title,
    profession,
    centralID,
    photo,
    nok_middlename,
  } = data;

  const inputs = [
    {
      surname: `${surname || ""}`.toUpperCase(),
      firstname: `${firstname || ""}`.toUpperCase(),
      middlename: `${middlename || ""}`.toUpperCase(),
      gender: `${gender || ""}`.toUpperCase(),
      residence_address: `${residence_AdressLine1 || ""}`.toUpperCase(),
      residence_town: `${residence_Town || ""}`.toUpperCase(),
      residence_state: `${residence_state || ""}`,
      trackingId: `${trackingId || ""}`,
      nin: `${nin?.slice(0, 4)}  ${nin?.slice(4, 7)}  ${nin?.slice(7)}`,
      birthdate: `${birthdate || ""}`.toUpperCase(),
      birthstate: `${birthstate || ""}`,
      birthlga: `${birthlga || ""}`,
      telephoneno: `${telephoneno || ""}`,
      photo: `data:image/${
        photo.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${photo}`,
      signature: `data:image/${
        signature.charAt(0) === "/" ? "jpeg" : "png"
      };base64,${signature}`,
      self_origin_lga: " ",
      heigth: `${heigth || ""}`.toUpperCase(),
      religion: `${religion || ""}`.toUpperCase(),
      educationallevel: `${educationallevel || ""}`.toUpperCase(),
      maritalstatus: `${maritalstatus || ""}`.toUpperCase(),
      self_origin_state: " ",
      spoken_language: " ",
      self_origin_place: " ",
      nok_town: `${nok_town || ""}`.toUpperCase(),
      birthcountry: `${birthcountry || ""}`.toUpperCase(),
      psurname: " ",
      pfirstname: " ",
      nok_lga: `${nok_lga || ""}`.toUpperCase(),
      nok_address2: " ",
      nok_state: `${nok_state || ""}`.toUpperCase(),
      nok_surname: `${nok_surname || ""}`.toUpperCase(),
      nok_firstname: `${nok_firstname || ""}`.toUpperCase(),
      ospokenlang: " ",
      nspokenlang: `${nspokenlang || ""}`.toUpperCase(),
      residencestatus: `${residencestatus || ""}`.toUpperCase(),
      employmentstatus: `${emplymentstatus || ""}`.toUpperCase(),
      pmiddlename: " ",
      email: " ",
      nok_postalcode: " ",
      residence_lga: `${residence_lga || ""}`.toUpperCase(),
      title: `${title || ""}`.toUpperCase(),
      profession: `${profession || ""}`.toUpperCase(),
      centralID: `${centralID || ""}`.toUpperCase(),
      nok_address1: `${nok_address1 || ""}`.toUpperCase(),
      nok_middlename: `${nok_middlename || ""}`.toUpperCase(),
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
