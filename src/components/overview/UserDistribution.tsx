"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Driver", value: 65, color: "#FF4A00" },
  { name: "User", value: 25, color: "#D9D9D9" },
];

export default function UserDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="h-full"
    >
      <Card className="border-none shadow-sm rounded-lg overflow-hidden h-full flex flex-col p-0">
        <CardContent className="p-5 sm:p-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-medium text-[#2C2E33]">User Distribution</h2>
            <div className="w-10 h-10 sm:w-13 sm:h-13 flex items-center justify-center bg-[#F1DED6] rounded-lg shadow-sm">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4A00]" />
            </div>
          </div>

          {/* Donut Chart Container */}
          <div className="flex-1 min-h-[220px] sm:min-h-[300px] relative flex items-center justify-center px-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20 outline-none">
                          <div className="flex items-center gap-2 mb-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: data.color }}
                            />
                            <p className="text-sm font-semibold text-[#2C2E33]">
                              {data.name}
                            </p>
                          </div>
                          <p className="text-xs text-[#737780] font-medium ml-4">
                            Distribution: <span className="text-[#2C2E33]">{data.value}%</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={8}
                  dataKey="value"
                  startAngle={210}
                  endAngle={-30}
                  stroke="none"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="none"
                      className="outline-none transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Section */}
          <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
            <div className="flex justify-between items-center p-1 sm:p-2">
              <div className="flex items-center gap-3">
                <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#FF4A00]" />
                <span className="text-xs sm:text-sm font-medium text-[#737780] tracking-wide">Driver</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-[#2C2E33]">65%</span>
            </div>
            <div className="flex justify-between items-center p-1 sm:p-2">
              <div className="flex items-center gap-3">
                <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#D9D9D9]" />
                <span className="text-xs sm:text-sm font-medium text-[#737780] tracking-wide">User</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-[#2C2E33]">25%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
