import { FC, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock12, MoreVertical } from "lucide-react";
import { Payment, PaymentStatus, User } from "@prisma/client";
import Image from "next/image";
import { formatToNaira } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { updatePayment } from "@/lib/redux/slices/payment/paymentThunk";
import { Button } from "./ui/Button";
import { useOnClickOutside } from "@/hooks/useOnclickOutside";

interface AdminPaymentRecordProps extends Payment {
  createdBy: User;
  index: number;
}

const AdminPaymentRecord: FC<AdminPaymentRecordProps> = ({
  id,
  paymentReference,
  paymentMethod,
  createdBy: { image, name },
  amount,
  status,
  createdAt,
  index,
}) => {
  const parsedDate = parseISO(`${createdAt}`);
  const dispatch = useDispatch<AppDispatch>();
  const [showOptns, setShowOptns] = useState(false);
  const { isLoading } = useSelector((store: RootState) => store.payments);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowOptns(false));
  return (
    <div className="w-full grid gap-6 grid-cols-[2rem_2fr_2fr_1fr_4rem_1.5fr_3rem_3rem] justify-between p-2 rounded-lg items-center text-sm bg-slate-100">
      <span>{index + 1}</span>
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full shadow-lg overflow-hidden"
          src={image || ""}
          height={30}
          width={30}
          alt=""
        />
        <h4 className="text-xs">{name?.toUpperCase()}</h4>
      </div>
      <h5 className="">{paymentReference}</h5>
      <h5 className="">{paymentMethod}</h5>
      <span>{formatToNaira.format(amount)}</span>
      <div className="flex gap-2 items-center text-xs">
        <div className="flex gap-2 items-center">
          <CalendarDays className="h-4 w-4" />
          {format(parsedDate, "do LLL")}, {format(parsedDate, "HH : mm : ss")}
        </div>
      </div>

      <div
        className={`p-2 text-[10px] capitalize rounded-xl ${
          status === "CREDITED"
            ? "bg-teal-600"
            : status === "INITIATED"
            ? "bg-yellow-600"
            : "bg-rose-600"
        }  text-white flex items-center justify-center`}
      >
        {status.toLowerCase()}
      </div>
      <div className="group">
        <button onClick={() => setShowOptns(!showOptns)}>
          <MoreVertical />
        </button>
        {showOptns && status != "CREDITED" && (
          <div
            ref={ref}
            className=" absolute rounded-lg bg-white right-0 border border-gray-400 shadow-md flex"
          >
            <ul className="flex flex-col text-gray-900 gap-2 text-xs py-2 px-1 ">
              <li className="px-4 py-2 w-full hover:bg-green-300 rounded-lg">
                <Button
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="bg-inherit hover:bg-inherit h-full w-full text-gray-900 p-0"
                  onClick={() =>
                    dispatch(
                      updatePayment({
                        paymentId: id,
                        status: PaymentStatus.CREDITED,
                      })
                    )
                  }
                >
                  Credit
                </Button>
              </li>
              <li className="px-4 py-2 w-full hover:bg-rose-300 rounded-lg">
                <Button
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="bg-inherit hover:bg-inherit h-full w-full text-gray-900 p-0"
                  onClick={() =>
                    dispatch(
                      updatePayment({
                        paymentId: id,
                        status: PaymentStatus.FAILED,
                      })
                    )
                  }
                >
                  Decline
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentRecord;
