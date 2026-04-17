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

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 6500 },
  { name: "Mar", value: 4800 },
  { name: "Apr", value: 8500 },
  { name: "May", value: 12500 },
  { name: "Ju", value: 6200 },
  { name: "July", value: 5000 },
];

export default function SalesAnalytics() {
  const [period, setPeriod] = useState("july-dec");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="h-full"
    >
      <Card className="border-none shadow-sm rounded-lg overflow-visible h-full flex flex-col p-0">
        <CardContent className="p-10 flex flex-col gap-10 h-full">
          {/* Card Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-[#2C2E33]">Sales Analytics</h2>
              <p className="text-5xl font-medium text-[#2C2E33] tracking-tight">$46,650</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-13 h-13 flex items-center justify-center bg-[#F1DED6] rounded-lg hover:bg-[#EACFC3] transition-all active:scale-95 shadow-sm">
                <Activity className="w-7 h-7 text-[#FF4A00]" />
              </button>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-12 px-5 py-6 rounded-sm border border-gray-200 text-sm font-medium text-[#737780] bg-white shadow-none cursor-pointer focus:ring-1 focus:ring-gray-200 min-w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[50] rounded-lg border border-gray-100 shadow-xl bg-white">
                  <SelectItem value="jan-jun">Jan–Jun</SelectItem>
                  <SelectItem value="july-dec">July–Dec</SelectItem>
                  <SelectItem value="q1">Q1 (Jan–Mar)</SelectItem>
                  <SelectItem value="q2">Q2 (Apr–Jun)</SelectItem>
                  <SelectItem value="q3">Q3 (Jul–Sep)</SelectItem>
                  <SelectItem value="q4">Q4 (Oct–Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chart Section */}
          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 500 }}
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
                  barSize={55}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "May" ? "#FF4A00" : "#D9D9D9"}
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
