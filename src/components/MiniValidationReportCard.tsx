import { FC } from "react";

interface MiniValidationReportCardProps {
  Icon: React.ReactNode;
  title: string;
  name: string;
  value: number;
}

const MiniValidationReportCard: FC<MiniValidationReportCardProps> = ({
  Icon,
  title,
  name,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`rounded ${
          name == "total"
            ? "bg-emerald-200"
            : name == "success"
            ? "bg-teal-200"
            : name == "pending"
            ? "bg-yellow-200"
            : "bg-rose-200"
        } p-2 h-fit`}
      >
        {Icon}
      </div>
      <div className="">
        <h4 className="font-bold text-xl  mb-0 ">{value}</h4>
        <span className="text-zinc-500 text-xs">{title}</span>
      </div>
    </div>
  );
};

export default MiniValidationReportCard;
