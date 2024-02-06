import { FC } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock12 } from "lucide-react";
import { SlipType, Transaction, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { UserRole, formatToNaira } from "@/lib/utils";

interface TransactionRecordProps extends Transaction {
  createdBy: User;
  index: number;
  slipType: SlipType[];
}

const TransactionRecord: FC<TransactionRecordProps> = ({
  id,
  createdAt,
  index,
  createdBy,
  price,
  slipType,
  status,
  type,
  reference,
}) => {
  const parsedDate = parseISO(`${createdAt}`);
  const { data: session } = useSession();

  return (
    <div
      className={`grid text-left gap-6 ${
        session?.user.type === UserRole.ADMIN
          ? " grid-cols-[2rem_2fr_1fr_1fr_0.8fr_1fr_1.5fr_3rem]"
          : " grid-cols-[2rem_1fr_1fr_0.8fr_1fr_1.5fr_3rem]"
      } grid-rows-1  p-2 rounded-lg items-center text-sm bg-slate-100`}
    >
      <span>{index + 1}</span>
      {session?.user.type === UserRole.ADMIN ? (
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full shadow-lg overflow-hidden"
            src={
              createdBy.image ||
              "https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg"
            }
            height={30}
            width={30}
            alt=""
          />
          <h4 className="text-xs">{createdBy.name?.toUpperCase()}</h4>
        </div>
      ) : null}
      <h5 className="text-xs">{type}</h5>
      <span>{(reference || id).slice(0, 7)}...</span>
      <span>{formatToNaira.format(price)}</span>
      <div>
        {slipType?.map((slip) => (
          <span className="block text-xs" key={slip.id}>{slip.title}</span>
        ))}
      </div>
      <div className="flex gap-2 items-center text-xs">
        <CalendarDays className="h-4 w-4" />
        {format(parsedDate, "do LLL")}, {format(parsedDate, "HH : mm : ss")}
      </div>

      <div
        className={`p-2 text-[10px]  rounded-xl ${
          status === "SUCCESS"
            ? "bg-teal-600"
            : status === "PENDING"
            ? "bg-yellow-600"
            : "bg-rose-600"
        }  text-white flex items-center justify-center`}
      >
        {status.toLowerCase()}
      </div>
    </div>
  );
};

export default TransactionRecord;
