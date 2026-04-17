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

export default function Overview() {
  const [period, setPeriod] = useState("yearly");

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#2C2E33]">Performance Analytics</h1>
          <p className="text-gray-500 mt-1 font-normal">Comprehensive metrics for finance and platform.</p>
        </div>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-10 px-4 py-6 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#2C2E33] shadow-sm hover:bg-gray-50 transition-all cursor-pointer focus:ring-1 focus:ring-gray-300 focus:border-gray-300 gap-1">
            <Calendar className="w-4 h-4 text-[#737780] shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white">
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <CardStates />

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesAnalytics />
        </div>
        <div className="lg:col-span-1 text-black">
          <UserDistribution />
        </div>
      </div>

    </div>
  );
}
