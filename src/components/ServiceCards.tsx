import { FC } from "react";
import ServiceCard from "./ServiceCard";
import { serviceDataType, subServiceDataType } from "@/types/service";
import ServiceItem from "./ServiceItem";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardsProps {
  displayedFromHome?: boolean;
  servicesData?: serviceDataType[];
  subServiceData?: subServiceDataType[];
  isServiceItem?: boolean;
  doSlice?: number;
}
const ServiceCards: FC<ServiceCardsProps> = ({
  displayedFromHome,
  servicesData,
  subServiceData,
  doSlice,
}) => {
  return (
    <>
      {servicesData
        ? servicesData.slice(0, doSlice || 10).map((service, index) => {
            const { title, description, slug, isServiecAvailable, image } =
              service;

            return (
              <div key={index} className="col-span-1">
                <ServiceCard
                  displayedFromHome={displayedFromHome}
                  isServiecAvailable={isServiecAvailable}
                  title={title}
                  description={description}
                  image={image}
                  slug={slug}
                />
              </div>
            );
          })
        : subServiceData &&
          subServiceData.slice(0, doSlice || 10).map((subService, index) => {
            return (
              <div key={index} className="col-span-1">
                <ServiceItem {...subService} />
              </div>
            );
          })}

      {doSlice && servicesData && (
        <Link
          href="dashboard/services"
          className={`relative bg-white block p-4 rounded-lg  h-[250px] md:h-[220px] border-2 hover:border-emerald-500 hover:shadow-lg ${
            displayedFromHome && "border-slate-900 border-[1px]"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-lg mb-2 h-full font-semibold leading-[-2px]">
                Other Services
              </h1>
              <div className="space-y-2">
                {servicesData.slice(5, servicesData.length).map((item) => (
                  <p
                    key={item.slug}
                    className="text-xs font-light text-zinc-600"
                  >
                    {item.title}
                  </p>
                ))}
              </div>

              <div className="absolute border-[1px] border-slate-300 bottom-4 right-4 rounded-full flex justify-center items-center overflow-hidden w-[50px] h-[40px]">
                <ArrowRight />
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ServiceCards;
