import { setModalTitle } from "@/lib/redux/slices/modalSlice";
import { selectSubService } from "@/lib/redux/slices/service/serviceSlice";
import { RootState } from "@/lib/redux/store";
import { subServiceDataType } from "@/types/service";
import {
  CheckCheck,
  Hash,
  MoveRight,
  Phone,
  ScanSearch,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

const ServiceItem: FC<subServiceDataType> = (props) => {
  const { title, description, price, slug } = props;
  const { selectedSubService } = useSelector(
    (store: RootState) => store.service
  );
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => {
        dispatch(setModalTitle(`Verify by ${title} `));
        dispatch(selectSubService(props));

        router.push("/dashboard/nin#slip-types");
      }}
      className={`relative cursor-pointer group bg-white block p-4 rounded-lg h-[220px] border-2 ${
        selectedSubService?.slug === slug ? "border-emerald-500 shadow-lg" : ""
      }  hover:border-emerald-500 hover:shadow-lg`}
    >
      {selectedSubService?.slug === slug && (
        <div className="bg-emerald-400 w-5 h-5 p-1 flex items-center justify-center rounded-full absolute top-1 right-1">
          <CheckCheck size={16} className="text-emerald-700" />
        </div>
      )}
      <div className="flex flex-col gap-2 ">
        <div
          className={`w-10 h-10 mb-6 ${
            slug === "nin-search"
              ? "bg-amber-100"
              : slug === "phone-search"
              ? "bg-purple-100"
              : slug === "demography-search"
              ? "bg-rose-100"
              : "bg-teal-100"
          } rounded-lg flex justify-center items-center `}
        >
          {slug === "nin-search" ? (
            <Search size={20} className="text-slate-700" />
          ) : slug === "phone-search" ? (
            <Phone size={20} className="text-slate-700" />
          ) : slug === "demography-search" ? (
            <ScanSearch size={20} className="text-slate-700" />
          ) : (
            <Hash size={20} className="text-slate-700" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg h-full font-semibold leading-negative-10">
            {title}
          </h1>

          <p className="text-xs font-light text-zinc-600">{description}</p>
        </div>

        <button className="absolute transition ease-in delay-1000 duration-1000 bottom-4 right-4 p-1 rounded-full bg-emerald-500 w-4 h-4 flex justify-center items-center group-hover:w-10 group-hover:h-6">
          <MoveRight
            size={20}
            className=" transition-all ease-in delay-1000 duration-1000 group-hover:flex text-white "
          />
        </button>
      </div>
    </div>
  );
};

export default ServiceItem;
