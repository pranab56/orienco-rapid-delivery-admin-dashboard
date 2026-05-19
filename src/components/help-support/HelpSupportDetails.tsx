"use client";

import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  useGetAllSupportQuery,
  useReplySupportMutation,
} from "@/features/support/supportApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSpin from "../LoadingSpin";

interface HelpSupportDetailsProps {
  id: string;
}

export default function HelpSupportDetails({ id }: HelpSupportDetailsProps) {
  const router = useRouter();
  const [replyText, setReplyText] = useState("");
  const { data: supportData, isLoading, isError } = useGetAllSupportQuery({ limit: 1000 }); // Fetch a larger batch to find the item
  const [replySupport, { isLoading: isReplying }] = useReplySupportMutation();

  const ticket = supportData?.data?.result?.find((item: any) => item._id === id);

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      await replySupport({
        id,
        data: {
          adminReply: replyText,
          status: "resolved",
        },
      }).unwrap();
      toast.success("Reply sent successfully");
      setReplyText("");
      router.push("/help-support");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpin />
      </div>
    );
  }


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
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">{ticket.user?.fullName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Date :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Status :</p>
            <p className={cn(
              "text-sm sm:text-base font-normal",
              ticket.status === "resolved" ? "text-green-500" : "text-orange-500"
            )}>
              {ticket.status}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-normal text-gray-400">Title :</p>
            <p className="text-sm sm:text-base font-normal text-[#2C2E33]">{ticket.title}</p>
          </div>
        </div>

        {/* ── Image Attachments ── */}
        {ticket.files && ticket.files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Attachments :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ticket.files.map((file: string, index: number) => (
                <div key={index} className="w-full aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden relative shadow-inner group">
                  <img src={file} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Message / Interaction Section ── */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Message :</h3>
            <div className="w-full min-h-[100px] sm:min-h-[140px] p-4 sm:p-6 bg-[#FFFAF5] rounded-lg text-xs sm:text-sm font-medium text-gray-700 leading-relaxed border border-orange-50/50 shadow-sm">
              {ticket.description}
            </div>
          </div>

          {!ticket.isReplied ? (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Your Reply :</h3>
              <textarea
                placeholder="Type Your Response Here."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full h-32 sm:h-40 p-4 sm:p-8 bg-[#FFFAF5] rounded-lg text-sm sm:text-base font-normal text-gray-700 leading-relaxed border border-orange-50/50 focus:ring-1 focus:ring-[#FF4A00]/20 shadow-sm outline-none resize-none placeholder:text-gray-400"
              />
              <button
                onClick={handleReply}
                disabled={isReplying}
                className="w-full sm:w-auto px-10 sm:px-14 py-3 bg-[#FF4A00] text-white rounded-lg cursor-pointer font-medium text-base sm:text-lg shadow-lg shadow-orange-100 hover:bg-[#e64300] transition-all active:scale-95 disabled:opacity-50"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">Admin Reply :</h3>
              <div className="w-full min-h-[100px] p-4 sm:p-6 bg-green-50 rounded-lg text-sm font-normal text-gray-700 border border-green-100">
                {ticket.adminReply}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
