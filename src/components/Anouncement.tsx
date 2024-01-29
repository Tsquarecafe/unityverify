import { FC } from "react";

interface AnouncementProps {
  title: string;
  description: string;
  fromWallet?: boolean;
}
const Anouncement: FC<AnouncementProps> = ({
  fromWallet,
  title,
  description,
}) => {
  return (
    <div className="bg-gradient-to-r h-[200px] flex items-center from-emerald-800 to-slate-900 rounded-lg p-4 ">
      <div className="space-y-3 text-white">
        <h4 className="font-semibold ">{title}</h4>

        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Anouncement;
