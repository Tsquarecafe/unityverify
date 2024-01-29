"use client";

import { selectService } from "@/lib/redux/slices/service/serviceSlice";
import { serviceDataType, subServiceDataType } from "@/types/service";
import { Ban, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch } from "react-redux";

const ServiceCard: FC<
  serviceDataType & {
    displayedFromHome?: boolean;
  }
> = ({
  isServiecAvailable,
  image,
  title,
  description,
  displayedFromHome,
  slug,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: session } = useSession();

  const handleSelect = () => {
    if (!session) return router.push("/sign-in");
    dispatch(
      selectService({
        isServiecAvailable,
        image,
        title,
        description,
        displayedFromHome,
        slug,
      })
    );

    if (slug === "nin") {
      router.push(`/dashboard/${slug}`);
    }
  };
  return (
    <div
      onClick={handleSelect}
      className={`relative bg-white cursor-pointer block p-4 rounded-lg h-[220px] border-2 hover:border-emerald-500 hover:shadow-lg ${
        displayedFromHome && "border-slate-900 border-[1px]"
      }`}
    >
      <div className="flex flex-col gap-6">
        {!displayedFromHome && (
          <div
            className={`flex gap-1 ${
              isServiecAvailable ? "bg-emerald-100 " : "bg-rose-100 "
            } rounded-xl w-fit p-2`}
          >
            {isServiecAvailable ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Ban className="h-4 w-4" />
            )}

            <span className="text-[10px] text-zinc-500 font-semibold">
              {isServiecAvailable ? "Use Service" : "Coming soon"}
            </span>
          </div>
        )}

        <div>
          <h1 className="text-lg h-full font-semibold leading-[-2px]">
            {title}
          </h1>

          <p className="text-xs font-light text-zinc-600">{description}</p>

          <div className="absolute border-[1px] border-slate-300 bottom-4 right-4 rounded-full flex justify-center items-center overflow-hidden w-[50px] h-[40px]">
            <Image
              width={50}
              height={40}
              alt={title}
              src={`/assets/services/${image}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
