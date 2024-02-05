import { selectSlipType } from "@/lib/redux/slices/service/serviceSlice";
import { RootState } from "@/lib/redux/store";
import { UserRole, formatToNaira } from "@/lib/utils";
import { slipDataType } from "@/types/service";
import { CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, SetStateAction, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SlipTypeProps extends slipDataType {
  setShowEdit?: Dispatch<SetStateAction<boolean>>;
  transactionId?: string[];
}
const SlipType: FC<SlipTypeProps> = (props) => {
  const { title, id, image, price, setShowEdit, transactionId } = props;
  const { selectedSlipType } = useSelector((store: RootState) => store.service);
  const dispatch = useDispatch();

  const { data: session } = useSession();

  const router = useRouter();

  return (
    <div
      onClick={() => {
        dispatch(selectSlipType({ title, id, image, price }));
        setShowEdit && setShowEdit(true);

        session?.user.type === UserRole.AGENT && transactionId
          ? router.push(
              `/dashboard/nin/select-slip/${transactionId}#proceed-btn`
            )
          : null;
      }}
      className={`relative group bg-slate-100 p-3 rounded-lg h-[187px] cursor-pointer border-[2px] transition-all  ${
        selectedSlipType.title === title ? "border-emerald-500 shadow-lg" : ""
      } hover:border-emerald-500 hover:shadow-lg`}
    >
      {selectedSlipType.title === title && (
        <div className="bg-emerald-400 w-5 h-5 p-1 flex items-center justify-center rounded-full absolute top-1 right-1">
          <CheckCheck size={16} className="text-emerald-700" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h4 className="text-center text-sm font-semibold">{title}</h4>

        <div className="border border-slate-100 rounded-lg overflow-hidden ">
          <Image
            height={120}
            width={200}
            src={`/assets/services/${image}`}
            alt={title}
            className="h-[120px] w-[300px] object-contain"
          />
        </div>
      </div>

      <div className=" rounded-lg hidden absolute bottom-0 top-3/4  left-0 right-0 group-hover:flex items-center justify-center text-white font-semibold bg-slate-800 bg-opacity-80 ">
        Price: {formatToNaira.format(price)}
      </div>
    </div>
  );
};

export default SlipType;
