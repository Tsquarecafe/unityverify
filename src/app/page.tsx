import Brand from "@/components/Brand";
import HomeSignUpBtns from "@/components/HomeSignUpBtns";
import ServiceCards from "@/components/ServiceCards";
import { generalServices } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl md:h-screen py-20 px-4">
      <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-center  ">
        <div className="flex flex-col gap-4">
          <Brand />
          <h2 className="text-3xl  md:text-5xl font-bold leading-[4rem]">
            Sign Up to Get Started
          </h2>
          <p className="font-medium">
            Your one-stop reliable service for verification
          </p>

          <div>
            <HomeSignUpBtns />

            <p className="mt-4 text-sm">
              Already have an Account?{" "}
              <Link
                href="/sign-in"
                className="text-gray-500 hover:text-gray-700 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <ServiceCards
            doSlice={5}
            displayedFromHome
            servicesData={generalServices}
          />
        </div>
      </div>
    </main>
  );
}
