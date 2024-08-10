import PremiumSlip from "@/components/slips/PremiumSlip";
import RegularSlip from "@/components/slips/RegularSlip";

import BasicSlip from "./BasicSlip";
import {
  basicSlipTitle,
  premiumSlipTitle,
  regularSlipTitle,
  NVSSlipTitle,
} from "@/lib/utils";
import { ResponseTypeDirectVerify } from "@/types/service";
import ImprovedSlip from "./ImprovedSlip";
import NVSSlip from "./NVSSlip";

const SelectSlip = async ({
  slipTitle,
  response,
}: {
  slipTitle: string;
  response: ResponseTypeDirectVerify;
}) => {
  let slipBlob: Blob;

  if (slipTitle === regularSlipTitle) {
    slipBlob = (await RegularSlip(response)) as Blob;
  } else if (slipTitle === premiumSlipTitle) {
    slipBlob = (await PremiumSlip(response)) as Blob;
  } else if (slipTitle === basicSlipTitle) {
    slipBlob = (await BasicSlip(response)) as Blob;
  } else if (slipTitle === NVSSlipTitle) {
    slipBlob = (await NVSSlip(response)) as Blob;
  } else {
    slipBlob = (await ImprovedSlip(response)) as Blob;
  }
  return slipBlob.size > 0 ? URL.createObjectURL(slipBlob) : "/";
};

export default SelectSlip;
