import { FC } from "react";

interface BrandProps {
  fromSidebar?: boolean;
}
const Brand: FC<BrandProps> = ({fromSidebar}) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <h4 className="font-medium text-2xl  ">
        Unity
        <span className={`${fromSidebar ? "bg-slate-100 text-emerald-800": "bg-slate-900 text-emerald-500"} p-2 rounded-lg `}>
          Verify
        </span>
      </h4>
    </div>
  );
};

export default Brand;
