"use client";

import { CheckCheck, Sigma, ThumbsDown } from "lucide-react";
import { FC, useEffect, useState } from "react";
import MiniValidationReportCard from "./MiniValidationReportCard";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface ReportSummary {
  totalTransactions: number;
  successTransactions: number;
  pendingsTransactions: number;
  failedTransactions: number;
}

interface ReportCardProps {}
const ReportCard: FC<ReportCardProps> = ({}) => {
  const [reportSummary, setReportSummary] = useState<ReportSummary>({
    totalTransactions: 0,
    successTransactions: 0,
    pendingsTransactions: 0,
    failedTransactions: 0,
  });

  useEffect(() => {
    const getReportSummary = async () => {
      try {
        const res = await axios.get("/api/transactions?filter=true");

        if (res.status === 200) {
          setReportSummary(res.data.transactions);
        } else {
          return toast({
            title: "Something went wrong",
            description: "Unable to get the report summary",
            variant: "destructive",
          });
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          return toast({
            title: "Something went wrong",
            description: err?.response?.data,
            variant: "destructive",
          });
        }

        return toast({
          title: "Something went wrong",
          description: "There was a problem with fetching reports",
          variant: "destructive",
        });
      }
    };

    getReportSummary();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg h-[350px]">
      <h3 className=" text-sm font-semibold mb-3 ">Verification Summary</h3>
      <div className="flex flex-col space-y-3">
        <MiniValidationReportCard
          value={reportSummary.totalTransactions}
          Icon={<Sigma className="h-5 w-5 text-emerald-700" />}
          title="Total Verifications"
          name="total"
        />
        <hr />

        <MiniValidationReportCard
          value={reportSummary.successTransactions}
          Icon={<CheckCheck className="h-5 w-5 text-teal-700" />}
          title="Successfull Verifications"
          name="success"
        />
        <hr />
        <MiniValidationReportCard
          value={reportSummary.pendingsTransactions}
          Icon={<CheckCheck className="h-5 w-5 text-yellow-700" />}
          title="Pending Verifications"
          name="pendin"
        />
        <hr />
        <MiniValidationReportCard
          value={reportSummary.failedTransactions}
          Icon={<ThumbsDown className="h-5 w-5 text-rose-700" />}
          title="Failed Verifications"
          name="failed"
        />
      </div>
    </div>
  );
};

export default ReportCard;
