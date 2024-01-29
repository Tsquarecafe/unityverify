"use client";

import { FC, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock12, Copy } from "lucide-react";
import { Payment } from "@prisma/client";
import { formatToNaira } from "@/lib/utils";
import copy from "clipboard-copy";
import { toast } from "@/hooks/use-toast";

interface PaymentRecordProps extends Payment {
  index: number;
}

const PaymentRecord: FC<PaymentRecordProps> = ({
  index,
  paymentReference,
  paymentMethod,
  amount,
  status,
  createdAt,
}) => {
  const parsedDate = parseISO(`${createdAt}`);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await copy(paymentReference);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  if (isCopied) {
    toast({
      title: "Text Copied!",
    });
  }

  return (
    <div className="w-full mb-2 grid gap-6 grid-cols-[2rem_2fr_2fr_1fr_1.5fr_4rem_3rem] justify-between p-2 rounded-lg items-center text-sm bg-slate-100">
      <h5 className="">{index + 1}</h5>
      <h5 className="">{paymentReference}</h5>
      <h5 className="">{paymentMethod}</h5>
      <span>{formatToNaira.format(amount)}</span>
      <div className="flex gap-2 items-center text-xs">
        <CalendarDays className="h-4 w-4" />
        {format(parsedDate, "do LLL")}, {format(parsedDate, "HH : mm : ss")}
      </div>

      <div
        className={`p-2 text-xs  rounded-xl ${
          status === "CREDITED"
            ? "bg-teal-600"
            : status === "INITIATED"
            ? "bg-yellow-600"
            : "bg-rose-600"
        }  text-white flex items-center justify-center`}
      >
        {status.toLowerCase()}
      </div>
      <button onClick={handleCopyClick}>
        <Copy />
      </button>
    </div>
  );
};

export default PaymentRecord;
