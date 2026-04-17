"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bike, DollarSign, Package, Users } from "lucide-react";

const stats = [
  { title: "TOTAL REVENUE", value: "$42.50", icon: DollarSign },
  { title: "TOTAL USERS", value: "100", icon: Users },
  { title: "TOTAL DRIVERS", value: "200", icon: Bike },
  { title: "TOTAL DELIVERY", value: "700", icon: Package },
];

export default function CardStates() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
        >
          <Card className="rounded-lg h-full py-7 overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <CardContent className=" flex flex-col gap-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center border border-gray-200 transition-transform duration-300">
                <stat.icon className="w-7 h-7 text-[#FF4A00]" />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-[0.1em] text-[#9CA3AF]">
                  {stat.title}
                </p>
                <p className="text-4xl font-bold text-[#2C2E33]">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
