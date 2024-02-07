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
    residence_town: string;
    nok_town: string;
    residence_state: string;
    residence_address: string;
    birthcountry: string;
    psurname: string;
    pfirstname: string;
    nok_lga: string;
    nok_address2: string;
    nok_state: string;
    nok_surname: string;
    nok_firstname: string;
    ospokenlang: string;
    residencestatus: string;
    pmiddlename: string;
    email: string;
    nok_postalcode: string;
    nin: string;
    employmentstatus: string;
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

export type verificationResponseTypeQV = {
  birthcountry: 'nigeria',
    birthdate: '21-10-1985',
    birthlga: 'Efon',
    birthstate: 'Ekiti',
    centralID: '53743336',
    educationallevel: 'tertiary',
    emplymentstatus: 'self employed',
    firstname: 'TAYE',
    gender: 'm',
    heigth: '178',
    maritalstatus: 'single',
    middlename: 'AKIN',
    nin: '33700057640',
    nok_address1: '7 AMUSA AROWOLO STREET',
    nok_firstname: 'FUNMILAYO',
    nok_lga: 'Ikorodu',
    nok_state: 'Lagos',
    nok_surname: 'IDOWU',
    nok_town: 'IKORODU',
    nspokenlang: 'YORUBA',
    photo: "",
    religion: 'christianity',
    residence_AdressLine1: '6 FLAT HOUSE GBENGA ARIA IWO ROAD',
    residence_Town: 'IBADAN',
    residence_lga: 'Lagelu',
    residence_state: 'Oyo',
    residencestatus: 'birth',
    self_origin_lga: 'Efon',
    self_origin_place: 'EFON ALAYE',
    self_origin_state: 'Ekiti',
    signature: "",
    surname: 'IDOWU',
    telephoneno: '08030961870',
    title: 'mr',
    trackingId: 'S7Y0NYFA3000M0W'
}


// residence_address
// residence_town