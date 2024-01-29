import { Button, buttonVariants } from "@/components/ui/Button";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="flex justify-center lg:h-[90%] ">
      <div className="grid lg:grid-cols-[1fr_400px] lg:max-h-[400px] my-16 px-3 rounded-lg">
        <div className=" bg-white p-10 rounded-l-lg ">
          <div className=" flex flex-col gap-6 justify-center h-full">
            <div className="flex gap-6 items-center">
              <div className="bg-slate-900 p-4 rounded-lg ">
                <Mail className="text-emerald-500" />
              </div>
              <div className="space-y-px">
                <span className="text-slate-400 text-xs font-semibold">
                  Email:
                </span>
                <h5 className="font-semibold">
                  tsquarecafeenterprise@gmail.com
                </h5>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="bg-slate-900 p-4 rounded-lg ">
                <Phone className="text-emerald-500" />
              </div>
              <div className="space-y-px">
                <span className="text-slate-400 text-xs font-semibold">
                  Phone:
                </span>
                <h5 className="font-semibold">+23480-3096-1870</h5>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="bg-slate-900 p-4 rounded-lg ">
                <MessageCircle className="text-emerald-500" />
              </div>
              <div className="space-y-px">
                <span className="text-slate-400 block mb-2 text-xs font-semibold">
                  Whatapp:
                </span>
                <Link
                  href="https://wa.me/+2348030961870"
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonVariants()} bg-green-200 hover:bg-green-300 text-white`}
                >
                  <Image
                    src="/assets/whatsapp.svg"
                    alt="Whatsapp logo"
                    height={50}
                    width={50}
                  />
                  Chat with us now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r h-[400px] from-slate-500 to-teal-500 flex-1 rounded-r-lg ">
          <div className="flex items-center justify-center w-full h-full">
            <h3 className="text-4xl leading-10 text-white font-bold">
              Contact Us
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
