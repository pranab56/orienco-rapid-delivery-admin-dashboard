"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetContactByIdQuery, useReplyContactMutation } from "@/features/contact/contactApi";

interface ContactUsDetailsProps {
  id: string;
}

export default function ContactUsDetails({ id }: ContactUsDetailsProps) {
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState("");

  const { data: contactResponse, isLoading } = useGetContactByIdQuery(id);
  const [replyContact, { isLoading: isReplying }] = useReplyContactMutation();

  const contact = contactResponse?.data;

  useEffect(() => {
    if (contact?.replyMessage) {
      setReplyMessage(contact.replyMessage);
    } else {
      setReplyMessage("");
    }
  }, [contact]);

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    try {
      await replyContact({
        id,
        data: { replyMessage },
      }).unwrap();
      toast.success("Reply sent successfully");
      router.push("/contact-us");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4A00]" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Message not found</p>
        <Link href="/contact-us" className="text-[#FF4A00] mt-4 inline-block font-medium">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
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
      <div className="border border-gray-100 bg-white p-6 rounded-lg space-y-7 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">From :</p>
            <p className="text-base font-semibold text-[#2C2E33]">{contact.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">Email :</p>
            <p className="text-base font-medium text-[#2C2E33]">{contact.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">Phone :</p>
            <p className="text-base font-medium text-[#2C2E33]">{contact.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-normal text-[#737780]">Date :</p>
            <p className="text-base font-normal text-[#2C2E33]">
              {new Date(contact.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ── Message Section ── */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#2C2E33]">Message :</h3>
            <div className="w-full min-h-[140px] p-6 bg-[#FFFAF5] rounded-sm text-sm font-normal text-gray-700 leading-relaxed border border-orange-50/50">
              {contact.message}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#2C2E33]">
              {contact.isReplied ? "Your Previous Reply :" : "Your Reply :"}
            </h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={contact.isReplied}
              placeholder="Type Your Response Here."
              className="w-full h-40 p-8 bg-[#FFFAF5] rounded-sm text-base font-normal text-gray-700 leading-relaxed border border-orange-50/50 focus:ring-1 focus:ring-[#FF4A00]/20 outline-none resize-none placeholder:text-gray-400 disabled:opacity-80"
            />
          </div>

          {!contact.isReplied && (
            <div className="flex justify-end">
              <button
                onClick={handleReply}
                disabled={isReplying}
                className="px-14 py-3 bg-[#FF4A00] text-white rounded-lg font-normal cursor-pointer text-lg shadow-lg shadow-orange-100 hover:bg-[#e64300] transition-all active:scale-95 disabled:opacity-50"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
