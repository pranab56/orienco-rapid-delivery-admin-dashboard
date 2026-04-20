"use client";


import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContactUsDetailsProps {
  id: string;
}

export default function ContactUsDetails({}: ContactUsDetailsProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      {/* ── Breadcrumbs / Header ── */}
      <div className="space-y-6">
        <Link
          href="/contact-us"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Contact Us
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-medium">Contact Us</h1>
          <p className="text-[#737780] font-normal text-base">Respond to User Messages</p>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className="border bg-white p-6 rounded-lg space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">From :</p>
            <p className="text-base font-normal text-[#2C2E33]">Sohidul Islam</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">Date :</p>
            <p className="text-base font-normal text-[#2C2E33]">2024-01-15</p>
          </div>
        </div>

        {/* ── Message Section ── */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#2C2E33]">Message :</h3>
            <div className="w-full min-h-[140px] p-6 bg-[#FFFAF5] rounded-sm text-sm font-normal text-gray-700 leading-relaxed border border-white">
              Im Having Issue With The Log In System.It Keeps Showing An Error:
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#2C2E33]">Your Reply :</h3>
            <textarea
              placeholder="Type Your Response Here."
              className="w-full h-40 p-8 bg-[#FFFAF5] rounded-sm text-base font-normal text-gray-700 leading-relaxed border border-white focus:ring-1 focus:ring-[#FF4A00]/20 outline-none resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-end">
            <button className="px-14 py-3 bg-[#FF4A00] text-white rounded-lg font-normal cursor-pointer text-lg shadow-lg shadow-orange-100 hover:bg-[#e64300] transition-all active:scale-95">
              Send Reply
            </button>
          </div>
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
                "w-10 h-10 rounded-full shadow-lg cursor-pointer text-sm font-medium transition-all",
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
