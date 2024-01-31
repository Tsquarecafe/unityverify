import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UnityVerify",
  description: "Your Sure Verification Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <div className="vh-subtract-40">{children}</div>
          <div className="h-[40px] border-t border-b border-slate-200 bg-white  text-slate-800 text-[12px]  flex items-center justify-center">
            &copy; 2024 UnityVerify
          </div>

          <Link
            href="https://wa.me/+2348030961870"
            className="fixed w-[50px] h-[50px] flex border-2 border-green-500 overflow-hidden  bottom-4 right-8 bg-slate-50 text-white rounded-full shadow-lg z-50"
          >
            <Image
              src="/assets/whatsapp.svg"
              alt="Whatsapp logo"
              className="w-full h-full"
              height={50}
              width={50}
            />
          </Link>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
