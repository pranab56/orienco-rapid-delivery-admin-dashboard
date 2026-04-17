"use client";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Box,
  Map as MapIcon,
  Clock,
  FileText,
  Star
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  id: string;
}

export default function OrderDetails({}: OrderDetailsProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs / Header ── */}
      <div className="space-y-6">
        <Link
          href="/order-management"
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-medium ">History Details</h1>
          <p className="text-gray-400 font-normal text-base">Order ID: <span className="text-red-400">#1432566411</span></p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-4">

        {/* ── Left Column (Route & Info) ── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Delivery Route Card */}
          <Card className="border-none shadow-none bg-gray-100/50 rounded-lg bg-[#FFFAF5] overflow-hidden p-2">
            <CardContent className="p-4 space-y-10">
              <p className="text-base font-normal text-gray-400 ">Delivery Route</p>

              <div className="relative pl-8 space-y-12">
                {/* Connector Line */}
                <div className="absolute left-[3.5px] top-6 bottom-0 w-0.5 bg-gray-200" />

                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-red-400 ring-4 ring-red-400/10" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pickup</p>
                    <p className="text-sm font-medium text-gray-500">123 Main St, Downtown</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-[#1A365D]" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Dropoff</p>
                    <p className="text-sm font-medium text-gray-500">456 Oak Ave, Uptown</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden relative border border-white">
                <div className="absolute inset-0 opacity-40 mix-blend-multiply flex items-center justify-center grayscale">
                  <MapIcon className="w-20 h-20 text-gray-400 opacity-20" />
                </div>
                {/* Map overlay lines placeholder */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-20">
                  {Array.from({ length: 72 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-gray-400/40" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Grid Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Date & Time", value: "Apr 4, 2026", sub: "2:30 PM", icon: Calendar, color: "text-red-400" },
              { label: "Parcel Type", value: "Document", sub: "Standard Courier", icon: Box, color: "text-red-400" },
              { label: "Distance", value: "4.2 km", sub: "City Route", icon: MapIcon, color: "text-red-400" },
              { label: "Duration", value: "18 min", sub: "Ahead of schedule", icon: Clock, color: "text-red-400" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-none bg-white rounded-lg p-6">
                <CardContent className="p-0 space-y-6 ">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                  <div className="space-y-1">
                    <p className="text-sm font-normal text-gray-400">{stat.label}</p>
                    <p className="text-sm font-bold text-[#2C2E33] leading-none">{stat.value}</p>
                    <p className="text-xs font-normal text-gray-500">{stat.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Note Card */}
          <Card className="border-[1.5px] shadow-none  border-dashed border-gray-300 bg-[#DCE4E84D] rounded-2xl p-8">
            <CardContent className="p-0 flex items-center gap-6">
              <div className="w-10 h-10 rounded-xl bg-[#E6F9FF] flex items-center justify-center border border-gray-100">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium">Note</p>
                <p className="text-sm font-normal text-gray-400">&ldquo;Enter parcel details and add notes to help us deliver accurately.&rdquo;</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (Info Sides) ── */}
        <div className="col-span-12 lg:col-span-4 space-y-8">

          {/* Driver Information Card */}
          <Card className="border-none shadow-none bg-white rounded-xl overflow-hidden p-2">
            <CardContent className="p-4 space-y-6">
              <p className="text-sm font-medium">Driver Information</p>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-300 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100/50">
                  <div className="w-full h-full bg-[#1A365D]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium">John Smith</p>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span className="text-xs font-bold text-red-400">4.8 Rating</span>
                  </div>
                  <p className="text-sm font-normal text-gray-500">Motorcycle Delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sender Info Card */}
          <Card className="border-none shadow-none bg-[#FFFAF5] rounded-xl p-6">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-2 bg-white rounded-lg border border-gray-100">
                  <Box className="w-4 h-4" />
                </div>
                <p className="text-base font-medium">Sender Info</p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-medium text-[#2C2E33]">Shakir Ahmed</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4 opacity-40 shrink-0" />
                    user@gmail.com
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4 opacity-40 shrink-0" />
                    +123456789
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-[240px]">
                  Chandgaon R/A, b-block, house no-313, road no-03, flat no-D7
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Receiver Info Card */}
          <Card className="border-none shadow-none bg-[#FFFAF5] rounded-xl p-6">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="p-2 bg-white rounded-lg border border-gray-100">
                  <User className="w-4 h-4" />
                </div>
                <p className="text-base font-medium">Receiver Info</p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-medium text-[#2C2E33]">Shakir Ahmed</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4 opacity-40 shrink-0" />
                  +123456789
                </div>
                <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-[240px]">
                  Chandgaon R/A, b-block, house no-313, road no-03, flat no-D7
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown Card */}
          <Card className="border-none shadow-none bg-white rounded-xl p-6 overflow-hidden relative">
            <CardContent className="p-0 space-y-10">
              <p className="text-base font-medium">Price Breakdown</p>

              <div className="space-y-4">
                <div className="flex justify-between text-base font-medium text-gray-500">
                  <span>Base fare</span>
                  <span>$4.00</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-500">
                  <span>Distance (4.2 km)</span>
                  <span>$1.99</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                <span className="text-2xl font-bold text-[#2C2E33]">Total</span>
                <span className="text-3xl font-bold text-red-500">$5.99</span>
              </div>

              {/* Rating Mini Card */}
              <div className="mt-10 p-4 bg-[#CFDEE3]/40 rounded-2xl border border-white flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-red-400 fill-red-400" />
                  ))}
                </div>
                <p className="text-sm font-normal text-red-400">
                  You rated this delivery 5 out of 5 stars
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
