// components/MyLineChart.tsx
"use client";
import { RootState } from "@/lib/redux/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const MyLineChart = () => {
  const { monthlySummary } = useSelector((store: RootState) => store.report);

  const [lables, setLables] = useState<string[] | null>(null);
  const [data, setData] = useState<number[] | null>(null);

  useEffect(() => {
    if (monthlySummary) {
      const entriesArray = Object.entries(monthlySummary);
      setLables(() => entriesArray.map(([key, _]) => key) as string[]);
      setData(() => entriesArray.map(([_, value]) => value) as number[]);
    }
  }, [monthlySummary]);

  return (
    <div>
      {lables && data ? (
        <Line
          data={{
            labels: lables,
            datasets: [
              {
                data: data,
                backgroundColor: "purple",
              },
            ],
          }}
        />
      ) : (
        <div className="w-full p-6 h-full flex items-center justify-center">
          <TailSpin />
        </div>
      )}
    </div>
  );
};
export default MyLineChart;
