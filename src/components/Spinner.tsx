import { FC } from "react";
import { TailSpin } from "react-loader-spinner";

interface SpinnerProps {}
const Spinner: FC<SpinnerProps> = ({}) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <TailSpin width={30} height={30} />
    </div>
  );
};

export default Spinner;
