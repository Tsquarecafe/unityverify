import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TSquareCafe",
  description: "Your Sure Verification Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <div className="h-[40px] border-t border-b border-slate-200 bg-white  text-slate-800 text-[12px]  flex items-center justify-center">
            &copy; 2024 TSquare-Cafe
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
