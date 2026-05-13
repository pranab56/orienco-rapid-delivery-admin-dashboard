"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CardStates from "./CardStates";
import SalesAnalytics from "./SalesAnalytics";
import UserDistribution from "./UserDistribution";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllAnalyticsQuery } from "@/features/overview/overviewApi";

function OverviewLoading() {
  return (
    <div className="space-y-4 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-5 w-80 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 sm:h-40 w-full rounded-xl" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <Skeleton className="lg:col-span-2 h-[400px] sm:h-[500px] w-full rounded-xl" />
        <Skeleton className="lg:col-span-1 h-[400px] sm:h-[500px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Overview() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2
  ];

  const { data: analyticsData, isLoading, error } = useGetAllAnalyticsQuery({ year: selectedYear });

  if (isLoading) return <OverviewLoading />;
  if (error) return <div className="flex items-center justify-center h-96 text-red-500">Error loading analytics</div>;

  const data = analyticsData?.data;

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#2C2E33]">Performance Analytics</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 font-normal">Comprehensive metrics for finance and platform.</p>
        </div>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-40 h-10 px-4 py-6 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#2C2E33] shadow-sm hover:bg-gray-50 transition-all cursor-pointer focus:ring-1 focus:ring-gray-300 focus:border-gray-300 gap-1">
            <Calendar className="w-4 h-4 text-[#737780] shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <CardStates data={data?.overview} />

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <SalesAnalytics data={data?.salesAnalytics} totalRevenue={data?.overview?.totalRevenue} />
        </div>
        <div className="lg:col-span-1 text-black">
          <UserDistribution data={data?.userDistribution} />
        </div>
      </div>
    </div>
  );
}
