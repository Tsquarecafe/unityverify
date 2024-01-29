import { FC } from "react";

interface BrandProps {}
const Brand: FC<BrandProps> = ({}) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <h4 className="font-medium text-2xl ">
        TSquare<span className="text-emerald-500">Cafe</span>
      </h4>
    </div>
  );
};

export default Brand;
