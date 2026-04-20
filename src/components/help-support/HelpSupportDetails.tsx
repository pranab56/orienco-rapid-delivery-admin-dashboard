"use client";

import { ArrowLeft, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HelpSupportDetailsProps {
  id: string;
}

export default function HelpSupportDetails({ }: HelpSupportDetailsProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs / Header ── */}
      <div className="space-y-6">
        <Link
          href="/help-support"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Request
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-medium">Help & Support</h1>
          <p className="text-sm sm:text-base text-[#737780] font-normal ">Solve the problems of the users.</p>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className=" bg-white p-4 sm:p-5 space-y-6 sm:space-y-7 rounded-lg shadow-sm border border-white/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 p-4 sm:p-8 rounded-lg bg-gray-50/50">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">From :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">Sohidul</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Date :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">2024-01-15</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Status :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">Pending</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Title :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">Id Cars Issue</p>
          </div>
        </div>

        {/* ── Image Attachment ── */}
        <div className="w-full aspect-[21/9] bg-gray-200 rounded-lg h-56 sm:h-100 overflow-hidden relative shadow-inner">
          {/* Placeholder Image Overlay */}
          <Image src="/images/help/image1.png" alt="Help Support"
            width={1200}
            height={600}
            className="w-full h-full object-cover" />
        </div>

        {/* ── File Attachments ── */}
        <div className="flex justify-between items-center">
          <div className="relative group cursor-pointer active:scale-95 transition-transform">
            <Image src="/images/help/image2.png" alt="Help Support" width={10000} height={10000} className="w-16 h-16 object-cover" />
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-sm hover:bg-gray-200 transition-colors shadow-sm border boder-white cursor-pointer">
            <Eye className="w-5 h-5 text-[#FF4A00]" />
          </button>
        </div>

        {/* ── Message / Interaction Section ── */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Message :</h3>
            <div className="w-full min-h-[100px] sm:min-h-[140px] p-4 sm:p-6 bg-[#FFFAF5] rounded-lg text-xs sm:text-sm font-medium text-gray-700 leading-relaxed border border-orange-50/50 shadow-sm">
              Im Having Issue With The Log In System.It Keeps Showing An Error:
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium">Your Reply :</h3>
            <textarea
              placeholder="Type Your Response Here."
              className="w-full h-32 sm:h-40 p-4 sm:p-8 bg-[#FFFAF5] rounded-lg text-sm sm:text-base font-normal text-gray-700 leading-relaxed border border-orange-50/50 focus:ring-1 focus:ring-[#FF4A00]/20 shadow-sm outline-none resize-none placeholder:text-gray-400"
            />
          </div>

          <button className="w-full sm:w-auto px-10 sm:px-14 py-3 bg-[#FF4A00] text-white rounded-lg cursor-pointer font-medium text-base sm:text-lg shadow-lg shadow-orange-100 hover:bg-[#e64300] transition-all active:scale-95">
            Send Reply
          </button>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 pb-2">
        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Desktop Version */}
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, "...", 10].map((page, i) => (
            <button
              key={i}
              className={cn(
                "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-bold transition-all",
                page === 1 ? "bg-[#FF4A00] text-white shadow-lg shadow-orange-100" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile Version - Compact */}
        <div className="flex sm:hidden items-center gap-1">
          {[1, 2, "...", 10].map((page, i) => (
            <button
              key={`mob-${i}`}
              className={cn(
                "w-8 h-8 rounded-full shadow-md cursor-pointer text-xs font-bold transition-all",
                page === 1 ? "bg-[#FF4A00] text-white shadow-md shadow-orange-100" : "bg-white text-gray-600 border border-gray-100 shadow-sm"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
