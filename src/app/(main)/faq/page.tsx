"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, CirclePlus, CircleMinus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetAllFaqQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFaqMutation,
} from "@/features/legal/legalApi";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // API Hooks
  const { data: faqData, isLoading: isFaqLoading } = useGetAllFaqQuery(undefined);
  const [createFAQ, { isLoading: isAdding }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FAQ | null>(null);

  // Form states
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const allFaqs: FAQ[] = faqData?.data || [];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAdd = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await createFAQ({
        question: formData.question,
        answer: formData.answer,
      }).unwrap();
      setIsAddOpen(false);
      setFormData({ question: "", answer: "" });
      toast.success("FAQ added successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add FAQ");
    }
  };

  const handleEdit = (faq: FAQ) => {
    setCurrentFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!formData.question || !formData.answer || !currentFaq) return;
    try {
      await updateFAQ({
        id: currentFaq._id,
        data: {
          question: formData.question,
          answer: formData.answer,
        },
      }).unwrap();
      setIsEditOpen(false);
      setCurrentFaq(null);
      setFormData({ question: "", answer: "" });
      toast.success("FAQ updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id).unwrap();
      toast.success("FAQ deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete FAQ");
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-lg p-5 shadow-none border border-gray-100 min-h-[400px]">
          {isFaqLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <p>Loading FAQs...</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {allFaqs.map((faq, index) => (
                <FAQItem
                  key={faq._id}
                  faq={faq}
                  index={index}
                  isExpanded={expandedId === faq._id}
                  onToggle={() => handleToggle(faq._id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              {allFaqs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <p>No FAQs available.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#EA4335] hover:bg-[#D33828] text-white px-8 py-6 rounded-lg text-base font-medium shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Add New FAQ
          </Button>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-none shadow-2xl">
          <div className="bg-[#EAEAEA] p-8 space-y-8">
            <div className="relative">
              <DialogTitle className="text-2xl font-medium text-center text-[#2C2E33]">
                Add New FAQ
              </DialogTitle>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Question</Label>
                <Input
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="bg-[#E5E1DA] border-none h-14 rounded-xl px-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Answer</Label>
                <Textarea
                  placeholder="Enter your answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="bg-[#E5E1DA] border-none min-h-[140px] rounded-xl px-4 py-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleAdd}
                disabled={isAdding}
                className="bg-[#EA4335] hover:bg-[#D33828] text-white px-20 h-12 rounded-xl text-base font-medium shadow-lg disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
          <div className="bg-[#EAEAEA] p-8 space-y-8">
            <div className="relative">
              <DialogTitle className="text-2xl font-medium text-center text-[#2C2E33]">
                Edit FAQ
              </DialogTitle>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Question</Label>
                <Input
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="bg-[#E5E1DA] border-none h-14 rounded-xl px-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800 ml-1">Answer</Label>
                <Textarea
                  placeholder="Enter your answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="bg-[#E5E1DA] border-none min-h-[140px] rounded-xl px-4 py-4 text-gray-800 placeholder:text-gray-500 text-lg focus-visible:ring-1 focus-visible:ring-gray-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="bg-[#EA4335] hover:bg-[#D33828] text-white px-20 h-12 rounded-xl text-base font-medium shadow-lg disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FAQItem({
  faq,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  faq: FAQ;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
}) {
  const number = (index + 1).toString().padStart(2, "0");

  return (
    <div className="py-8 border-b border-gray-300/60 last:border-0">
      <div className="flex items-start gap-10">
        {/* Left column: Number and Actions */}
        <div className="flex flex-col items-center gap-4 mt-1 space-y-5">
          <span className="text-2xl font-bold text-[#2C2E33] leading-none min-w-[34px]">{number}</span>
          <div className="flex items-center gap-5 pl-4">
            <button
              onClick={() => onEdit(faq)}
              className="text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => onDelete(faq._id)}
              className="text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Middle column: Question and Answer */}
        <div className="flex-1 space-y-3 pr-4">
          <div
            onClick={onToggle}
            className="cursor-pointer"
          >
            <h3 className={cn(
              "text-xl font-semibold leading-snug transition-colors",
              isExpanded ? "text-gray-900" : "text-gray-800"
            )}>
              {faq.question}
            </h3>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <p className="text-gray-600 text-[17px] leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Toggle Button */}
        <button
          onClick={onToggle}
          className="text-gray-900 hover:opacity-70 cursor-pointer transition-all mt-0.5"
        >
          {isExpanded ? (
            <CircleMinus size={42} strokeWidth={1} className="text-gray-900" />
          ) : (
            <CirclePlus size={42} strokeWidth={1} className="text-gray-900" />
          )}
        </button>
      </div>
    </div>
  );
}