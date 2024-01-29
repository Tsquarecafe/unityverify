import { AdminCardsTile, formatToNaira } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface InfoCardProps {
  name: string;
  amount: number;
  Icon: LucideIcon;
  backgroundColor: string;
  slug: string;
}
const InfoCard: FC<InfoCardProps> = ({
  name,
  amount,
  Icon,
  backgroundColor,
  slug,
}) => {
  return (
    <div
      className={`h-[150px] text-white rounded-xl bg-gradient-to-b ${backgroundColor}`}
    >
      <div className="px-4 py-6 flex flex-col  h-full">
        <div className="flex mb-6 items-center justify-between">
          <Icon color="white" size={30} />

          {slug && (
            <Link href={slug} className="text-xs text-gray-200">
              View
            </Link>
          )}
        </div>

        <h5 className="text-xs mb-2">{name}</h5>

        <h4 className="text-xl font-semibold">
          {name === AdminCardsTile.income
            ? formatToNaira.format(amount)
            : amount}
        </h4>
      </div>
    </div>
  );
};

export default InfoCard;
