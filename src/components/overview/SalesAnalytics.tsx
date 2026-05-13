"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SalesAnalytics({ data, totalRevenue }: { data: any[], totalRevenue: number }) {
  const [period, setPeriod] = useState("july-dec");

  const chartData = data?.map(item => ({
    name: item.month,
    value: item.revenue
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="h-full"
    >
      <Card className="border-none shadow-sm rounded-lg overflow-visible h-full flex flex-col p-0">
        <CardContent className="p-5 sm:p-10 flex flex-col gap-6 sm:gap-10 h-full">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-medium text-[#2C2E33]">Sales Analytics</h2>
              <p className="text-3xl sm:text-5xl font-medium text-[#2C2E33] tracking-tight">${totalRevenue?.toFixed(2) || "0.00"}</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="flex-1 w-full min-h-[300px] sm:min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                  ticks={[0, 3500, 7000, 10500, 14000]}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                />
                <Bar
                  dataKey="value"
                  radius={[16, 16, 16, 16]}
                  maxBarSize={55}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > 0 ? "#FF4A00" : "#D9D9D9"}
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
