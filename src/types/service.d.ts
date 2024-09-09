import { boolean } from "zod";

export type serviceDataType = {
  title: string;
  description: string;
  slug: string;
  image: string;
  isServiecAvailable: boolean;
};
export type subServiceDataType = {
  title: string;
  description: string;
  isServiecAvailable: boolean;
  price: number;
  slug: string;
};

export type slipDataType = {
  id: string;
  title: string;
  image: string;
  price: number;
};

export type verificationResponseType = {
  status: boolean;
  data: {
    firstname: string;
    surname: string;
    middlename: string;
    birthdate: string;
    userid: string;
    gender: string;
    email: string;
    telephoneno: string;
    vnin?: string;
    self_origin_lga: string;
    heigth: string;
    birthstate: string;
    religion: string;
    educationallevel: string;
    maritalstatus: string;
    self_origin_state: string;
    trackingId: string;
    self_origin_place: string;
    residence_town: string; //DDD
    residence_state: string;
    residence_address: string; //DDD
    residence_lga: string;
    residencestatus: string;
    birthcountry: string;
    psurname: string;
    pfirstname: string;
    pmiddlename: string;
    nok_lga: string;
    nok_town: string;
    nok_address2: string;
    nok_state: string;
    nok_surname: string;
    nok_middlename: string;
    nok_firstname: string;
    nok_postalcode: string;
    nok_address1: string;
    ospokenlang: string; //DDD
    spoken_language: string;
    nin: string;
    employmentstatus: string; //DDD
    birthlga: string;
    title: string;
    profession: string;
    centralID: string;
    photo: string;
    signature: string;
  };
};

export type verificationResponseType2 = {
  status: boolean;
  data: {
    email?: string;
    birthcountry: string;
    birthdate: string;
    birthlga: string;
    birthstate: string;
    centralID: string;
    educationallevel: string;
    emplymentstatus: string; //DDD
    firstname: string;
    gender: string;
    heigth: string;
    maritalstatus: string;
    middlename: string;
    psurname?: string;
    pmiddlename?: string;
    pfirstname?: string;
    self_origin_lga?: string;
    self_origin_place?: string;
    self_origin_state?: string;
    nin: string;
    nok_address1: string;
    nok_address2?: string;
    nok_firstname: string;
    nok_lga: string;
    nok_middlename: string;
    nok_state: string;
    nok_surname: string;
    nok_town: string;
    nok_postalcode?: string;
    nspokenlang: string; //DDD
    ospokenlang?: string;
    photo: string;
    profession: string;
    religion: string;
    residence_AdressLine1: string; //DDD
    residence_Town: string; //DDD
    residence_lga: string;
    residence_state: string;
    residencestatus: string;
    signature: string;
    surname: string;
    telephoneno: string;
    title: string;
    trackingId: string;
  };
};
// export type AddressType = {
//   addressLine: string;
//   town: string;
//   lga: string;
//   state: string;
// };

export type ResponseTypeDirectVerify = {
  status: boolean;
  data: {
    id: string;
 addressLine: string;
  town: string;
  lga: string;
  state: string;  // Updated field to include the AddressType
    parentId: null;
    status: string;
    reason: null;
    dataValidation: boolean;
    selfieValidation: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    image: string;
    signature: string;
    mobile: string;
    email: string;
    birthState?: string;
    nokState: string;
    religion: string;
    birthLGA?: string;
    birthCountry: string;
    dateOfBirth: string;
    isConsent: boolean;
    idNumber: string;
    businessId: string;
    type: string;
    allValidationPassed: boolean;
    gender: string;
    requestedAt: string;
    requestedById: string;
    country: string;
    createdAt: string;
    lastModifiedAt: string;
    photo: string;
  };
};
