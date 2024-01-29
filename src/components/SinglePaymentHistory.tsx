import { CheckCircle, CircleOff, PauseCircle } from "lucide-react";
import { FC } from "react";
import { format, parseISO } from "date-fns";
import { formatToNaira } from "@/lib/utils";

interface SinglePaymentHistoryProps {
  dateTime: Date;
  status: string;
  amount: number;
}
const SinglePaymentHistory: FC<SinglePaymentHistoryProps> = ({
  dateTime,
  status,
  amount,
}) => {
  const parsedDate = parseISO(`${dateTime}`);

  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      {status == "CREDITED" ? (
        <CheckCircle className="h-4 w-4 text-emerald-500" />
      ) : status == "INITIATED" ? (
        <PauseCircle className="h-4 w-4 text-yellow-600" />
      ) : (
        <CircleOff className="h-4 w-4 text-rose-500" />
      )}

      <span>{format(parsedDate, "k:m:s bbb")}</span>

      <span
        className={
          status == "CREDITED"
            ? "text-emerald-500"
            : status == "INITIATED"
            ? "text-yellow-600"
            : "text-rose-500"
        }
      >
        {status}
      </span>
      <span className="font-semibold">{formatToNaira.format(amount)}</span>
    </div>
  );
};

export default SinglePaymentHistory;
