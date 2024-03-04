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

export type verificationResponseType2 = {
  status: boolean;
  reference: string;
  data: {
    firstname: string;
    surname: string;
    middlename: string;
    birthdate: string;
    userid: string;
    gender: string;
    telephoneno: string;
    vnin?: string;
    self_origin_lga: string;
    heigth: string;
    birthstate: string;
    signature: string;
    religion: string;
    educationallevel: string;
    maritalstatus: string;
    self_origin_state: string;
    spoken_language: string;
    trackingId: string;
    self_origin_place: string;
    residence_town: string; //DDD
    nok_town: string;
    residence_state: string;
    residence_address: string; //DDD
    birthcountry: string;
    psurname: string;
    pfirstname: string;
    nok_lga: string;
    nok_address2: string;
    nok_state: string;
    nok_surname: string;
    nok_firstname: string;
    ospokenlang: string; //DDD
    residencestatus: string;
    pmiddlename: string;
    email: string;
    nok_postalcode: string;
    nin: string;
    employmentstatus: string; //DDD
    birthlga: string;
    residence_lga: string;
    title: string;
    profession: string;
    centralID: string;
    nok_address1: string;
    photo: string;
    nok_middlename: string;
  };
};

export type verificationResponseType = {
  status: true;
  data: {
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
    nin: string;
    nok_address1: string;
    nok_firstname: string;
    nok_lga: string;
    nok_middlename: string;
    nok_state: string;
    nok_surname: string;
    nok_town: string;
    nspokenlang: string; //DDD
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
